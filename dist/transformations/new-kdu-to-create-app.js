"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
// Limitations: cannot transform expressions like `new HelloWorld()`
// FIXME: for ES modules, should use `createApp` instead of `Kdu.createApp`
// because the latter makes it difficult to tree-shake the kdu module
// FIXME: need to ensure there will be a Kdu import if needed.
const transformAST = (context, params = {
    includeMaybeComponents: true,
}) => {
    const { j, root } = context;
    const { includeMaybeComponents = true } = params;
    const newKdu = root.find(j.NewExpression, {
        callee: {
            type: 'Identifier',
            name: 'Kdu',
        },
    });
    // new Kdu() -> Kdu.createApp()
    newKdu.replaceWith(({ node }) => {
        const rootProps = node.arguments[0];
        return j.callExpression(j.memberExpression(j.identifier('Kdu'), j.identifier('createApp')), [rootProps]);
    });
    const kduCreateApp = newKdu;
    // Kdu.createApp().$mount() -> Kdu.createApp().mount()
    kduCreateApp.forEach((path) => {
        const parentNode = path.parent.node;
        if (j.MemberExpression.check(parentNode) &&
            parentNode.object === path.node &&
            j.Identifier.check(parentNode.property) &&
            parentNode.property.name === '$mount') {
            parentNode.property.name = 'mount';
        }
    });
    // Kdu.createApp({ el: '#app' }) -> Kdu.createApp().mount('#app')
    kduCreateApp.replaceWith(({ node }) => {
        if (node.arguments.length !== 1 ||
            !j.ObjectExpression.check(node.arguments[0])) {
            return node;
        }
        const rootProps = node.arguments[0];
        const elIndex = rootProps.properties.findIndex((p) => j.ObjectProperty.check(p) &&
            j.Identifier.check(p.key) &&
            p.key.name === 'el');
        if (elIndex === -1) {
            return node;
        }
        const elProperty = rootProps.properties.splice(elIndex, 1)[0];
        const elExpr = elProperty.value;
        return j.callExpression(j.memberExpression(node, j.identifier('mount')), 
        // @ts-ignore I'm not sure what the edge cases are
        [elExpr]);
    });
    if (includeMaybeComponents) {
        // new My().$mount
        const new$mount = root.find(j.CallExpression, (n) => {
            return (j.MemberExpression.check(n.callee) &&
                j.NewExpression.check(n.callee.object) &&
                j.Identifier.check(n.callee.property) &&
                n.callee.property.name === '$mount');
        });
        new$mount.replaceWith(({ node }) => {
            const el = node.arguments[0];
            const instance = node.callee
                .object;
            const ctor = instance.callee;
            return j.callExpression(j.memberExpression(j.callExpression(j.memberExpression(j.identifier('Kdu'), j.identifier('createApp')), [
                ctor,
                ...instance.arguments,
            ]), j.identifier('mount')), [el]);
        });
        // vm.$mount
        const $mount = root.find(j.CallExpression, {
            callee: {
                type: 'MemberExpression',
                property: {
                    type: 'Identifier',
                    name: '$mount',
                },
            },
            arguments: (args) => args.length === 1,
        });
        $mount.forEach(({ node }) => {
            // @ts-ignore
            node.callee.property.name = 'mount';
        });
        // new My({ el })
        const newWithEl = root.find(j.NewExpression, (n) => {
            return (n.arguments.length === 1 &&
                j.ObjectExpression.check(n.arguments[0]) &&
                n.arguments[0].properties.some((prop) => j.ObjectProperty.check(prop) &&
                    j.Identifier.check(prop.key) &&
                    prop.key.name === 'el'));
        });
        newWithEl.replaceWith(({ node }) => {
            const rootProps = node.arguments[0];
            const elIndex = rootProps.properties.findIndex((p) => j.ObjectProperty.check(p) &&
                j.Identifier.check(p.key) &&
                p.key.name === 'el');
            const elProperty = rootProps.properties.splice(elIndex, 1)[0];
            const elExpr = elProperty.value;
            const ctor = node.callee;
            return j.callExpression(j.memberExpression(j.callExpression(j.memberExpression(j.identifier('Kdu'), j.identifier('createApp')), [
                ctor,
                // additional props, and skip empty objects
                ...(rootProps.properties.length > 0 ? [rootProps] : []),
            ]), j.identifier('mount')), 
            // @ts-ignore I'm not sure what the edge cases are
            [elExpr]);
        });
    }
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

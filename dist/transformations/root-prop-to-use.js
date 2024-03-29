"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
/**
 * Expected to be run after the `createApp` transformation.
 * Transforms expressions like `createApp({ router })` to `createApp().use(router)`
 */
const transformAST = ({ root, j }, { rootPropName }) => {
    const appRoots = root.find(j.CallExpression, (node) => {
        if (node.arguments.length === 1 &&
            j.ObjectExpression.check(node.arguments[0])) {
            if (j.Identifier.check(node.callee) && node.callee.name === 'createApp') {
                return true;
            }
            if (j.MemberExpression.check(node.callee) &&
                j.Identifier.check(node.callee.object) &&
                node.callee.object.name === 'Kdu' &&
                j.Identifier.check(node.callee.property) &&
                node.callee.property.name === 'createApp') {
                return true;
            }
        }
    });
    appRoots.replaceWith(({ node: createAppCall }) => {
        const rootProps = createAppCall.arguments[0];
        const propertyIndex = rootProps.properties.findIndex(
        // @ts-ignore
        (p) => p.key && p.key.name === rootPropName);
        if (propertyIndex === -1) {
            return createAppCall;
        }
        // @ts-ignore
        const [{ value: pluginInstance }] = rootProps.properties.splice(propertyIndex, 1);
        return j.callExpression(j.memberExpression(createAppCall, j.identifier('use')), [pluginInstance]);
    });
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

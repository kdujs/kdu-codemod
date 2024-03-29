"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const hookNameMap = {
    bind: 'beforeMount',
    inserted: 'mounted',
    componentUpdated: 'updated',
    unbind: 'unmounted',
};
const transformAST = ({ root, j }) => {
    const directiveRegistration = root.find(j.CallExpression, {
        callee: {
            type: 'MemberExpression',
            object: {
                name: 'Kdu',
            },
            property: {
                name: 'directive',
            },
        },
    });
    directiveRegistration.forEach(({ node }) => {
        if (node.arguments.length === 2 &&
            j.ObjectExpression.check(node.arguments[1])) {
            const directiveOptions = node.arguments[1];
            let updateIndex = -1;
            directiveOptions.properties.forEach((prop, index) => {
                if (j.SpreadElement.check(prop) ||
                    j.SpreadProperty.check(prop) ||
                    !j.Identifier.check(prop.key)) {
                    return;
                }
                if (hookNameMap[prop.key.name]) {
                    prop.key.name = hookNameMap[prop.key.name];
                }
                if (prop.key.name === 'update') {
                    updateIndex = index;
                }
            });
            if (updateIndex !== -1) {
                const nextProp = directiveOptions.properties[updateIndex + 1] ||
                    // if `update` is the last property
                    directiveOptions.properties[updateIndex - 1];
                nextProp.comments = nextProp.comments || [];
                nextProp.comments.push(j.commentBlock(` __REMOVED__: In Kdu 3, there's no 'update' hook for directives `));
                directiveOptions.properties.splice(updateIndex, 1);
                // TODO: should warn user in the console
            }
        }
    });
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

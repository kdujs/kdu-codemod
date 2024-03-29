"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
/**
 * Note:
 * here we don't completely remove the import declaration statement
 * if all import specifiers are removed.
 * For example, `import foo from 'bar'`,
 * if `foo` is unused, the statement would become `import 'bar'`.
 * It is because we are not sure if the module contains any side effects.
 */
const transformAST = ({ root, j }, { localBinding }) => {
    const usages = root
        .find(j.Identifier, { name: localBinding })
        .filter((identifierPath) => {
        const parent = identifierPath.parent.node;
        // Ignore the import specifier
        if (j.ImportDefaultSpecifier.check(parent) ||
            j.ImportSpecifier.check(parent) ||
            j.ImportNamespaceSpecifier.check(parent)) {
            return false;
        }
        // Ignore properties in MemberExpressions
        if (j.MemberExpression.check(parent) &&
            parent.property === identifierPath.node) {
            return false;
        }
        // Ignore keys in ObjectProperties
        if (j.ObjectProperty.check(parent) &&
            parent.key === identifierPath.node &&
            parent.value !== identifierPath.node) {
            return false;
        }
        return true;
    });
    if (!usages.length) {
        let specifier = root.find(j.ImportSpecifier, {
            local: {
                name: localBinding,
            },
        });
        if (!specifier.length) {
            specifier = root.find(j.ImportDefaultSpecifier, {
                local: {
                    name: localBinding,
                },
            });
        }
        if (!specifier.length) {
            specifier = root.find(j.ImportNamespaceSpecifier, {
                local: {
                    name: localBinding,
                },
            });
        }
        if (!specifier.length) {
            return;
        }
        const decl = specifier.closest(j.ImportDeclaration);
        const declNode = decl.get(0).node;
        const peerSpecifiers = declNode.specifiers;
        const source = declNode.source.value;
        // these modules are known to have no side effects
        const safelyRemovableModules = [
            'kdu',
            'kdu-router',
            'kdux',
            '@kdujs/composition-api',
        ];
        if (peerSpecifiers.length === 1 &&
            safelyRemovableModules.includes(source)) {
            decl.remove();
        }
        else {
            // otherwise, only remove the specifier
            specifier.remove();
        }
    }
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

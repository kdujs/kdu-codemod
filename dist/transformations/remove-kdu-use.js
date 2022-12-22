"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
/**
 * Remove `Kdu.use()` calls
 * Per current design, `Kdu.use` is replaced by `app.use`.
 * But in library implementations like `kdu-router` and `kdux`,
 * the new `app.use` does not reuse the same argument passed to `Kdu.use()`,
 * but expects instantiated instances that are used to pass to the root components instead.
 * So we now expect the migration to be done in the `root-prop-to-use` transformation,
 * and the `Kdu.use` statements can be just abandoned.
 */
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const remove_extraneous_import_1 = require("./remove-extraneous-import");
const transformAST = (context, { removablePlugins }) => {
    const { j, root } = context;
    const kduUseCalls = root.find(j.CallExpression, {
        callee: {
            type: 'MemberExpression',
            object: {
                name: 'Kdu',
            },
            property: {
                name: 'use',
            },
        },
    });
    const removedPlugins = [];
    const removableUseCalls = kduUseCalls.filter(({ node }) => {
        if (j.Identifier.check(node.arguments[0])) {
            const plugin = node.arguments[0].name;
            if (removablePlugins.includes(plugin)) {
                removedPlugins.push(plugin);
                return true;
            }
        }
        return false;
    });
    removableUseCalls.remove();
    removedPlugins.forEach((name) => remove_extraneous_import_1.transformAST(context, {
        localBinding: name,
    }));
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

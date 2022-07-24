"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const add_import_1 = require("./add-import");
const remove_extraneous_import_1 = require("./remove-extraneous-import");
// new Store() -> createStore()
const transformAST = (context) => {
    const { j, root } = context;
    const kduxImportDecls = root.find(j.ImportDeclaration, {
        source: {
            value: 'kdux',
        },
    });
    const importedKdux = kduxImportDecls.find(j.ImportDefaultSpecifier);
    const importedStore = kduxImportDecls.find(j.ImportSpecifier, {
        imported: {
            name: 'Store',
        },
    });
    if (importedKdux.length) {
        const localKdux = importedKdux.get(0).node.local.name;
        const newKduxDotStore = root.find(j.NewExpression, {
            callee: {
                type: 'MemberExpression',
                object: {
                    type: 'Identifier',
                    name: localKdux,
                },
                property: {
                    name: 'Store',
                },
            },
        });
        newKduxDotStore.replaceWith(({ node }) => {
            return j.callExpression(j.memberExpression(j.identifier(localKdux), j.identifier('createStore')), node.arguments);
        });
    }
    if (importedStore.length) {
        const localStore = importedStore.get(0).node.local.name;
        const newStore = root.find(j.NewExpression, {
            callee: {
                type: 'Identifier',
                name: localStore,
            },
        });
        (0, add_import_1.transformAST)(context, {
            specifier: {
                type: 'named',
                imported: 'createStore',
            },
            source: 'kdux',
        });
        newStore.replaceWith(({ node }) => {
            return j.callExpression(j.identifier('createStore'), node.arguments);
        });
        (0, remove_extraneous_import_1.transformAST)(context, { localBinding: localStore });
    }
};
exports.transformAST = transformAST;
exports.default = (0, wrapAstTransformation_1.default)(exports.transformAST);
exports.parser = 'babylon';

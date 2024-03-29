"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const add_import_1 = require("./add-import");
const remove_extraneous_import_1 = require("./remove-extraneous-import");
// new Router() -> createRouter()
const transformAST = (context) => {
    const { root, j } = context;
    const routerImportDecls = root.find(j.ImportDeclaration, {
        source: {
            value: 'kdu-router',
        },
    });
    const importedKduRouter = routerImportDecls.find(j.ImportDefaultSpecifier);
    if (importedKduRouter.length) {
        const localKduRouter = importedKduRouter.get(0).node.local.name;
        const newKduRouter = root.find(j.NewExpression, {
            callee: {
                type: 'Identifier',
                name: localKduRouter,
            },
        });
        add_import_1.transformAST(context, {
            specifier: { type: 'named', imported: 'createRouter' },
            source: 'kdu-router',
        });
        newKduRouter.replaceWith(({ node }) => {
            // mode: 'history' -> history: createWebHistory(), etc
            let historyMode = 'createWebHashHistory';
            let baseValue;
            if (!j.ObjectExpression.check(node.arguments[0])) {
                throw new Error('Currently, only object expressions passed to `new KduRouter` can be transformed.');
            }
            const routerConfig = node.arguments[0];
            routerConfig.properties = routerConfig.properties.filter((p) => {
                if (!j.ObjectProperty.check(p) && !j.Property.check(p)) {
                    return true;
                }
                if (p.key.name === 'mode') {
                    const mode = p.value.value;
                    if (mode === 'hash') {
                        historyMode = 'createWebHashHistory';
                    }
                    else if (mode === 'history') {
                        historyMode = 'createWebHistory';
                    }
                    else if (mode === 'abstract') {
                        historyMode = 'createMemoryHistory';
                    }
                    else {
                        throw new Error(`mode must be one of 'hash', 'history', or 'abstract'`);
                    }
                    return false;
                }
                else if (p.key.name === 'base') {
                    baseValue = p.value;
                    return false;
                }
                return true;
            });
            // add the default mode with a hash history
            add_import_1.transformAST(context, {
                specifier: { type: 'named', imported: historyMode },
                source: 'kdu-router',
            });
            node.arguments[0].properties = node.arguments[0].properties.filter((p) => !!p);
            node.arguments[0].properties.unshift(j.objectProperty(j.identifier('history'), j.callExpression(j.identifier(historyMode), baseValue ? [baseValue] : [])));
            return j.callExpression(j.identifier('createRouter'), node.arguments);
        });
        remove_extraneous_import_1.transformAST(context, {
            localBinding: localKduRouter,
        });
    }
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

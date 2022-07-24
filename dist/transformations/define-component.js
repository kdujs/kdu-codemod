"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const add_import_1 = require("./add-import");
const remove_extraneous_import_1 = require("./remove-extraneous-import");
const transformAST = (context, { useCompositionApi } = {
    useCompositionApi: false,
}) => {
    const { root, j, filename } = context;
    const importDefineComponent = () => (0, add_import_1.transformAST)(context, {
        specifier: {
            type: 'named',
            imported: 'defineComponent',
        },
        source: useCompositionApi ? '@kdujs/composition-api' : 'kdu',
    });
    const kduExtend = root.find(j.CallExpression, {
        callee: {
            type: 'MemberExpression',
            object: {
                name: 'Kdu',
            },
            property: {
                name: 'extend',
            },
        },
    });
    if (kduExtend.length) {
        importDefineComponent();
        kduExtend.forEach(({ node }) => {
            node.callee = j.identifier('defineComponent');
        });
        (0, remove_extraneous_import_1.transformAST)(context, { localBinding: 'Kdu' });
    }
    if (filename && filename.endsWith('.kdu')) {
        const defaultExport = root.find(j.ExportDefaultDeclaration);
        if (!defaultExport.length) {
            return;
        }
        const declarationNode = defaultExport.nodes()[0].declaration;
        if (!j.ObjectExpression.check(declarationNode)) {
            return;
        }
        importDefineComponent();
        defaultExport.nodes()[0].declaration = j.callExpression(j.identifier('defineComponent'), [declarationNode]);
        (0, remove_extraneous_import_1.transformAST)(context, { localBinding: 'Kdu' });
    }
};
exports.transformAST = transformAST;
exports.default = (0, wrapAstTransformation_1.default)(exports.transformAST);
exports.parser = 'babylon';

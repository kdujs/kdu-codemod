"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const add_import_1 = require("./add-import");
const transformAST = (context) => {
    const { root, j } = context;
    const renderFns = root.find(j.ObjectProperty, {
        key: {
            name: 'render',
        },
        value: {
            type: 'ArrowFunctionExpression',
        },
    });
    const renderMethods = root.find(j.ObjectMethod, {
        key: {
            name: 'render',
        },
        params: (params) => j.Identifier.check(params[0]) && params[0].name === 'h',
    });
    if (renderFns.length || renderMethods.length) {
        add_import_1.transformAST(context, {
            specifier: { type: 'named', imported: 'h' },
            source: 'kdu',
        });
        renderFns.forEach(({ node }) => {
            ;
            node.value.params.shift();
        });
        renderMethods.forEach(({ node }) => {
            node.params.shift();
        });
    }
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

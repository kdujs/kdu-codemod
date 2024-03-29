"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
// import Kdu from 'kdu' -> import * as Kdu from 'kdu'
const transformAST = ({ j, root }) => {
    const importDecl = root.find(j.ImportDeclaration, {
        source: {
            value: 'kdu',
        },
    });
    importDecl.find(j.ImportDefaultSpecifier).replaceWith(({ node }) => {
        return j.importNamespaceSpecifier(node.local);
    });
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

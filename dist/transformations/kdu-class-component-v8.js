"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
// import { Component } from 'kdu-class-component' ->
// import { Options as Component } from 'kdu-class-component'
const transformAST = (context) => {
    const { j, root } = context;
    const kduClassComponentImportDecls = root.find(j.ImportDeclaration, {
        source: {
            value: 'kdu-class-component',
        },
    });
    const ComponentImportSpec = kduClassComponentImportDecls.find(j.ImportSpecifier, {
        imported: {
            name: 'Component',
        },
    });
    ComponentImportSpec.replaceWith(({ node }) => {
        return j.importSpecifier(j.identifier('Options'), j.identifier('Component'));
    });
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

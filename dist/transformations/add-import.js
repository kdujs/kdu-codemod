"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const transformAST = ({ root, j }, { specifier, source }) => {
    let localBinding;
    if (specifier.type === 'named') {
        localBinding = specifier.local || specifier.imported;
    }
    else {
        localBinding = specifier.local;
    }
    const duplicate = root.find(j.ImportDeclaration, {
        specifiers: (arr) => 
        // @ts-ignore there's a bug in ast-types definition, the `local` should be non-nullable
        arr.some((s) => s.local.name === localBinding),
        source: {
            value: source,
        },
    });
    if (duplicate.length) {
        return;
    }
    let newImportSpecifier;
    if (specifier.type === 'default') {
        newImportSpecifier = j.importDefaultSpecifier(j.identifier(specifier.local));
    }
    else if (specifier.type === 'named') {
        newImportSpecifier = j.importSpecifier(j.identifier(specifier.imported), j.identifier(localBinding));
    }
    else {
        // namespace
        newImportSpecifier = j.importNamespaceSpecifier(j.identifier(localBinding));
    }
    const matchedDecl = root.find(j.ImportDeclaration, {
        source: {
            value: source,
        },
    });
    if (matchedDecl.length &&
        !matchedDecl.find(j.ImportNamespaceSpecifier).length) {
        // add new specifier to the existing import declaration
        matchedDecl.get(0).node.specifiers.push(newImportSpecifier);
    }
    else {
        const newImportDecl = j.importDeclaration([newImportSpecifier], j.stringLiteral(source));
        const lastImportDecl = root.find(j.ImportDeclaration).at(-1);
        if (lastImportDecl.length) {
            // add the new import declaration after all other import declarations
            lastImportDecl.insertAfter(newImportDecl);
        }
        else {
            // add new import declaration at the beginning of the file
            root.get().node.program.body.unshift(newImportDecl);
        }
    }
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

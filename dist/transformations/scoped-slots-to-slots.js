"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const transformAST = ({ j, root }) => {
    const dotScopedSlots = root.find(j.MemberExpression, {
        property: {
            type: 'Identifier',
            name: '$scopedSlots',
        },
    });
    dotScopedSlots.forEach(({ node }) => {
        ;
        node.property.name = '$slots';
    });
    const squareBracketScopedSlots = root.find(j.MemberExpression, {
        property: {
            type: 'StringLiteral',
            value: '$scopedSlots',
        },
    });
    squareBracketScopedSlots.forEach(({ node }) => {
        node.property = j.stringLiteral('$slots');
    });
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

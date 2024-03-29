"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const transformAST = ({ root, j }) => {
    const productionTipAssignment = root.find(j.AssignmentExpression, (n) => j.MemberExpression.check(n.left) &&
        n.left.property.name === 'productionTip' &&
        n.left.object.property.name === 'config' &&
        n.left.object.object.name === 'Kdu');
    productionTipAssignment.remove();
};
exports.transformAST = transformAST;
exports.default = wrapAstTransformation_1.default(exports.transformAST);
exports.parser = 'babylon';

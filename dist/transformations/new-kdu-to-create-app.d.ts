import type { ASTTransformation } from '../src/wrapAstTransformation';
import type * as N from 'jscodeshift';
declare type Params = {
    includeMaybeComponents?: boolean;
};
export declare const transformAST: ASTTransformation<Params | void>;
declare const _default: N.Transform;
export default _default;
export declare const parser = "babylon";

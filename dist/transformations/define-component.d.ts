import type { ASTTransformation } from '../src/wrapAstTransformation';
declare type Params = {
    useCompositionApi: boolean;
};
export declare const transformAST: ASTTransformation<Params | undefined>;
declare const _default: import("jscodeshift/src/core").Transform;
export default _default;
export declare const parser = "babylon";

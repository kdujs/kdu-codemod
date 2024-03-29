import type { ASTTransformation } from '../src/wrapAstTransformation';
declare type Params = {
    removablePlugins: string[];
};
export declare const transformAST: ASTTransformation<Params>;
declare const _default: import("jscodeshift/src/core").Transform;
export default _default;
export declare const parser = "babylon";

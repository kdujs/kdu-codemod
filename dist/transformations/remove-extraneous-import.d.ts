import type { ASTTransformation } from '../src/wrapAstTransformation';
declare type Params = {
    localBinding: string;
};
/**
 * Note:
 * here we don't completely remove the import declaration statement
 * if all import specifiers are removed.
 * For example, `import foo from 'bar'`,
 * if `foo` is unused, the statement would become `import 'bar'`.
 * It is because we are not sure if the module contains any side effects.
 */
export declare const transformAST: ASTTransformation<Params>;
declare const _default: import("jscodeshift/src/core").Transform;
export default _default;
export declare const parser = "babylon";

import type { ASTTransformation } from '../src/wrapAstTransformation';
import type * as N from 'jscodeshift';
/**
 * It is expected to be run after the `createApp` transformataion
 * if a root component is trivial, that is, it contains only one simple prop,
 * like `{ render: h => h(App) }`, then just use the `App` variable
 *
 * TODO: implement `remove-trivial-render`,
 * move all other rootProps to the second argument of `createApp`
 */
export declare const transformAST: ASTTransformation;
declare const _default: N.Transform;
export default _default;
export declare const parser = "babylon";

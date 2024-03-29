import type { ASTTransformation } from '../src/wrapAstTransformation';
import * as N from 'jscodeshift';
declare type Params = {
    rootPropName: string;
};
/**
 * Expected to be run after the `createApp` transformation.
 * Transforms expressions like `createApp({ router })` to `createApp().use(router)`
 */
export declare const transformAST: ASTTransformation<Params>;
declare const _default: N.Transform;
export default _default;
export declare const parser = "babylon";

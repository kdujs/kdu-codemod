import type { Collection, ObjectMethod, ObjectExpression, FunctionExpression, ArrowFunctionExpression } from 'jscodeshift';
import type { Context } from './wrapAstTransformation';
declare type KduOptionsType = ObjectExpression | ArrowFunctionExpression | FunctionExpression | ObjectMethod;
export declare function getKduOptions(context: Context): Collection<KduOptionsType>;
export {};

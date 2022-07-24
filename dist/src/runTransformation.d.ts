import { Transform, Parser } from 'jscodeshift';
import KduTransformation from './KduTransformation';
declare type FileInfo = {
    path: string;
    source: string;
};
declare type JSTransformation = Transform & {
    parser?: string | Parser;
};
declare type JSTransformationModule = JSTransformation | {
    default: Transform;
    parser?: string | Parser;
};
declare type KduTransformationModule = KduTransformation | {
    default: KduTransformation;
};
declare type TransformationModule = JSTransformationModule | KduTransformationModule;
export default function runTransformation(fileInfo: FileInfo, transformationModule: TransformationModule, params?: object): string;
export {};

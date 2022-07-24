import { CompilerOptions, CodegenResult, ParserOptions, RootNode, ElementNode, SourceLocation, CompilerError, BindingMetadata } from '@kdujs/compiler-core';
import { RawSourceMap } from 'source-map';
import { Statement } from '@babel/types';
export declare function stringify(sfcDescriptor: SFCDescriptor): string;
/**
 * The following content are modifed from https://github.com/kdujs/core/blob/main/packages/compiler-sfc/src/parse.ts
 */
export interface TemplateCompiler {
    compile(template: string, options: CompilerOptions): CodegenResult;
    parse(template: string, options: ParserOptions): RootNode;
}
export interface SFCParseOptions {
    filename?: string;
    sourceMap?: boolean;
    sourceRoot?: string;
    pad?: boolean | 'line' | 'space';
    compiler?: TemplateCompiler;
}
export interface SFCBlock {
    type: string;
    content: string;
    attrs: Record<string, string | true>;
    loc: SourceLocation;
    map?: RawSourceMap;
    lang?: string;
    src?: string;
}
export interface SFCTemplateBlock extends SFCBlock {
    type: 'template';
    ast: ElementNode;
}
export interface SFCScriptBlock extends SFCBlock {
    type: 'script';
    setup?: string | boolean;
    bindings?: BindingMetadata;
    scriptAst?: Statement[];
    scriptSetupAst?: Statement[];
}
export interface SFCStyleBlock extends SFCBlock {
    type: 'style';
    scoped?: boolean;
    module?: string | boolean;
}
export interface SFCDescriptor {
    filename: string;
    source: string;
    template: SFCTemplateBlock | null;
    script: SFCScriptBlock | null;
    scriptSetup: SFCScriptBlock | null;
    styles: SFCStyleBlock[];
    customBlocks: SFCBlock[];
}
export interface SFCParseResult {
    descriptor: SFCDescriptor;
    errors: (CompilerError | SyntaxError)[];
}
export declare function parse(source: string, { sourceMap, filename, sourceRoot, pad, compiler, }?: SFCParseOptions): SFCParseResult;

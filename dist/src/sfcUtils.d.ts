import { CompilerOptions, CodegenResult, ParserOptions, RootNode, ElementNode, SourceLocation, CompilerError, BindingMetadata } from '@kdujs/compiler-core';
import { RawSourceMap } from 'source-map';
import { Statement } from '@babel/types';
/**
 * The MIT License (MIT)
 * Copyright (c) 2018 Paul Salaets
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
export declare function stringify(sfcDescriptor: SFCDescriptor): string;
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

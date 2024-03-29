"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parse = exports.stringify = void 0;
const CompilerDom = __importStar(require("@kdujs/compiler-dom"));
const source_map_1 = require("source-map");
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
function stringify(sfcDescriptor) {
    const { template, script, styles, customBlocks } = sfcDescriptor;
    return ([template, script, ...styles, ...customBlocks]
        // discard blocks that don't exist
        .filter((block) => block != null)
        // sort blocks by source position
        .sort((a, b) => a.loc.start.offset - b.loc.start.offset)
        // figure out exact source positions of blocks
        .map((block) => {
        const openTag = makeOpenTag(block);
        const closeTag = makeCloseTag(block);
        return Object.assign({}, block, {
            openTag,
            closeTag,
            startOfOpenTag: block.loc.start.offset - openTag.length,
            endOfOpenTag: block.loc.start.offset,
            startOfCloseTag: block.loc.end.offset,
            endOfCloseTag: block.loc.end.offset + closeTag.length,
        });
    })
        // generate sfc source
        .reduce((sfcCode, block, index, array) => {
        const first = index === 0;
        let newlinesBefore = 0;
        if (first) {
            newlinesBefore = block.startOfOpenTag;
        }
        else {
            const prevBlock = array[index - 1];
            newlinesBefore = block.startOfOpenTag - prevBlock.endOfCloseTag;
        }
        return (sfcCode +
            '\n'.repeat(newlinesBefore) +
            block.openTag +
            block.content +
            block.closeTag);
    }, ''));
}
exports.stringify = stringify;
function makeOpenTag(block) {
    let source = '<' + block.type;
    source += Object.keys(block.attrs)
        .sort()
        .map((name) => {
        const value = block.attrs[name];
        if (value === true) {
            return name;
        }
        else {
            return `${name}="${value}"`;
        }
    })
        .map((attr) => ' ' + attr)
        .join('');
    return source + '>';
}
function makeCloseTag(block) {
    return `</${block.type}>\n`;
}
const SFC_CACHE_MAX_SIZE = 500;
const sourceToSFC = new (require('lru-cache'))(SFC_CACHE_MAX_SIZE);
function parse(source, { sourceMap = true, filename = 'anonymous.kdu', sourceRoot = '', pad = false, compiler = CompilerDom, } = {}) {
    const sourceKey = source + sourceMap + filename + sourceRoot + pad + compiler.parse;
    const cache = sourceToSFC.get(sourceKey);
    if (cache) {
        return cache;
    }
    const descriptor = {
        filename,
        source,
        template: null,
        script: null,
        scriptSetup: null,
        styles: [],
        customBlocks: [],
    };
    const errors = [];
    const ast = compiler.parse(source, {
        // there are no components at SFC parsing level
        isNativeTag: () => true,
        // preserve all whitespaces
        isPreTag: () => true,
        getTextMode: ({ tag, props }, parent) => {
            // all top level elements except <template> are parsed as raw text
            // containers
            if ((!parent && tag !== 'template') ||
                // <template lang="xxx"> should also be treated as raw text
                (tag === 'template' &&
                    props.some((p) => p.type === 6 /* ATTRIBUTE */ &&
                        p.name === 'lang' &&
                        p.value &&
                        p.value.content !== 'html'))) {
                return 2 /* RAWTEXT */;
            }
            else {
                return 0 /* DATA */;
            }
        },
        onError: (e) => {
            errors.push(e);
        },
    });
    ast.children.forEach((node) => {
        if (node.type !== 1 /* ELEMENT */) {
            return;
        }
        if (!node.children.length && !hasSrc(node) && node.tag !== 'template') {
            return;
        }
        switch (node.tag) {
            case 'template':
                if (!descriptor.template) {
                    const templateBlock = (descriptor.template = createBlock(node, source, false));
                    templateBlock.ast = node;
                }
                else {
                    errors.push(createDuplicateBlockError(node));
                }
                break;
            case 'script':
                const scriptBlock = createBlock(node, source, pad);
                const isSetup = !!scriptBlock.attrs.setup;
                if (isSetup && !descriptor.scriptSetup) {
                    descriptor.scriptSetup = scriptBlock;
                    break;
                }
                if (!isSetup && !descriptor.script) {
                    descriptor.script = scriptBlock;
                    break;
                }
                errors.push(createDuplicateBlockError(node, isSetup));
                break;
            case 'style':
                const styleBlock = createBlock(node, source, pad);
                if (styleBlock.attrs.vars) {
                    errors.push(new SyntaxError(`<style vars> has been replaced by a new proposal.`));
                }
                descriptor.styles.push(styleBlock);
                break;
            default:
                descriptor.customBlocks.push(createBlock(node, source, pad));
                break;
        }
    });
    if (descriptor.scriptSetup) {
        if (descriptor.scriptSetup.src) {
            errors.push(new SyntaxError(`<script setup> cannot use the "src" attribute because ` +
                `its syntax will be ambiguous outside of the component.`));
            descriptor.scriptSetup = null;
        }
        if (descriptor.script && descriptor.script.src) {
            errors.push(new SyntaxError(`<script> cannot use the "src" attribute when <script setup> is ` +
                `also present because they must be processed together.`));
            descriptor.script = null;
        }
    }
    if (sourceMap) {
        const genMap = (block) => {
            if (block && !block.src) {
                block.map = generateSourceMap(filename, source, block.content, sourceRoot, !pad || block.type === 'template' ? block.loc.start.line - 1 : 0);
            }
        };
        genMap(descriptor.template);
        genMap(descriptor.script);
        descriptor.styles.forEach(genMap);
        descriptor.customBlocks.forEach(genMap);
    }
    const result = {
        descriptor,
        errors,
    };
    sourceToSFC.set(sourceKey, result);
    return result;
}
exports.parse = parse;
function createDuplicateBlockError(node, isScriptSetup = false) {
    const err = new SyntaxError(`Single file component can contain only one <${node.tag}${isScriptSetup ? ` setup` : ``}> element`);
    err.loc = node.loc;
    return err;
}
function createBlock(node, source, pad) {
    const type = node.tag;
    let { start, end } = node.loc;
    let content = '';
    if (node.children.length) {
        start = node.children[0].loc.start;
        end = node.children[node.children.length - 1].loc.end;
        content = source.slice(start.offset, end.offset);
    }
    const loc = {
        source: content,
        start,
        end,
    };
    const attrs = {};
    const block = {
        type,
        content,
        loc,
        attrs,
    };
    if (pad) {
        block.content = padContent(source, block, pad) + block.content;
    }
    node.props.forEach((p) => {
        if (p.type === 6 /* ATTRIBUTE */) {
            attrs[p.name] = p.value ? p.value.content || true : true;
            if (p.name === 'lang') {
                block.lang = p.value && p.value.content;
            }
            else if (p.name === 'src') {
                block.src = p.value && p.value.content;
            }
            else if (type === 'style') {
                if (p.name === 'scoped') {
                    ;
                    block.scoped = true;
                }
                else if (p.name === 'module') {
                    ;
                    block.module = attrs[p.name];
                }
            }
            else if (type === 'script' && p.name === 'setup') {
                ;
                block.setup = attrs.setup;
            }
        }
    });
    return block;
}
const splitRE = /\r?\n/g;
const emptyRE = /^(?:\/\/)?\s*$/;
const replaceRE = /./g;
function generateSourceMap(filename, source, generated, sourceRoot, lineOffset) {
    const map = new source_map_1.SourceMapGenerator({
        file: filename.replace(/\\/g, '/'),
        sourceRoot: sourceRoot.replace(/\\/g, '/'),
    });
    map.setSourceContent(filename, source);
    generated.split(splitRE).forEach((line, index) => {
        if (!emptyRE.test(line)) {
            const originalLine = index + 1 + lineOffset;
            const generatedLine = index + 1;
            for (let i = 0; i < line.length; i++) {
                if (!/\s/.test(line[i])) {
                    map.addMapping({
                        source: filename,
                        original: {
                            line: originalLine,
                            column: i,
                        },
                        generated: {
                            line: generatedLine,
                            column: i,
                        },
                    });
                }
            }
        }
    });
    return JSON.parse(map.toString());
}
function padContent(content, block, pad) {
    content = content.slice(0, block.loc.start.offset);
    if (pad === 'space') {
        return content.replace(replaceRE, ' ');
    }
    else {
        const offset = content.split(splitRE).length;
        const padChar = block.type === 'script' && !block.lang ? '//\n' : '\n';
        return Array(offset).join(padChar);
    }
}
function hasSrc(node) {
    return node.props.some((p) => {
        if (p.type !== 6 /* ATTRIBUTE */) {
            return false;
        }
        return p.name === 'src';
    });
}

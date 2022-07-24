"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jscodeshift_1 = __importDefault(require("jscodeshift"));
// @ts-ignore
const getParser_1 = __importDefault(require("jscodeshift/src/getParser"));
const debug_1 = __importDefault(require("debug"));
const sfcUtils_1 = require("./sfcUtils");
const KduTransformation_1 = __importDefault(require("./KduTransformation"));
const debug = (0, debug_1.default)('kdu-codemod');
function runTransformation(fileInfo, transformationModule, params = {}) {
    let transformation;
    // @ts-ignore
    if (typeof transformationModule.default !== 'undefined') {
        // @ts-ignore
        transformation = transformationModule.default;
    }
    else {
        transformation = transformationModule;
    }
    if (transformation instanceof KduTransformation_1.default) {
        debug('TODO: Running KduTransformation');
        return fileInfo.source;
    }
    debug('Running jscodeshift transform');
    const { path, source } = fileInfo;
    const extension = (/\.([^.]*)$/.exec(path) || [])[0];
    let lang = extension.slice(1);
    let descriptor;
    if (extension === '.kdu') {
        descriptor = (0, sfcUtils_1.parse)(source, { filename: path }).descriptor;
        // skip .kdu files without script block
        if (!descriptor.script) {
            return source;
        }
        lang = descriptor.script.lang || 'js';
        fileInfo.source = descriptor.script.content;
    }
    let parser = (0, getParser_1.default)();
    let parserOption = transformationModule.parser;
    // force inject `parser` option for .tsx? files, unless the module specifies a custom implementation
    if (typeof parserOption !== 'object') {
        if (lang.startsWith('ts')) {
            parserOption = lang;
        }
    }
    if (parserOption) {
        parser =
            typeof parserOption === 'string' ? (0, getParser_1.default)(parserOption) : parserOption;
    }
    const j = jscodeshift_1.default.withParser(parser);
    const api = {
        j,
        jscodeshift: j,
        stats: () => { },
        report: () => { },
    };
    const out = transformation(fileInfo, api, params);
    if (!out) {
        return source; // skipped
    }
    // need to reconstruct the .kdu file from descriptor blocks
    if (extension === '.kdu') {
        if (out === descriptor.script.content) {
            return source; // skipped, don't bother re-stringifying
        }
        descriptor.script.content = out;
        return (0, sfcUtils_1.stringify)(descriptor);
    }
    return out;
}
exports.default = runTransformation;

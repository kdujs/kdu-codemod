#!/usr/bin/env node
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const module_1 = __importDefault(require("module"));
const yargs = __importStar(require("yargs"));
const globby = __importStar(require("globby"));
const debug_1 = __importDefault(require("debug"));
const transformations_1 = __importDefault(require("../transformations"));
const runTransformation_1 = __importDefault(require("../src/runTransformation"));
const debug = debug_1.default('kdu-codemod');
const log = console.log.bind(console);
const { _: files, transformation: transformationName, params } = yargs
    .usage('Usage: $0 [file pattern]')
    .option('transformation', {
    alias: 't',
    type: 'string',
    describe: 'Name or path of the transformation module',
})
    .option('params', {
    alias: 'p',
    describe: 'Custom params to the transformation',
})
    .demandOption('transformation')
    .help().argv;
// TODO: port the `Runner` interface of jscodeshift
async function main() {
    const resolvedPaths = globby.sync(files);
    const transformationModule = loadTransformationModule(transformationName);
    log(`Processing ${resolvedPaths.length} files…`);
    for (const p of resolvedPaths) {
        debug(`Processing ${p}…`);
        const fileInfo = {
            path: p,
            source: fs.readFileSync(p).toString(),
        };
        try {
            const result = runTransformation_1.default(fileInfo, transformationModule, params);
            fs.writeFileSync(p, result);
        }
        catch (e) {
            console.error(e);
        }
    }
}
main().catch((err) => {
    console.error(err);
    process.exit(1);
});
function loadTransformationModule(nameOrPath) {
    let transformation = transformations_1.default[nameOrPath];
    if (transformation) {
        return transformation;
    }
    const customModulePath = path.resolve(process.cwd(), nameOrPath);
    if (fs.existsSync(customModulePath)) {
        const requireFunc = module_1.default.createRequire(path.resolve(process.cwd(), './package.json'));
        // TODO: interop with ES module
        // TODO: fix absolute path
        return requireFunc(`./${nameOrPath}`);
    }
    throw new Error(`Cannot find transformation module ${nameOrPath}`);
}

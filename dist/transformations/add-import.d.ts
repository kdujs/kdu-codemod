import type { ASTTransformation } from '../src/wrapAstTransformation';
declare type DefaultSpecifierParam = {
    type: 'default';
    local: string;
};
declare type NamedSpecifierParam = {
    type: 'named';
    imported: string;
    local?: string;
};
declare type NamespaceSpecifierParam = {
    type: 'namespace';
    local: string;
};
declare type Params = {
    specifier: DefaultSpecifierParam | NamedSpecifierParam | NamespaceSpecifierParam;
    source: string;
};
export declare const transformAST: ASTTransformation<Params>;
declare const _default: import("jscodeshift/src/core").Transform;
export default _default;
export declare const parser = "babylon";

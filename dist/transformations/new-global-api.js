"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parser = exports.transformAST = void 0;
const wrapAstTransformation_1 = __importDefault(require("../src/wrapAstTransformation"));
const kdu_as_namespace_import_1 = require("./kdu-as-namespace-import");
const import_composition_api_from_kdu_1 = require("./import-composition-api-from-kdu");
const new_kdu_to_create_app_1 = require("./new-kdu-to-create-app");
const root_prop_to_use_1 = require("./root-prop-to-use");
const remove_trivial_root_1 = require("./remove-trivial-root");
const remove_production_tip_1 = require("./remove-production-tip");
const remove_kdu_use_1 = require("./remove-kdu-use");
const remove_contextual_h_from_render_1 = require("./remove-contextual-h-from-render");
const remove_extraneous_import_1 = require("./remove-extraneous-import");
const transformAST = (context) => {
    (0, kdu_as_namespace_import_1.transformAST)(context);
    (0, import_composition_api_from_kdu_1.transformAST)(context);
    (0, new_kdu_to_create_app_1.transformAST)(context);
    (0, root_prop_to_use_1.transformAST)(context, { rootPropName: 'store' });
    (0, root_prop_to_use_1.transformAST)(context, { rootPropName: 'router' });
    (0, remove_trivial_root_1.transformAST)(context);
    (0, remove_production_tip_1.transformAST)(context);
    // TODO:
    // should analyze the AST to get the default import of kdu-router and kdux,
    // rather than hard-coding the names
    (0, remove_kdu_use_1.transformAST)(context, { removablePlugins: ['KduRouter', 'Kdux'] });
    (0, remove_contextual_h_from_render_1.transformAST)(context);
    (0, remove_extraneous_import_1.transformAST)(context, { localBinding: 'Kdu' });
    (0, remove_extraneous_import_1.transformAST)(context, { localBinding: 'Kdux' });
    (0, remove_extraneous_import_1.transformAST)(context, { localBinding: 'KduRouter' });
};
exports.transformAST = transformAST;
exports.default = (0, wrapAstTransformation_1.default)(exports.transformAST);
exports.parser = 'babylon';

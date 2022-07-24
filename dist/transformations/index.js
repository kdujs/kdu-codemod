"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const transformationMap = {
    'kdu-class-component-v8': require('./kdu-class-component-v8'),
    'new-global-api': require('./new-global-api'),
    'kdu-router-v4': require('./kdu-router-v4'),
    'kdux-v4': require('./kdux-v4'),
    'define-component': require('./define-component'),
    'new-kdu-to-create-app': require('./new-kdu-to-create-app'),
    'scoped-slots-to-slots': require('./scoped-slots-to-slots'),
    'new-directive-api': require('./new-directive-api'),
    'remove-kdu-set-and-delete': require('./remove-kdu-set-and-delete'),
    // atomic ones
    'remove-contextual-h-from-render': require('./remove-contextual-h-from-render'),
    'remove-production-tip': require('./remove-production-tip'),
    'remove-trivial-root': require('./remove-trivial-root'),
    'remove-kdu-use': require('./remove-kdu-use'),
    'root-prop-to-use': require('./root-prop-to-use'),
    'kdu-as-namespace-import': require('./kdu-as-namespace-import'),
    // generic utility tranformations
    'add-import': require('./add-import'),
    'remove-extraneous-import': require('./remove-extraneous-import'),
};
exports.default = transformationMap;

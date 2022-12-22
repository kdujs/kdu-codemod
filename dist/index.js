"use strict";
// TODO: Programmatic API
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformations = exports.runTransformation = exports.KduTransformation = void 0;
var KduTransformation_1 = require("./src/KduTransformation");
Object.defineProperty(exports, "KduTransformation", { enumerable: true, get: function () { return __importDefault(KduTransformation_1).default; } });
var runTransformation_1 = require("./src/runTransformation");
Object.defineProperty(exports, "runTransformation", { enumerable: true, get: function () { return __importDefault(runTransformation_1).default; } });
var transformations_1 = require("./transformations");
Object.defineProperty(exports, "transformations", { enumerable: true, get: function () { return __importDefault(transformations_1).default; } });

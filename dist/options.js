"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var schema_utils_1 = __importDefault(require("schema-utils"));
var loader_utils_1 = require("loader-utils");
var defaults_1 = require("./defaults");
exports.schema = {
    type: 'object',
    properties: {
        viewFileName: {
            type: 'string'
        },
        viewFileExt: {
            type: 'string'
        },
        styleFileName: {
            type: 'string'
        },
        styleFileExt: {
            type: 'string'
        }
    }
};
function validateOptions(errorMsg) {
    var options = loader_utils_1.getOptions(this);
    if (options) {
        schema_utils_1.default(exports.schema, options, errorMsg);
    }
    else {
        options = defaults_1.defaults;
    }
    return options;
}
exports.validateOptions = validateOptions;
//# sourceMappingURL=options.js.map
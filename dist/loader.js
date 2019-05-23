"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs_1 = require("fs");
var path_1 = require("path");
var options_1 = require("./options");
var defaults_1 = require("./defaults");
var ts_utils_1 = require("./ts-utils");
function default_1(source) {
    var _this = this;
    var options = options_1.validateOptions.call(this, 'Mantha component loader');
    var fileExists = function (filename) {
        try {
            return fs_1.existsSync(path_1.join(_this._module.context, filename));
        }
        catch (error) {
            console.error(error);
            return false;
        }
    };
    var _a = defaults_1.optionsWithDefaults(options), viewFileName = _a.viewFileName, styleFileName = _a.styleFileName;
    var importStatements = ts_utils_1.generateImportDeclarations([styleFileName, viewFileName], [ts_utils_1.declareImport(), ts_utils_1.declareImport(defaults_1.defaultRenderFactory)], fileExists);
    // Return original file if no imports need to be added
    if (importStatements.length === 0) {
        return source;
    }
    var sourceFile = ts_utils_1.createFile(source);
    var defaultExport = ts_utils_1.findDefaultExport(sourceFile);
    // Return original file if no default export is found
    if (!defaultExport) {
        return sourceFile;
    }
    return ts_utils_1.printer.printFile(ts_utils_1.updateSourceWith({
        sourceFile: sourceFile,
        importStatements: importStatements,
        inject: defaultExport
    }));
}
exports.default = default_1;
//# sourceMappingURL=loader.js.map
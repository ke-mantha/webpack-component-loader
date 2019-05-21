"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var loader_utils_1 = require("loader-utils");
var schema_utils_1 = __importDefault(require("schema-utils"));
var typescript_1 = __importDefault(require("typescript"));
var fs_1 = require("fs");
var path_1 = require("path");
var schema = {
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
var defaultViewFileName = 'view';
var defaultViewFileExt = '.pug';
var defaultStyleFileName = 'styles';
var defaultStyleFileExt = '.styl';
function default_1(source) {
    var options = loader_utils_1.getOptions(this);
    schema_utils_1.default(schema, options, 'Mantha component loader');
    var literal = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var result = typescript_1.default.createLiteral.apply(typescript_1.default, args);
        result.singleQuote = true;
        return result;
    };
    var viewFileName = options.viewFileName, styleFileName = options.styleFileName, viewFileExt = options.viewFileExt, styleFileExt = options.styleFileExt;
    var importStatements = [];
    var finalViewFileExt = viewFileExt || defaultViewFileExt;
    var finalViewFileName = (viewFileName || defaultViewFileName) + finalViewFileExt;
    var finalStyleFileExt = styleFileExt || defaultStyleFileExt;
    var finalStyleFileName = (styleFileName || defaultStyleFileName) + finalStyleFileExt;
    var renderPresent = false;
    // Add view import statement if there is such file
    if (fs_1.existsSync(path_1.join(this._module.context, finalViewFileName))) {
        renderPresent = true;
        importStatements.push(typescript_1.default.createImportDeclaration(undefined, undefined, typescript_1.default.createImportClause(typescript_1.default.createIdentifier('render'), undefined), literal("./" + finalViewFileName)));
    }
    // Add styles import statement if there is such file
    if (fs_1.existsSync(path_1.join(this._module.context, finalStyleFileName))) {
        importStatements.push(typescript_1.default.createImportDeclaration(undefined, undefined, undefined, literal("./" + finalStyleFileName)));
    }
    var sourceFile = typescript_1.default.createSourceFile('index.ts', source, typescript_1.default.ScriptTarget.ESNext, true, typescript_1.default.ScriptKind.TS);
    var printer = typescript_1.default.createPrinter({
        omitTrailingSemicolon: false,
        removeComments: false
    });
    var update = sourceFile;
    if (renderPresent) {
        var updatedNode_1 = null;
        typescript_1.default.forEachChild(sourceFile, function (node) {
            if (node.kind === typescript_1.default.SyntaxKind.ExportAssignment && node.getChildAt(1).kind === typescript_1.default.SyntaxKind.DefaultKeyword) {
                updatedNode_1 = node;
            }
        });
        if (updatedNode_1) {
            var _updatedNode = updatedNode_1;
            var exportedStatement = _updatedNode.getChildAt(2);
            var renderCall = typescript_1.default.createCall(typescript_1.default.createIdentifier('render'), undefined, [exportedStatement]);
            var indexOfExport = sourceFile.statements.indexOf(_updatedNode);
            update = typescript_1.default.updateSourceFileNode(sourceFile, importStatements.concat(sourceFile.statements.slice(0, indexOfExport), [
                typescript_1.default.createExportDefault(renderCall)
            ], sourceFile.statements.slice(indexOfExport + 1)));
        }
    }
    return printer.printFile(update);
}
exports.default = default_1;
//# sourceMappingURL=loader.js.map
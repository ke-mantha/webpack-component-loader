"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var typescript_1 = require("typescript");
var defaults_1 = require("./defaults");
exports.literal = function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    var result = typescript_1.createLiteral.apply(void 0, args);
    result.singleQuote = true;
    return result;
};
exports.declareImport = function (declaration) { return function (filename) { return typescript_1.createImportDeclaration(undefined, undefined, declaration ? typescript_1.createImportClause(typescript_1.createIdentifier(declaration), undefined) : undefined, exports.literal("./" + filename)); }; };
exports.generateImportDeclarations = function (files, factories, fileExists) {
    if (fileExists === void 0) { fileExists = function (_) { return true; }; }
    return files.reduce(function (arr, file, idx) {
        if (fileExists(file)) {
            arr.push(factories[idx](file));
        }
        return arr;
    }, []);
};
exports.createFile = function (source) { return typescript_1.createSourceFile('index.ts', source, typescript_1.ScriptTarget.ESNext, true, typescript_1.ScriptKind.TS); };
exports.wrapDefaultExportNode = function (node) { return typescript_1.createExportDefault(typescript_1.createCall(typescript_1.createIdentifier(defaults_1.defaultRenderFactory), undefined, [node])); };
exports.printer = typescript_1.createPrinter({
    omitTrailingSemicolon: false,
    removeComments: false
});
exports.findDefaultExport = function (sourceFile) {
    var defaultExportStatement = undefined;
    typescript_1.forEachChild(sourceFile, function (statement) {
        if (statement.kind === typescript_1.SyntaxKind.ExportAssignment
            && statement.getChildAt(1).kind === typescript_1.SyntaxKind.DefaultKeyword) {
            defaultExportStatement = statement;
            return;
        }
    });
    return defaultExportStatement;
};
exports.nodeFromDefaultExport = function (exportStatement) {
    // children:
    // 0      1       2        3
    // export default something;
    return exportStatement.getChildAt(2);
};
exports.updateSourceWith = function (_a) {
    var sourceFile = _a.sourceFile, importStatements = _a.importStatements, inject = _a.inject;
    var index = sourceFile.statements.indexOf(inject);
    return typescript_1.updateSourceFileNode(sourceFile, importStatements.concat(sourceFile.statements.slice(0, index), [
        exports.wrapDefaultExportNode(exports.nodeFromDefaultExport(inject))
    ], sourceFile.statements.slice(index + 1)));
};
//# sourceMappingURL=ts-utils.js.map
import { SourceFile, Node, Statement, ImportDeclaration } from 'typescript';
export declare const literal: (value: string | number | boolean | import("typescript").PseudoBigInt) => import("typescript").PrimaryExpression;
export declare type ImportFactory = (filename: string) => ImportDeclaration;
export declare const importRenderDeclaration: ImportFactory;
export declare const importStyleDeclaration: ImportFactory;
export declare const generateImportDeclarations: (files: string[], factories: ImportFactory[], fileExists?: (name: string) => boolean) => ImportDeclaration[];
export declare const createFile: (source: string) => SourceFile;
export declare const wrapDefaultExportNode: (node: Node) => import("typescript").ExportAssignment;
export declare const printer: import("typescript").Printer;
export declare const findDefaultExport: (sourceFile: SourceFile) => Statement | undefined;
export declare const nodeFromDefaultExport: (exportStatement: Statement) => Statement & Node;
export declare const updateSourceWith: ({ sourceFile, importStatements, inject }: {
    sourceFile: SourceFile;
    importStatements: ImportDeclaration[];
    inject: Node & Statement;
}) => SourceFile;

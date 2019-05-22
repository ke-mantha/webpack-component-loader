import {
  createLiteral,
  createImportDeclaration,
  createImportClause,
  createIdentifier,
  createSourceFile,
  ScriptTarget,
  ScriptKind,
  createPrinter,
  SourceFile,
  forEachChild,
  Node,
  SyntaxKind,
  Expression,
  createExportDefault,
  createCall,
  Statement,
  ImportDeclaration,
  updateSourceFileNode
} from 'typescript';

export const literal = (...args: Parameters<typeof createLiteral>) => {
  const result = createLiteral(...args);
  (result as any).singleQuote = true;
  return result;
};

export type ImportFactory = (filename: string) => ImportDeclaration;

export const declareImport = (
  declaration?: string
): ImportFactory => (
  filename: string
) => createImportDeclaration(
  undefined,
  undefined,
  declaration ? createImportClause(
    createIdentifier(declaration),
    undefined
  ) : undefined,
  literal(`./${filename}`)
);

export const generateImportDeclarations = (
  files: string[],
  factories: ImportFactory[],
  fileExists: (name: string) => boolean = _ => true
): ImportDeclaration[] => files.reduce<ImportDeclaration[]>((arr, file, idx) => {
  if (fileExists(file)) {
    arr.push(factories[idx](file));
  }

  return arr;
}, []);

export const createFile = (source: string) => createSourceFile(
  'index.ts',
  source,
  ScriptTarget.ESNext,
  true,
  ScriptKind.TS
);

export const wrapDefaultExportNode = (node: Node) => createExportDefault(
  createCall(
    createIdentifier('render'),
    undefined,
    [node as Expression]
  )
);

export const printer = createPrinter({
  omitTrailingSemicolon: false,
  removeComments: false
});

export const findDefaultExport = (sourceFile: SourceFile): Statement | undefined => {
  let defaultExportStatement: Node | undefined = undefined;

  forEachChild(sourceFile, statement => {
    if (
      statement.kind === SyntaxKind.ExportAssignment
      && statement.getChildAt(1).kind === SyntaxKind.DefaultKeyword
    ) {
      defaultExportStatement = statement;

      return;
    }
  });

  return defaultExportStatement;
};

export const nodeFromDefaultExport = (exportStatement: Statement): Statement & Node => {
  // children:
  // 0      1       2        3
  // export default something;
  return exportStatement.getChildAt(2) as Statement;
}

export const updateSourceWith = ({
  sourceFile,
  importStatements,
  inject
}: {
  sourceFile: SourceFile,
  importStatements: ImportDeclaration[],
  inject: Node & Statement
}) => {
  const index = sourceFile.statements.indexOf(inject);

  return updateSourceFileNode(sourceFile, [
    ...importStatements,
    ...sourceFile.statements.slice(0, index),
    wrapDefaultExportNode(
      nodeFromDefaultExport(inject)
    ),
    ...sourceFile.statements.slice(index + 1)
  ]);
};

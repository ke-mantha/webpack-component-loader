import { getOptions } from 'loader-utils';
import validateOptions from 'schema-utils';
import ts from 'typescript';
import { existsSync } from 'fs';
import { join } from 'path';

const schema = {
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

const defaultViewFileName = 'view';
const defaultViewFileExt = '.pug';
const defaultStyleFileName = 'styles';
const defaultStyleFileExt = '.styl';

export default function (source) {
  const options = getOptions(this);

  validateOptions(schema, options, 'Mantha component loader');

  const literal = (...args: Parameters<typeof ts.createLiteral>) => {
    const result = ts.createLiteral(...args);
    (result as any).singleQuote = true;
    return result;
  }

  const { viewFileName, styleFileName, viewFileExt, styleFileExt } = options;
  const importStatements: ts.ImportDeclaration[] = [];
  const finalViewFileExt = viewFileExt || defaultViewFileExt;
  const finalViewFileName = (viewFileName || defaultViewFileName) + finalViewFileExt;
  const finalStyleFileExt = styleFileExt || defaultStyleFileExt;
  const finalStyleFileName = (styleFileName || defaultStyleFileName) + finalStyleFileExt;

  let renderPresent = false;

  // Add view import statement if there is such file
  if (existsSync(join(this._module.context, finalViewFileName))) {
    renderPresent = true;
    importStatements.push(ts.createImportDeclaration(
      undefined,
      undefined,
      ts.createImportClause(
        ts.createIdentifier('render'),
        undefined
      ),
      literal(`./${finalViewFileName}`)
    ));
  }

  // Add styles import statement if there is such file
  if (existsSync(join(this._module.context, finalStyleFileName))) {
    importStatements.push(ts.createImportDeclaration(
      undefined,
      undefined,
      undefined,
      literal(`./${finalStyleFileName}`)
    ));
  }

  const sourceFile = ts.createSourceFile(
    'index.ts',
    source,
    ts.ScriptTarget.ESNext,
    true,
    ts.ScriptKind.TS
  );

  const printer = ts.createPrinter({
    omitTrailingSemicolon: false,
    removeComments: false
  });

  let update = sourceFile;

  if (renderPresent) {
    let updatedNode: ts.Node | null = null;
    ts.forEachChild(sourceFile, node => {
      if (node.kind === ts.SyntaxKind.ExportAssignment && node.getChildAt(1).kind === ts.SyntaxKind.DefaultKeyword) {
        updatedNode = node;
      }
    });
    
    if (updatedNode) {
      const _updatedNode: ts.Node = updatedNode;
      const exportedStatement = _updatedNode.getChildAt(2);
      const renderCall = ts.createCall(ts.createIdentifier('render'), undefined, [exportedStatement as ts.Expression]);
      const indexOfExport = sourceFile.statements.indexOf(_updatedNode as ts.Statement);

      update = ts.updateSourceFileNode(sourceFile, [
        ...importStatements,
        ...sourceFile.statements.slice(0, indexOfExport),
        ts.createExportDefault(renderCall),
        ...sourceFile.statements.slice(indexOfExport+1)
      ]);
    }
  }

  return printer.printFile(update);
}

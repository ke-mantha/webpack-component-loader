import { existsSync } from 'fs';
import { join } from 'path';
import { validateOptions } from './options';
import { loader } from 'webpack';
import { optionsWithDefaults, defaultRenderFactory } from './defaults';

import {
  declareImport,
  createFile,
  printer,
  findDefaultExport,
  generateImportDeclarations,
  updateSourceWith
} from './ts-utils';

export default function (this: loader.LoaderContext, source: string) {
  const options = validateOptions.call(this, 'Mantha component loader');
  const fileExists = (filename: string) => existsSync(join(this.context, filename));

  const { viewFileName, styleFileName } = optionsWithDefaults(options);
  const importStatements = generateImportDeclarations(
    [styleFileName, viewFileName],
    [declareImport(), declareImport(defaultRenderFactory)],
    fileExists
  );

  // Return original file if no imports need to be added
  if (importStatements.length === 0) {
    return source;
  }

  const sourceFile = createFile(source);
  const defaultExport = findDefaultExport(sourceFile);

  // Return original file if no default export is found
  if (!defaultExport) {
    return sourceFile;
  }

  return printer.printFile(
    updateSourceWith({
      sourceFile,
      importStatements,
      inject: defaultExport
    })
  );
}

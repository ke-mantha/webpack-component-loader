import validateSchemaOptions from 'schema-utils';
import { getOptions, OptionObject } from 'loader-utils';
import { defaults } from './defaults';

export type SchemaKeys = keyof typeof schema['properties'];

export type Options = {
  [key in SchemaKeys]: string;
};

export const schema = {
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

export function validateOptions(errorMsg: string) {
  let options = getOptions(this) as Options & OptionObject;

  if (options) {
    validateSchemaOptions(schema, options, errorMsg);
  } else {
    options = defaults;
  }

  return options;
}

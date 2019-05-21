import validateSchemaOptions from 'schema-utils';
import { getOptions, OptionObject } from 'loader-utils';

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
  const options = getOptions(this) as Options & OptionObject;

  validateSchemaOptions(schema, options, errorMsg);

  return options;
}

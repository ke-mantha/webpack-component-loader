import validateSchemaOptions from 'schema-utils';
import { getOptions } from 'loader-utils';

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
  const options = getOptions(this);
  
  validateSchemaOptions(schema, options, errorMsg);

  return options;
}

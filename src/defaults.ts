import { OptionObject } from 'loader-utils';
import { schema, Options } from './options';

export const defaults: Options = {
  viewFileName: 'view',
  viewFileExt: '.pug',
  styleFileName: 'styles',
  styleFileExt: '.styl'
};

export const optionsWithDefaults = (options: OptionObject & Options) => {
  for (const key in schema.properties) {
    options[key] = typeof options[key] === 'string' ? options[key] : defaults[key];
  }

  options.styleFileName = options.styleFileName + options.styleFileExt;
  options.viewFileName = options.viewFileName + options.viewFileExt;

  return options;
}

export const defaultRenderFactory = 'render';

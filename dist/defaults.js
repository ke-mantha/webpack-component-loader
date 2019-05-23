"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var options_1 = require("./options");
exports.defaults = {
    viewFileName: 'view',
    viewFileExt: '.pug',
    styleFileName: 'styles',
    styleFileExt: '.styl'
};
exports.optionsWithDefaults = function (options) {
    for (var key in options_1.schema.properties) {
        options[key] = typeof options[key] === 'string' ? options[key] : exports.defaults[key];
    }
    options.styleFileName = options.styleFileName + options.styleFileExt;
    options.viewFileName = options.viewFileName + options.viewFileExt;
    return options;
};
exports.defaultRenderFactory = 'render';
//# sourceMappingURL=defaults.js.map
import { OptionObject } from 'loader-utils';
export declare type SchemaKeys = keyof typeof schema['properties'];
export declare type Options = {
    [key in SchemaKeys]: string;
};
export declare const schema: {
    type: string;
    properties: {
        viewFileName: {
            type: string;
        };
        viewFileExt: {
            type: string;
        };
        styleFileName: {
            type: string;
        };
        styleFileExt: {
            type: string;
        };
    };
};
export declare function validateOptions(errorMsg: string): Options & OptionObject;

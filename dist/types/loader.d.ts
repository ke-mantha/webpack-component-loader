import { loader } from 'webpack';
export default function (this: loader.LoaderContext, source: string): string | import("typescript").SourceFile;

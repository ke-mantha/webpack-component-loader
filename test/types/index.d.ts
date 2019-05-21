declare const MainComponent: any;

declare module '.*' {
  const render: <T>(arg: T) => T
  export = render;
}

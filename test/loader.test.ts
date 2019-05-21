import compiler from './compiler';

const compileFileWithLoader = async (fileName: string, options: any = {}) => {
  const stats = await compiler(fileName, options);
  const jsonStats = stats.toJson();
  let output = '';

  if (jsonStats && jsonStats.modules) {
    const originalModule = jsonStats.modules.find(m => !m.issuerName || !m.issuerName.includes(fileName));
    originalModule && (output = originalModule.source);
  }

  return output;
}

describe('Inserts imports', () => {
  it('Inserts view and styles', async () => {
    const output = await compileFileWithLoader('example-component/index.ts');

    expect(output).toContain(`import './styles.styl';`);
    expect(output).toContain(`import render from './view.pug';`);
  });

  it('Inserts only view', async () => {
    const output = await compileFileWithLoader('example-component/index.ts', {
      styleFileName: 'wrong-style-name'
    });

    expect(output).not.toContain(`import './styles.styl';`);
    expect(output).toContain(`import render from './view.pug';`);
  });

  it('Inserts none', async () => {
    const output = await compileFileWithLoader('example-component/index.ts', {
      styleFileName: 'wrong-style-name',
      viewFileName: 'wrong-view-name'
    });

    expect(output).not.toContain(`import './styles.styl';`);
    expect(output).not.toContain(`import render from './view.pug';`);
  });
});

describe('Inserts "render" method call', () => {
  it('Inserts render with view', async () => {
    const output = await compileFileWithLoader('example-component/index.ts');

    expect(output).toContain(`export default render(`);
  });

  it('Doesn\'t inserts render', async () => {
    const output = await compileFileWithLoader('example-component/index.ts', {
      styleFileName: 'wrong-style-name',
      viewFileName: 'wrong-view-name'
    });

    expect(output).not.toContain(`export default render(`);
  });
});

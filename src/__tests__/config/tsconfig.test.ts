import { readFileSync } from 'fs';
import { join } from 'path';

describe('TypeScript Config', () => {
  let tsconfig: any;

  beforeEach(() => {
    const tsconfigPath = join(process.cwd(), 'tsconfig.json');
    tsconfig = JSON.parse(readFileSync(tsconfigPath, 'utf8'));
  });

  it('deve ter as configurações corretas', () => {
    expect(tsconfig.compilerOptions).toBeDefined();
    expect(tsconfig.compilerOptions.target).toBe('es2018');
    expect(tsconfig.compilerOptions.module).toBe('commonjs');
    expect(tsconfig.compilerOptions.lib).toEqual(['es2018', 'esnext.asynciterable']);
    expect(tsconfig.compilerOptions.skipLibCheck).toBe(true);
    expect(tsconfig.compilerOptions.sourceMap).toBe(true);
    expect(tsconfig.compilerOptions.outDir).toBe('./dist');
    expect(tsconfig.compilerOptions.moduleResolution).toBe('node');
    expect(tsconfig.compilerOptions.removeComments).toBe(true);
    expect(tsconfig.compilerOptions.noImplicitAny).toBe(true);
    expect(tsconfig.compilerOptions.strictNullChecks).toBe(true);
    expect(tsconfig.compilerOptions.strictFunctionTypes).toBe(true);
    expect(tsconfig.compilerOptions.noImplicitThis).toBe(true);
    expect(tsconfig.compilerOptions.noUnusedLocals).toBe(true);
    expect(tsconfig.compilerOptions.noUnusedParameters).toBe(true);
    expect(tsconfig.compilerOptions.noImplicitReturns).toBe(true);
    expect(tsconfig.compilerOptions.noFallthroughCasesInSwitch).toBe(true);
    expect(tsconfig.compilerOptions.allowSyntheticDefaultImports).toBe(true);
    expect(tsconfig.compilerOptions.esModuleInterop).toBe(true);
    expect(tsconfig.compilerOptions.emitDecoratorMetadata).toBe(true);
    expect(tsconfig.compilerOptions.experimentalDecorators).toBe(true);
    expect(tsconfig.compilerOptions.resolveJsonModule).toBe(true);
    expect(tsconfig.compilerOptions.baseUrl).toBe('.');
    expect(tsconfig.compilerOptions.paths).toEqual({
      '@/*': ['src/*'],
    });
  });

  it('deve incluir os arquivos corretos', () => {
    expect(tsconfig.include).toEqual(['./src/**/*.ts', './src/**/*.tsx']);
    expect(tsconfig.exclude).toEqual(['node_modules']);
  });

  it('deve ter as configurações do Jest', () => {
    expect(tsconfig.jest).toBeDefined();
    expect(tsconfig.jest.moduleNameMapper).toEqual({
      '^@/(.*)$': '<rootDir>/src/$1',
    });
  });
}); 
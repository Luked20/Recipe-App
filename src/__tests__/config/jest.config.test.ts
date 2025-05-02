import { readFileSync } from 'fs';
import { join } from 'path';

describe('Jest Config', () => {
  let jestConfig: any;

  beforeEach(() => {
    const jestConfigPath = join(process.cwd(), 'jest.config.js');
    const jestConfigContent = readFileSync(jestConfigPath, 'utf8');
    jestConfig = eval(jestConfigContent);
  });

  it('deve ter as configurações básicas corretas', () => {
    expect(jestConfig.preset).toBe('ts-jest');
    expect(jestConfig.testEnvironment).toBe('node');
    expect(jestConfig.roots).toEqual(['<rootDir>/src']);
    expect(jestConfig.transform).toEqual({
      '^.+\\.tsx?$': 'ts-jest',
    });
    expect(jestConfig.testRegex).toBe('(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$');
    expect(jestConfig.moduleFileExtensions).toEqual(['ts', 'tsx', 'js', 'jsx', 'json', 'node']);
  });

  it('deve ter as configurações de cobertura corretas', () => {
    expect(jestConfig.collectCoverage).toBe(true);
    expect(jestConfig.coverageDirectory).toBe('coverage');
    expect(jestConfig.coverageReporters).toEqual(['text', 'lcov']);
    expect(jestConfig.coveragePathIgnorePatterns).toEqual([
      '/node_modules/',
      '/src/database/migrations/',
      '/src/database/subscribers/',
    ]);
  });

  it('deve ter as configurações de mapeamento de módulos corretas', () => {
    expect(jestConfig.moduleNameMapper).toEqual({
      '^@/(.*)$': '<rootDir>/src/$1',
    });
  });

  it('deve ter as configurações de arquivos de setup corretas', () => {
    expect(jestConfig.setupFiles).toEqual(['<rootDir>/src/config/jest.setup.ts']);
  });

  it('deve ter as configurações globais corretas', () => {
    expect(jestConfig.globals).toBeDefined();
    expect(jestConfig.globals['ts-jest']).toBeDefined();
    expect(jestConfig.globals['ts-jest'].tsconfig).toBe('tsconfig.json');
  });
}); 
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Package Config', () => {
  let packageJson: any;

  beforeEach(() => {
    const packagePath = join(process.cwd(), 'package.json');
    packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
  });

  it('deve ter as configurações básicas corretas', () => {
    expect(packageJson.name).toBe('meal-planner');
    expect(packageJson.version).toBe('1.0.0');
    expect(packageJson.description).toBe('Aplicativo de planejamento de refeições com base em estoque');
    expect(packageJson.main).toBe('src/index.ts');
  });

  it('deve ter os scripts corretos', () => {
    expect(packageJson.scripts).toBeDefined();
    expect(packageJson.scripts.start).toBe('ts-node src/index.ts');
    expect(packageJson.scripts.dev).toBe('nodemon src/index.ts');
    expect(packageJson.scripts.build).toBe('tsc');
    expect(packageJson.scripts.test).toBe('jest');
    expect(packageJson.scripts['test:watch']).toBe('jest --watch');
    expect(packageJson.scripts['test:coverage']).toBe('jest --coverage');
  });

  it('deve ter as dependências corretas', () => {
    expect(packageJson.dependencies).toBeDefined();
    expect(packageJson.dependencies.express).toBe('^4.18.2');
    expect(packageJson.dependencies.sqlite3).toBe('^5.1.6');
    expect(packageJson.dependencies.typeorm).toBe('^0.3.17');
    expect(packageJson.dependencies.axios).toBe('^1.6.2');
    expect(packageJson.dependencies.dotenv).toBe('^16.3.1');
    expect(packageJson.dependencies.cors).toBe('^2.8.5');
    expect(packageJson.dependencies.bcryptjs).toBe('^2.4.3');
    expect(packageJson.dependencies.jsonwebtoken).toBe('^9.0.2');
  });

  it('deve ter as dependências de desenvolvimento corretas', () => {
    expect(packageJson.devDependencies).toBeDefined();
    expect(packageJson.devDependencies['@types/express']).toBe('^4.17.21');
    expect(packageJson.devDependencies['@types/node']).toBe('^20.10.5');
    expect(packageJson.devDependencies['@types/cors']).toBe('^2.8.17');
    expect(packageJson.devDependencies['@types/bcryptjs']).toBe('^2.4.6');
    expect(packageJson.devDependencies['@types/jsonwebtoken']).toBe('^9.0.5');
    expect(packageJson.devDependencies['@types/jest']).toBe('^29.5.11');
    expect(packageJson.devDependencies['@types/supertest']).toBe('^6.0.2');
    expect(packageJson.devDependencies.typescript).toBe('^5.3.3');
    expect(packageJson.devDependencies['ts-node']).toBe('^10.9.2');
    expect(packageJson.devDependencies.nodemon).toBe('^3.0.2');
    expect(packageJson.devDependencies.jest).toBe('^29.7.0');
    expect(packageJson.devDependencies['ts-jest']).toBe('^29.1.1');
    expect(packageJson.devDependencies.supertest).toBe('^6.3.3');
  });
}); 
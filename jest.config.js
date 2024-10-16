/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.json',
      isolatedModules: true,  // Enables transpile-only mode
      diagnostics: false  // Disable diagnostics to speed up transpile-only mode
    }
  },
  moduleFileExtensions: ['ts', 'js'],
  testMatch: ['**/test/**/*.test.ts'],
  verbose: true,
  transformIgnorePatterns: ['/node_modules/'],
};

module.exports = config;

/** @type {import('jest').Config} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  rootDir: '.',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^framer-motion$': '<rootDir>/src/__mocks__/framer-motion.ts',
    '^../shared/LocationInput$': '<rootDir>/src/__mocks__/LocationInput.tsx',
    '^react-is$': '<rootDir>/src/__mocks__/react-is.js',
    '^react-is/.*$': '<rootDir>/src/__mocks__/react-is.js',
    '^../collections$': '<rootDir>/src/__mocks__/collections.cjs'
  },
  setupFilesAfterEnv: [
    '<rootDir>/setupTests.mjs',
    '<rootDir>/src/setupTests.ts'
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node', 'mjs', 'cjs'],
  transform: {
    '^.+\\.(ts|tsx)$': [
      'ts-jest',
      {
        tsconfig: 'tsconfig.jest.json',
        diagnostics: false,
        isolatedModules: true,
        useESM: true
      },
    ],
    '^.+\\.m?js$': 'babel-jest',
    '^.+\\.cjs$': 'babel-jest'
  },
  testMatch: [
    '**/__tests__/**/*.+(ts|tsx)',
    '**/?(*.)+(spec|test).+(ts|tsx)'
  ],
  transformIgnorePatterns: [
    '/node_modules/(?!framer-motion|@firebase|firebase)/'
  ],
  moduleDirectories: ['node_modules', 'src'],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
  verbose: false,
  bail: true,
  testPathIgnorePatterns: [
    '/node_modules/',
    '/dist/'
  ],
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts'
  ],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  roots: ['<rootDir>/src'],
  modulePaths: ['<rootDir>/src'],
  maxWorkers: '50%',
  cache: true,
  cacheDirectory: '<rootDir>/node_modules/.cache/jest'
};
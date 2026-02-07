module.exports = {
  preset: "ts-jest/presets/default-esm",
  testEnvironment: "node",
  extensionsToTreatAsEsm: [".ts"],
  testMatch: ["**/__tests__/**/*.test.ts"],
  moduleNameMapper: {
    "^\\.\\./db/prisma\\.js$": "<rootDir>/__tests__/mocks/prisma.ts",
    "^\\.\\./db/redis\\.js$": "<rootDir>/__tests__/mocks/redis.ts",
    "^(\\.{1,2}/.*)\\.js$": "$1",
  },
  setupFiles: ["<rootDir>/jest.setup.ts"],
};

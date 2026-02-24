/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  setupFiles: ["<rootDir>/jest.setup.js"],
  testEnvironment: "node",
  testMatch: ["**/tests/api/**/*.test.ts"],
  transform: {
    "^.+\\.tsx?$": ["ts-jest", {}],
  },
  moduleNameMapper: {
    "@/tests/(.*)": "<rootDir>/__tests__/$1",
    "@/(.*)": "<rootDir>/src/$1",
  },
  testPathIgnorePatterns: ["/node_modules/", "/dist/", "/tools/",],
  coveragePathIgnorePatterns: ["/tests/",],
  transformIgnorePatterns: [
    "node_modules/(?!(next-auth|@auth/core|oauth4webapi|preact-render-to-string|preact|@panva/hkdf|jose)/)"
  ],
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node']
};

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
    testEnvironment: "node",
    transform: {
        "^.+\\.tsx?$": ["ts-jest", {}],
    },
    moduleNameMapper: {
        "@/(.*)": "<rootDir>/src/$1",
    },
    testMatch: ["**/tests/integration/**/*.test.ts"],
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    setupFilesAfterEnv: ["<rootDir>/tests/integration/setup.ts"],
};
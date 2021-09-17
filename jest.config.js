module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    coveragePathIgnorePatterns: [
        "./node_modules/"
    ],
    globalSetup: "./tests/setup.ts",
    globalTeardown: "./tests/teardown.ts",
    setupFilesAfterEnv: [
        "./tests/setupAfterEnv.ts"
    ],
    testEnvironment: "./tests/environment.ts",
    testMatch: [
        "**/__tests__/**/*.[jt]s?(x)",
        "**/?(*.)+(spec|test).[tj]s?(x)"
    ]
};
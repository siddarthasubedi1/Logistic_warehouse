module.exports = {
    testEnvironment: "node",

    setupFilesAfterEnv: [
        "<rootDir>/test/setup.js",
    ],

    testTimeout: 30000,
    moduleNameMapper: {
        '^.*shared/simulationEngine\\.mjs$': '<rootDir>/test/nativeSimulationEngine.cjs',
        '^.*shared/simulationTemplates\\.mjs$': '<rootDir>/test/nativeSimulationTemplates.cjs',
    },
};
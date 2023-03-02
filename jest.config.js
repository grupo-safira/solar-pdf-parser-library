(module.exports = {
  preset: "ts-jest",
  roots: ["<rootDir>/src"],
  testEnvironment: "node",
  collectCoverageFrom: [
    "<rootDir>/src/**/*.ts",
    "!<rootDir>/src/cemigParse/*.ts",
    "!<rootDir>/src/*.ts",
    "!<rootDir>/src/tests/**/*.ts",
  ],
  coverageReporters: ["json", "lcov", "text", "json-summary"],
  coverageDirectory: "<rootDir>/jest/coverage",
  transform: {
    "\\.ts$": "ts-jest",
  },
}),
  (process.env.TZ = "UTC");

import type { Config } from "jest";
const config: Config = {
  testEnvironment: "jsdom",
  setupFilesAfterEnv: ["<rootDir>/jest.setup.ts"],
  transform: { "^.+\\.(t|j)sx?$": ["ts-jest", { tsconfig: "tsconfig.json" }] },
  moduleNameMapper: { "\\.(css|less|scss)$": "identity-obj-proxy" },
  testPathIgnorePatterns: ["/node_modules/", "/dist/"],
};
export default config;

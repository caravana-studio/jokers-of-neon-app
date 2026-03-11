module.exports = {
  root: true,
  env: {
    browser: true,
    es2024: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ["react-hooks"],
  rules: {
    "react-hooks/rules-of-hooks": "warn",
    "react-hooks/exhaustive-deps": "off",

    // React Compiler diagnostics to keep config and runtime assumptions valid.
    "react-hooks/config": "error",
    "react-hooks/gating": "error",
    "react-hooks/globals": "error",
    "react-hooks/set-state-in-render": "error",
  },
  ignorePatterns: ["dist", "dist-shop", "node_modules", "android", "ios"],
};

const path = require("path");
const { FlatCompat } = require("@eslint/eslintrc");

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

module.exports = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    rules: {
      // Отключаем правило, если оно ругается на require
      "import/no-commonjs": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
];

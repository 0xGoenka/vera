// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require("eslint/config");
const expoConfig = require("eslint-config-expo/flat");

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ["dist/*"],
  },
  {
    files: ["**/*.{ts,tsx,js,jsx}"],
    rules: {
      // Allow default import from styled-components/native
      // styled-components exports 'styled' as the default export, which is the correct usage
      // This rule is too strict for styled-components which correctly uses default exports
      "import/no-named-as-default": "off",
      "import/no-named-as-default-member": "off",
    },
  },
]);

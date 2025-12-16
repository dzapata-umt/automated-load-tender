/* eslint-disable no-undef */
// eslint.config.cjs
module.exports = (async () => {
  const js = (await import('@eslint/js')).default;
  const tseslint = await import('typescript-eslint');
  const googleMod = await import('eslint-config-google');
  const prettier = (await import('eslint-config-prettier')).default;
  const prettierPlugin = (await import('eslint-plugin-prettier')).default;

  const google = {
    ...googleMod.default,
  };
  google.rules = {
    ...(google.rules || {}),
  };
  delete google.rules['valid-jsdoc'];
  delete google.rules['require-jsdoc'];

  return [
    {
      ignores: ['dist', 'node_modules'],
    },

    js.configs.recommended,

    ...tseslint.configs.recommended,

    google,
    {
      files: ['**/*.ts', '**/*.tsx'],
      languageOptions: {
        parser: tseslint.parser,
        parserOptions: {
          sourceType: 'module',
        },
      },
      rules: {
        'no-console': [
          'warn',
          {
            allow: ['warn', 'error'],
          },
        ],
        'no-unused-vars': 'off',
        '@typescript-eslint/no-unused-vars': ['warn'],
        quotes: [
          'error',
          'single',
          {
            avoidEscape: true,
          },
        ],
        indent: ['error', 2],
        'object-curly-spacing': ['error', 'always'],
      },
    },
    prettier,
    {
      plugins: {
        prettier: prettierPlugin,
      },
      rules: {
        'prettier/prettier': [
          'error',
          {
            printWidth: 80,
            semi: true,
            singleQuote: true,
          },
        ],
      },
    },
  ];
})();

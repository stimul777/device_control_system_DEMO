module.exports = {
    root: true,
    env: {
        node: true,
        es6: true,
    },
    parserOptions: { ecmaVersion: 8 }, // to enable features such as async/await
    ignorePatterns: ['node_modules/*', '!.prettierrc.js'], // We don't want to lint generated files nor node_modules, but we want to lint .prettierrc.js (ignored by default by eslint)

    extends: ['eslint:recommended'],
    overrides: [
        {
            files: ['**/*.vue', '**/*.js'],
            settings: {},
            env: {
                browser: true,
                es6: true,
            },
            extends: ['plugin:vue/essential', 'plugin:prettier/recommended', 'prettier/@typescript-eslint'],
            rules: {
                'prettier/prettier': ['error', { endOfLine: 'auto', arrowParens: 'avoid' }, { usePrettierrc: true }], // Includes .prettierrc.js rules
            },
        },
    ],
};

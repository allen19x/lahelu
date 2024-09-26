const typescriptParser = require('@typescript-eslint/parser');
const react = require('eslint-plugin-react');
const reactNative = require('eslint-plugin-react-native');
const typescript = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');

module.exports = [
    {
        files: ['**/*.ts', '**/*.tsx', '**/*.js', '**/*.jsx'],
        ignores: ['node_modules/', 'build/', 'dist/', '.expo/'],
    },
    {
        files: ['**/*.ts', '**/*.tsx'],
        languageOptions: {
            parser: typescriptParser,
            parserOptions: {
                project: './tsconfig.json',
                ecmaVersion: 'latest',
                sourceType: 'module',
            },
        },
        plugins: {
            '@typescript-eslint': typescript,
            react: react,
            'react-native': reactNative,
            import: importPlugin
        },
        rules: {
            'eqeqeq': ['error', 'always'], // Require strict equality
            'no-console': 'warn', // Warn on console.log usage
            'no-unused-vars': ['warn', { 'args': 'none' }], // Disallow unused variables
            'no-var': 'error', // Disallow var, encourage let/const
            'prefer-const': 'error', // Suggest const when variables are not reassigned

            'import/first': 'error', // Ensure imports are at the top
            'import/order': 'off',

            'react/react-in-jsx-scope': 'off', // Disable React in scope for JSX
            'react/prop-types': 'off', // Disable prop-types if using TypeScript

            '@typescript-eslint/no-unused-vars': ['warn', { 'argsIgnorePattern': '^_' }], // Ignore underscore-prefixed args
            '@typescript-eslint/no-explicit-any': 'warn', // Warn on usage of any type
        },
    },
    {
        files: ['**/*.js', '**/*.jsx'],
        languageOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            globals: {
                __dirname: 'readonly',
                module: 'writable',
                process: 'readonly',
            },
        },
        plugins: {
            react: react,
            'react-native': reactNative,
            import: importPlugin,
        },
        rules: {
            'eqeqeq': ['error', 'always'],
            'no-console': 'warn',
            'no-unused-vars': ['warn', { 'args': 'none' }],
            'no-var': 'error',
            'prefer-const': 'error',
            'import/first': 'error',
            'import/order': 'off',
            'react/react-in-jsx-scope': 'off',
        },
    },
];

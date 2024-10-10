module.exports = {
  plugins: ['@typescript-eslint'],
  extends: ['next', 'prettier', 'plugin:@typescript-eslint/recommended'],
  rules: {
    'no-console': ['error', { allow: ['info', 'warn', 'error', 'time', 'timeLog', 'timeEnd'] }],
    'max-lines': ['error', { max: 400, skipBlankLines: true, skipComments: true }],
    'max-lines-per-function': ['error', { max: 300, skipBlankLines: true, skipComments: true }],
    'prefer-rest-params': 'off',
    'react/no-unescaped-entities': 'off',
    'import/no-anonymous-default-export': 'error',
    'react-hooks/exhaustive-deps': 'error',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-unused-vars': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/ban-ts-comment': 'off',
  },
  overrides: [
    {
      files: [
        'app/**/*.+(test|spec).+(ts|tsx|js|jsx)',
        'components/**/*.+(test|spec).+(ts|tsx|js|jsx)',
        'lib/**/*.+(test|spec).+(ts|tsx|js|jsx)'
      ],
      rules: {
        'max-lines': ['error', { max: 120, skipBlankLines: true, skipComments: true }],
        'max-lines-per-function': ['error', { max: 500, skipBlankLines: true, skipComments: true }],
      },
    },
  ],
};

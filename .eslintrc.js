module.exports = {
  root: true,
  env: {
    node: true
  },
  'extends': [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
  ],
  
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'vue/html-self-closing': 'off',
    'max-len': 'off',
    semi: ['error', 'never'],
    'arrow-parens': 'off',
    'linebreak-style': 'off',
    'global-require': 'off',
    'import/newline-after-import': 'off',
    'no-unused-vars': 'off',
    'padding-line-between-statements': 'off',
    'newline-before-return': 'off',
    'no-extend-native': 'off',
    'no-useless-escape': 'off',
    'no-case-declarations':'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off'
  }
}

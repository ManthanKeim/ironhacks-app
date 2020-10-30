const _env ={
  'browser': true,
  'es6': true,
}

const _extends = [
  'prettier',
  'plugin:prettier/recommended',
  'prettier/react',
]

const _plugins = [
  'eslint-comments',
  'import',
  'react',
  'react-hooks',
  'prettier',
]

const _parserOptions = {
  ecmaVersion: 2018,
  sourceType: 'module',
}

const _settings = {
  react: {
    version: 'extends'
  }
}

const _overrides = [
  {
    'files': [ '*.js' ],
    'plugins': [ 'flowtype' ],
    'parser': 'babel-eslint',
    'rules': {
      'flowtype/define-flow-type': 1,
      'flowtype/use-flow-type': 1, },
  },
  {
    'files': [ '*.ts', '*.tsx' ],
    'parser': '@typescript-eslint/parser',
    'plugins': [ '@typescript-eslint/eslint-plugin' ],
    'rules': {
      '@typescript-eslint/no-unused-vars': [
        'error',
        { 'argsIgnorePattern': '^_' }
      ],
        'no-unused-vars': 'off'
      },
  }
]

const _globals = {
  '__DEV__': true,
  '__dirname': false,
  '__fbBatchedBridgeConfig': false,
  'alert': false,
  'cancelAnimationFrame': false,
  'cancelIdleCallback': false,
  'clearImmediate': true,
  'clearInterval': false,
  'clearTimeout': false,
  'console': false,
  'document': false,
  'escape': false,
  'Event': false,
  'EventTarget': false,
  'exports': false,
  'fetch': false,
  'FormData': false,
  'global': false,
  'Map': true,
  'module': false,
  'navigator': false,
  'process': false,
  'Promise': true,
  'requestAnimationFrame': true,
  'requestIdleCallback': true,
  'require': false,
  'Set': true,
  'setImmediate': true,
  'setInterval': false,
  'setTimeout': false,
  'window': false,
  'XMLHttpRequest': false,
  'Atomics': 'readonly',
  'SharedArrayBuffer': 'readonly',
};

const _rules = {
  'comma-dangle': 0,
  'no-cond-assign': 1,
  'no-console': 0,
  'no-const-assign': 2,
  'no-constant-condition': 0,
  'no-control-regex': 1,
  'no-debugger': 1,
  'no-dupe-class-members': 2,
  'no-dupe-keys': 2,
  'no-empty': 0,
  'no-ex-assign': 1,
  'no-extra-boolean-cast': 1,
  'no-extra-parens': 0,
  'no-extra-semi': 0,
  'no-func-assign': 1,
  'no-inner-declarations': 0,
  'no-invalid-regexp': 1,
  'no-negated-in-lhs': 1,
  'no-obj-calls': 1,
  'no-regex-spaces': 1,
  'no-reserved-keys': 0,
  'no-sparse-arrays': 1,
  'no-unreachable': 2,
  'use-isnan': 1,
  'valid-jsdoc': 0,
  'valid-typeof': 1,

  // Best Practices
  'block-scoped-var': 0,
  'complexity': 0,
  'consistent-return': 0,
  'curly': 1,
  'default-case': 0,
  'dot-notation': 1,
  'eqeqeq': [ 1, 'allow-null' ],
  'guard-for-in': 0,
  'no-alert': 1,
  'no-caller': 1,
  'no-div-regex': 1,
  'no-else-return': 0,
  'no-eq-null': 0,
  'no-eval': 2,
  'no-extra-bind': 1,
  'no-mixed-operators': 0,
  'no-fallthrough': 1,
  'no-floating-decimal': 0,
  'no-implied-eval': 1,
  'no-labels': 1,
  'no-iterator': 1,
  'no-lone-blocks': 1,
  'no-loop-func': 0,
  'no-multi-str': 0,
  'no-new': 1,
  'no-new-func': 2,
  'no-new-wrappers': 1,
  'no-octal': 1,
  'no-octal-escape': 1,
  'no-proto': 1,
  'no-redeclare': 0,
  'no-return-assign': 1,
  'no-script-url': 1,
  'no-self-compare': 1,
  'no-sequences': 1,
  'no-unused-expressions': 0,
  'no-void': 1,
  'no-warning-comments': 0,
  'no-with': 1,
  'radix': 1,
  'semi-spacing': 0,
  'vars-on-top': 0,
  'wrap-iife': 0,
  'yoda': 1,

  // Variables
  'no-catch-shadow': 1,
  'no-delete-var': 1,
  'no-label-var': 1,
  'no-shadow': 1,
  'no-shadow-restricted-names': 1,
  'no-undef': 2,
  'no-undefined': 0,
  'no-undef-init': 1,
  'no-unused-vars': [
    1,
    {
      vars: 'all',
      args: 'none',
      ignoreRestSiblings: true
    }
  ],

  'no-use-before-define': 0,

  'handle-callback-err': 1,
  'no-mixed-requires': 1,
  'no-new-require': 1,
  'no-path-concat': 1,
  'no-process-exit': 0,
  'no-restricted-modules': 1,
  'no-sync': 0,

  'eslint-comments/no-aggregating-enable': 1,
  'eslint-comments/no-unlimited-disable': 1,
  'eslint-comments/no-unused-disable': 1,
  'eslint-comments/no-unused-enable': 1,

  'prettier/prettier': 1,

  'key-spacing': 0,
  'keyword-spacing': 0,

  'jsx-quotes': 0,
  'comma-spacing': 0,
  'no-multi-spaces': 0,
  'brace-style': 0,
  'camelcase': 0,
  'consistent-this': 1,
  'eol-last': 0,
  'func-names': 0,
  'func-style': 0,
  'new-cap': 0,
  'new-parens': 0,
  'no-nested-ternary': 0,
  'no-array-constructor': 1,
  'no-empty-character-class': 1,
  'no-lonely-if': 0,
  'no-new-object': 1,
  'no-spaced-func': 0,
  'no-ternary': 0,
  'no-trailing-spaces': 0,
  'no-underscore-dangle': 0,
  'no-mixed-spaces-and-tabs': 0,
  'quotes': [ 1, 'single', 'avoid-escape' ],
  'quote-props': 0,
  'semi': 0,
  'sort-vars': 0,
  'space-in-brackets': 0,
  'space-in-parens': 0,
  'space-infix-ops': 0,
  // 'space-unary-ops': [ 1, { words: true, nonwords: false } ],
  'space-unary-ops': 0,
  'max-nested-callbacks': 0,
  'one-var': 0,
  'wrap-regex': 0,

  // Legacy
  'max-len': 0,
  'max-params': 0,
  'max-statements': 0,
  'no-bitwise': 1,
  'no-plusplus': 0,

  // React Plugin
  'react/display-name': 0,
  'react/jsx-boolean-value': 0,
  'react/jsx-no-comment-textnodes': 1,
  'react/jsx-no-duplicate-props': 2,
  'react/jsx-no-undef': 2,
  'react/jsx-sort-props': 0,
  'react/jsx-uses-react': 1,
  'react/jsx-uses-vars': 1,
  'react/no-did-mount-set-state': 1,
  'react/no-did-update-set-state': 1,
  'react/no-multi-comp': 0,
  'react/no-string-refs': 1,
  'react/no-unknown-property': 0,
  'react/prop-types': 0,
  'react/react-in-jsx-scope': 0,
  'react/self-closing-comp': 1,
  'react/wrap-multilines': 0,
  'react/no-typos': 0,

  // React-Hooks Plugin
  'react-hooks/rules-of-hooks': 'error',
  'react-hooks/exhaustive-deps': 'error',

  // Import Plugin
  'import/no-unresolved': 2,
  'import/default': 2,
  'import/export': 2,
  'import/named': 2,
  'import/namespace': 2,
  'import/no-duplicates': 1,
  'import/no-named-as-default-member': 1,
  'import/no-named-as-default': 1,
  'operator-linebreak': 0,
}

module.exports = {
  root: true,
  env: _env,
  parserOptions: _parserOptions,
  extends: _extends,
  plugins: _plugins,
  settings: _settings,
  overrides: _overrides,
  globals: _globals,
  rules: _rules
}

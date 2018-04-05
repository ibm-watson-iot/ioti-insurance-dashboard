module.exports = {
  settings: {
    'import/resolver': {
      node: {
        paths: ['app/']
      }
    }
  },
  root: true,
  env: {
    "es6": false,
    browser: true
  },
  globals: {
    _: true,
    angular: true,
    JSData: true,
    AmCharts: true
  },
  "extends": ["airbnb-base", "plugin:node/recommended", "plugin:you-dont-need-lodash-underscore/all"],
  "plugins": [
    "json",
    "node"
  ],
  "rules": {
    "radix": 'off',
    "arrow-body-style": "off",
    "comma-dangle": "off",
    "func-names": "off",
    "global-require": "off",
    "keyword-spacing": ["error"],
    "no-console": "off",
    "no-param-reassign": "off",
    "no-plusplus": ["error", {
      "allowForLoopAfterthoughts": true
    }],
    "no-underscore-dangle": "off",
    "no-unused-vars": ["error", {
      "args": "none"
    }],
    "no-use-before-define": ["error", {
      "functions": false
    }],
    "max-len": ["error", 120],
    "object-shorthand": "off",
    "prefer-arrow-callback": "off",
    "prefer-rest-params": "off",
    "spaced-comment": "off",
    "space-before-function-paren": ["error", "never"],
    "strict": "error",
    "vars-on-top": "error",
    "one-var-declaration-per-line": "off",
    "one-var": ["error", { "initialized": "never", "uninitialized": "always" }],

    "import/no-dynamic-require": "off",
    "import/no-extraneous-dependencies": "off",
    "node/no-unpublished-require": "off",

    "prefer-template": "off",
    "prefer-spread": "off",
    "prefer-destructuring": "off",
    "space-in-parens": ["error", "never"],
    "space-before-blocks": ["error", "always"],
    "padded-blocks": "off",
    "no-else-return": "off",
    "no-empty": "off",
    "prefer-const": "off",
    "prefer-let": "off",
    "no-var": "off",
    "class-methods-use-this": "off"
  }
};

module.exports = {
  extends: 'airbnb',
  parser: 'babel-eslint',
  ecmaFeatures: {
    classes: true,
  },
  rules: {
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.jsx'] }],
    'linebreak-style': ['error', 'windows'],
  },
  env: {
    browser: true,
  },
};

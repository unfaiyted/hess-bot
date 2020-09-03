module.exports = {
  env: {
    browser: false,
    es2020: true,
    node: true,
  },
  extends: [
    'airbnb-base',
  ],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  globals: {
    db: true,
    client: true,
    log: true,
    VoiceConnections: true,
    SongDispatcher: true,
  },
  rules: {
    'no-trailing-spaces': 'off',
    'consistent-return': 'off',
    'no-multiple-empty-lines': 'off',
  },
};

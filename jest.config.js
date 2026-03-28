module.exports = {
  transform: {
    '^.+\\.(ts|tsx|js|jsx)$': ['babel-jest', {
      presets: [
        ['@babel/preset-env', { targets: { node: 'current' } }],
        '@babel/preset-typescript',
        ['@babel/preset-react', { runtime: 'automatic' }],
      ],
    }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx'],
  testMatch: ['**/__tests__/**/*.test.(ts|tsx)'],
  moduleNameMapper: {
    '^react-native-mmkv$': '<rootDir>/__mocks__/react-native-mmkv.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(react-native|@react-native|expo|expo-.*|@expo|react-native-reanimated|react-native-gesture-handler|@shopify/react-native-skia|@react-native-async-storage|date-fns)/)',
  ],
}

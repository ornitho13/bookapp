module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    'react-native-reanimated/plugin',
    [
      'module-resolver',
      {
        root: ['./src'],
        alias: {
          '@components': './src/components',
          '@screens': './src/screens',
          '@navigation': './src/navigation',
          '@services': './src/services',
          '@context': './src/context',
          '@types': './src/types'
        }
      }
    ]
  ]
};

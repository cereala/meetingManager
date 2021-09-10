export default {
    clearMocks: true,
    setupFilesAfterEnv: ['regenerator-runtime/runtime'],
    testPathIgnorePatterns: ['/node_modules/'],
    moduleFileExtensions: ['js', 'jsx', 'ejs', 'ejx'],
    transform: {
        "^.+\\.jsx?$": "babel-jest"
    }
  }
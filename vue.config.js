module.exports = {
  lintOnSave: false,

  css: {
    loaderOptions: {
      sass: {
        importer: require(`node-sass-magic-importer`)(),
        data: `@import '@/design/foundation';`,
      },
    },
  },
}

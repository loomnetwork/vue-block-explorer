module.exports = {
  lintOnSave: false,
  configureWebpack: config => {
    config.output.publicPath = process.env.WEBPACK_PUBLIC_PATH
  }
}

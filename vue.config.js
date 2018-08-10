module.exports = {
  lintOnSave: false,
  devServer: {
    open: process.platform === "darwin",
    host: "0.0.0.0",
    port: 3000,
    https: false,
    hotOnly: false
  }
}

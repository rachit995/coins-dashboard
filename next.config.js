const withPlugins = require('next-compose-plugins')

const nextConfig = {
  webpackDevMiddleware: webpackConfig => {
    webpackConfig.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return webpackConfig
  },
  reactStrictMode: true,
  images: {
    domains: ['bitbns.com'],
  },
}
module.exports = withPlugins([], nextConfig)

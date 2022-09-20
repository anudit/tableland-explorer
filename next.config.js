const runtimeCaching = require('next-pwa/cache')
const withPWA = require('next-pwa')({dest: 'public', runtimeCaching})
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase) => {

  const baseConfig = {
    experimental: {
      optimizeCss:true,
      urlImports: ['https://cdn.jsdelivr.net'],
    },
    reactStrictMode: true,
    webpack: (config, { isServer }) => {
      if (!isServer) {
        config.resolve.fallback.fs = false;
        config.resolve.fallback.net = false;
        config.resolve.fallback.tls = false;
      }
      return config;
    },
    images: {
      minimumCacheTTL: 60,
      domains: ['render.tableland.xyz'],
    },
  }

  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      ...baseConfig
    }
  }

  return withPWA({
      ...baseConfig,
      poweredByHeader: false
   })
}

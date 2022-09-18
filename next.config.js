const runtimeCaching = require('next-pwa/cache')
const withPWA = require('next-pwa')({dest: 'public', runtimeCaching})
const { PHASE_DEVELOPMENT_SERVER } = require('next/constants')

module.exports = (phase) => {
  if (phase === PHASE_DEVELOPMENT_SERVER) {
    return {
      experimental: {
        optimizeCss:true
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
    }
  }

  return withPWA({
      experimental: {
        optimizeCss:true
      },
      poweredByHeader: false,
      reactStrictMode: true,
      webpack: (config, { isServer }) => {
        if (!isServer) {
          config.resolve.fallback.fs = false;
          config.resolve.fallback.net = false;
          config.resolve.fallback.tls = false;
        }
        return config;
      },
   })
}

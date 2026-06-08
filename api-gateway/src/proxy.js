const { createProxyMiddleware } = require('http-proxy-middleware');

const createProxy = (target) =>
  createProxyMiddleware({
    target,
    changeOrigin: true,
  });

module.exports = { createProxy };

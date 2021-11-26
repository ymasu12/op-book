const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://devbook.open-pamphlet.com',
      changeOrigin: true,
    })
  );
};
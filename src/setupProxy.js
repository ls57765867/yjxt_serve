const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
    app.use(
        '/baidu_api',
        createProxyMiddleware({
            target: 'http://api.map.baidu.com/telematics/v3',
            changeOrigin: true,
            pathRewrite: {
                '^/baidu_api': '/'
            }
        })
    );
    app.use(
        '/baidu',
        createProxyMiddleware({
            target: 'https://api.map.baidu.com/',
            changeOrigin: true,
            pathRewrite: {
                '^/baidu': '/'
            }
        })
    );
    app.use(
        '/api',
        createProxyMiddleware({
            target: 'http://localhost:5000',
            changeOrigin: true,
            pathRewrite: {
                '^/api': '/api'
            }
        })
    );
};


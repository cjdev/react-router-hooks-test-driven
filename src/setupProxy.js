const {createProxyMiddleware} = require('http-proxy-middleware');

module.exports = function (app) {
    const options = {
        target: 'http://localhost:8080',
        changeOrigin: true,
        pathRewrite: {
            '^/proxy/task': '/task',
            '^/proxy/profile': '/profile'
        }
    };
    app.use(
        '/proxy',
        createProxyMiddleware(options)
    );
};

const express = require('express');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { PORT = 8000 } = process.env;

const config = process.env.CONFIG ? JSON.parse(process.env.CONFIG) : {
  'default'        : 'http://wttr.in?0q',
  'london.weather' : 'http://wttr.in/London?0q',
  'paris.weather'  : 'http://wttr.in/Paris?0q',
  'myip.lan'       : 'http://ifconfig.me'
};

console.log('Config:', config);

const app = express();

app.use(helmet());
app.use('/', createProxyMiddleware({ 
  target: config.default,
  router: (req) => {
    const host = req.headers.host.split(':')[0];
    const targetUrl = config[host] ? config[host] : config.default;
    // console.log('Original URL:', req.originalUrl);
    // console.log('Target URL:', targetUrl);
    // console.log(req);
    return targetUrl;
  },
  changeOrigin: true,
  autoRewrite: true,
  protocolRewrite: true,
  logger: console,
  // logLevel: 'debug',
  // onError: (err, req, res, target) => {
  //   console.log('||| Error:', err);
  //   console.log('||| Req:', req);
  //   console.log('||| Res:', res);
  //   console.log('||| Target:', target);
  // },
  //pathRewrite: (path, req) => path.replace(/^\/https?:\/\/[^\/]+/, ''),
  pathRewrite: {
    '^/https?://[^/]+': '',
  },
  protocolRewrite: true,
  ws: true,
  // hostRewrite: true,
  // autoRewrite: true,
  // protocolRewrite: 'http',
  followRedirects: true,
  // on: {
  //   onProxyReqWs: (proxyReq, req, socket, options, head) => {
  //     console.log(proxyReq);
  //   },
  // }
}));

app.listen(PORT);

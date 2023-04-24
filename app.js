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

const app = express();

app.use(helmet());
app.use('/', createProxyMiddleware({ 
  router: (req) => {
    const host = req.headers.host.split(':')[0];
    console.log(req.originalUrl);
    return config[host] ? config[host] : config.default;
  },
  changeOrigin: true,
  autoRewrite: true,
  protocolRewrite: true,
  logger: console,
  pathRewrite: (path, req) => path.replace(/^\/https?:\/\/[^\/]+/, ''),
}));

app.listen(PORT);

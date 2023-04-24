const express = require('express');
const helmet = require('helmet');
const { createProxyMiddleware } = require('http-proxy-middleware');

const { PORT = 8000 } = process.env;

const config = process.env.CONFIG ? JSON.parse(process.env.CONFIG) : {
  'default'        : 'http://wttr.in?0q',
  'london.weather' : 'http://wttr.in/London?0q',
  'paris.weather'  : 'http://wttr.in/Paris?0q',
  'myip.lan'       : 'http://ifconfig.me'
}

const app = express();

app.use(helmet());
app.use('/', createProxyMiddleware({ 
  router: (req) => {
    const host = req.headers.host.split(':')[0];
    return config[host] ? config[host] : config.default;
  },
  changeOrigin: true,
}));

app.listen(PORT);

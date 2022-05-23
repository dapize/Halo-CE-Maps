import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import https from 'https';
import compression from 'compression';
import Logger from 'jet-logger';
import morgan from 'morgan';
import { createStream } from 'rotating-file-stream';
import vhost from 'vhost';

import connect from '@config/db';
import compress from '@helpers/compress'
import downloadCtrl from '@controllers/download';

// cheking env file
const config = dotenv.config();
if (config.error) Logger.err('Missing environment variables');

// Global variables
declare global {
  var __basedir: string;
}
global.__basedir = __dirname;

// init DB
connect(`${process.env.DB_URI}`);

// set up plain http server
const http = express();
http.use(vhost('maps.haloce.net', downloadCtrl));
http.get('/', (req, res) => {
  res.redirect('https://' + req.headers.host + req.url);
});
http.use(compression({ filter: compress }))
http.listen(80, () => {
  console.log('Init server without SSL, por 80');
});

// Init Server
const app = express();
app.use(helmet({
  contentSecurityPolicy: {
    useDefaults: true,
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://tagmanager.google.com", "https://www.googletagmanager.com", "https://www.google-analytics.com", "'sha256-IFLwGasMSK0CkL5uDNotHgL1Px0uJRP8gyX7sY0IfHU='"],
      imgSrc: ["'self'", "https://ssl.gstatic.com",  "https://www.gstatic.com", "https://i.ytimg.com"],
      frameSrc: ["'self'", "https://www.youtube.com", "https://www.youtube.com/embed/"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
      connectSrc: ["'self'", "https://www.google-analytics.com"]
    }
  },
  crossOriginResourcePolicy: false,
  crossOriginEmbedderPolicy: false
}));

app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') }));
const accessLogStream = createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'log')
});
app.use(morgan('combined', { stream: accessLogStream }));
app.use(compression({ filter: compress }));

// Main request
app.use('/', express.static('public'));

// for get any map
app.use(vhost('maps.haloce.net', downloadCtrl))

// SLL Config
const httpsServer = https.createServer({
  ca: fs.readFileSync(__dirname + "/ssl/ca_bundle.crt", 'utf8'),
  key: fs.readFileSync(__dirname + "/ssl/private.key", 'utf8'),
  cert: fs.readFileSync(__dirname + "/ssl/certificate.crt", 'utf8')
}, app);
httpsServer.listen(443, () => console.log('Init server with SSL, port 443'));

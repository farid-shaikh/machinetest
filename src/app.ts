const params = require('strong-params');
import bodyParser from 'body-parser';
import express from 'express';
import { Logger } from './lib/logger';
import { middlewares } from './middlewares/error.handler';
import { routes as apiRoutes } from './routes/index';
const cors = require('cors');
const app = express();
const logger = new Logger();

const swaggerUi=require('swagger-ui-express');
const swaggerDocument=require('./swagger.json');


app.use(cors());
app.options('*', new cors());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use('/api-docs',swaggerUi.serve,swaggerUi.setup(swaggerDocument));
app.use(bodyParser.json({ limit: '50mb', type: 'application/json' }));
app.use(params.expressMiddleware());
app.use(logger.getRequestLogger());

app.use('/api', apiRoutes);
app.get('/health', (req, res) => res.json({ status: true, message: 'Health OK!' }));

app.use(logger.getRequestErrorLogger());

app.use((req, res, next) => {
  const err = new Error('Not found');
  res.statusCode = 404;
  res.send(err.message);
});
app.use(middlewares.handleRequestError);
export { app };

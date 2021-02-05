import * as dotenv from "dotenv";
dotenv.config();

import { createConnection } from "typeorm";
import * as express from 'express';
import * as helmet from 'helmet';
import * as cors from 'cors';
import * as bodyParser from  'body-parser';

import router from './routes';

createConnection().then(async connection => {
  const app = express();

  app.use(cors());
  app.use(helmet());
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use('/', router);

  app.listen(8080, () => {
    console.log('Listening on port 8080');
  });
})
  .catch(err => console.log(err));

import express, { Express } from 'express';
import { start } from './server';
import { customDatabaseConnection } from './DBconnection';
import { config } from './configuration';

const initialize = (): void => {
  config.cloudinaryConfig();
  const app: Express = express();
  customDatabaseConnection();
  start(app);
};

//entry point
initialize();

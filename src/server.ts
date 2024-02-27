import http from 'http';
import 'express-async-errors';
import {
  CustomError,
  IAuthPayload,
  IErrorResponse,
  winstonLogger,
} from '@remus1504/micrograde';
import { Logger } from 'winston';
import { config } from './configuration';
import {
  Application,
  Request,
  Response,
  NextFunction,
  json,
  urlencoded,
} from 'express';
import hpp from 'hpp';
import helmet from 'helmet';
import cors from 'cors';
import { verify } from 'jsonwebtoken';
import compression from 'compression';
import { checkConnection, createIndex } from './elasticsearch';
import { appRoutes } from './Endpoints';
import { Channel } from 'amqplib';
import { createConnection } from './queues/connect';

const NEW_SERVER_PORT = 4002;
const newLogger: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_ENDPOINT}`,
  'authenticationServer',
  'debug',
);

export let newAuthChannel: Channel;

export function start(newApp: Application): void {
  newSecurityMiddleware(newApp);
  newStandardMiddleware(newApp);
  newRoutesMiddleware(newApp);
  startQueues();
  //startElasticSearch();
  newAuthErrorHandler(newApp);
  startNewServer(newApp);
}

function newSecurityMiddleware(newApp: Application): void {
  newApp.set('trust proxy', 1);
  newApp.use(hpp());
  newApp.use(helmet());
  newApp.use(
    cors({
      origin: config.API_GATEWAY_URL,
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    }),
  );
  newApp.use((req: Request, _res: Response, next: NextFunction) => {
    if (req.headers.authorization) {
      const token = req.headers.authorization.split(' ')[1];
      const payload: IAuthPayload = verify(
        token,
        config.JWT_TOKEN!,
      ) as IAuthPayload;
      req.currentUser = payload;
    }
    next();
  });
}

function newStandardMiddleware(newApp: Application): void {
  newApp.use(compression());
  newApp.use(json({ limit: '200mb' }));
  newApp.use(urlencoded({ extended: true, limit: '200mb' }));
}

function newRoutesMiddleware(newApp: Application): void {
  appRoutes(newApp);
}

async function startQueues(): Promise<void> {
  newAuthChannel = (await createConnection()) as Channel;
}

/*function startElasticSearch(): void {
  checkConnection();
  createIndex('courses');
} */

function newAuthErrorHandler(newApp: Application): void {
  newApp.use(
    (
      error: IErrorResponse,
      _req: Request,
      res: Response,
      next: NextFunction,
    ) => {
      newLogger.log('error', `AuthService ${error.comingFrom}:`, error);
      if (error instanceof CustomError) {
        res.status(error.statusCode).json(error.serializeErrors());
      }
      next();
    },
  );
}

function startNewServer(newApp: Application): void {
  try {
    const newHttpServer: http.Server = new http.Server(newApp);
    newLogger.info(
      `Authentication server has started with process id ${process.pid}`,
    );
    newHttpServer.listen(NEW_SERVER_PORT, () => {
      newLogger.info(
        `Authentication server running on port ${NEW_SERVER_PORT}`,
      );
    });
  } catch (error) {
    newLogger.log('error', 'AuthService startServer() method error:', error);
  }
}

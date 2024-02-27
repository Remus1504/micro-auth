import { Application } from 'express';
import { verifyGatewayRequest } from '@remus1504/micrograde';
import { authRoutes } from './Routes/AuthenticationRoutes';
import { currentUserRoutes } from './Routes/ActiveUser';
import { healthRoutes } from './Routes/Health';
import { searchRoutes } from './Routes/searchCourse';
import { seedRoutes } from './Routes/seed';

const BASE_PATH = '/api/v1/auth';

export function appRoutes(app: Application): void {
  app.use('', healthRoutes());
  app.use(BASE_PATH, searchRoutes());
  app.use(BASE_PATH, seedRoutes());

  app.use(BASE_PATH, verifyGatewayRequest, authRoutes());
  app.use(BASE_PATH, verifyGatewayRequest, currentUserRoutes());
}

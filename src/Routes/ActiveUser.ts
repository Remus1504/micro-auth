import { read, resendEmail } from '../Controllers/ExsistingUser';
import { token } from '../Controllers/RegenerateToken';
import express, { Router } from 'express';

const router: Router = express.Router();

export function currentUserRoutes(): Router {
  router.get('/refresh-token/:username', token);
  router.get('/currentuser', read);
  router.post('/resend-email', resendEmail);

  return router;
}

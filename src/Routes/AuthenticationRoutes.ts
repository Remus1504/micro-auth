import {
  changePassword,
  forgotPassword,
  resetPassword,
} from '../Controllers/password';
import { read } from '../Controllers/Login';
import { create } from '../Controllers/register';
import { update } from '../Controllers/Verification';
import express, { Router } from 'express';

const router: Router = express.Router();

export function authRoutes(): Router {
  router.post('/signup', create);
  router.post('/signin', read);
  router.put('/verify-email', update);
  router.put('/forgot-password', forgotPassword);
  router.put('/reset-password/:token', resetPassword);
  router.put('/change-password', changePassword);

  return router;
}

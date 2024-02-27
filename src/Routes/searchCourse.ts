import { courses, singleCourseById } from '../Controllers/searchCourses';
import express, { Router } from 'express';

const router: Router = express.Router();

export function searchRoutes(): Router {
  router.get('/search/course/:from/:size/:type', courses);
  router.get('/search/course/:courseId', singleCourseById);

  return router;
}

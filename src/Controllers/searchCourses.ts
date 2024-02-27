import { courseById, courseSearch } from '../Helper/Search';
import { IPaginateProps, ISearchResult } from '@remus1504/micrograde';
import { Request, Response } from 'express';
import { sortBy } from 'lodash';
import { StatusCodes } from 'http-status-codes';

export async function courses(req: Request, res: Response): Promise<void> {
  const { from, size, type } = req.params;
  let resultHits: unknown[] = [];
  const paginate: IPaginateProps = { from, size: parseInt(`${size}`), type };
  const courses: ISearchResult = await courseSearch(
    `${req.query.query}`,
    paginate,
    `${req.query.delivery_time}`,
    parseInt(`${req.query.minPrice}`),
    parseInt(`${req.query.maxPrice}`),
  );
  for (const item of courses.hits) {
    resultHits.push(item._source);
  }
  if (type === 'backward') {
    resultHits = sortBy(resultHits, ['sortId']);
  }
  res.status(StatusCodes.OK).json({
    message: 'Search courses results',
    total: courses.total,
    courses: resultHits,
  });
}

export async function singleCourseById(
  req: Request,
  res: Response,
): Promise<void> {
  const course = await courseById('courses', req.params.courseId);
  res.status(StatusCodes.OK).json({ message: 'Signle course result', course });
}

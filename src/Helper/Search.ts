import { elasticSearchClient, getDocumentById } from '../elasticsearch';
import { SearchResponse } from '@elastic/elasticsearch/lib/api/types';
import {
  IHitsTotal,
  IPaginateProps,
  IQueryList,
  ISearchResult,
  InstructorCourse,
} from '@remus1504/micrograde';

export async function courseById(
  index: string,
  courseId: string,
): Promise<InstructorCourse> {
  const course: InstructorCourse = await getDocumentById(index, courseId);
  return course;
}

export async function courseSearch(
  searchQuery: string,
  paginate: IPaginateProps,
  deliveryTime?: string,
  min?: number,
  max?: number,
): Promise<ISearchResult> {
  const { from, size, type } = paginate;
  const queryList: IQueryList[] = [
    {
      query_string: {
        fields: [
          'username',
          'title',
          'description',
          'basicDescription',
          'basicTitle',
          'categories',
          'subCategories',
          'tags',
        ],
        query: `*${searchQuery}*`,
      },
    },
    {
      term: {
        active: true,
      },
    },
  ];

  if (deliveryTime !== 'undefined') {
    queryList.push({
      query_string: {
        fields: ['expectedDuration'],
        query: `*${deliveryTime}*`,
      },
    });
  }

  if (!isNaN(parseInt(`${min}`)) && !isNaN(parseInt(`${max}`))) {
    queryList.push({
      range: {
        price: {
          gte: min,
          lte: max,
        },
      },
    });
  }
  const result: SearchResponse = await elasticSearchClient.search({
    index: 'courses',
    size,
    query: {
      bool: {
        must: [...queryList],
      },
    },
    sort: [
      {
        sortId: type === 'forward' ? 'asc' : 'desc',
      },
    ],
    ...(from !== '0' && { search_after: [from] }),
  });
  const total: IHitsTotal = result.hits.total as IHitsTotal;
  return {
    total: total.value,
    hits: result.hits.hits,
  };
}

import { Client } from '@elastic/elasticsearch';
import {
  ClusterHealthResponse,
  GetResponse,
} from '@elastic/elasticsearch/lib/api/types';
import { config } from './configuration';
import { InstructorCourse, winstonLogger } from '@remus1504/micrograde';
import { Logger } from 'winston';

const log: Logger = winstonLogger(
  `${config.ELASTIC_SEARCH_ENDPOINT}`,
  'authElasticSearchServer',
  'debug',
);

const elasticSearchClient = new Client({
  node: `${config.ELASTIC_SEARCH_ENDPOINT}`,
});

async function checkConnection(): Promise<void> {
  let isConnected = false;
  while (!isConnected) {
    log.info('AuthService connecting to ElasticSearch...');
    try {
      const health: ClusterHealthResponse =
        await elasticSearchClient.cluster.health({});
      log.info(`AuthService Elasticsearch health status - ${health.status}`);
      isConnected = true;
    } catch (error) {
      log.error('Connection to Elasticsearch failed. Retrying...');
      log.log('error', 'AuthService checkConnection() method:', error);
    }
  }
}

async function checkIfIndexExist(indexName: string): Promise<boolean> {
  const result: boolean = await elasticSearchClient.indices.exists({
    index: indexName,
  });
  return result;
}

async function createIndex(indexName: string): Promise<void> {
  try {
    const result: boolean = await checkIfIndexExist(indexName);
    if (result) {
      log.info(`Index "${indexName}" already exist.`);
    } else {
      await elasticSearchClient.indices.create({ index: indexName });
      await elasticSearchClient.indices.refresh({ index: indexName });
      log.info(`Created index ${indexName}`);
    }
  } catch (error) {
    log.error(`An error occurred while creating the index ${indexName}`);
    log.log('error', 'AuthService createIndex() method error:', error);
  }
}

async function getDocumentById(
  index: string,
  courseId: string,
): Promise<InstructorCourse> {
  try {
    const result: GetResponse = await elasticSearchClient.get({
      index,
      id: courseId,
    });
    return result._source as InstructorCourse;
  } catch (error) {
    log.log(
      'error',
      'AuthService elastcisearch getDocumentById() method error:',
      error,
    );
    return {} as InstructorCourse;
  }
}

export { elasticSearchClient, checkConnection, createIndex, getDocumentById };

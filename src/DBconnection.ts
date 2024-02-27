import { winstonLogger as createLogger } from '@remus1504/micrograde';
import { Logger } from 'winston';
import { config as appConfig } from './configuration';
import { Sequelize as MicroGradeSequelize } from 'sequelize';

// Create a logger instance with modified parameters
const customLogger: Logger = createLogger(
  `${appConfig.ELASTIC_SEARCH_ENDPOINT}`,
  'customDatabaseServer',
  'debug',
);

// Create a Sequelize instance with modified parameters
export const customSequelize = new MicroGradeSequelize(process.env.MYSQL_DB!, {
  dialect: 'mysql',
  logging: false,
  dialectOptions: {
    multipleStatements: true,
  },
});

// start the database connection
export async function customDatabaseConnection(): Promise<void> {
  try {
    await customSequelize.authenticate();
    customLogger.info(
      'CustomService MySQL database connection has been established successfully.',
    );
  } catch (error) {
    customLogger.error('Custom Service - Unable to connect to the database.');
    customLogger.log(
      'error',
      'CustomService databaseConnection() method error:',
      error,
    );
  }
}

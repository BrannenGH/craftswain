import { JestEnvironmentConfig } from '@jest/environment';
import { LoggerOptions } from 'winston';

export type CraftswainConfig = JestEnvironmentConfig & {
    modules: string[],
    logger: LoggerOptions
}

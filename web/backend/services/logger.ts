import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';

const logDir = `${process.cwd()}/logs`;
const { combine, timestamp, prettyPrint, json } = winston.format;

export const logger = winston.createLogger({
	transports: [
		new winston.transports.Console({
			format: combine(timestamp(), prettyPrint()),
		}),
		new DailyRotateFile({
			filename: 'app-%DATE%.log',
			dirname: logDir,
			datePattern: 'YYYY-MM-DD',
			zippedArchive: true,
			maxFiles: '14d',
			maxSize: '20m',
			format: combine(timestamp(), json()),
		}),
	],
});

logger.exitOnError = false;

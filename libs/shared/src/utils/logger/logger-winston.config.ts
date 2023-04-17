import { WinstonModule } from 'nest-winston';
import { format, transports } from 'winston';

const LEVEL_LOG = process.env.LEVEL_LOG || '2';

enum Levels {
  error,
  warn,
  info,
  http,
  verbose,
  debug,
  silly,
}

export const loggerWinston = WinstonModule.createLogger({
  exitOnError: false,
  level: Levels[LEVEL_LOG],
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.simple(),
  ),
  defaultMeta: { service: 'App_NestJS' },
  transports: [
    new transports.File({
      filename: 'logs/errors.log',
      level: 'error',
    }),
    new transports.File({ filename: 'logs/all.log' }),
    new transports.Console({
      format: format.printf((msg) =>
        format
          .colorize()
          .colorize(
            msg.level,
            `${msg.timestamp} - ${msg.level}: ${
              msg.message || JSON.stringify(msg)
            }`,
          ),
      ),
    }),
  ],
});

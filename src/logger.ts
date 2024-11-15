// logger.js
import { createLogger, format, transports } from 'winston';

const logger = createLogger({
  level: 'info',
  format: format.combine(
    // format.timestamp(),
    format.json(),
  ),
  transports: [
    new transports.Console(),
    new transports.File({ filename: 'app.log' }), // Logs also saved in app.log
  ],
});

// If we're not in production, log to the console with a more readable format
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.colorize(), format.simple()),
    }),
  );
}

export default logger;

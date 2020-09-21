import { createLogger, format, transports, Logger } from "winston";

export const logger: Logger = createLogger({
    level: 'debug',
    format: format.json(),
    transports: [
        new transports.Console()
    ]
});
logger.exceptions.handle(new transports.Console());

process.on("unhandledRejection", (ex) => {
    logger.error(ex);
    throw ex;
});

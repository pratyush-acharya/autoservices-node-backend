import {createLogger, format, transports} from "winston";

const myFormat = format.printf(({level, message, timestamp}) => {
    return `${timestamp} [${level}]: ${message}`;
});

export const logger =
    createLogger({
        format: format.combine(
            format.timestamp(),
            myFormat
        ),
        transports: [
            new transports.File({
                level: 'error',
                filename: '../logs/error.log'
            }),

            new transports.File({
                level: 'info',
                filename: '../logs/info.log'
            })
        ]
    });
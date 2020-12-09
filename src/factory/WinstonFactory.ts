import { createLogger, LoggerOptions, transports, format } from "winston"
import chalk from "chalk"

/**
 * Factory for the Winston logger
 */
export class WinstonFactory {
  static defaultConfig: LoggerOptions = {
    transports: [
      new transports.Console({
        format: format.combine(
          format.timestamp(),
          format.colorize(),
          format.printf(
            ({ level, message, timestamp }) =>
              `(${level}) ${chalk.gray(timestamp)}  ${message}`
          )
        ),
        handleExceptions: true,
      }),
    ],
  }

  static create(options = WinstonFactory.defaultConfig) {
    return createLogger(options)
  }
}

export default WinstonFactory

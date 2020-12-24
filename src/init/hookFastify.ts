import fastify from "fastify"
import fastifyCors from "fastify-cors"
import fastifyHelmet from "fastify-helmet"
import { useControllers } from "../hooks/useControllers"
import Fasteer from "../types/fasteer"
import WinstonFactory from "../factory/WinstonFactory"
import { FasteerFactory } from "../factory/FasteerFactory"
import useWinston from "../hooks/useWinston"
import { withFasteer } from "../helpers"

/**
 * HookFastify
 *
 * Hooks Fasteer to Fastify and creates new FasteerInstance
 */
export const hookFastify = (
  {
    controllers = [],
    globalPrefix = "/",
    cors = false,
    helmet = false,
    errorHandler,
    development = false,
    port,
    host = "127.0.0.1",
    loggerOptions,
    logRequests,
    logErrors = true,
  }: Fasteer.Config,
  app = fastify()
) => {
  port = Number(port)

  if (!app) app = fastify()
  const logger = WinstonFactory.create(loggerOptions)

  console.log(withFasteer("Adding an Error Handler"))

  app.setErrorHandler(
    errorHandler
      ? errorHandler
      : (err, req, res) => {
          logger.error(
            withFasteer("Error occurred processing route", req.method, req.url)
          )

          if (logErrors) logger.error(withFasteer(err.stack))

          res
            .status(
              res.statusCode ? res.statusCode : err.validation ? 400 : 500
            )
            .send({
              httpCode: res.statusCode
                ? res.statusCode
                : err.validation
                ? 400
                : 500,
              message: err.validation
                ? "Validation Error"
                : err.statusCode
                ? err.message
                : development
                ? err.message
                : "Internal Server Error",
              ...(err.validation ? { validationErrors: err.validation } : {}),
              ...(development && !err.validation ? { stack: err.stack } : {}),
            })
        }
  )

  if (cors) {
    console.log(withFasteer("Registering CORS"))
    app.register(fastifyCors, {
      origin: typeof cors === "string" ? cors : undefined,
    })
  }
  if (helmet) {
    console.log(withFasteer("Registering Helmet"))
    app.register(fastifyHelmet, typeof helmet !== "boolean" ? helmet : {})
  }
  if (logRequests) {
    console.log(withFasteer("Registering a Request Logger hook"))
    app.register(useWinston, { winston: logger })
  }
  app.register(useControllers, { controllers, globalPrefix })

  return FasteerFactory.create(app, { port, host, logger })
}

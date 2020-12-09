import {
  FastifyRequest,
  FastifyReply,
  FastifyError,
  FastifyInstance,
} from "fastify"
import helmet from "helmet"
import { Logger, LoggerOptions } from "winston"
import FasteerInstance from "../FasteerInstance"

export namespace Fasteer {
  export interface ControllerImport<
    TFastify extends FastifyInstance = FastifyInstance
  > {
    default: (fastify: TFastify) => any
    routePrefix?: string
  }
  export type FunctionalController<
    TFastify extends FastifyInstance = FastifyInstance
  > = ControllerImport<TFastify>["default"]
  export interface ClassController<
    TFastify extends FastifyInstance = FastifyInstance
  > {
    fastify: TFastify
    constructor: (fastify: TFastify) => never
  }
  export type FCtrl<
    TFastify extends FastifyInstance = FastifyInstance
  > = FunctionalController<TFastify>
  export type CCtrl<
    TFastify extends FastifyInstance = FastifyInstance
  > = ClassController<TFastify>

  export interface Config {
    controllers: string | string[]
    globalPrefix?: string
    cors?: boolean | string
    helmet?: boolean | Parameters<typeof helmet>[0]
    errorHandler?: (
      this: FastifyInstance,
      error: FastifyError,
      request: FastifyRequest,
      reply: FastifyReply
    ) => void
    development?: boolean
    port: number | string
    host?: string
    loggerOptions?: LoggerOptions
    logRequests?: boolean
  }

  export interface ConstructorOptions {
    port: number | string
    host: string
    logger: Logger
  }

  export interface UseControllers {
    controllers: string | string[]
    globalPrefix?: string
  }

  export interface UseWinston {
    winston: Logger
  }

  export type Fasteer = FasteerInstance
}

export default Fasteer

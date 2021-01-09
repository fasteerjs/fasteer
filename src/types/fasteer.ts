import {
  FastifyRequest,
  FastifyReply,
  FastifyError,
  FastifyInstance,
} from "fastify"
import { FastifyCorsOptions } from "fastify-cors"
import helmet from "helmet"
import { Logger, LoggerOptions } from "winston"
import FasteerInstance from "../FasteerInstance"

export type FastifyHelmetOptions = Parameters<typeof helmet>[0]

/**
 * Fasteer Typings
 */
export namespace Fasteer {
  /**
   * The ES import() for controllers
   */
  export interface ControllerImport<
    TFastify extends FastifyInstance = FastifyInstance
  > {
    default: (fastify: TFastify, opts: { ctx: any }) => any
    routePrefix?: string
    __requireModule?: true
  }

  /**
   * Functional Controller
   */
  export type FunctionalController<
    TFastify extends FastifyInstance = FastifyInstance
  > = ControllerImport<TFastify>["default"]

  /**
   * Class Controller
   *
   * This is an upcoming feature for Fasteer.js for people that want OOP.
   * It is not part of Fasteer.js as of now and needs a RFC proposal for Class Controllers.
   */
  export interface ClassController<
    TFastify extends FastifyInstance = FastifyInstance
  > {
    fastify: TFastify
    constructor: (fastify: TFastify) => never
  }

  /**
   * Alias for Fasteer.FunctionalController
   */
  export type FCtrl<
    TFastify extends FastifyInstance = FastifyInstance
  > = FunctionalController<TFastify>

  /**
   * Alias for Fasteer.ClassController
   */
  export type CCtrl<
    TFastify extends FastifyInstance = FastifyInstance
  > = ClassController<TFastify>

  /**
   * Configuration for init hookFastify()
   */
  export interface Config {
    controllers: string | string[]
    controllerContext?: object
    globalPrefix?: string
    cors?: boolean | FastifyCorsOptions
    helmet?: boolean | FastifyHelmetOptions
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
    logErrors?: boolean
  }

  export interface Ctx<TContext extends object> {
    ctx: TContext
  }

  /**
   * Options for FasteerInstance.
   * @internal
   */
  export interface ConstructorOptions {
    port: number | string
    host: string
    logger: Logger
  }

  /**
   * Options for useControllers() hook
   */
  export interface UseControllers {
    controllers: string | string[]
    globalPrefix?: string
    context: object
  }

  /**
   * Options for useWinston() hook
   */
  export interface UseWinston {
    winston: Logger
  }

  /**
   * FasteerInstance
   */
  export type Fasteer = FasteerInstance
}

export default Fasteer

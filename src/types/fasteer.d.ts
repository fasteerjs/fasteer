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
    TFastify extends FastifyInstance = FastifyInstance,
    TContext extends object = object,
    TInjected extends object = object
  > {
    default: (
      fastify: TFastify,
      opts: { ctx: () => TContext & Context } & TInjected & Injected
    ) => any
    routePrefix?: string
    __requireModule?: true
  }

  /**
   * Functional Controller
   */
  export type FunctionalController<
    TFastify extends FastifyInstance = FastifyInstance,
    TContext extends object = object,
    TInjected extends object = object
  > = ControllerImport<TFastify, TContext, TInjected>["default"]

  /**
   * Alias for Fasteer.FunctionalController
   */
  export type FCtrl<
    TFastify extends FastifyInstance = FastifyInstance,
    TContext extends object = object,
    TInjected extends object = object
  > = FunctionalController<TFastify, TContext, TInjected>

  /**
   * Configuration for init hookFastify()
   */
  export interface Config {
    controllers: UseControllers["controllers"]
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

  export type Ctx<
    TContext extends object = object,
    TInjected extends object = object
  > = {
    ctx: () => TContext
  } & TInjected

  /**
   * Options for FasteerInstance.
   * @internal
   */
  export interface ConstructorOptions {
    config: Config
    logger: Logger
  }

  /**
   * Options for useControllers() hook
   */
  export interface UseControllers {
    controllers: string | ControllerImport | (string | ControllerImport)[]
    globalPrefix?: string
    context?: () => object
    injected?: object
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

  export interface Context {}

  export interface Injected {}
}

export default Fasteer

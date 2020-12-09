import { FastifyInstance } from "fastify"
import FasteerInstance from "../FasteerInstance"
import Fasteer from "../types/fasteer"
import WinstonFactory from "./WinstonFactory"

/**
 * Factory for the FasteerInstance
 */
export class FasteerFactory {
  static defaultConfig: Fasteer.ConstructorOptions = {
    port: 4200,
    host: "127.0.0.1",
    logger: WinstonFactory.create(),
  }
  static create<TFastify extends FastifyInstance = FastifyInstance>(
    fastify: TFastify,
    options = FasteerFactory.defaultConfig
  ) {
    return new FasteerInstance(fastify, options)
  }
}

export default FasteerFactory

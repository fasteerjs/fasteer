import { FastifyInstance } from "fastify"
import { Logger } from "winston"
import { withFasteer } from "./helpers"
import { useControllers } from "./hooks/useControllers"
import Fasteer from "./types/fasteer"

export class FasteerInstance<
  TFastify extends FastifyInstance = FastifyInstance
> {
  private fastifyInstance: TFastify

  public logger: Logger
  private config: Fasteer.Config

  private _controllerContext: { [key: string]: any } = {}
  private _plugins: ((fasteer: this) => any)[] = []

  constructor(
    fastify: TFastify,
    { config, logger }: Fasteer.ConstructorOptions
  ) {
    this.fastifyInstance = fastify

    this.logger = logger
    this.config = config

    console.log(withFasteer("Created Fasteer Instance"))
  }

  private initControllers() {
    this.fastifyInstance.register(useControllers, {
      controllers: this.config.controllers,
      globalPrefix: this.config.globalPrefix,
      context: () => this._controllerContext,
    })
  }

  private async initPlugins() {
    for (const plugin of this._plugins) {
      await plugin(this)
    }
  }

  async start() {
    try {
      this.initControllers()
      await this.initPlugins()
      await this.fastifyInstance.listen(this.config.port, this.config.host)
    } catch (e) {
      throw e
    }
  }

  public getFastify() {
    return this.fastifyInstance
  }

  public getPort() {
    return this.config.port
  }

  public getHost() {
    return this.config.host
  }

  public ctx<TVal extends any = any>(key: string, value: TVal) {
    this._controllerContext[key] = value
  }

  public plugin(fn: (fasteer: this) => any) {
    this._plugins.push(fn)
  }

  public getLogger() {
    return this.logger
  }
}

export default FasteerInstance

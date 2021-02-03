import { FastifyInstance } from "fastify"
import { Logger } from "winston"
import { withFasteer } from "./helpers"
import { useControllers } from "./hooks/useControllers"
import Fasteer from "./types/fasteer"

export class FasteerInstance<
  TFastify extends FastifyInstance = FastifyInstance
> {
  public fastify: TFastify

  public logger: Logger

  private _config: Fasteer.Config

  private _controllerContext: { [key: string]: any } = {}
  private _plugins: ((fasteer: this) => any)[] = []

  private _injected: { [key: string]: any } = {}

  private _started = false

  constructor(
    fastify: TFastify,
    { config, logger }: Fasteer.ConstructorOptions
  ) {
    this.fastify = fastify

    this.logger = logger
    this._config = config

    console.log(withFasteer("Created Fasteer Instance"))
  }

  private initControllers() {
    this.fastify.register(useControllers, {
      controllers: this._config.controllers,
      globalPrefix: this._config.globalPrefix,
      context: () => this._controllerContext,
      injected: this._injected,
    })
    return this
  }

  private async initPlugins() {
    for (const plugin of this._plugins) {
      await plugin(this)
    }
    return this
  }

  async start() {
    try {
      this.initControllers()
      await this.initPlugins()

      const addr = await this.fastify.listen(
        this._config.port,
        this._config.host
      )
      this._started = true

      return addr
    } catch (e) {
      throw e
    }
  }

  public getFastify() {
    return this.fastify
  }

  public getPort() {
    return this._config.port
  }

  public getHost() {
    return this._config.host
  }

  public ctx<TVal extends any = any>(key: string, value?: TVal) {
    if (value !== undefined) this._controllerContext[key] = value
    return value !== undefined ? this : this._controllerContext[key]
  }

  public plugin(fn: (fasteer: this) => any) {
    this._plugins.push(fn)
    return this
  }

  public inject<TVal extends any = any>(key: string, value: TVal) {
    if (this._started)
      throw new Error(
        withFasteer("Cannot inject once Fasteer has been started!")
      )
    this._injected[key] = value
    return this
  }

  public getLogger() {
    return this.logger
  }
}

export default FasteerInstance

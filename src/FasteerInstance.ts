import { FastifyInstance } from "fastify"
import { Logger } from "winston"
import { withFasteer } from "./helpers"
import { useControllers } from "./hooks/useControllers"
import Fasteer from "./types/fasteer"

export class FasteerInstance<
  TFastify extends FastifyInstance = FastifyInstance
> {
  public logger: Logger

  private _config: Fasteer.Config

  private _controllerContext: { [key: string]: unknown } = {}
  private _plugins: ((fasteer: this) => any)[] = []

  private _injected: { [key: string]: any } = {}

  private _started = false

  constructor(
    private fastify: TFastify,
    { config, logger }: Fasteer.ConstructorOptions
  ) {
    this.logger = logger
    this._config = config
    this._controllerContext = config.controllerContext ?? {}

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
    this.initControllers()
    await this.initPlugins()

    const addr = await this.fastify.listen(this._config.port, this._config.host)
    this._started = true

    return addr
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

  public hasStarted() {
    return this._started
  }

  public ctx<TVal extends any = any>(key: string, value?: TVal) {
    if (value !== undefined) this._controllerContext[key] = value
    return value !== undefined ? this : (this._controllerContext[key] as TVal)
  }

  public plugin(fn: (fasteer: this) => any) {
    this._plugins.push(fn)
    return this
  }

  public inject<TVal extends any = any>(
    ...[toInject, value]: [string, TVal] | [TVal]
  ) {
    if (this._started)
      throw new Error(
        withFasteer("Cannot inject once Fasteer has been started!")
      )

    const blacklisted = ["ctx", "prefix"]

    if (typeof toInject === "object") {
      for (const key in toInject) {
        const val = toInject[key]
        if (val === undefined)
          throw new Error(
            withFasteer(`Need to specify a value for injected key "${key}"`)
          )

        if (blacklisted.includes(key))
          throw new Error(
            `Key "${toInject}" is blacklisted because it's used in Fasteer's internals."`
          )

        this._injected[key] = val
        return this
      }
    }

    if (typeof toInject === "string") {
      if (value === undefined)
        throw new Error(
          withFasteer(`Need to specify a value for injected key "${toInject}"`)
        )

      if (blacklisted.includes(toInject))
        throw new Error(
          withFasteer(
            `Key "${toInject}" is blacklisted because it's used in Fasteer's internals."`
          )
        )

      this._injected[toInject] = value
      return this
    }

    throw new Error(
      withFasteer(
        "Invalid usage of FasteerInstance.inject()! Please read the docs for more info!"
      )
    )
  }

  public getLogger() {
    return this.logger
  }
}

export default FasteerInstance

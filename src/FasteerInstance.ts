import { redBright } from "chalk"
import { FastifyInstance } from "fastify"
import { Logger } from "winston"
import { withFasteer } from "./helpers"
import Fasteer from "./types/fasteer"

export class FasteerInstance<
  TFastify extends FastifyInstance = FastifyInstance
> {
  private fastifyInstance: TFastify

  private fastifyPort: number
  private fastifyHost: string

  public logger: Logger

  constructor(
    fastify: TFastify,
    { port, host, logger }: Fasteer.ConstructorOptions
  ) {
    this.fastifyPort = Number(port)
    this.fastifyHost = host

    this.fastifyInstance = fastify
    this.logger = logger
    console.log(withFasteer("Created Fasteer Instance"))
  }

  async listen() {
    try {
      const address = await this.fastifyInstance.listen(
        this.fastifyPort,
        this.fastifyHost
      )
      console.info(withFasteer("Started Fastify at", address))
      return address
    } catch (e) {
      console.error(
        withFasteer(redBright("Cannot start Fastify, error:", e.message))
      )
      console.log({ e })
      throw e
    }
  }

  public getFastify() {
    return this.fastifyInstance
  }

  public getPort() {
    return this.fastifyPort
  }

  public getHost() {
    return this.fastifyHost
  }

  public getLogger() {
    return this.logger
  }
}

export default FasteerInstance

import t from "tap"

import fastify from "fastify"
import axios from "axios"
import WinstonFactory from "../src/factory/WinstonFactory"
import FasteerInstance from "../src/FasteerInstance"
import { ctrl } from "../src/hooks/useControllers"
import Fasteer from "../src/types/fasteer"

t.test("FasteerInstance", async t => {
  const app = fastify()
  const logger = WinstonFactory.create()
  const config: Fasteer.Config = {
    host: "127.0.0.1",
    port: 4200,
    controllers: [
      ctrl(async fastify => {
        fastify.get("/hello", async (_, res) => res.send("hello"))
      }),
    ],
    controllerContext: {
      hello: "world",
    },
  }

  const fasteer = new FasteerInstance(app, {
    config,
    logger,
  })

  let pluginExecuted = false

  fasteer.plugin(() => {
    pluginExecuted = true
  })

  t.test("constructor()", async t => {
    t.equals(fasteer.getHost(), "127.0.0.1")
    t.equals(fasteer.getPort(), 4200)
    t.equals(fasteer.getLogger(), logger)
    t.equals(fasteer.getFastify(), app)
    t.equals(fasteer.hasStarted(), false)
  })

  t.test("ctx()", async t => {
    t.equals(fasteer.ctx("hello"), "world")
    t.equals(fasteer.ctx("yo", "whats up"), fasteer)
    t.equals(fasteer.ctx("yo"), "whats up")
  })

  t.test("inject()", async t => {
    t.throws(
      () => fasteer.inject("ctx", {}),
      undefined,
      "Key \"ctx\" is blacklisted because it's used in Fasteer's internals."
    )

    t.throws(
      () => fasteer.inject({ ctx: {} }),
      undefined,
      "Key \"ctx\" is blacklisted because it's used in Fasteer's internals."
    )

    t.throws(
      () => fasteer.inject("hallo", undefined),
      undefined,
      'Need to specify a value for injected key "hallo"'
    )

    t.throws(
      () => fasteer.inject({ hallo: undefined }),
      undefined,
      'Need to specify a value for injected key "hallo"'
    )

    t.throws(
      () => fasteer.inject(() => {}),
      undefined,
      "Invalid usage of FasteerInstance.inject()! Please read the docs for more info!"
    )

    fasteer.inject("hey", "hello")
    t.equals((fasteer as any)._injected["hey"], "hello")

    fasteer.inject({ fasteer: "is cool" })
    t.equals((fasteer as any)._injected["fasteer"], "is cool")
    ;(fasteer as any)._started = true
    t.throws(
      () => fasteer.inject({}),
      undefined,
      "Cannot inject once Fasteer has been started!"
    )
    ;(fasteer as any)._started = false
  })

  t.test("start()", async t => {
    await fasteer.start()

    t.equals(fasteer.hasStarted(), true)
    t.equals(pluginExecuted, true)

    const { data } = await axios.get("http://localhost:4200/hello")
    t.equals(data, "hello")

    await app.close()
  })
})

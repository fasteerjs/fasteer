import fastify from "fastify"
import t from "tap"

import FasteerFactory from "../../src/factory/FasteerFactory"
import WinstonFactory from "../../src/factory/WinstonFactory"
import FasteerInstance from "../../src/FasteerInstance"

t.test("FasteerFactory", async t => {
  t.test("static create()", async t => {
    const fasteer = FasteerFactory.create(fastify(), {
      logger: WinstonFactory.create(WinstonFactory.defaultConfig),
      config: {
        controllers: [],
        port: 4200,
      },
    })

    t.true(fasteer instanceof FasteerInstance)
  })
})

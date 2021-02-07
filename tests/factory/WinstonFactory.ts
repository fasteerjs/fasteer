import t from "tap"
import WinstonFactory from "../../src/factory/WinstonFactory"

t.test("WinstonFactory", async t => {
  t.test("static create()", async t => {
    const winston = WinstonFactory.create()

    // Not aware of a way to check if the actual instance is a Winston Logger instance,
    // I just check if the info function is present.
    t.true(Boolean(winston.info))
  })
})

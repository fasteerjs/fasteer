import chalk from "chalk"
import t from "tap"

import * as helpers from "../src/helpers"
import { compareObjects } from "../test-helpers/objects"

const helloWorldObj = { hello: "world" }
const helloWorldStr = JSON.stringify(helloWorldObj)

t.test("helpers", async t => {
  t.test("formatStatusCode()", async t => {
    t.equals(helpers.formatStatusCode(200), chalk.greenBright(200))
    t.equals(helpers.formatStatusCode(202), chalk.greenBright(202))

    t.equals(helpers.formatStatusCode(300), chalk.magentaBright(300))

    t.equals(helpers.formatStatusCode(302), chalk.magentaBright(302))

    t.equals(helpers.formatStatusCode(400), chalk.yellow(400))
    t.equals(helpers.formatStatusCode(404), chalk.yellow(404))

    t.equals(helpers.formatStatusCode(500), chalk.redBright(500))
    t.equals(helpers.formatStatusCode(502), chalk.redBright(502))
  })

  t.test("safeParseJson()", async t => {
    t.true(compareObjects(helpers.safeParseJson(helloWorldStr), helloWorldObj))
    t.equals(helpers.safeParseJson("{'hello': 'syntaxerror}"), null)
  })

  t.test("formatJson()", async t => {
    t.equals(helpers.formatJson(null), null)
    t.equals(helpers.formatJson("{{}"), "{{}")
    t.equals(
      helpers.formatJson(helloWorldStr, false),
      JSON.stringify(helloWorldObj, null, 2)
    )
    t.equals(
      helpers.formatJson(helloWorldObj, false),
      JSON.stringify(helloWorldObj, null, 2)
    )
  })

  t.test("withFasteer()", async t => {
    t.assert(
      helpers.withFasteer("Hello", "World"),
      chalk.yellow("[Fasteer] ") + chalk.green(["Hello", "World"].join(" "))
    )
  })
})

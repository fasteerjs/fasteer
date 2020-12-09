import fp from "fastify-plugin"
import F from "../types/fasteer"
import { blueBright, gray, white, whiteBright } from "chalk"
import { formatJson, formatStatusCode, withFasteer } from "../helpers"

/**
 * UseWinston Hook
 *
 * Uses the Winston instance and creates Fastify onSend hook
 * for logging the requests.
 */
export const useWinston = fp(async (fastify, { winston }: F.UseWinston) => {
  console.log(
    withFasteer(
      blueBright("[useWinston]"),
      "Registering a onSend hook for logging"
    )
  )
  fastify.addHook("onSend", async (req, res, payload: string | object) => {
    winston.info(
      gray(
        formatStatusCode(res.statusCode),
        white(req.raw.method),
        white(req.raw.url),
        `(${req.ip})`
      )
    )
    if (req.body) {
      winston.info(
        `${whiteBright("Request:")}\n` +
          (req.body instanceof Object ? formatJson(req.body) : req.body)
      )
    }
    if (payload) {
      winston.info(`${whiteBright("Response:")}\n` + formatJson(payload))
    }
  })

  return winston
})

export default useWinston

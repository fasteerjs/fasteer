import { blueBright } from "chalk"
import fp from "fastify-plugin"
import glob from "glob"

import path from "path"
import { withFasteer } from "../helpers"
import F from "../types/fasteer"

/**
 * RequireJS Compatibility helper
 *
 * Function for cross-compatibility with require()
 *
 * Usage:
 *  module.exports = ctrl((fastify) => {}, "/")
 */
export const ctrl = (controller: F.FCtrl, routePrefix?: string) => ({
  default: controller,
  routePrefix,
  __requireModule: true,
})

/**
 * UseController Hook
 *
 * Registers all controller paths from given paths.
 * Under the hood it uses glob, so it can accept glob syntax as a path.
 *
 * Examples:
 *  - http/controllers/UserController.ts
 *  - http/controllers/*Controller.ts
 */
export const useControllers = fp(
  async (fastify, { controllers, globalPrefix = "/" }: F.UseControllers) => {
    controllers = typeof controllers === "string" ? [controllers] : controllers

    const log = (...log: any[]) =>
      withFasteer(blueBright("[useControllers]"), ...log)

    for (const controllerPath of controllers) {
      console.info(log("Looking up path", controllerPath))
      const controllers = glob.sync(controllerPath)

      /**
       * Fasteer imports the controller file using ES6 imports.
       * Controllers need to have a default function export, which has the following signature:
       *  (fastify: FastifyInstance) => any
       *
       * Additionally, a string export "routePrefix" sets a prefix for the following controller.
       */
      for (const controller of controllers) {
        const parsedPath = path.parse(controller)
        let ctrl = (await import(controller)) as F.ControllerImport

        /**
         * When using RequireJS, a ctrl() function is provided
         * that adds an additional __requireModule property to let useControllers
         * know that this is a RequireJS export and to use it accordingly.
         */
        if (ctrl.__requireModule) {
          ctrl = Object.assign({}, ctrl)
          ctrl.default = (ctrl as any).default.default
        }

        /**
         * Controller has a default export that is a function with the following signature:
         *  async (fastify: FastifyInstance) => any
         */
        if (!ctrl.default || typeof ctrl.default !== "function") {
          console.warn(
            log(
              `Controller ${parsedPath.base.replace(
                parsedPath.ext,
                ""
              )} does not have a default export or it is not a function. Skipping...`
            )
          )
          continue
        }

        /**
         * Controllers usually have a prefix, eg. Auth Controller
         * has an /auth route prefix.
         * By exporting a String constant routePrefix, you define that prefix
         */
        fastify.register(ctrl.default, {
          prefix: path.join(globalPrefix, ctrl.routePrefix ?? ""),
        })

        console.log(
          log(
            `${parsedPath.base.replace(parsedPath.ext, "")} ${
              ctrl.routePrefix
                ? `(${path.join(globalPrefix, ctrl.routePrefix ?? "")})`
                : ""
            } registered`
          )
        )
      }
    }
  }
)

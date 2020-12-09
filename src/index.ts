import { FasteerInstance } from "./FasteerInstance"
import { useControllers } from "./hooks/useControllers"
import { useWinston } from "./hooks/useWinston"
import { hookFastify } from "./init/hookFastify"
import Fasteer from "./types/fasteer"
import FasteerFactory from "./factory/FasteerFactory"
import WinstonFactory from "./factory/WinstonFactory"

/**
 * Fasteer.js
 *
 * @license MIT
 * @author Filip Vottus <vottus@vott.us>
 * @year 2020
 */
export {
  Fasteer,
  FasteerInstance,
  useControllers,
  useWinston,
  hookFastify,
  FasteerFactory,
  WinstonFactory,
}

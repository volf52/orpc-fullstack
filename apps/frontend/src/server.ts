import {
  createStartHandler,
  defaultStreamHandler,
} from "@tanstack/react-start/server"
import { createRouter } from "./router"

const streamHandler = defaultStreamHandler

const startHandlerRouter = createStartHandler({ createRouter })
export default startHandlerRouter(streamHandler)

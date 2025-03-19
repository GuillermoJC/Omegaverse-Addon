import { world } from "@minecraft/server";
import { env, currentContext } from "../constants/env"

export default class Console {
    static dev(message: string, file: string) {
        if (currentContext === env.DEV) console.warn(`${message}; ${file}`)
    }

    static world(message: string) {
        world.sendMessage(message)
    }
}
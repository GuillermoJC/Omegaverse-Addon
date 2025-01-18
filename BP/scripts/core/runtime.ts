import { world } from "@minecraft/server"
import RuntimeEvents from "./events/RuntimeEvents"


export function runtime() {
    const players = world.getPlayers()

    RuntimeEvents.setPlayerEvents(players)
    RuntimeEvents.setWorldEvents(players)
}
import { Player, world } from "@minecraft/server";
import { PlayerTags } from "../constants/tags"
import PlayerController from "../controllers/Player"
import RuntimeController from "../controllers/Runtime"

export default class RuntimeEvents {

    static async setPlayerEvents(players: Player[]) {

        for (let player of players) {
            //Si el jugador no está registrado, registrar todas las propiedades y tags necesarias
            if (!player.getTags().includes(PlayerTags.firstSpawn)) new PlayerController(player).runFirstSpawn()
        }

    }

    static async setWorldEvents(players: Player[]) {
        const currentDay = world.getDay()

        //Verificar si el día actual es diferente al día del runtime events
        if (currentDay !== RuntimeController.getLastDay()) RuntimeController.afterNewDayStart(players, currentDay)

    }

}
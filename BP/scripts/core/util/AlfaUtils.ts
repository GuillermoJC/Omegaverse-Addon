import { Player } from "@minecraft/server"
import { AlfaDynamicProperties } from "../constants/dynamic_properties"
import Utility from "../util/Utility"

export default class AlfaUtils {
    /**
     * @description Returns a set of the marked players
     */
    static getMarkedPlayers(alfa: Player): Set<string> {
        const players = alfa.getDynamicProperty(AlfaDynamicProperties.markedPlayers) as string
        return new Set(players.split(";"))
    }

    /**
     * @description Set the marked players (DO NOT USE TO ADD OR REMOVE PLAYERS, INSTEAD, USE addMarkedPlayer AND removeMarkedPlayer)
     * @param { Set } markedPlayers A Set with the names of the players
     */
    static setMarkedPlayers(alfa: Player, markedPlayers: Set<string>): void {
        const players = Utility.convertSetToString(markedPlayers, ";")
        alfa.setDynamicProperty(AlfaDynamicProperties.markedPlayers, players)
    }

    /**
     * @description Add a new player into the markedPlayers Dynamic Property
     * @param { string } playerName The name of the new player
     * @returns Returns if it was correctly added or it already exists
     */
    static addMarkedPlayer(alfa: Player, playerName: string): boolean {

        const players = alfa.getDynamicProperty(AlfaDynamicProperties.markedPlayers) as string
        const playersSet = new Set(players.split(";"))
        if (playersSet.has(playerName)) return false
        playersSet.add(playerName)

        alfa.setDynamicProperty(AlfaDynamicProperties.markedPlayers, Array.from(playersSet).join(";"))
        return true
    }
    /**
     * @description Remove a player into the markedPlayers Dynamic Property
     * @param { string } playerName The name of the player to remove
     * @returns Returns if it was correctly removed
     */
    static removeMarkedPlayer(alfa: Player, playerName: string): boolean {
        const players = alfa.getDynamicProperty(AlfaDynamicProperties.markedPlayers) as string
        const playersSet = new Set(players.split(";"))
        if (playersSet.has(playerName)) return false
        playersSet.delete(playerName)

        alfa.setDynamicProperty(AlfaDynamicProperties.markedPlayers, Array.from(playersSet).join(";"))
        return true
    }
}
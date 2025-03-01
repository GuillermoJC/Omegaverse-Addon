import { Player } from "@minecraft/server";
import { AlfaDynamicProperties } from "../constants/dynamic_properties";
import { PlayerTags } from "../constants/tags";
import PlayerController from "../controllers/Player";


export default class AlfaController extends PlayerController {

    constructor(player: Player) {
        super(player)
    }

    static getIsAlfa(player: Player): boolean {
        return player.hasTag(PlayerTags.alfaPlayer)
    }

    /**
     * @description Returns a set of the marked players
     */
    getMarkedPlayers(): Set<string> {
        const players = this._player.getDynamicProperty(AlfaDynamicProperties.markedPlayers) as string
        return new Set(players.split(";"))
    }

    /**
     * @description Set the marked players (DO NOT USE TO ADD OR REMOVE PLAYERS, INSTEAD, USE addMarkedPlayer AND removeMarkedPlayer)
     * @param { Set } markedPlayers A Set with the names of the players
     */
    setMarkedPlayers(markedPlayers: Set<string>): void {
        const players = Array.from(markedPlayers)
        this._player.setDynamicProperty(AlfaDynamicProperties.markedPlayers, players.join(";"))
    }

    /**
     * @description Add a new player into the markedPlayers Dynamic Property
     * @param { string } playerName The name of the new player
     * @returns Returns if it was correctly added or it already exists
     */
    addMarkedPlayer(playerName: string): boolean {

        const players = this._player.getDynamicProperty(AlfaDynamicProperties.markedPlayers) as string
        const playersSet = new Set(players.split(";"))
        if (playersSet.has(playerName)) return false
        playersSet.add(playerName)

        this._player.setDynamicProperty(AlfaDynamicProperties.markedPlayers, Array.from(playersSet).join(";"))
        return true
    }
    /**
     * @description Remove a player into the markedPlayers Dynamic Property
     * @param { string } playerName The name of the player to remove
     * @returns Returns if it was correctly removed
     */
    removeMarkedPlayer(playerName: string): boolean {
        const players = this._player.getDynamicProperty(AlfaDynamicProperties.markedPlayers) as string
        const playersSet = new Set(players.split(";"))
        if (playersSet.has(playerName)) return false
        playersSet.delete(playerName)

        this._player.setDynamicProperty(AlfaDynamicProperties.markedPlayers, Array.from(playersSet).join(";"))
        return true
    }
}
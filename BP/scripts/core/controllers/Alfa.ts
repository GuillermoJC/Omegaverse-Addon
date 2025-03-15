import { Player } from "@minecraft/server";
import Utility from "../util/Utility";
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
}
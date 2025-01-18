import { Player, ItemUseAfterEvent, PlayerBreakBlockAfterEvent, PlayerLeaveBeforeEvent, ItemCompleteUseAfterEvent, PlayerSpawnAfterEvent } from "@minecraft/server"
import PlayerController from "../controllers/Player"
import { MinecraftItems, OmegaverseItems } from "../constants/items_ids"
import AdminForm from "../forms/admin_form"

export default class PlayerEvents {

    static afterUseAdminKey(event: ItemUseAfterEvent) {
        const { source, itemStack } = event

        if (itemStack.typeId === OmegaverseItems.adminKey) new AdminForm(source)
    }

    static #afterAvoidingEffects(player: Player) {
        const currentPlayer = new PlayerController(player)
        currentPlayer.setPlayerEffects()
    }

    /*
    //No parece ser un evento necesario por ahora
    static beforeLeavingServer(event: PlayerLeaveBeforeEvent) {
        //const { player } = event
        //const currentPlayer = new PlayerController(player)
    }
    */

    // Si estoy junto a un omega vinculado, debería dar LinkedPoints a ambos
    static afterBrakeAMobSpawn(event: PlayerBreakBlockAfterEvent) {
        const { player } = event
        const currentPlayer = new PlayerController(player)

        currentPlayer.incrementMiningPointsBy(1)

        //TODO: Verificar si este jugador es un alfa
        //TODO: Si Verificar si el jugador tiene algun omega vinculado cerca
    }

    static afterItemCompleteUse(event: ItemCompleteUseAfterEvent) {
        const { source, itemStack } = event

        if (source.typeId === "minecraft:player" && itemStack.typeId === MinecraftItems.milkBucket) PlayerEvents.#afterAvoidingEffects(event.source)
    }

    static afterPlayerSpawnEvent(event: PlayerSpawnAfterEvent) {

    }
}
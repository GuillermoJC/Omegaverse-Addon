import {
    Player,
    ItemUseAfterEvent, ItemReleaseUseAfterEvent, ItemCompleteUseAfterEvent,
    PlayerBreakBlockAfterEvent, PlayerSpawnAfterEvent,
    EntityHitEntityAfterEvent, EntityDieAfterEvent,
    EntityDamageCause
} from "@minecraft/server"
import PlayerController from "../controllers/Player"
import { MinecraftItems, OmegaverseItems } from "../constants/items_ids"
import { MinecraftEntityIds } from "../constants/entity_ids"
import { EffectIds } from "../constants/effect_ids"
import { env, currentContext } from "../constants/env"
import AdminForm from "../forms/admin_form"
import OmegaController from "../controllers/Omega"
import AlfaController from "../controllers/Alfa"
import OmegaEvents from "../events/OmegaEvents"

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

        if (source.typeId === MinecraftEntityIds.Player && itemStack.typeId === MinecraftItems.milkBucket) PlayerEvents.#afterAvoidingEffects(event.source)
    }

    static afterItemReleaseUse(event: ItemReleaseUseAfterEvent) {
        const { itemStack, source } = event

        if (itemStack.typeId === OmegaverseItems.fangs && AlfaController.getIsAlfa(source)) {
            const viewedEntities = source.getEntitiesFromViewDirection()

            for (let viewedEntity of viewedEntities) {
                const { entity } = viewedEntity

                if (entity instanceof Player) {
                    if (OmegaController.getIsOmega(entity)) break
                    const currentAlfa = new AlfaController(source)
                    const currentOmega = new OmegaController(entity)

                    currentOmega.setMarkedBy(source.nameTag)
                    currentAlfa.addMarkedPlayer(entity.nameTag)
                }
                else {
                    entity.applyDamage(2, { cause: EntityDamageCause.fireTick, damagingEntity: source })
                    source.addEffect(EffectIds.Regeneration, 1, { amplifier: 5 })
                }

            }

            if (!viewedEntities.length && currentContext === env.DEV) console.warn("Nothing caught")
        }
        else {
            if (currentContext === env.DEV) console.warn(itemStack.typeId)
        }

    }

    static afterEntityHitEntity(event: EntityHitEntityAfterEvent): void {
        const { hitEntity } = event

        if (hitEntity instanceof Player) {
            if (OmegaController.getIsOmega(hitEntity)) OmegaEvents.afterReceivingDamage(new OmegaController(hitEntity))
        }
    }

    static afterEntityDie(event: EntityDieAfterEvent): void {
        const { deadEntity } = event

        if (deadEntity instanceof Player) {
            if (OmegaController.getIsOmega(deadEntity)) OmegaEvents.afterDying(new OmegaController(deadEntity))
        }
    }

    static afterPlayerSpawnEvent(event: PlayerSpawnAfterEvent) {

    }
}
import {
    world,
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
//import { OmegaTags } from "../constants/tags"
//import WorldController from "../controllers/World"
import Console from "../util/Console"
import OmegaUtils from "../../../../../Omegaverse%201.0.5/bp/scripts/core/util/OmegaUtils"
import AlfaUtils from "../../../../../Omegaverse%201.0.5/bp/scripts/core/util/AlfaUtils"

const THIS_FILE = "scripts/core/controllers/PlayerEvents.ts"

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
        const { itemStack, source: alfa } = event

        if (itemStack.typeId === OmegaverseItems.fangs && AlfaController.getIsAlfa(alfa)) {
            const viewedEntities = alfa.getEntitiesFromViewDirection()

            for (let viewedEntity of viewedEntities) {
                const { entity: entity } = viewedEntity

                if (entity instanceof Player) {
                    if (OmegaController.getIsOmega(entity)) break

                    OmegaUtils.setMarkedBy(entity, alfa.nameTag)
                    AlfaUtils.addMarkedPlayer(alfa, entity.nameTag)
                }
                else {
                    entity.applyDamage(2, { cause: EntityDamageCause.fireTick, damagingEntity: alfa })
                    alfa.addEffect(EffectIds.Regeneration, 1, { amplifier: 5 })
                }

            }

            if (!viewedEntities.length) Console.dev("No entities", THIS_FILE)
        }
        else {
            if (currentContext === env.DEV) Console.dev(itemStack.typeId, THIS_FILE)
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
        const { player } = event

        //TODO: Remover todas las tags pendientes

    }
}
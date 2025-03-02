import { world, EntityDamageCause, EntityComponentTypes, EntityHealthComponent } from "@minecraft/server"
import { EffectIds } from "../constants/effect_ids";
import { OmegaTags } from "../constants/tags";
import OmegaController from "../controllers/Omega";

export default class OmegaEvents {

    static onStartOmegaPeriod(omegaPlayer: OmegaController): void {
        // Reiniciar el contador de días
        omegaPlayer.renewOmegaLastPeriod()

        //Poner la tag de "hasPeriod"
        omegaPlayer.addTag(OmegaTags.hasPeriod)
    }

    static onFinishOmegaPeriod(omegaPlayer: OmegaController): void {
        //Remover el celo
        omegaPlayer.removeTag(OmegaTags.hasPeriod)
    }

    static afterReceivingDamage(omegaPlayer: OmegaController): void {
        const alfaMarkPlayer = omegaPlayer.getMarkedBy()

        if (!alfaMarkPlayer) {
            const alfaPlayerMark = world.getAllPlayers().filter(p => p.nameTag === alfaMarkPlayer)[0]
            if (!alfaPlayerMark) return

            alfaPlayerMark.applyDamage(1, { cause: EntityDamageCause.override, damagingEntity: omegaPlayer.getPlayer() })
            const omegaHealthComponent = omegaPlayer.getPlayer().getComponent(EntityComponentTypes.Health) as EntityHealthComponent
            if (omegaHealthComponent) {
                const { currentValue, effectiveMax } = omegaHealthComponent
                if (currentValue == effectiveMax / 8) alfaPlayerMark.teleport(omegaPlayer.getPlayer().getHeadLocation())
            }
        }
    }

    static afterDying(omegaPlayer: OmegaController): void {
        const alfaMarkPlayer = omegaPlayer.getMarkedBy()

        if (!alfaMarkPlayer) {
            const alfaPlayerMark = world.getAllPlayers().filter(p => p.nameTag === alfaMarkPlayer)[0]
            if (!alfaPlayerMark) return

            alfaPlayerMark.applyDamage(6, { cause: EntityDamageCause.override, damagingEntity: omegaPlayer.getPlayer() })
            alfaPlayerMark.addEffect(EffectIds.Blindness, 30, { showParticles: false })
            alfaPlayerMark.addEffect(EffectIds.Weakness, 60, { amplifier: 3, showParticles: false })

        }
    }
}
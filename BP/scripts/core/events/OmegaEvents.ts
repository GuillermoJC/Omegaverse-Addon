import { world, EntityDamageCause } from "@minecraft/server"
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

        }
    }

    static afterDying(omegaPlayer: OmegaController): void {
        const alfaMarkPlayer = omegaPlayer.getMarkedBy()

        if (!alfaMarkPlayer) {
            const alfaPlayerMark = world.getAllPlayers().filter(p => p.nameTag === alfaMarkPlayer)[0]
            if (!alfaPlayerMark) return

            alfaPlayerMark.applyDamage(6, { cause: EntityDamageCause.override, damagingEntity: omegaPlayer.getPlayer() })
            //TODO: Add nerf effects to the mark entity
        }
    }
}
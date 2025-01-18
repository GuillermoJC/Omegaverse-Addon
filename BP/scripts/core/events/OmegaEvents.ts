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
}
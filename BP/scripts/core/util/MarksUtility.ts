import { world, Player } from "@minecraft/server";
import OmegaController from "../controllers/Omega";
import AlfaController from "../controllers/Alfa";
import WorldController from "../controllers/World";
import { OmegaTags } from "../constants/tags";

export default class MarksUtility {

    static linkOmegaAndAlfa(alfa: Player, omega: Player): boolean {
        const alfaPlayer = new AlfaController(alfa)
        const omegaPlayer = new OmegaController(omega)

        const hasMark = Boolean(omegaPlayer.getTags().filter(t => t.includes(OmegaTags.markedBy))[0])

        if (!hasMark) return false

        omegaPlayer.setMarkedBy(alfa.nameTag)
        alfaPlayer.addMarkedPlayer(omega.nameTag)
        return true
    }

    static unLinkOmegaAndAlfa(alfa: Player | string, omega: Player): boolean {
        const alfaName = typeof alfa === "string"
            ? alfa
            : alfa.nameTag

        const omegaPlayer = new OmegaController(omega)

        let isDeleted: boolean
        let alfaPlayer: AlfaController
        try {
            if (!(typeof alfa === "string")) alfaPlayer = new AlfaController(alfa)
            else alfaPlayer = new AlfaController(world.getAllPlayers().filter(p => p.nameTag === alfa)[0])

            isDeleted = omegaPlayer.deleteMarkedBy(alfaName)
            if (isDeleted) {
                alfaPlayer.removeMarkedPlayer(omega.nameTag)
            }
            return true
        }
        catch {
            isDeleted = omegaPlayer.deleteMarkedBy(alfaName)
            WorldController.addMarkToRemove([alfaName, omega.nameTag])
            return false
        }
    }
}
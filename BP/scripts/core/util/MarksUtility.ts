import { world, Player } from "@minecraft/server";
import OmegaUtils from "../util/OmegaUtils";
import AlfaUtil from "../util/AlfaUtils";
import WorldController from "../controllers/World";
import { OmegaTags } from "../constants/tags";

export default class MarksUtility {

    static linkOmegaAndAlfa(alfa: Player, omega: Player): boolean {

        const hasMark = Boolean(omega.hasTag(OmegaTags.markedBy))

        if (!hasMark) return false

        OmegaUtils.setMarkedBy(omega, alfa.nameTag)
        AlfaUtil.addMarkedPlayer(alfa, omega.nameTag)
        return true
    }

    static unLinkOmegaAndAlfa(alfa: Player | string, omega: Player): boolean {
        const alfaName = typeof alfa === "string"
            ? alfa
            : alfa.nameTag

        let isDeleted: boolean
        let alfaPlayer: Player
        try {
            if (typeof alfa === "string") world.getAllPlayers().filter(p => p.nameTag === alfa)[0]

            isDeleted = OmegaUtils.deleteMarkedBy(omega, alfaName)
            if (isDeleted) {
                AlfaUtil.removeMarkedPlayer(alfaPlayer, omega.nameTag)
            }
            return true
        }
        catch {
            isDeleted = OmegaUtils.deleteMarkedBy(omega, alfaName)
            WorldController.addMarkToRemove([alfaName, omega.nameTag])
            return false
        }
    }
}
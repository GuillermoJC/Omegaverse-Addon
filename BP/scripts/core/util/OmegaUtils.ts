import { Player } from "@minecraft/server"
import { OmegaTags } from "../constants/tags"
import { OmegaDynamicProperties } from "../constants/dynamic_properties"


export default class OmegaUtils {
    static getIsAlreadyMarked(player: Player): boolean {
        return Boolean(player.getDynamicProperty(OmegaDynamicProperties.markedBy))
    }
    static getMarkedBy(omega: Player): string | undefined {
        return omega.getDynamicProperty(OmegaDynamicProperties.markedBy) as string
    }

    /**
     * @description Set an alfa mark
     * @returns Returns **true** if the player has been marked correctly or **false** if not.
     */
    static setMarkedBy(omega: Player, playerName: string): boolean {
        const lastMarkedPlayer = this.getMarkedBy(omega)
        if (!lastMarkedPlayer) {
            omega.setDynamicProperty(OmegaDynamicProperties.markedBy, playerName)
            omega.addTag(`${OmegaTags.markedBy}_${playerName}`)

            return true
        }
        else return false
    }
    static deleteMarkedBy(omega: Player, playerName?: string): boolean {

        const markedByTag = playerName
            ? `${OmegaTags.markedBy}${playerName}`
            : omega.getTags().filter(t => t?.includes(OmegaTags.markedBy))[0]

        if (!markedByTag) return false
        omega.removeTag(markedByTag)
    }
}
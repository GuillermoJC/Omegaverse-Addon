import { world, Player } from "@minecraft/server";
import { OmegaDynamicProperties } from "../constants/dynamic_properties";
import PlayerController from "../controllers/Player";
import { OmegaTags, PlayerTags } from "../constants/tags";

export default class OmegaController extends PlayerController {

    constructor(player: Player) {
        super(player)

        if (!this.getOmegaLastPeriod()) this._player.setDynamicProperty(OmegaDynamicProperties.lastOmegaPeriod, world.getDay())
    }

    /* ------------------> UTILITY METHODS <------------------ */

    static hasPassedAMonthFromLastPeriod(player: Player): boolean {
        const lastPeriod = player.getDynamicProperty(OmegaDynamicProperties.lastOmegaPeriod) as number
        if (!lastPeriod) return false

        return world.getDay() - lastPeriod >= 30
    }

    static hasPassedThisDaysFromLastPeriod(days: number, player: Player) {
        const lastPeriod = player.getDynamicProperty(OmegaDynamicProperties.lastOmegaPeriod) as number
        if (!lastPeriod) return false

        const isMoreOrEqualThanDays = (world.getDay() - lastPeriod) >= days
        //Para evitar que se buggee con el último día en el que tiene que hacer el cambio
        const isLessThanAMonth = (world.getDay() - lastPeriod) < 29

        return isMoreOrEqualThanDays && isLessThanAMonth
    }

    static getIsOmega(player: Player): boolean {
        return player.hasTag(PlayerTags.omegaPlayer)
    }
    static getIsAlreadyMarked(player: Player): boolean {
        return Boolean(player.getDynamicProperty(OmegaDynamicProperties.markedBy))
    }
    getMarkedBy(): string | undefined {
        return this._player.getDynamicProperty(OmegaDynamicProperties.markedBy) as string
    }

    /**
     * @description Set an alfa mark
     * @returns Returns **true** if the player has been marked correctly or **false** if not.
     */
    setMarkedBy(playerName: string): boolean {
        const lastMarkedPlayer = this.getMarkedBy()
        if (!lastMarkedPlayer) {
            this._player.setDynamicProperty(OmegaDynamicProperties.markedBy, playerName)
            this._player.addTag(`${OmegaTags.markedBy}_${playerName}`)

            return true
        }
        else return false
    }

    addTag(tag: PlayerTags | OmegaTags): void {
        this._player.addTag(tag)
    }
    removeTag(tag: PlayerTags | OmegaTags): void {
        this._player.removeTag(tag)
    }

    //Dynamic Properties Methods
    getOmegaLastPeriod(): number | null {
        return this._player.getDynamicProperty(OmegaDynamicProperties.lastOmegaPeriod) as number
    }
    renewOmegaLastPeriod(): void {
        this._player.setDynamicProperty(OmegaDynamicProperties.lastOmegaPeriod, world.getDay())
    }

}
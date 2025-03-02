import { Player, world } from "@minecraft/server";
import Utility from "../util/Utility";
import { WorldDynamicProperties } from "../constants/dynamic_properties";
import Mark from "../types/Mark";

export default class WorldController {

    private static getMarksRegister = () => Utility.convertStringToMap(world.getDynamicProperty(WorldDynamicProperties.marksToRemove) as string)
    private static setMarksRegister = (str: string) => world.setDynamicProperty(WorldDynamicProperties.marksToRemove, str)

    static getPlayersToRemoveMark(): Map<string, string> {
        return WorldController.getMarksRegister()
    }

    static setMarksToRemove(marks: Map<string, string>): void {
        const marksConverted = Utility.convertMapToString(marks)
        WorldController.setMarksRegister(marksConverted)
    }

    static addMarkToRemove(mark: Mark): boolean {
        const marksRegister = WorldController.getMarksRegister()

        const hadMark = marksRegister.has(mark[0])

        if (hadMark) return false;
        else {
            marksRegister.set(mark[0], mark[1])

            const marksNewRegister = Utility.convertMapToString(marksRegister)

            WorldController.setMarksRegister(marksNewRegister)
        }
    }

    static removeMarkToRemove(mark: string): boolean {
        const marksRegister = WorldController.getMarksRegister()

        const hadMark = marksRegister.has(mark)

        if (!hadMark) return false
        else {
            marksRegister.delete(mark)
            const marksNewRegister = Utility.convertMapToString(marksRegister)
            WorldController.setMarksRegister(marksNewRegister)
        }
    }

    static removeMarksToAPlayer(player: Player, mark: string): void {

    }

}
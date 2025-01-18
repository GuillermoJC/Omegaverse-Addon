import { Player, world } from "@minecraft/server";
import OmegaController from "../controllers/Omega";
import { WorldDynamicProperties } from "../constants/dynamic_properties";
import OmegaEvents from "../events/OmegaEvents";


class RuntimeController {

    constructor() {
        if (!this.getLastDay()) world.setDynamicProperty(WorldDynamicProperties.lastDayStored, world.getDay())
    }

    afterNewDayStart(players: Player[], newDay: number) {

        for (let player of players) {
            //Si el jugador es omega, y pasaron 30 días desde su celo, activar su celo
            if (OmegaController.getIsOmega(player) && OmegaController.hasPassedAMonthFromLastPeriod(player))
                OmegaEvents.onStartOmegaPeriod(new OmegaController(player))

            //Si pasaron 3 días desde que el jugador tuvo su último celo, entonces desactivar su celo
            if (OmegaController.getIsOmega(player) && OmegaController.hasPassedThisDaysFromLastPeriod(3, player))
                OmegaEvents.onFinishOmegaPeriod(new OmegaController(player))
        }

        //Actualizar el nuevo día en WorldDynamicProperties.lastDayStored
        world.setDynamicProperty(WorldDynamicProperties.lastDayStored, newDay)

    }

    getLastDay(): number | undefined {
        return world.getDynamicProperty(WorldDynamicProperties.lastDayStored) as number
    }

}

//Se instancia el objeto antes de exportarlo para asegurarse que solo se ejecute una vez el constructor.
export default new RuntimeController()
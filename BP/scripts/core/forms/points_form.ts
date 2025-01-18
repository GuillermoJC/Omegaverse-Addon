import { Player } from "@minecraft/server"
import { ActionFormData, MessageFormData } from "@minecraft/server-ui"
import MathFunctions from "../util/MathFunctions"
import PlayerController from "../controllers/Player"

enum MainSelection {
    CLAIM_MINING_POINTS
}

export default class PointsForm {

    constructor(player: Player) {
        this.#player = player
        this.#main()
    }

    #main() {
        const currentPlayer = new PlayerController(this.#player)

        new ActionFormData()
            .button("Canjear punto de minado: " + currentPlayer.getMiningPoints(), "textures/items/diamond_pickaxe.png")
            .show(this.#player)
            .then((r) => {
                const { canceled, selection = MainSelection } = r

                switch (selection) {
                    case MainSelection.CLAIM_MINING_POINTS: {
                        this.#miningPointsRedeem()
                        break
                    }
                }
            })
    }

    #miningPointsRedeem() {
        const currentPlayer = new PlayerController(this.#player)
        const miningPoints = currentPlayer.getMiningPoints()
        const nextLevel = MathFunctions.getNextRedeemableMiningPoint(currentPlayer.getPlayerRedeemedMiningPoints()) || 1
        const bodyMessage = `Tienes ${miningPoints} puntos de minado y necesita ${nextLevel} para reclamar el siguiente punto de edad`

        if (miningPoints >= nextLevel) new MessageFormData()
            .title("Reclama puntos de edad por minar")
            .body(bodyMessage)
            .button1("Reclamar")
            .button2("Cancelar")
            .show(this.#player)
            .then(r => {
                const { selection } = r
                if (selection === 0) {
                    currentPlayer.decrementMiningPointsBy(nextLevel)
                    currentPlayer.incrementAgePointsBy(1)
                    currentPlayer.incrementPlayerRedeemedMiningPointsBy(1)
                }
            })
        else new MessageFormData()
            .title("No tienes suficientes puntos para reclamar")
            .body(bodyMessage)
            .button1("Aceptar")
            .button2("Cerrar menú de puntos")
            .show(this.#player)
            //Si la seleccion es igual a 0 entonces ejecutar el formulario principal
            .then(r => !r.selection && this.#main())

    }

    //Do the hunting claim points logic here

    #player: Player

}
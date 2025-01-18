import { Player } from "@minecraft/server"
import PlayerController from "../controllers/Player"
import MathFunctions from "../util/MathFunctions"
import { ModalFormData, ActionFormData } from "@minecraft/server-ui"

enum SkillSelection {
    Life,
    Haste,
    Strength,
    Speed,
    Regeneration,
    Defense,
    WaterBreathing,
    FireInmunity
}

export default class SkillsForm {

    constructor(player: Player) {
        this.#player = player
        this.#main()
    }

    #main() {
        const currentPlayer = new PlayerController(this.#player)

        const hasPlayerWaterBreathing = currentPlayer.getPlayerHasWaterBreathing() ? "Ya obtenido" : "No obtenido"
        const hasPlayerFireInmunity = currentPlayer.getPlayerHasFireInmunity() ? "Ya obtenido" : "No obtenido"

        new ActionFormData()
            .title("Puntos de habilidad")
            .body(`
Actualmente tienes ${currentPlayer.getAgePoints()}
Para aumentar un año necesitas ${MathFunctions.incrementNextAgeOfPlayer(currentPlayer.getPlayerAge())}
Para cada año puedes subir un punto de:
            `)
            .button(`Vida - ${currentPlayer.getPlayerLife()}`, "textures/ui/sidebar_icons/redheart.png")
            .button(`Prisa - ${currentPlayer.getPlayerHaste()}`, "textures/gui/newgui/mob_effects/haste_effect.png")
            .button(`Fuerza - ${currentPlayer.getPlayerStrength()}`, "textures/gui/newgui/mob_effects/strength_effect.png")
            .button(`Velocidad - ${currentPlayer.getPlayerSpeed()}`, "textures/gui/newgui/mob_effects/speed_effect.png")
            .button(`Regeneración - ${currentPlayer.getPlayerRegeneration()}`, "textures/gui/newgui/mob_effects/regeneration_effect.png")
            .button(`Defensa - ${currentPlayer.getPlayerDefense()}`, "textures/gui/newgui/mob_effects/resistance_effect.png")
            .button(`Respiracion bajo el agua \n ${hasPlayerWaterBreathing}`, "textures/gui/newgui/mob_effects/water_breathing_effect.png")
            .button(`Inmunidad al fuego \n ${hasPlayerFireInmunity}`, "textures/gui/newgui/mob_effects/fire_resistance_effect.png")
            .show(this.#player)
            .then(({ selection = SkillSelection }) => {
                const currentPlayer = new PlayerController(this.#player)

                switch (selection) {
                    case SkillSelection.Life: {
                        currentPlayer.incrementPlayerLife()
                        break
                    }
                    case SkillSelection.Haste: {
                        currentPlayer.incrementPlayerHaste()
                        break
                    }
                    case SkillSelection.Strength: {
                        currentPlayer.incrementPlayerStrength()
                        break
                    }
                    case SkillSelection.Speed: {
                        currentPlayer.incrementPlayerSpeed()
                        break
                    }
                    case SkillSelection.Regeneration: {
                        currentPlayer.incrementPlayerRegeneration()
                        break
                    }
                    case SkillSelection.Defense: {
                        currentPlayer.incrementPlayerDefense()
                        break
                    }
                    case SkillSelection.WaterBreathing: {
                        currentPlayer.setPlayerWaterBreathing()
                        break
                    }
                    case SkillSelection.FireInmunity: {
                        currentPlayer.setPlayerFireInmunity()
                        break
                    }
                }

                currentPlayer.setPlayerEffects()
            })
    }

    #player: Player

}
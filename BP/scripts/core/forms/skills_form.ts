import { Player } from "@minecraft/server"
import PlayerController from "../controllers/Player"
import MathFunctions from "../util/MathFunctions"
import { ModalFormData, ActionFormData } from "@minecraft/server-ui"
import { SkillOption } from "../constants/form_results"

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
            .then(({ selection = SkillOption }) => {
                switch (selection) {
                    case SkillOption.Life: {
                        currentPlayer.incrementPlayerLife()
                        break
                    }
                    case SkillOption.Haste: {
                        currentPlayer.incrementPlayerHaste()
                        break
                    }
                    case SkillOption.Strength: {
                        currentPlayer.incrementPlayerStrength()
                        break
                    }
                    case SkillOption.Speed: {
                        currentPlayer.incrementPlayerSpeed()
                        break
                    }
                    case SkillOption.Regeneration: {
                        currentPlayer.incrementPlayerRegeneration()
                        break
                    }
                    case SkillOption.Defense: {
                        currentPlayer.incrementPlayerDefense()
                        break
                    }
                    case SkillOption.WaterBreathing: {
                        currentPlayer.setPlayerWaterBreathing()
                        break
                    }
                    case SkillOption.FireInmunity: {
                        currentPlayer.setPlayerFireInmunity()
                        break
                    }
                }

                currentPlayer.setPlayerEffects()
            })
    }

    #player: Player

}
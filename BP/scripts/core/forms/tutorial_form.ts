import { Player } from "@minecraft/server"
import { ActionFormData } from "@minecraft/server-ui"

export default class TutorialForm {

    constructor(player: Player) {
        this.#player = player
        this.#main()
    }

    #main() {
        new ActionFormData()
            .title("Bienvenido a Omegaverse Addon")
            .body(`
            Este addon está inspirado en el género literario del Omegaverse, este tutorial no volverá a aparecer después de visto.
            `)
            .button("§4Saltar tutorial", "textures/gui/newgui/anvil-crossout.png")
            .show(this.#player)
    }

    #player: Player

}
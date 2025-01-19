import { Player } from "@minecraft/server"
import { ActionFormData, ModalFormData } from "@minecraft/server-ui"
import PlayerController from "../controllers/Player"
import TutorialForm from "./tutorial_form"
import PointsForm from "../forms/points_form"
import SkillsForm from "../forms/skills_form"
import { ScoreboardObjectives } from "../constants/scoreboards"
import { GiveMePointsFormValues } from "../types/GiveMePointsFormValues"
import { AdminFormSelection, SkillsPointsOptionsResults } from "../constants/form_results"

export default class AdminForm {

    constructor(player: Player) {
        this.#player = player
        this.#main()
    }

    #main() {
        const currentPlayer = new PlayerController(this.#player)

        new ActionFormData()
            .title("Admin Panel")
            //Para testear el panel del tutorial
            .button("Open Tutorial Form")
            //Para testear el panel de los puntos
            .button("Open Points Form")
            //Para testear el panel de skills
            .button("Open Skills Form")
            //Para remover las tags e imitar el evento cuando un jugador nuevo entra
            .button("Remove My Initial tags")
            //Para dar puntos al jugador y testear los puntos de edad
            .button("Give me Points")
            .show(this.#player)
            .then((result) => {
                const { canceled, selection = AdminFormSelection } = result
                if (!canceled) {
                    switch (selection) {
                        case AdminFormSelection.TUTORIAL_FORM: {
                            new TutorialForm(this.#player)
                            break
                        }
                        case AdminFormSelection.POINTS_FORM: {
                            new PointsForm(this.#player)
                            break
                        }
                        case AdminFormSelection.SKILLS_FORM: {
                            new SkillsForm(this.#player)
                            break
                        }
                        case AdminFormSelection.DELETE_INITIAL_TAGS: {
                            currentPlayer.removeInitialTags()
                            break
                        }
                        case AdminFormSelection.GIVE_POINTS: {
                            this.#giveMePoints()
                            break
                        }
                    }
                }
            })

    }

    #giveMePoints() {
        const options: ScoreboardObjectives[] = [ScoreboardObjectives.agePointsDisplayName, ScoreboardObjectives.miningPointsDisplayName, ScoreboardObjectives.linkingPointsDisplayName, ScoreboardObjectives.huntingAlfasPointsDisplayName]

        new ModalFormData()
            .dropdown("Points of", options)
            .slider("Points", 0, 1000, 1, 0)
            .submitButton("Claim")
            .show(this.#player)
            .then(formData => {
                const [optionResult, quantity] = formData.formValues as GiveMePointsFormValues
                const currentPlayer = new PlayerController(this.#player)

                switch (optionResult) {
                    case SkillsPointsOptionsResults.AgePoints: {
                        currentPlayer.setAgePointsBy(quantity)
                        break
                    }
                    case SkillsPointsOptionsResults.MiningPoints: {
                        currentPlayer.setMiningPointsBy(quantity)
                        break
                    }
                    case SkillsPointsOptionsResults.LinkingPoints: {
                        currentPlayer.setLinkingPointsBy(quantity)
                        break
                    }
                    case SkillsPointsOptionsResults.HuntingAlfasPoints: {
                        currentPlayer.setHuntingAlfasPointsBy(quantity)
                        break
                    }
                }

            })
    }

    #player: Player
}
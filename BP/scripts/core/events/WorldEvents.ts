import { world, system, } from "@minecraft/server"
import { ScoreboardObjectives } from "../constants/scoreboards"

export default class WorldEvents {

    static onWorldInitialize() {

        //Detectar los scoreboards
        const agePointsObjective = world.scoreboard.getObjective(ScoreboardObjectives.agePointsId)
        const huntingAlfasObjective = world.scoreboard.getObjective(ScoreboardObjectives.huntingAlfasPointsId)
        const miningPointsObjective = world.scoreboard.getObjective(ScoreboardObjectives.miningPointsId)
        const linkingPointsObjective = world.scoreboard.getObjective(ScoreboardObjectives.linkingPointsId)

        //Crea los scoreboard que no existen
        if (!agePointsObjective) world.scoreboard.addObjective(ScoreboardObjectives.agePointsId, ScoreboardObjectives.agePointsDisplayName)
        if (!huntingAlfasObjective) world.scoreboard.addObjective(ScoreboardObjectives.huntingAlfasPointsId, ScoreboardObjectives.huntingAlfasPointsDisplayName)
        if (!miningPointsObjective) world.scoreboard.addObjective(ScoreboardObjectives.miningPointsId, ScoreboardObjectives.miningPointsDisplayName)
        if (!linkingPointsObjective) world.scoreboard.addObjective(ScoreboardObjectives.linkingPointsId, ScoreboardObjectives.linkingPointsDisplayName)

    }
}
import { world, system, Player } from "@minecraft/server"
import { PlayerTags } from "../constants/tags"
import { PlayerProperties } from "../constants/properties"
import { ScoreboardObjectives } from "../constants/scoreboards"
import TutorialForm from "../forms/tutorial_form"
import { PlayerDynamicProperties } from "../constants/dynamic_properties"
import MathFunctions from "../util/MathFunctions"
import { PlayerInitialization } from "../constants/initial_values"
import { EffectIds } from "../constants/effect_ids"

export default class PlayerController {

    //Hacer que se inicialicen solo los datos necesarios para correr este objeto (mejorar de performance)
    constructor(player: Player) {
        this._player = player
    }

    /* ------------------> UTILITY METHODS <------------------ */

    //El script que corre cuando un nuevo jugador se registra en el mundo
    runFirstSpawn(): void {

        this.setInitialTags()
        this.#resetScoreBoards()
        this.#resetDynamicProperties()
        this.#setPlayerAge(PlayerInitialization.playerInitialAge)
        new TutorialForm(this._player)
    }

    #setEffect(effectId: EffectIds, level: number) {
        const command = `effect @s ${effectId} infinite ${level} true`
        system.run(() => this._player.runCommandAsync(command))
    }

    setPlayerEffects() {
        if (this.getPlayerLife()) this.#setEffect(EffectIds.Life, this.getPlayerLife())
        if (this.getPlayerStrength()) this.#setEffect(EffectIds.Strength, this.getPlayerStrength())
        if (this.getPlayerDefense()) this.#setEffect(EffectIds.Defense, this.getPlayerDefense())
        if (this.getPlayerHasFireInmunity()) this.#setEffect(EffectIds.FireInmunity, this.getPlayerHasFireInmunity() ? 1 : 0)

        if (this.getPlayerSpeed()) this.#setEffect(EffectIds.Speed, this.getPlayerSpeed())
        if (this.getPlayerRegeneration()) this.#setEffect(EffectIds.Regeneration, this.getPlayerRegeneration())
        if (this.getPlayerHaste()) this.#setEffect(EffectIds.Haste, this.getPlayerHaste())
        if (this.getPlayerHasWaterBreathing()) this.#setEffect(EffectIds.WaterBreathing, this.getPlayerHasWaterBreathing() ? 1 : 0)
    }

    getIsFirstSpawn(): boolean {
        const tags = this.getTags()
        return tags.includes(PlayerTags.firstSpawn)
    }

    addTag(tag: PlayerTags): void {
        this._player.addTag(tag)
    }

    getTags(): string[] {
        return this._player.getTags()
    }

    initializeDynamicProperties() {
        const redeemedMiningPoints = this._player.getDynamicProperty(PlayerDynamicProperties.reedemedMiningPoints) as number

        if (!redeemedMiningPoints) this._player.setDynamicProperty(PlayerDynamicProperties.reedemedMiningPoints, 0)
    }

    #resetDynamicProperties() {
        this._player.clearDynamicProperties()
        this.initializeDynamicProperties()
    }

    #resetScoreBoards() {
        const agePointsObjective = world.scoreboard.getObjective(ScoreboardObjectives.agePointsId)
        const huntingAlfasPointsObjective = world.scoreboard.getObjective(ScoreboardObjectives.huntingAlfasPointsId)
        const miningPointsObjective = world.scoreboard.getObjective(ScoreboardObjectives.miningPointsId)
        const linkingPointsObjective = world.scoreboard.getObjective(ScoreboardObjectives.linkingPointsId)

        agePointsObjective.addScore(this._player, 0)
        huntingAlfasPointsObjective.addScore(this._player, 0)
        miningPointsObjective.addScore(this._player, 0)
        linkingPointsObjective.addScore(this._player, 0)

        agePointsObjective.setScore(this._player, 0)
        huntingAlfasPointsObjective.setScore(this._player, 0)
        miningPointsObjective.setScore(this._player, 0)
        linkingPointsObjective.setScore(this._player, 0)
    }

    setInitialTags(): void {
        this._player.addTag(PlayerTags.firstSpawn)
        this._player.addTag(PlayerTags.noClassPlayer)
    }
    removeInitialTags(): void {
        this._player.removeTag(PlayerTags.firstSpawn)
        this._player.removeTag(PlayerTags.noClassPlayer)
    }

    getPlayerAge(): number {
        return this._player.getProperty(PlayerProperties.playerAge) as number
    }
    incrementPlayerAge(): void {
        const newAge = this._player.getProperty(PlayerProperties.playerAge) as number + 1

        //Si la edad del jugador es mayor a 12 años y menor a 17 años se debe empezar a decidir qué clase será
        if (this.getPlayerAge() >= 12 && this.getPlayerAge() <= 17) this.#decideANewClass()
        //Si es mayor a 17 años y no tiene clase, cambiar la case por beta
        else if (this.getPlayerAge() > 17 && this.getTags().includes(PlayerTags.noClassPlayer)) this.#changeToBetaClass()

        this._player.setProperty(PlayerProperties.playerAge, newAge)
    }
    #setPlayerAge(newAge: number): void {
        this._player.setProperty(PlayerProperties.playerAge, newAge)
    }

    getPlayerClassWeight(): number {
        return this._player.getProperty(PlayerProperties.playerClassWeight) as number
    }
    incrementPlayerClassWeight(): void {
        const newWeight = this._player.getProperty(PlayerProperties.playerClassWeight) as number + 1
        this._player.setProperty(PlayerProperties.playerClassWeight, newWeight)
    }
    decrementPlayerClassWeight(): void {
        const newWeight = this._player.getProperty(PlayerProperties.playerClassWeight) as number - 1
        this._player.setProperty(PlayerProperties.playerClassWeight, newWeight)
    }

    #decideANewClass() {
        const classWeight = this.getPlayerClassWeight()
        const classRandomizedWeight = MathFunctions.randomizeClassWeightSelection(classWeight)

        //Si devuelve menor a -10 se define como omega
        if (classRandomizedWeight <= -10) this.#changeToOmegaClass()
        //Si devuelve mayor a 10 se define como alfa
        else if (classRandomizedWeight >= 10) this.#changeToAlfaClass()

    }

    getAgePoints(): number {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.agePointsId)
        return objective.getScore(this._player)
    }
    incrementAgePointsBy(points: number): void {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.agePointsId)
        const score = objective.getScore(this._player)
        objective.setScore(this._player, score + points)
    }
    decrementAgePointsBy(points: number): void {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.agePointsId)
        const score = objective.getScore(this._player)
        objective.setScore(this._player, score - points)
    }

    setAgePointsBy(points: number): void {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.agePointsId)
        objective.setScore(this._player, points)
    }

    //TODO : Agregar los setter (increment, decrement) de este método
    getHuntingAlfasPoints(): number {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.huntingAlfasPointsId)
        return objective.getScore(this._player)
    }

    setHuntingAlfasPointsBy(points: number): void {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.huntingAlfasPointsId)
        objective.setScore(this._player, points)
    }

    getMiningPoints(): number {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.miningPointsId)
        return objective.getScore(this._player)
    }
    incrementMiningPointsBy(points: number): void {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.miningPointsId)
        const score = objective.getScore(this._player)
        objective.setScore(this._player, score + points)
    }
    decrementMiningPointsBy(points: number): void {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.miningPointsId)
        const score = objective.getScore(this._player)
        objective.setScore(this._player, score - points)
    }
    setMiningPointsBy(points: number): void {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.miningPointsId)
        objective.setScore(this._player, points)
    }

    //TODO : Agregar los setter (increment, decrement) de este método
    getLinkingPoints(): number {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.linkingPointsId)
        return objective.getScore(this._player)
    }

    setLinkingPointsBy(points: number): void {
        const objective = world.scoreboard.getObjective(ScoreboardObjectives.linkingPointsId)
        objective.setScore(this._player, points)
    }

    /* ---> ALFA UTILITY METHODS <--- */

    //Cambiar este metodo al objeto de Alfa
    getIsAlfa(): boolean {
        return this._player.hasTag(PlayerTags.alfaPlayer)
    }
    #changeToAlfaClass() {
        //Quitar la clase no_class
        this._player.removeTag(PlayerTags.noClassPlayer)
        //Agregar la clase alfa
        this._player.addTag(PlayerTags.alfaPlayer)

        world.sendMessage(`${this._player.nameTag} es un jugador Alfa`)
    }

    /* ---> OMEGA UTILITY METHODS <--- */
    #changeToOmegaClass() {
        //Quitar la clase no_class
        this._player.removeTag(PlayerTags.noClassPlayer)
        //Agregar la clase omega
        this._player.addTag(PlayerTags.omegaPlayer)

        world.sendMessage(`§d${this._player.nameTag} es un jugador Beta`)
        //Se inicializa el nuevo controller para inicializar las propiedades correspondientes con este jugador
    }

    /* ---> BETA UTILITY METHODS <--- */

    //Cambiar este metodo al objeto de Beta
    getIsBeta(): boolean {
        return this._player.hasTag(PlayerTags.betaPlayer)
    }
    #changeToBetaClass() {
        //Quitar la clase no_class
        this._player.removeTag(PlayerTags.noClassPlayer)
        //Agregar la clase beta
        this._player.addTag(PlayerTags.betaPlayer)

        world.sendMessage(`§b${this._player.nameTag} es un jugador Beta`)
    }


    /* ------------------> ALFA PROPERTY METHODS <------------------ */

    getPlayerLife(): number {
        return this._player.getProperty(PlayerProperties.playerLife) as number
    }
    incrementPlayerLife(): void {
        const newPoints = this._player.getProperty(PlayerProperties.playerLife) as number + 1
        this._player.setProperty(PlayerProperties.playerLife, newPoints)

        this.incrementPlayerClassWeight()
    }

    getPlayerStrength(): number {
        return this._player.getProperty(PlayerProperties.playerStrength) as number
    }
    incrementPlayerStrength(): void {
        const newPoints = this._player.getProperty(PlayerProperties.playerStrength) as number + 1
        this._player.setProperty(PlayerProperties.playerStrength, newPoints)

        this.incrementPlayerClassWeight()
    }

    getPlayerDefense(): number {
        return this._player.getProperty(PlayerProperties.playerDefense) as number
    }
    incrementPlayerDefense(): void {
        const newPoints = this._player.getProperty(PlayerProperties.playerDefense) as number + 1
        this._player.setProperty(PlayerProperties.playerDefense, newPoints)

        this.incrementPlayerClassWeight()
    }

    getPlayerHasFireInmunity(): boolean {
        return this._player.getProperty(PlayerProperties.playerHasFireInmunity) as boolean
    }
    setPlayerFireInmunity(): void {
        const hasFireInmunity = this._player.getProperty(PlayerProperties.playerHasFireInmunity) as boolean
        if (hasFireInmunity) this.incrementPlayerClassWeight()
        this._player.setProperty(PlayerProperties.playerHasFireInmunity, true)
    }

    /* ------------------> OMEGA PROPERTY METHODS <------------------ */

    getPlayerSpeed(): number {
        return this._player.getProperty(PlayerProperties.playerSpeed) as number
    }
    incrementPlayerSpeed(): void {
        const newPoints = this._player.getProperty(PlayerProperties.playerSpeed) as number + 1
        this._player.setProperty(PlayerProperties.playerSpeed, newPoints)

        this.decrementPlayerClassWeight()
    }

    getPlayerRegeneration(): number {
        return this._player.getProperty(PlayerProperties.playerRegeneration) as number
    }
    incrementPlayerRegeneration(): void {
        const newPoints = this._player.getProperty(PlayerProperties.playerRegeneration) as number + 1
        this._player.setProperty(PlayerProperties.playerRegeneration, newPoints)

        this.decrementPlayerClassWeight()
    }

    getPlayerHaste(): number {
        return this._player.getProperty(PlayerProperties.playerHaste) as number
    }
    incrementPlayerHaste(): void {
        const newPoints = this._player.getProperty(PlayerProperties.playerHaste) as number + 1
        this._player.setProperty(PlayerProperties.playerHaste, newPoints)

        this.decrementPlayerClassWeight()
    }

    getPlayerHasWaterBreathing(): boolean {
        return this._player.getProperty(PlayerProperties.playerHasWaterBreathing) as boolean
    }
    setPlayerWaterBreathing(): void {
        const hasWaterBreathing = this._player.getProperty(PlayerProperties.playerHasWaterBreathing) as boolean
        if (hasWaterBreathing) this.decrementPlayerClassWeight()
        this._player.setProperty(PlayerProperties.playerHasWaterBreathing, true)
    }

    /* ------------------> Dynamic PROPERTY METHODS <------------------ */

    getPlayerRedeemedMiningPoints(): number {
        return this._player.getDynamicProperty(PlayerDynamicProperties.reedemedMiningPoints) as number
    }
    incrementPlayerRedeemedMiningPointsBy(points: number): void {
        const playerRedeemedMiningPoints = this._player.getDynamicProperty(PlayerDynamicProperties.reedemedMiningPoints) as number

        this._player.setDynamicProperty(PlayerDynamicProperties.reedemedMiningPoints, playerRedeemedMiningPoints + points)
    }

    getIsSpawnedForJoinTheWorld(): boolean {
        return this._player.getDynamicProperty(PlayerDynamicProperties.isSpawnedForJoinTheWorld) as boolean
    }
    toogleIsSpawnedForJoinTheWorld(): void {
        this._player.setDynamicProperty(PlayerDynamicProperties.isSpawnedForJoinTheWorld, false)
    }

    protected _player: Player
}
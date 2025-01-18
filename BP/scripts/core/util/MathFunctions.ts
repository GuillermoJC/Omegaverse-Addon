import PlayerController from "../controllers/Player"

export default class MathFunctions {

    static getNextRedeemableMiningPoint(current: number): number {
        //f(c) = c**2
        return Math.pow(2, current)
    }

    static incrementNextAgeOfPlayer(current: number): number {
        //f(c) = 5c + 1
        const nextYear = ((current - PlayerController.getInitialAge()) * 5) + 1
        return nextYear ? nextYear : 1
    }

    static randomizeClassWeightSelection(classWeight: number): number {
        console.warn("Randomizing class weight selection : Line 17 : File: core/util/MathFunctions.ts")
        //Establecer classWeight como el centro del peso y tomar los 5 numeros anteriores y los 5 siguientes
        const availableNumbers = [classWeight]
        for (let i = classWeight - 1; i >= classWeight - 5; i--) availableNumbers.unshift(i)
        for (let i = classWeight + 1; i <= classWeight + 5; i++) availableNumbers.push(i)

        //Tomar un número entre este array de números
        const randomSelection = Math.abs(Math.round((Math.random() * 10) - 1))

        //Devolver ese número
        return availableNumbers[randomSelection]

    }
}
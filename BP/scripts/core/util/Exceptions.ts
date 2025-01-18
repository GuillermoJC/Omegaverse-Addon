export default class OmegaverseException {

    static NotEnoughPointsException(message?: string): Error {
        return new Error(message)
    }

    static NotImplementedMethodException(message?: string): Error {
        return new Error(message)
    }
}
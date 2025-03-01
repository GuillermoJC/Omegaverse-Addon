
export default class Utility {

    static convertArrayToSet<K>(array: Array<K>): Set<K> {
        return new Set(array)
    }

    static convertSetToArray<K>(set: Set<K>): Array<K> {
        return [...set]
    }

    static convertStringToArray(str: string, sep: string): Array<string> {
        return str.split(sep);
    }

    static convertArrayToString(array: Array<string>, sep: string): string {
        return array.join(sep)
    }

    static convertSetToString(set: Set<string>, sep: string): string {
        return Utility.convertArrayToString(Utility.convertSetToArray(set), sep)
    }
}
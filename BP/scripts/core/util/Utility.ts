
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

    static convertArrayToMap<K, V>(array: [K, V]): Map<K, V> {
        return new Map([array])
    }

    static convertStringToMap(str: string): Map<string, string> {
        const matrix = str.split(";").map(e => e.split(",")) as Array<[string, string]>

        for (let array of matrix) {
            if (array.length !== 2) throw new TypeError("Matrix must be composed of an array of 2 strings")
        }

        return new Map(matrix)
    }

    static convertMapToString(map: Map<string, string>): string {
        return [...map].join(";")
    }

    static convertSetToString(set: Set<string>, sep: string): string {
        return Utility.convertArrayToString(Utility.convertSetToArray(set), sep)
    }
}
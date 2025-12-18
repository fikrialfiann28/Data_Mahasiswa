// Sorting.js

class Sorting {
    // Bubble Sort - O(n²)
    static bubbleSort(arr, key = 'nim') {
        const n = arr.length;
        const result = [...arr]; // clone
        for (let i = 0; i < n - 1; i++) {
            for (let j = 0; j < n - i - 1; j++) {
                if (result[j][key] > result[j + 1][key]) {
                    [result[j], result[j + 1]] = [result[j + 1], result[j]];
                }
            }
        }
        return result;
    }

    // Merge Sort - O(n log n)
    static mergeSort(arr, key = 'nim') {
        if (arr.length <= 1) return arr;
        const mid = Math.floor(arr.length / 2);
        const left = this.mergeSort(arr.slice(0, mid), key);
        const right = this.mergeSort(arr.slice(mid), key);
        return this.merge(left, right, key);
    }

    static merge(left, right, key) {
        let result = [];
        let i = 0, j = 0;
        while (i < left.length && j < right.length) {
            if (left[i][key] <= right[j][key]) {
                result.push(left[i++]);
            } else {
                result.push(right[j++]);
            }
        }
        return result.concat(left.slice(i), right.slice(j));
    }
}
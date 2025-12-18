// Searching.js

class Searching {
    // Linear Search - O(n)
    static linearSearch(arr, nim) {
        return arr.findIndex(m => m.nim === nim);
    }

    // Binary Search - O(log n) — asumsi array sudah diurutkan berdasarkan NIM
    static binarySearch(arr, nim) {
        let low = 0, high = arr.length - 1;
        while (low <= high) {
            const mid = Math.floor((low + high) / 2);
            if (arr[mid].nim === nim) return mid;
            if (arr[mid].nim < nim) {
                low = mid + 1;
            } else {
                high = mid - 1;
            }
        }
        return -1; // tidak ditemukan
    }
}
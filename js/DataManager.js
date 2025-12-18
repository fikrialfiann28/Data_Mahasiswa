// DataManager.js
class DataManager {
    constructor(storageKey = "mahasiswa_data") {
        this.storageKey = storageKey;
    }

    // Baca dari localStorage (simulasi baca file)
    loadData() {
        try {
            const data = localStorage.getItem(this.storageKey);
            if (!data) return [];
            const parsed = JSON.parse(data);
            return parsed.map(obj => Mahasiswa.fromObject(obj));
        } catch (error) {
            console.error("Gagal memuat data:", error);
            return [];
        }
    }

    // Simpan ke localStorage (simulasi tulis file)
    saveData(mahasiswaArray) {
        try {
            const serializable = mahasiswaArray.map(m => m.toObject());
            localStorage.setItem(this.storageKey, JSON.stringify(serializable));
        } catch (error) {
            throw new Error("Gagal menyimpan data: " + error.message);
        }
    }

    // CRUD
    addMahasiswa(mahasiswa) {
        const data = this.loadData();
        if (data.some(m => m.nim === mahasiswa.nim)) {
            throw new Error("NIM sudah terdaftar!");
        }
        data.push(mahasiswa);
        this.saveData(data);
    }

    updateMahasiswa(nim, updatedData) {
        const data = this.loadData();
        const index = data.findIndex(m => m.nim === nim);
        if (index === -1) throw new Error("Mahasiswa tidak ditemukan!");
        data[index].nama = updatedData.nama;
        data[index].email = updatedData.email;
        data[index].prodi = updatedData.prodi;
        data[index].angkatan = updatedData.angkatan;
        data[index].status = updatedData.status;
        this.saveData(data);
    }

    deleteMahasiswa(nim) {
        const data = this.loadData();
        const filtered = data.filter(m => m.nim !== nim);
        if (filtered.length === data.length) {
            throw new Error("Mahasiswa tidak ditemukan!");
        }
        this.saveData(filtered);
    }

    getAllMahasiswa() {
        return this.loadData();
    }
}
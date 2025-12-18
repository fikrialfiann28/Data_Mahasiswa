// Mahasiswa.js
class Mahasiswa {
  constructor(nim, nama, email, prodi, angkatan, status) {
    this._nim = nim;
    this._nama = nama;
    this._email = email;
    this._prodi = prodi;
    this._angkatan = angkatan;
    this._status = status;
  }

  // ===== GETTER =====
  get nim() { return this._nim; }
  get nama() { return this._nama; }
  get email() { return this._email; }
  get prodi() { return this._prodi; }
  get angkatan() { return this._angkatan; }
  get status() { return this._status; }

  // ===== SETTER =====
  set nama(value) { this._nama = value; }
  set email(value) { this._email = value; }
  set prodi(value) { this._prodi = value; }
  set angkatan(value) { this._angkatan = value; }
  set status(value) { this._status = value; }

  // ===== SERIALIZATION =====
  toObject() {
    return {
      nim: this._nim,
      nama: this._nama,
      email: this._email,
      prodi: this._prodi,
      angkatan: this._angkatan,
      status: this._status
    };
  }

  // ===== DESERIALIZATION =====
  static fromObject(obj) {
    return new Mahasiswa(
      obj.nim,
      obj.nama,
      obj.email,
      obj.prodi,
      obj.angkatan,
      obj.status
    );
  }
}

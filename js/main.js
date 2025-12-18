// =====================
// VIEW STATE (LAYOUT 2)
// =====================
let originalViewData = []; // <-- TAMBAHKAN
let currentViewData = [];
let isSorted = false;
let hasLoadedData = false;
let viewMode = "all"; 
// all | search | sorted



// =====================
// INIT
// =====================
const dataManager = new DataManager();

const sidebar = document.getElementById("sidebar");
const overlay = document.getElementById("overlay");

// =====================
// SIDEBAR
// =====================
document.getElementById("menuBtn").onclick = () => {
  sidebar.classList.add("active");
  overlay.classList.add("active");
};

overlay.onclick = () => {
  sidebar.classList.remove("active");
  overlay.classList.remove("active");
};

window.showSection = function (section) {
  document.getElementById("section-input").hidden = section !== "input";
  document.getElementById("section-data").hidden = section !== "data";

  if (section === "data" && !hasLoadedData) {
    loadAndRender();
    hasLoadedData = true;
  }

  sidebar.classList.remove("active");
  overlay.classList.remove("active");
};
 


window.toggleDark = function () {
  document.body.classList.toggle("dark");
};


// =====================
// VALIDASI
// =====================
function validateInput(nim, nama, email, prodi, angkatan, status) {
  if (!/^\d{12}$/.test(nim)) throw new Error("NIM harus 12 digit angka");
  if (!nama.trim()) throw new Error("Nama wajib diisi");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    throw new Error("Email tidak valid");
  if (!prodi.trim()) throw new Error("Program Studi wajib diisi");
  if (!/^\d{4}$/.test(angkatan)) throw new Error("Angkatan harus 4 digit");
  if (!["Aktif", "Cuti", "Lulus"].includes(status))
    throw new Error("Status tidak valid");
}

// =====================
// RENDER TABLE (LAYOUT 2)
// =====================
function renderTable(list) {
  const tbody = document.getElementById("mahasiswaTableBody");
  tbody.innerHTML = "";

  list.forEach(m => {
    tbody.innerHTML += `
      <tr>
        <td>${m.nim}</td>
        <td>${m.nama}</td>
        <td>${m.email}</td>
        <td>${m.prodi}</td>
        <td>${m.angkatan}</td>
        <td>${m.status}</td>
        <td>
          <button class="btn btn-edit" onclick="editMahasiswa('${m.nim}')">Edit</button>
          <button class="btn btn-delete" onclick="deleteMahasiswa('${m.nim}')">Hapus</button>
        </td>
      </tr>
    `;
  });
}

// =====================
// INPUT ELEMENT
// =====================
const nimEl = document.getElementById("nim");
const namaEl = document.getElementById("nama");
const emailEl = document.getElementById("email");
const prodiEl = document.getElementById("prodi");
const angkatanEl = document.getElementById("angkatan");
const statusEl = document.getElementById("status");

// =====================
// EDIT MODAL ELEMENT
// =====================
const editNama = document.getElementById("edit-nama");
const editEmail = document.getElementById("edit-email");
const editProdi = document.getElementById("edit-prodi");
const editAngkatan = document.getElementById("edit-angkatan");
const editStatus = document.getElementById("edit-status");


// =====================
// TAMBAH DATA
// =====================
document.getElementById("addBtn").onclick = () => {
  try {
    const nim = nimEl.value.trim();
    const nama = namaEl.value.trim();
    const email = emailEl.value.trim();
    const prodi = prodiEl.value.trim();
    const angkatan = angkatanEl.value.trim();
    const status = statusEl.value;

    validateInput(nim, nama, email, prodi, angkatan, status);

    dataManager.addMahasiswa(
      new Mahasiswa(nim, nama, email, prodi, angkatan, status)
    );

    alert("Mahasiswa berhasil ditambahkan");
    clearForm();
    showSection("data");
    loadAndRender();
  } catch (e) {
    alert(e.message);
  }
};

// =====================
// EDIT (TETAP PAKAI FORM INPUT)
// =====================
let editingNim = null;

window.editMahasiswa = function (nim) {
  const m = dataManager.getAllMahasiswa().find(x => x.nim === nim);
  if (!m) return;

  editingNim = nim;

  document.getElementById("edit-nim").textContent = m.nim;
  document.getElementById("edit-nama").value = m.nama;
  document.getElementById("edit-email").value = m.email;
  document.getElementById("edit-prodi").value = m.prodi;
  document.getElementById("edit-angkatan").value = m.angkatan;
  document.getElementById("edit-status").value = m.status;

  document.getElementById("editModal").classList.add("show");
  document.getElementById("modalOverlay").classList.add("show");
};

document.getElementById("saveEditBtn").onclick = () => {
  try {
    const data = {
      nama: editNama.value.trim(),
      email: editEmail.value.trim(),
      prodi: editProdi.value.trim(),
      angkatan: editAngkatan.value.trim(),
      status: editStatus.value
    };

    validateInput(
      editingNim,
      data.nama,
      data.email,
      data.prodi,
      data.angkatan,
      data.status
    );

    dataManager.updateMahasiswa(editingNim, data);
    closeEdit();
    loadAndRender();
    alert("Data berhasil diperbarui");
  } catch (e) {
    alert(e.message);
  }
};

function closeEdit() {
  editingNim = null;
  document.getElementById("editModal").classList.remove("show");
  document.getElementById("modalOverlay").classList.remove("show");
}
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeEdit();
});
// =====================
// DELETE (WAJIB GLOBAL)
// =====================
window.deleteMahasiswa = function (nim) {
  try {
    if (!confirm(`Hapus mahasiswa dengan NIM ${nim}?`)) return;

    // Hapus dari data source
    dataManager.deleteMahasiswa(nim);

    // Hapus dari view (layout 2)
    currentViewData = currentViewData.filter(m => m.nim !== nim);
    renderTable(currentViewData);

    alert("Data berhasil dihapus");
  } catch (e) {
    alert(e.message);
  }
};


// =====================
// SEARCH & SORT
// =====================

const linearSearchBtn = document.getElementById("linearSearchBtn");
const binarySearchBtn = document.getElementById("binarySearchBtn");

binarySearchBtn.disabled = true;
binarySearchBtn.classList.add("disabled");

const searchInput = document.getElementById("searchNim");

linearSearchBtn.onclick = () => {
  const keyword = searchInput.value.trim();

  if (!/^\d{12}$/.test(keyword)) {
    alert("NIM harus 12 digit");
    return;
  }

  const index = Searching.linearSearch(currentViewData, keyword);

  if (index === -1) {
    alert("Data tidak ditemukan");
    return;
  }

  renderTable([currentViewData[index]]);
  viewMode = "search";
};

binarySearchBtn.onclick = () => {
  if (!isSorted) {
    alert("Binary Search hanya bisa digunakan setelah data diurutkan!");
    return;
  }

  const keyword = searchInput.value.trim();
  if (!/^\d{12}$/.test(keyword)) {
    alert("NIM harus 12 digit");
    return;
  }

  const index = Searching.binarySearch(currentViewData, keyword);

  if (index === -1) {
    alert("Data tidak ditemukan");
    return;
  }

  renderTable([currentViewData[index]]);
  viewMode = "search";
};



window.resetSearch = function () {
  currentViewData = [...originalViewData];
  renderTable(currentViewData);
  searchInput.value = "";
  viewMode = "all";
};



document.getElementById("sortBtn").onclick = () => {
  const method = sortMethod.value;

  currentViewData =
    method === "bubble"
      ? Sorting.bubbleSort([...currentViewData], "nim")
      : Sorting.mergeSort([...currentViewData], "nim");

  isSorted = true;
  viewMode = "sorted";

  binarySearchBtn.disabled = false;
  binarySearchBtn.classList.remove("disabled");

  renderTable(currentViewData);
};



// =====================
// UTIL
// =====================
function shuffleArray(arr) {
  const result = [...arr]; // clone agar data asli aman
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

function clearForm() {
  [nimEl, namaEl, emailEl, prodiEl, angkatanEl].forEach(el => el.value = "");
  statusEl.value = "Aktif";
}

function loadAndRender(force = false) {
  if (viewMode === "search" && !force) return;

  const data = dataManager.getAllMahasiswa();

  originalViewData = shuffleArray(data);
  currentViewData = [...originalViewData];

  isSorted = false;
  viewMode = "all";

  binarySearchBtn.disabled = true;
  binarySearchBtn.classList.add("disabled");

  renderTable(currentViewData);
}






window.exportData = function () {
  if (!currentViewData || currentViewData.length === 0) {
    alert("Tidak ada data untuk diekspor");
    return;
  }

  exportToCSV(currentViewData);
  exportToExcel(currentViewData);
};

function exportToCSV(data) {
  const header = ["NIM", "Nama", "Email", "Prodi", "Angkatan", "Status"];

  const rows = data.map(m => [
    m.nim,
    m.nama,
    m.email,
    m.prodi,
    m.angkatan,
    m.status
  ]);

  let csv = header.join(",") + "\n";
  rows.forEach(row => {
    csv += row.join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "data_mahasiswa.csv";
  a.click();

  URL.revokeObjectURL(url);
}

function exportToExcel(data) {
  let table = `
    <table border="1">
      <tr>
        <th>NIM</th>
        <th>Nama</th>
        <th>Email</th>
        <th>Prodi</th>
        <th>Angkatan</th>
        <th>Status</th>
      </tr>
  `;

  data.forEach(m => {
    table += `
      <tr>
        <td>${m.nim}</td>
        <td>${m.nama}</td>
        <td>${m.email}</td>
        <td>${m.prodi}</td>
        <td>${m.angkatan}</td>
        <td>${m.status}</td>
      </tr>
    `;
  });

  table += `</table>`;

  const blob = new Blob([table], {
    type: "application/vnd.ms-excel"
  });

  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data_mahasiswa.xls";
  a.click();

  URL.revokeObjectURL(url);
}

window.openExportChoice = function () {
  if (!currentViewData || currentViewData.length === 0) {
    alert("Tidak ada data untuk diekspor");
    return;
  }
  document.getElementById("exportModal").classList.add("show");
  document.getElementById("modalOverlay").classList.add("show");
};

window.closeExport = function () {
  document.getElementById("exportModal").classList.remove("show");
  document.getElementById("modalOverlay").classList.remove("show");
};

window.exportCSV = function () {
  exportToCSV(currentViewData);
  closeExport();
};

window.exportExcel = function () {
  exportToExcel(currentViewData);
  closeExport();
};

window.openImportChoice = function () {
  document.getElementById("importModal").classList.add("show");
  document.getElementById("modalOverlay").classList.add("show");
};

window.closeImport = function () {
  document.getElementById("importModal").classList.remove("show");
  document.getElementById("modalOverlay").classList.remove("show");
  document.getElementById("importFile").value = "";
};

window.processImport = function () {
  const fileInput = document.getElementById("importFile");
  const file = fileInput.files[0];

  if (!file) {
    alert("Pilih file CSV atau Excel");
    return;
  }

  const ext = file.name.split(".").pop().toLowerCase();

  if (ext === "csv") {
    importCSV(file);
  } else if (ext === "xlsx") {
    importExcel(file);
  } else {
    alert("Format file tidak didukung");
  }
};

function importCSV(file) {
  const reader = new FileReader();

  reader.onload = e => {
    const lines = e.target.result.split("\n").slice(1);
    let count = 0;

    lines.forEach(line => {
      if (!line.trim()) return;
      const [nim, nama, email, prodi, angkatan, status] =
        line.split(",").map(v => v.trim());

      try {
        validateInput(nim, nama, email, prodi, angkatan, status);
        dataManager.addMahasiswa(
          new Mahasiswa(nim, nama, email, prodi, angkatan, status)
        );
        count++;
      } catch {}
    });

    loadAndRender();
    closeImport();
    alert(`Berhasil impor ${count} data`);
  };

  reader.readAsText(file);
}

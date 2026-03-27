/**
 * EnglishPro — script.js
 * File JavaScript bersama (shared) yang dipakai di semua halaman.
 * Berisi: localStorage helpers, user management, toast, validasi.
 * ============================================================
 */

// ============================================================
// 1. KONSTANTA & KONFIGURASI
// ============================================================
const STORAGE_KEYS = {
  USERS: 'ep_users',
  LAPORAN: 'laporan',
  DARK_MODE: 'darkMode',
  CURRENT_USER: 'currentUser'   // disimpan di sessionStorage
};

// Kode rahasia untuk registrasi akun Admin
const ADMIN_SECRET_KEY = 'ENGLISHPRO2025';

// ============================================================
// 2. USER MANAGEMENT (localStorage)
// ============================================================

/**
 * Ambil semua user dari localStorage.
 * Jika belum ada, buat akun admin default.
 * @returns {Array} Array of user objects
 */
function getUsers() {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  if (raw) return JSON.parse(raw);

  // Buat akun admin default jika belum ada user sama sekali
  const defaultAdmin = {
  id: 1,
  fullname: 'Yohana Lumban Batu',
  username: 'yohana',
  password: 'yohana@12',
  role: 'admin'
};
  const defaultUsers = [defaultAdmin];
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(defaultUsers));
  return defaultUsers;
}

/**
 * Simpan array user ke localStorage.
 * @param {Array} users
 */
function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

/**
 * Cek apakah user sedang login (ada di sessionStorage).
 * @returns {Object|null} User object atau null
 */
function getCurrentUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER) || 'null');
}

// ============================================================
// 3. LAPORAN DATA (localStorage)
// ============================================================

/**
 * Ambil semua data laporan.
 * @returns {Array}
 */
function getLaporan() {
  return JSON.parse(localStorage.getItem(STORAGE_KEYS.LAPORAN) || '[]');
}

/**
 * Simpan data laporan.
 * @param {Array} data
 */
function saveLaporan(data) {
  localStorage.setItem(STORAGE_KEYS.LAPORAN, JSON.stringify(data));
}

// ============================================================
// 4. TOAST NOTIFICATION
// ============================================================

/**
 * Tampilkan notifikasi toast.
 * @param {string} message - Pesan yang ditampilkan
 * @param {'success'|'error'|'info'} type - Tipe toast
 * @param {number} duration - Durasi tampil (ms), default 3000
 */
function showToast(message, type = 'info', duration = 3000) {
  const icons = {
    success: '✅',
    error: '❌',
    info: 'ℹ️'
  };

  // Cari elemen toast di halaman saat ini
  const toast = document.getElementById('toast');
  if (!toast) return;

  toast.textContent = '';
  toast.className = `toast ${type}`;

  const icon = document.createElement('span');
  icon.textContent = icons[type] || 'ℹ️';

  const text = document.createElement('span');
  text.textContent = message;

  toast.appendChild(icon);
  toast.appendChild(text);
  toast.classList.remove('hidden');

  // Auto-hide setelah `duration` ms
  clearTimeout(toast._timer);
  toast._timer = setTimeout(() => {
    toast.classList.add('hidden');
  }, duration);
}

// ============================================================
// 5. FORM VALIDATION HELPERS
// ============================================================

/**
 * Tampilkan pesan error di bawah field tertentu.
 * @param {string} elementId - ID elemen error span
 * @param {string} message - Pesan error
 */
function showFieldError(elementId, message) {
  const el = document.getElementById(elementId);
  if (el) {
    el.textContent = message;
    el.style.display = 'block';
    // Tambahkan animasi shake pada input
    const inputEl = el.previousElementSibling?.querySelector('input, select');
    if (inputEl) {
      inputEl.style.borderColor = 'var(--error)';
      inputEl.classList.add('shake');
      setTimeout(() => inputEl.classList.remove('shake'), 400);
    }
  }
}

/**
 * Hapus semua pesan error di halaman.
 */
function clearErrors() {
  document.querySelectorAll('.field-error').forEach(el => {
    el.textContent = '';
    el.style.display = 'none';
  });
  document.querySelectorAll('input, select').forEach(el => {
    el.style.borderColor = '';
  });
}

// ============================================================
// 6. UTILITY FUNCTIONS
// ============================================================

/**
 * Format tanggal dari YYYY-MM-DD ke format lokal Indonesia.
 * @param {string} dateStr - String tanggal format YYYY-MM-DD
 * @returns {string}
 */
function formatDateID(dateStr) {
  if (!dateStr) return '-';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

/**
 * Escape HTML untuk mencegah XSS.
 * @param {string} str
 * @returns {string}
 */
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Generate ID unik sederhana berbasis timestamp.
 * @returns {string}
 */
function generateId() {
  return String(Date.now()) + Math.random().toString(36).slice(2, 6);
}

/**
 * Dapatkan rentang tanggal minggu ini (Senin - Minggu).
 * @returns {{ start: string, end: string }}
 */
function getWeekRange() {
  const now = new Date();
  const day = now.getDay();
  const diffToMonday = day === 0 ? -6 : 1 - day;
  const monday = new Date(now);
  monday.setDate(now.getDate() + diffToMonday);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  return {
    start: monday.toISOString().slice(0, 10),
    end: sunday.toISOString().slice(0, 10)
  };
}

/**
 * Dapatkan rentang tanggal bulan ini.
 * @returns {{ start: string, end: string }}
 */
function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().slice(0, 10);
  return { start, end };
}

/**
 * Filter array laporan berdasarkan rentang tanggal.
 * @param {Array} data
 * @param {string} start - YYYY-MM-DD
 * @param {string} end - YYYY-MM-DD
 * @returns {Array}
 */
function filterByDate(data, start, end) {
  return data.filter(d => {
    if (start && d.tanggal < start) return false;
    if (end && d.tanggal > end) return false;
    return true;
  });
}

// ============================================================
// 7. SHAKE ANIMATION (CSS injected via JS)
// ============================================================
(function injectShakeStyle() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%, 100% { transform: translateX(0); }
      20% { transform: translateX(-6px); }
      40% { transform: translateX(6px); }
      60% { transform: translateX(-4px); }
      80% { transform: translateX(4px); }
    }
    .shake { animation: shake 0.35s ease; }
  `;
  document.head.appendChild(style);
})();

// ============================================================
// 8. INIT: Pastikan data default sudah ada saat script dimuat
// ============================================================
(function init() {
  // Panggil getUsers() untuk memastikan akun admin default dibuat
  getUsers();
})();

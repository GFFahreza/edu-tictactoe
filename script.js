/* ============================================================
   EDU-TICTACTOE — Complete Game Logic
   Teknologi Multimedia · UAD 2026
   ============================================================ */

'use strict';

// ============================
// GAME STATE
// ============================
let gameState = {
  mode: 'ai',           // 'ai' | 'pvp'
  currentPlayer: 'A',  // 'A' | 'B'
  board: Array(9).fill(null),   // null | 'A' | 'B' | 'locked-A' | 'locked-B'
  scores: { A: 0, B: 0 },
  team1Name: 'Kelompok Garuda',
  team2Name: 'Komputer (AI)',
  avatarA: '🐱',
  avatarB: '🐶',
  materi: 'matematika',
  level: 'sedang',
  totalAnswered: 0,
  totalCorrect: 0,
  startTime: null,
  pendingCell: null,
  isGameOver: false,
  soundOn: true,
  chartsInit: false,
  editingQuestionId: null,
};

// ============================
// QUESTION DATABASE
// ============================
let questionDB = [
  // MATEMATIKA - MUDAH
  { id:1, q:'Berapakah hasil dari 7 × 8?', opts:['56','54','48','64'], ans:0, cat:'Matematika', level:'Mudah' },
  { id:2, q:'Berapakah 15 + 27?', opts:['42','41','43','40'], ans:0, cat:'Matematika', level:'Mudah' },
  { id:3, q:'Berapakah 100 ÷ 4?', opts:['25','20','30','15'], ans:0, cat:'Matematika', level:'Mudah' },
  // MATEMATIKA - SEDANG
  { id:4, q:'Sebuah kebun berbentuk persegi panjang memiliki panjang 12 m dan lebar 8 m. Berapakah luas kebun tersebut?', opts:['96 m²','40 m²','20 m²','88 m²'], ans:0, cat:'Matematika', level:'Sedang' },
  { id:5, q:'Jika keliling sebuah persegi adalah 48 cm, berapakah panjang sisinya?', opts:['12 cm','10 cm','14 cm','16 cm'], ans:0, cat:'Matematika', level:'Sedang' },
  { id:6, q:'Berapakah 25% dari 200?', opts:['50','40','60','45'], ans:0, cat:'Matematika', level:'Sedang' },
  // MATEMATIKA - MENANTANG
  { id:7, q:'Sebuah tangki air berbentuk tabung dengan jari-jari 7 cm dan tinggi 20 cm. Berapakah volume air jika setengah penuh? (π = 22/7)', opts:['1540 cm³','3080 cm³','770 cm³','2310 cm³'], ans:0, cat:'Matematika', level:'Menantang' },
  { id:8, q:'Jika 3x + 7 = 22, maka nilai x adalah...', opts:['5','4','6','3'], ans:0, cat:'Matematika', level:'Menantang' },
  // IPA - MUDAH
  { id:9, q:'Proses fotosintesis terjadi di bagian tumbuhan yang disebut...', opts:['Kloroplas','Mitokondria','Inti sel','Ribosom'], ans:0, cat:'IPA', level:'Mudah' },
  { id:10, q:'Planet apa yang paling dekat dengan Matahari?', opts:['Merkurius','Venus','Bumi','Mars'], ans:0, cat:'IPA', level:'Mudah' },
  { id:11, q:'Hewan yang berdarah dingin adalah...', opts:['Ular','Kelinci','Anjing','Burung'], ans:0, cat:'IPA', level:'Mudah' },
  // IPA - SEDANG
  { id:12, q:'Zat yang dihasilkan oleh fotosintesis adalah...', opts:['Glukosa dan Oksigen','CO₂ dan Air','Protein dan Lemak','Nitrogen dan Hidrogen'], ans:0, cat:'IPA', level:'Sedang' },
  { id:13, q:'Tulang yang berfungsi melindungi jantung dan paru-paru adalah...', opts:['Tulang rusuk','Tulang belakang','Tulang bahu','Tulang pinggul'], ans:0, cat:'IPA', level:'Sedang' },
  // IPA - MENANTANG
  { id:14, q:'Proses pemisahan campuran berdasarkan perbedaan titik didih disebut...', opts:['Destilasi','Filtrasi','Kristalisasi','Sublimasi'], ans:0, cat:'IPA', level:'Menantang' },
  // PPKn - MUDAH
  { id:15, q:'Sila ke-3 Pancasila berbunyi...', opts:['Persatuan Indonesia','Kemanusiaan yang Adil','Ketuhanan Yang Maha Esa','Kerakyatan yang dipimpin'], ans:0, cat:'PPKn', level:'Mudah' },
  { id:16, q:'Lambang negara Indonesia adalah...', opts:['Garuda Pancasila','Burung Merak','Banteng','Pohon Beringin'], ans:0, cat:'PPKn', level:'Mudah' },
  // PPKn - SEDANG
  { id:17, q:'Semboyan negara Indonesia adalah...', opts:['Bhinneka Tunggal Ika','Pancasila Sakti','Merah Putih','Merdeka atau Mati'], ans:0, cat:'PPKn', level:'Sedang' },
  { id:18, q:'Hak memilih dalam pemilihan umum termasuk hak...', opts:['Politik','Ekonomi','Sosial','Budaya'], ans:0, cat:'PPKn', level:'Sedang' },
  // PPKn - MENANTANG
  { id:19, q:'Amandemen Undang-Undang Dasar 1945 dilakukan sebanyak...', opts:['4 kali','3 kali','5 kali','2 kali'], ans:0, cat:'PPKn', level:'Menantang' },
  { id:20, q:'Lembaga negara yang bertugas mengawasi keuangan negara adalah...', opts:['BPK','DPR','MA','KPK'], ans:0, cat:'PPKn', level:'Menantang' },
];

let nextId = 21;

// ============================
// STUDENT DATABASE
// ============================
const studentDB = {
  sandrina: {
    password: 'sandrina123',
    name: 'Tim Sandrina',
    avatar: '⭐',
    stats: { games: 7, wins: 5, bestScore: 765, avgAcc: 80, mathAcc: 82, ipaAcc: 78, ppknAcc: 85 },
    history: [
      { date: '12 Jul 2026', materi: 'IPA',         level: 'Sedang',    vs: 'Tim Septi',      correct: 5, total: 7, score: 120, result: 'Menang' },
      { date: '11 Jul 2026', materi: 'Matematika',  level: 'Mudah',     vs: 'Kel. Garuda',    correct: 4, total: 5, score: 90,  result: 'Seri' },
      { date: '11 Jul 2026', materi: 'PPKn',        level: 'Sedang',    vs: 'Komputer (AI)',  correct: 6, total: 7, score: 140, result: 'Menang' },
      { date: '10 Jul 2026', materi: 'Matematika',  level: 'Menantang', vs: 'Kel. Roket',     correct: 3, total: 6, score: 80,  result: 'Kalah' },
      { date: '9 Jul 2026',  materi: 'IPA',         level: 'Mudah',     vs: 'Komputer (AI)',  correct: 5, total: 5, score: 100, result: 'Menang' },
      { date: '8 Jul 2026',  materi: 'PPKn',        level: 'Sedang',    vs: 'Kel. UFO',       correct: 6, total: 7, score: 130, result: 'Menang' },
      { date: '7 Jul 2026',  materi: 'Matematika',  level: 'Sedang',    vs: 'Komputer (AI)',  correct: 4, total: 6, score: 105, result: 'Menang' },
    ],
    scoreHistory: [90, 80, 140, 80, 100, 130, 105],
  },
  septi: {
    password: 'septi123',
    name: 'Tim Septi',
    avatar: '🌸',
    stats: { games: 6, wins: 4, bestScore: 740, avgAcc: 77, mathAcc: 75, ipaAcc: 80, ppknAcc: 76 },
    history: [
      { date: '12 Jul 2026', materi: 'PPKn',        level: 'Mudah',     vs: 'Tim Sandrina',   correct: 4, total: 5, score: 90,  result: 'Seri' },
      { date: '11 Jul 2026', materi: 'Matematika',  level: 'Sedang',    vs: 'Komputer (AI)',  correct: 5, total: 7, score: 110, result: 'Menang' },
      { date: '10 Jul 2026', materi: 'IPA',         level: 'Mudah',     vs: 'Kel. Anjing',    correct: 6, total: 7, score: 135, result: 'Menang' },
      { date: '9 Jul 2026',  materi: 'PPKn',        level: 'Menantang', vs: 'Kel. Garuda',    correct: 3, total: 7, score: 65,  result: 'Kalah' },
      { date: '8 Jul 2026',  materi: 'Matematika',  level: 'Mudah',     vs: 'Komputer (AI)',  correct: 5, total: 6, score: 100, result: 'Menang' },
      { date: '7 Jul 2026',  materi: 'IPA',         level: 'Sedang',    vs: 'Tim Sandrina',   correct: 4, total: 5, score: 95,  result: 'Menang' },
    ],
    scoreHistory: [90, 110, 135, 65, 100, 95],
  },
};
let currentStudent = null;

// ============================
// NAVIGATION
// ============================
function goTo(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
  window.scrollTo(0, 0);

  // Show/hide nav based on page
  const nav = document.getElementById('globalNav');
  if (pageId === 'dashboard') {
    nav.style.display = 'none';
  } else {
    nav.style.display = '';
  }

  if (pageId === 'dashboard') {
    setTimeout(() => initCharts(), 100);
    renderQuestionTable();
  }
  if (pageId === 'arena') {
    // reset scroll
  }
}

function scrollToSection(id) {
  if (document.getElementById('landing').classList.contains('active')) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    goTo('landing');
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 400);
  }
}

// ============================
// MOBILE MENU
// ============================
function toggleMobileMenu() {
  const menu = document.getElementById('mobileMenu');
  menu.classList.toggle('open');
}

// ============================
// SOUND
// ============================
function toggleSound() {
  gameState.soundOn = !gameState.soundOn;
  const icon = gameState.soundOn ? '🔊' : '🔇';
  document.getElementById('soundToggle').textContent = icon;
  document.getElementById('soundToggle').classList.toggle('muted', !gameState.soundOn);
  const arenaBtn = document.getElementById('soundToggleArena');
  if (arenaBtn) { arenaBtn.textContent = icon; arenaBtn.classList.toggle('muted', !gameState.soundOn); }

  // Stop TTS if muted
  if (!gameState.soundOn && window.speechSynthesis) {
    window.speechSynthesis.cancel();
  }
  showToast(gameState.soundOn ? '🔊 Suara Aktif' : '🔇 Suara Dinonaktifkan');
}

function playSound(type) {
  if (!gameState.soundOn) return;
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      osc.frequency.setValueAtTime(523, ctx.currentTime);
      osc.frequency.setValueAtTime(659, ctx.currentTime + 0.12);
      osc.frequency.setValueAtTime(784, ctx.currentTime + 0.24);
      gain.gain.setValueAtTime(0.18, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.5);
    } else if (type === 'wrong') {
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.setValueAtTime(220, ctx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.35);
    } else if (type === 'win') {
      [523,659,784,1047].forEach((f, i) => {
        const o = ctx.createOscillator();
        const g = ctx.createGain();
        o.connect(g); g.connect(ctx.destination);
        o.frequency.value = f;
        g.gain.setValueAtTime(0.15, ctx.currentTime + i*0.12);
        g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i*0.12 + 0.3);
        o.start(ctx.currentTime + i*0.12);
        o.stop(ctx.currentTime + i*0.12 + 0.3);
      });
    } else if (type === 'click') {
      osc.frequency.value = 440;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.1);
    }
  } catch(e) {}
}

// ============================
// TOAST
// ============================
let toastTimer = null;
function showToast(msg, duration = 2500) {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), duration);
}

// ============================
// LOGIN
// ============================
function openLoginModal() {
  document.getElementById('loginModal').style.display = 'flex';
  document.getElementById('loginError').style.display = 'none';
}
function closeLoginModal() {
  document.getElementById('loginModal').style.display = 'none';
}
function doLogin() {
  const u = document.getElementById('loginUsername').value.trim();
  const p = document.getElementById('loginPassword').value.trim();
  if (u === 'guru' && p === '1234') {
    closeLoginModal();
    goTo('dashboard');
    document.getElementById('dashGreeting').textContent = 'Halo, Bu Siti 👋';
  } else {
    document.getElementById('loginError').style.display = 'block';
    document.getElementById('loginPassword').value = '';
  }
}
document.addEventListener('keydown', e => {
  if (e.key === 'Enter' && document.getElementById('loginModal').style.display === 'flex') {
    doLogin();
  }
  if (e.key === 'Enter' && document.getElementById('studentLoginModal').style.display === 'flex') {
    doStudentLogin();
  }
});

// ============================
// STUDENT LOGIN
// ============================
function openStudentLoginModal() {
  document.getElementById('studentLoginModal').style.display = 'flex';
  document.getElementById('studentLoginError').style.display = 'none';
}
function closeStudentLoginModal() {
  document.getElementById('studentLoginModal').style.display = 'none';
}
function doStudentLogin() {
  const u = document.getElementById('studentLoginUser').value.trim().toLowerCase();
  const p = document.getElementById('studentLoginPass').value.trim();
  const student = studentDB[u];
  if (student && student.password === p) {
    closeStudentLoginModal();
    currentStudent = { ...student, username: u };
    renderStudentDashboard();
    goTo('student-dashboard');
  } else {
    document.getElementById('studentLoginError').style.display = 'block';
  }
}

// ============================
// STUDENT DASHBOARD
// ============================
let sdLineChartObj = null, sdPieChartObj = null;

function renderStudentDashboard() {
  if (!currentStudent) return;
  const s = currentStudent;

  // Update header
  document.getElementById('studentNavName').textContent = `👤 Halo, ${s.name}!`;
  document.getElementById('studentDashAvatar').textContent = s.avatar;
  document.getElementById('studentDashName').textContent = s.name;

  // KPIs
  document.getElementById('sdStatGames').textContent = s.stats.games;
  document.getElementById('sdStatWins').textContent = s.stats.wins;
  document.getElementById('sdStatBest').textContent = s.stats.bestScore;
  document.getElementById('sdStatAcc').textContent = s.stats.avgAcc + '%';

  // Progress bars
  document.getElementById('sdMathPct').textContent = s.stats.mathAcc + '%';
  document.getElementById('sdIpaPct').textContent  = s.stats.ipaAcc  + '%';
  document.getElementById('sdPpknPct').textContent = s.stats.ppknAcc + '%';
  setTimeout(() => {
    document.getElementById('sdMathBar').style.width = s.stats.mathAcc + '%';
    document.getElementById('sdIpaBar').style.width  = s.stats.ipaAcc  + '%';
    document.getElementById('sdPpknBar').style.width = s.stats.ppknAcc + '%';
  }, 300);

  // Game history table
  const tbody = document.getElementById('studentHistoryBody');
  const resultClass = { Menang: 'tag-easy', Seri: 'tag-med', Kalah: 'tag-hard' };
  tbody.innerHTML = s.history.map((h, i) => `
    <tr>
      <td>${i + 1}</td>
      <td>${h.date}</td>
      <td>${h.materi}</td>
      <td>${h.level}</td>
      <td>${h.vs}</td>
      <td>${h.correct}/${h.total}</td>
      <td><span class="tag-pill ${h.score >= 120 ? 'tag-hard' : h.score >= 90 ? 'tag-med' : 'tag-easy'}">${h.score} pts</span></td>
      <td><span class="tag-pill ${resultClass[h.result] || 'tag-med'}">${h.result}</span></td>
    </tr>
  `).join('');

  // Charts
  initStudentCharts(s);
}

function initStudentCharts(s) {
  // Destroy old charts if exist
  if (sdLineChartObj) { sdLineChartObj.destroy(); sdLineChartObj = null; }
  if (sdPieChartObj)  { sdPieChartObj.destroy();  sdPieChartObj  = null; }

  const lineCtx = document.getElementById('sdLineChart');
  if (lineCtx) {
    const labels = s.history.map((_, i) => `Sesi ${i + 1}`);
    sdLineChartObj = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels,
        datasets: [{
          label: 'Skor',
          data: s.scoreHistory,
          borderColor: '#6C5CE7',
          backgroundColor: 'rgba(108,92,231,0.12)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#6C5CE7',
          pointRadius: 5,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(108,92,231,0.07)' }, ticks: { font: { family: 'Quicksand', weight: 600 } } },
          x: { grid: { display: false }, ticks: { font: { family: 'Quicksand', weight: 600 } } }
        },
        animation: { duration: 700 }
      }
    });
  }

  const pieCtx = document.getElementById('sdPieChart');
  if (pieCtx) {
    sdPieChartObj = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Matematika', 'IPA', 'PPKn'],
        datasets: [{
          data: [s.stats.mathAcc, s.stats.ipaAcc, s.stats.ppknAcc],
          backgroundColor: ['#6C5CE7', '#4ECDC4', '#FFD93D'],
          hoverOffset: 8,
        }]
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { font: { family: 'Quicksand', weight: 600 }, padding: 12 } } },
        animation: { duration: 700 }
      }
    });
  }
}

// ============================
// MASCOT INTERACTION
// ============================
const mascotEmojis = ['🦉', '🦊', '🐼', '🦁', '🐯', '🐸', '🦄', '🐉'];
let mascotIdx = 0;
document.addEventListener('DOMContentLoaded', () => {
  const mascot = document.getElementById('mascot');
  if (mascot) {
    mascot.addEventListener('click', () => {
      mascotIdx = (mascotIdx + 1) % mascotEmojis.length;
      mascot.textContent = mascotEmojis[mascotIdx];
      playSound('click');
    });
    // Cursor follow effect
    document.addEventListener('mousemove', e => {
      const rect = mascot.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / window.innerWidth * 12;
      const dy = (e.clientY - cy) / window.innerHeight * 8;
      mascot.style.transform = `translateX(${dx}px) translateY(${dy - 8}px)`;
    });
  }
});

// ============================
// SETUP PAGE
// ============================
function selectMode(el) {
  document.querySelectorAll('.mode-option').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
  gameState.mode = el.dataset.mode;

  const team2Input = document.getElementById('team2Name');
  if (gameState.mode === 'ai') {
    team2Input.value = 'Komputer (AI)';
    team2Input.readOnly = true;
  } else {
    if (team2Input.value === 'Komputer (AI)') team2Input.value = 'Kelompok Elang';
    team2Input.readOnly = false;
  }
}

function selectAvatar(el) {
  document.querySelectorAll('.avatar-pair').forEach(x => x.classList.remove('selected'));
  el.classList.add('selected');
  gameState.avatarA = el.dataset.a;
  gameState.avatarB = el.dataset.b;
}

function updateDifficultyPreview() {
  const level = document.getElementById('selectLevel').value;
  const preview = document.getElementById('difficultyPreview');
  const configs = {
    mudah: { cls: 'diff-mudah', text: '😊 Mudah — Waktu 60 detik per soal' },
    sedang: { cls: 'diff-sedang', text: '🤔 Sedang — Waktu 45 detik per soal' },
    menantang: { cls: 'diff-menantang', text: '🔥 Menantang — Waktu 30 detik per soal' },
  };
  const c = configs[level];
  preview.innerHTML = `<span class="diff-badge ${c.cls}">${c.text}</span>`;
}

function getTimerDuration() {
  const levels = { mudah: 60, sedang: 45, menantang: 30 };
  return levels[gameState.level] || 45;
}

function startGame() {
  // Gather settings
  gameState.team1Name = document.getElementById('team1Name').value.trim() || 'Tim 1';
  gameState.team2Name = document.getElementById('team2Name').value.trim() || 'Tim 2';
  gameState.materi = document.getElementById('selectMateri').value;
  gameState.level = document.getElementById('selectLevel').value;

  // Get selected avatar
  const sel = document.querySelector('.avatar-pair.selected');
  if (sel) {
    gameState.avatarA = sel.dataset.a;
    gameState.avatarB = sel.dataset.b;
  }

  // Get selected mode
  const modeSel = document.querySelector('.mode-option.selected');
  if (modeSel) gameState.mode = modeSel.dataset.mode;

  // Reset game state
  gameState.board = Array(9).fill(null);
  gameState.scores = { A: 0, B: 0 };
  gameState.currentPlayer = 'A';
  gameState.totalAnswered = 0;
  gameState.totalCorrect = 0;
  gameState.pendingCell = null;
  gameState.isGameOver = false;
  gameState.startTime = Date.now();

  // Update UI
  updateArenaUI();
  renderBoard();
  goTo('arena');
}

// ============================
// ARENA UI
// ============================
function updateArenaUI() {
  const isA = gameState.currentPlayer === 'A';
  const avatar = isA ? gameState.avatarA : gameState.avatarB;
  const name = isA ? gameState.team1Name : gameState.team2Name;
  const teamColor = isA ? 'var(--team-a)' : 'var(--team-b)';

  document.getElementById('turnAvatar').textContent = avatar;
  document.getElementById('turnAvatar').style.borderColor = teamColor;
  document.getElementById('turnAvatar').style.background = isA ? 'rgba(255,138,101,0.15)' : 'rgba(92,157,245,0.15)';
  document.getElementById('turnName').textContent = name;

  document.getElementById('scoreAvatarA').textContent = gameState.avatarA;
  document.getElementById('scoreAvatarB').textContent = gameState.avatarB;
  document.getElementById('scoreNameA').textContent = gameState.team1Name.replace('Kelompok ', '');
  document.getElementById('scoreNameB').textContent = gameState.team2Name.replace('Kelompok ', '').replace('Komputer ', 'AI');
  document.getElementById('scorePtsA').textContent = gameState.scores.A;
  document.getElementById('scorePtsB').textContent = gameState.scores.B;

  document.getElementById('legendA').textContent = `Tim ${gameState.avatarA} ${gameState.team1Name}`;
  document.getElementById('legendB').textContent = `Tim ${gameState.avatarB} ${gameState.team2Name}`;

  const materiLabels = { matematika: '📐 Matematika', ipa: '🔬 IPA', ppkn: '🏛️ PPKn' };
  const levelLabels = { mudah: 'Mudah', sedang: 'Sedang', menantang: 'Menantang' };
  const label = `${materiLabels[gameState.materi]} · ${levelLabels[gameState.level]}`;
  document.getElementById('categoryLabel').textContent = label;

  // Score animation
  ['A','B'].forEach(t => {
    const el = document.getElementById('scorePts' + t);
    el.style.transform = 'scale(1.3)';
    setTimeout(() => el.style.transform = '', 200);
  });
}

// ============================
// BOARD RENDERING
// ============================
function renderBoard() {
  const board = document.getElementById('gameBoard');
  board.innerHTML = '';
  gameState.board.forEach((val, i) => {
    const cell = document.createElement('div');
    cell.className = 'cell';
    cell.dataset.index = i;

    if (val === 'A') {
      cell.classList.add('filled-a');
      cell.textContent = gameState.avatarA;
    } else if (val === 'B') {
      cell.classList.add('filled-b');
      cell.textContent = gameState.avatarB;
    } else if (val === 'locked-A' || val === 'locked-B') {
      cell.classList.add('locked');
    } else {
      // Empty — clickable
      cell.addEventListener('click', () => onCellClick(i));
    }

    board.appendChild(cell);
  });
}

function onCellClick(idx) {
  if (gameState.isGameOver) return;
  if (gameState.board[idx] !== null) return;
  if (gameState.mode === 'ai' && gameState.currentPlayer === 'B') return;

  gameState.pendingCell = idx;
  playSound('click');
  openQuiz();
}

// ============================
// QUIZ SYSTEM
// ============================
let timerInterval = null;
let timerSeconds = 45;
let currentQuestion = null;

function getFilteredQuestions() {
  const catMap = { matematika: 'Matematika', ipa: 'IPA', ppkn: 'PPKn' };
  const lvlMap = { mudah: 'Mudah', sedang: 'Sedang', menantang: 'Menantang' };
  const cat = catMap[gameState.materi];
  const lvl = lvlMap[gameState.level];
  let questions = questionDB.filter(q => q.cat === cat && q.level === lvl);
  if (questions.length === 0) questions = questionDB.filter(q => q.cat === cat);
  if (questions.length === 0) questions = questionDB;
  return questions;
}

function openQuiz() {
  const questions = getFilteredQuestions();
  currentQuestion = questions[Math.floor(Math.random() * questions.length)];

  // Set quiz meta
  const matIcons = { Matematika: '📐', IPA: '🔬', PPKn: '🏛️' };
  document.getElementById('quizMeta').textContent = `${matIcons[currentQuestion.cat] || '📚'} ${currentQuestion.cat} · ${currentQuestion.level}`;
  document.getElementById('quizQuestion').textContent = currentQuestion.q;

  // Render options
  const optContainer = document.getElementById('quizOptions');
  optContainer.innerHTML = '';
  const labels = ['A','B','C','D'];
  currentQuestion.opts.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'quiz-opt';
    div.innerHTML = `<div class="opt-badge">${labels[i]}</div><span>${opt}</span>`;
    div.addEventListener('click', () => onAnswerSelect(i));
    optContainer.appendChild(div);
  });

  // Show modal
  document.getElementById('quizModal').style.display = 'flex';

  // Start timer
  startTimer();

  // Auto TTS if sound is on
  if (gameState.soundOn) {
    setTimeout(() => speakQuestion(), 300);
  }
}

function startTimer() {
  clearInterval(timerInterval);
  timerSeconds = getTimerDuration();
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timerSeconds--;
    updateTimerDisplay();
    if (timerSeconds <= 0) {
      clearInterval(timerInterval);
      onTimerExpired();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const duration = getTimerDuration();
  const el = document.getElementById('timerText');
  const circle = document.getElementById('timerCircle');
  const circumference = 150.8;

  el.textContent = timerSeconds;
  el.classList.toggle('warn', timerSeconds <= 10);

  const offset = circumference * (1 - timerSeconds / duration);
  circle.style.strokeDashoffset = offset;
  circle.style.stroke = timerSeconds <= 10 ? 'var(--red)' : 'var(--purple)';
}

function onTimerExpired() {
  if (window.speechSynthesis) window.speechSynthesis.cancel();
  // Mark all opts as disabled
  document.querySelectorAll('.quiz-opt').forEach(o => o.classList.add('disabled'));
  // Show correct answer
  document.querySelectorAll('.quiz-opt')[currentQuestion.ans].classList.add('correct');
  gameState.totalAnswered++;
  setTimeout(() => {
    closeQuiz();
    onAnswerWrong();
  }, 1200);
}

function onAnswerSelect(idx) {
  clearInterval(timerInterval);
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  // Disable all opts
  document.querySelectorAll('.quiz-opt').forEach(o => o.classList.add('disabled'));
  gameState.totalAnswered++;

  if (idx === currentQuestion.ans) {
    document.querySelectorAll('.quiz-opt')[idx].classList.add('correct');
    gameState.totalCorrect++;
    setTimeout(() => {
      closeQuiz();
      onAnswerCorrect();
    }, 900);
  } else {
    document.querySelectorAll('.quiz-opt')[idx].classList.add('wrong');
    document.querySelectorAll('.quiz-opt')[currentQuestion.ans].classList.add('correct');
    setTimeout(() => {
      closeQuiz();
      onAnswerWrong();
    }, 1200);
  }
}

function closeQuiz() {
  document.getElementById('quizModal').style.display = 'none';
  clearInterval(timerInterval);
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}

function onAnswerCorrect() {
  const player = gameState.currentPlayer;
  const idx = gameState.pendingCell;
  gameState.board[idx] = player;
  gameState.scores[player] += 10;

  // Add log
  addLog(`✅ ${player === 'A' ? gameState.avatarA + ' ' + gameState.team1Name : gameState.avatarB + ' ' + gameState.team2Name} → Kotak ${idx+1} (+10 poin)`);

  playSound('correct');
  renderBoard();
  updateArenaUI();

  showFeedback(true);

  // Check win
  const winner = checkWinner();
  if (winner) {
    setTimeout(() => endGame(winner), 1500);
    return;
  }
  if (isBoardFull()) {
    setTimeout(() => endGame('draw'), 1500);
    return;
  }

  // Switch turn
  setTimeout(() => {
    switchTurn();
  }, 1200);
}

function onAnswerWrong() {
  const player = gameState.currentPlayer;
  const opponent = player === 'A' ? 'B' : 'A';
  const idx = gameState.pendingCell;

  // Lock the cell for the current player (opponent can try)
  gameState.board[idx] = 'locked-' + player;

  addLog(`❌ ${player === 'A' ? gameState.avatarA + ' ' + gameState.team1Name : gameState.avatarB + ' ' + gameState.team2Name} → Kotak ${idx+1} dikunci`);

  playSound('wrong');
  renderBoard();
  updateArenaUI();

  showFeedback(false);

  // Check if all cells locked or full
  if (isBoardFull()) {
    setTimeout(() => endGame('draw'), 1500);
    return;
  }

  setTimeout(() => {
    switchTurn();
  }, 1200);
}

function switchTurn() {
  gameState.currentPlayer = gameState.currentPlayer === 'A' ? 'B' : 'A';
  updateArenaUI();

  // AI turn
  if (gameState.mode === 'ai' && gameState.currentPlayer === 'B' && !gameState.isGameOver) {
    setTimeout(() => doAITurn(), 900);
  }
}

// ============================
// FEEDBACK
// ============================
function showFeedback(correct) {
  const overlay = document.getElementById('feedbackOverlay');
  const icon = document.getElementById('feedbackIcon');
  const title = document.getElementById('feedbackTitle');
  const msg = document.getElementById('feedbackMsg');
  const teamName = gameState.currentPlayer === 'A' ? gameState.team1Name : gameState.team2Name;

  if (correct) {
    icon.textContent = '✅';
    title.textContent = 'Jawaban Benar!';
    msg.textContent = `+10 poin untuk ${teamName}!`;
    title.style.color = 'var(--green)';
  } else {
    icon.textContent = '❌';
    title.textContent = 'Jawaban Salah!';
    msg.textContent = `Kotak dikunci, giliran lawan!`;
    title.style.color = 'var(--red)';
  }

  overlay.style.display = 'flex';
  setTimeout(() => overlay.style.display = 'none', 1200);
}

// ============================
// LOG
// ============================
function addLog(text) {
  const list = document.getElementById('moveLogList');
  const item = document.createElement('div');
  item.className = 'log-item';
  item.textContent = text;
  list.insertBefore(item, list.firstChild);
  if (list.children.length > 15) list.removeChild(list.lastChild);
}

// ============================
// WIN CHECK
// ============================
const WIN_LINES = [
  [0,1,2],[3,4,5],[6,7,8], // rows
  [0,3,6],[1,4,7],[2,5,8], // cols
  [0,4,8],[2,4,6]           // diags
];

function checkWinner() {
  for (const [a,b,c] of WIN_LINES) {
    if (gameState.board[a] && gameState.board[b] && gameState.board[c] &&
        gameState.board[a] === gameState.board[b] &&
        gameState.board[b] === gameState.board[c] &&
        !gameState.board[a].startsWith('locked')) {
      // Highlight winning cells
      highlightWinCells([a,b,c]);
      return gameState.board[a]; // 'A' or 'B'
    }
  }
  return null;
}

function highlightWinCells(indices) {
  const cells = document.getElementById('gameBoard').children;
  indices.forEach(i => cells[i].classList.add('win-cell'));
}

function isBoardFull() {
  return gameState.board.every(cell => cell !== null);
}

// ============================
// AI (MINIMAX)
// ============================
function doAITurn() {
  if (gameState.isGameOver) return;

  // Get available cells
  const available = gameState.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
  if (available.length === 0) return;

  let bestIdx = available[0];

  // Try Minimax if few empty cells remain, else random-ish
  if (available.length <= 7) {
    bestIdx = minimaxBestMove();
  } else {
    // Strategy: center > corner > edge
    const centers = [4];
    const corners = [0,2,6,8];
    const edges = [1,3,5,7];
    const pick = [...centers, ...corners, ...edges].find(i => available.includes(i));
    bestIdx = pick !== undefined ? pick : available[Math.floor(Math.random() * available.length)];
  }

  gameState.pendingCell = bestIdx;
  openQuiz();
}

function minimaxBestMove() {
  const available = gameState.board.map((v, i) => v === null ? i : null).filter(v => v !== null);
  let best = -Infinity, bestMove = available[0];
  available.forEach(i => {
    const boardCopy = [...gameState.board];
    boardCopy[i] = 'B';
    const score = minimax(boardCopy, 0, false);
    if (score > best) { best = score; bestMove = i; }
  });
  return bestMove;
}

function minimax(board, depth, isMaximizing) {
  // Check terminal states
  for (const [a,b,c] of WIN_LINES) {
    if (board[a] && board[b] && board[c] && board[a] === board[b] && board[b] === board[c] && !board[a].startsWith('locked')) {
      return board[a] === 'B' ? 10 - depth : depth - 10;
    }
  }
  if (board.every(v => v !== null)) return 0;
  if (depth > 5) return 0; // depth limit

  const available = board.map((v, i) => v === null ? i : null).filter(v => v !== null);

  if (isMaximizing) {
    let best = -Infinity;
    available.forEach(i => {
      const copy = [...board]; copy[i] = 'B';
      best = Math.max(best, minimax(copy, depth + 1, false));
    });
    return best;
  } else {
    let best = Infinity;
    available.forEach(i => {
      const copy = [...board]; copy[i] = 'A';
      best = Math.min(best, minimax(copy, depth + 1, true));
    });
    return best;
  }
}

// ============================
// GAME OVER
// ============================
function endGame(winner) {
  gameState.isGameOver = true;
  clearInterval(timerInterval);
  if (window.speechSynthesis) window.speechSynthesis.cancel();

  const duration = Math.floor((Date.now() - gameState.startTime) / 1000);
  const mins = Math.floor(duration / 60);
  const secs = duration % 60;

  let winnerName, overSub;
  if (winner === 'A') {
    gameState.scores.A += 50; // bonus
    winnerName = gameState.team1Name;
    overSub = `${gameState.avatarA} Berhasil menyusun garis kemenangan!`;
    playSound('win');
  } else if (winner === 'B') {
    gameState.scores.B += 50;
    winnerName = gameState.team2Name;
    overSub = `${gameState.avatarB} Berhasil menyusun garis kemenangan!`;
    playSound('win');
  } else {
    winnerName = 'SERI!';
    overSub = 'Semua kotak penuh — tidak ada pemenang kali ini!';
    document.getElementById('trophyAnim').textContent = '🤝';
    document.getElementById('overEyebrow').textContent = '🤝 SERI';
  }

  // Populate game over page
  document.getElementById('winnerName').textContent = winnerName;
  document.getElementById('overSub').textContent = overSub;
  document.getElementById('statPoinA').textContent = gameState.scores.A;
  document.getElementById('statPoinB').textContent = gameState.scores.B;
  document.getElementById('statLblA').textContent = `Poin ${gameState.team1Name}`;
  document.getElementById('statLblB').textContent = `Poin ${gameState.team2Name}`;
  document.getElementById('statCorrect').textContent = `${gameState.totalCorrect}/${gameState.totalAnswered}`;
  document.getElementById('statDuration').textContent = `${mins}:${String(secs).padStart(2,'0')}`;

  const accuracy = gameState.totalAnswered > 0 ? Math.round(gameState.totalCorrect / gameState.totalAnswered * 100) : 0;
  document.getElementById('accText').textContent = `${accuracy}% akurasi · bonus +50 poin (garis kemenangan)`;
  setTimeout(() => {
    document.getElementById('accBarFill').style.width = accuracy + '%';
  }, 300);

  goTo('over');
  startConfetti();
}

function restartGame() {
  stopConfetti();
  goTo('setup');
}

// ============================
// CONFETTI
// ============================
let confettiAnimId = null;
const CONFETTI_COLORS = ['#FF6B9D','#6C5CE7','#4ECDC4','#FFD93D','#FF8A65','#34C759'];

function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const ctx = canvas.getContext('2d');

  const pieces = Array.from({length: 60}, () => ({
    x: Math.random() * canvas.width,
    y: -10 - Math.random() * 100,
    w: 8 + Math.random() * 8,
    h: 6 + Math.random() * 6,
    color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
    speed: 2 + Math.random() * 3,
    angle: Math.random() * Math.PI * 2,
    spin: (Math.random() - 0.5) * 0.15,
    drift: (Math.random() - 0.5) * 1.5,
  }));

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      ctx.restore();
      p.y += p.speed;
      p.x += p.drift;
      p.angle += p.spin;
      if (p.y > canvas.height + 20) {
        p.y = -20; p.x = Math.random() * canvas.width;
      }
    });
    confettiAnimId = requestAnimationFrame(draw);
  }
  draw();
}

function stopConfetti() {
  if (confettiAnimId) { cancelAnimationFrame(confettiAnimId); confettiAnimId = null; }
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

// ============================
// TEXT-TO-SPEECH
// ============================
function speakQuestion() {
  if (!gameState.soundOn) return;
  if (!window.speechSynthesis) { showToast('Browser tidak mendukung TTS'); return; }

  const question = document.getElementById('quizQuestion').textContent;
  if (!question || question === 'Memuat soal...') return;

  window.speechSynthesis.cancel();

  const utt = new SpeechSynthesisUtterance(question);
  utt.lang = 'id-ID';
  utt.rate = 0.9;
  utt.pitch = 1.1;

  const ttsBtn = document.getElementById('ttsBtn');
  if (ttsBtn) ttsBtn.classList.add('speaking');
  utt.onend = () => { if (ttsBtn) ttsBtn.classList.remove('speaking'); };
  utt.onerror = () => { if (ttsBtn) ttsBtn.classList.remove('speaking'); };

  window.speechSynthesis.speak(utt);
}

// ============================
// QUIT GAME
// ============================
function confirmQuit() {
  document.getElementById('quitModal').style.display = 'flex';
}

// ============================
// DASHBOARD: PANEL SWITCHING
// ============================
function switchPanel(el, panelId) {
  document.querySelectorAll('.side-menu a').forEach(a => a.classList.remove('active'));
  el.classList.add('active');
  document.querySelectorAll('.dash-panel').forEach(p => p.classList.remove('active'));
  const panel = document.getElementById('panel-' + panelId);
  if (panel) panel.classList.add('active');
  if (panelId === 'questions') renderQuestionTable();
}

// ============================
// DASHBOARD: CHARTS
// ============================
let barChartObj = null, pieChartObj = null, lineChartObj = null;

function initCharts() {
  if (gameState.chartsInit) return;
  gameState.chartsInit = true;

  // Bar Chart
  const barCtx = document.getElementById('barChart');
  if (barCtx) {
    barChartObj = new Chart(barCtx, {
      type: 'bar',
      data: {
        labels: ['Pecahan','Fotosintesis','Pancasila','Geometri','Tata Surya'],
        datasets: [{
          label: 'Jawaban Salah',
          data: [42, 35, 28, 24, 18],
          backgroundColor: ['#FF6B9D','#6C5CE7','#4ECDC4','#FFD93D','#FF8A65'],
          borderRadius: 10,
          borderSkipped: false,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(108,92,231,0.07)' }, ticks: { font: { family: 'Quicksand', weight: 600 } } },
          x: { grid: { display: false }, ticks: { font: { family: 'Quicksand', weight: 600 } } }
        },
        animation: { duration: 800 }
      }
    });
  }

  // Pie Chart
  const pieCtx = document.getElementById('pieChart');
  if (pieCtx) {
    pieChartObj = new Chart(pieCtx, {
      type: 'doughnut',
      data: {
        labels: ['Matematika','IPA','PPKn'],
        datasets: [{ data: [98, 76, 40], backgroundColor: ['#6C5CE7','#4ECDC4','#FFD93D'], hoverOffset: 8 }]
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { font: { family: 'Quicksand', weight: 600 }, padding: 14 } } },
        animation: { duration: 800 }
      }
    });
  }

  // Line Chart
  const lineCtx = document.getElementById('lineChart');
  if (lineCtx) {
    lineChartObj = new Chart(lineCtx, {
      type: 'line',
      data: {
        labels: ['Sesi 1','Sesi 2','Sesi 3','Sesi 4','Sesi 5','Sesi 6'],
        datasets: [{
          label: 'Rata-rata Skor',
          data: [620, 680, 710, 740, 690, 760],
          borderColor: '#6C5CE7',
          backgroundColor: 'rgba(108,92,231,0.12)',
          tension: 0.4,
          fill: true,
          pointBackgroundColor: '#6C5CE7',
          pointRadius: 5,
        }]
      },
      options: {
        plugins: { legend: { display: false } },
        scales: {
          y: { grid: { color: 'rgba(108,92,231,0.07)' }, ticks: { font: { family: 'Quicksand', weight: 600 } } },
          x: { grid: { display: false }, ticks: { font: { family: 'Quicksand', weight: 600 } } }
        },
        animation: { duration: 800 }
      }
    });
  }

  // Teacher > Student Line Chart (Sandrina vs Septi)
  const stuLineCtx = document.getElementById('studentLineChart');
  if (stuLineCtx) {
    new Chart(stuLineCtx, {
      type: 'line',
      data: {
        labels: ['Sesi 1','Sesi 2','Sesi 3','Sesi 4','Sesi 5','Sesi 6','Sesi 7'],
        datasets: [
          {
            label: 'Tim Sandrina ⭐',
            data: [90, 80, 140, 80, 100, 130, 105],
            borderColor: '#6C5CE7',
            backgroundColor: 'rgba(108,92,231,0.10)',
            tension: 0.4, fill: true,
            pointBackgroundColor: '#6C5CE7', pointRadius: 5,
          },
          {
            label: 'Tim Septi 🌸',
            data: [90, 110, 135, 65, 100, 95, null],
            borderColor: '#FF6B9D',
            backgroundColor: 'rgba(255,107,157,0.10)',
            tension: 0.4, fill: true,
            pointBackgroundColor: '#FF6B9D', pointRadius: 5,
          },
        ]
      },
      options: {
        plugins: { legend: { position: 'bottom', labels: { font: { family: 'Quicksand', weight: 600 }, padding: 14 } } },
        scales: {
          y: { beginAtZero: true, grid: { color: 'rgba(108,92,231,0.07)' }, ticks: { font: { family: 'Quicksand', weight: 600 } } },
          x: { grid: { display: false }, ticks: { font: { family: 'Quicksand', weight: 600 } } }
        },
        animation: { duration: 800 }
      }
    });
  }
}

function updateBarChart(filter) {
  if (!barChartObj) return;
  const data = {
    all: { labels: ['Pecahan','Fotosintesis','Pancasila','Geometri','Tata Surya'], data: [42,35,28,24,18] },
    matematika: { labels: ['Pecahan','Geometri','Persamaan','Desimal','Persen'], data: [42,24,19,15,12] },
    ipa: { labels: ['Fotosintesis','Tata Surya','Ekosistem','Gaya','Energi'], data: [35,18,22,14,10] },
    ppkn: { labels: ['Pancasila','HAM','UUD 45','Pemilu','Demokrasi'], data: [28,20,16,11,9] },
  };
  const d = data[filter] || data.all;
  barChartObj.data.labels = d.labels;
  barChartObj.data.datasets[0].data = d.data;
  barChartObj.update();
}

// ============================
// DASHBOARD: QUESTION CRUD
// ============================
function renderQuestionTable() {
  const matFilter = document.getElementById('filterMateri')?.value || '';
  const lvlFilter = document.getElementById('filterLevel')?.value || '';
  const tbody = document.getElementById('questionTableBody');
  if (!tbody) return;

  let filtered = questionDB;
  if (matFilter) filtered = filtered.filter(q => q.cat === matFilter);
  if (lvlFilter) filtered = filtered.filter(q => q.level === lvlFilter);

  const lvlClass = { Mudah: 'tag-easy', Sedang: 'tag-med', Menantang: 'tag-hard' };
  tbody.innerHTML = filtered.map((q, i) => `
    <tr>
      <td>${i + 1}</td>
      <td style="max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${q.q}">${q.q}</td>
      <td>${q.cat}</td>
      <td><span class="tag-pill ${lvlClass[q.level] || 'tag-med'}">${q.level}</span></td>
      <td><div class="row-actions">
        <button onclick="editQuestion(${q.id})" title="Edit">✏️</button>
        <button class="del" onclick="deleteQuestion(${q.id})" title="Hapus">🗑️</button>
      </div></td>
    </tr>
  `).join('');

  // Update KPI
  const kpiEl = document.getElementById('kpiTotalSoal');
  if (kpiEl) kpiEl.textContent = questionDB.length;
}

function filterQuestions() {
  renderQuestionTable();
}

function openAddQuestionModal() {
  gameState.editingQuestionId = null;
  document.getElementById('aqModalTitle').textContent = '➕ Tambah Soal Baru';
  document.getElementById('aqQuestion').value = '';
  document.getElementById('aqA').value = '';
  document.getElementById('aqB').value = '';
  document.getElementById('aqC').value = '';
  document.getElementById('aqD').value = '';
  document.getElementById('aqAnswer').value = 'A';
  document.getElementById('aqCategory').value = 'Matematika';
  document.getElementById('aqDifficulty').value = 'Sedang';
  document.getElementById('addQuestionModal').style.display = 'flex';
}

function closeAddQuestionModal() {
  document.getElementById('addQuestionModal').style.display = 'none';
  gameState.editingQuestionId = null;
}

function saveQuestion() {
  const q = document.getElementById('aqQuestion').value.trim();
  const a = document.getElementById('aqA').value.trim();
  const b = document.getElementById('aqB').value.trim();
  const c = document.getElementById('aqC').value.trim();
  const d = document.getElementById('aqD').value.trim();
  const ans = ['A','B','C','D'].indexOf(document.getElementById('aqAnswer').value);
  const cat = document.getElementById('aqCategory').value;
  const lvl = document.getElementById('aqDifficulty').value;

  if (!q || !a || !b || !c || !d) { showToast('⚠️ Semua field harus diisi!'); return; }

  if (gameState.editingQuestionId) {
    const idx = questionDB.findIndex(x => x.id === gameState.editingQuestionId);
    if (idx !== -1) {
      questionDB[idx] = { id: gameState.editingQuestionId, q, opts: [a,b,c,d], ans, cat, level: lvl };
      showToast('✅ Soal berhasil diperbarui!');
    }
  } else {
    questionDB.push({ id: nextId++, q, opts: [a,b,c,d], ans, cat, level: lvl });
    showToast('✅ Soal berhasil ditambahkan!');
  }

  closeAddQuestionModal();
  renderQuestionTable();
}

function editQuestion(id) {
  const q = questionDB.find(x => x.id === id);
  if (!q) return;
  gameState.editingQuestionId = id;
  document.getElementById('aqModalTitle').textContent = '✏️ Edit Soal';
  document.getElementById('aqQuestion').value = q.q;
  document.getElementById('aqA').value = q.opts[0];
  document.getElementById('aqB').value = q.opts[1];
  document.getElementById('aqC').value = q.opts[2];
  document.getElementById('aqD').value = q.opts[3];
  document.getElementById('aqAnswer').value = ['A','B','C','D'][q.ans];
  document.getElementById('aqCategory').value = q.cat;
  document.getElementById('aqDifficulty').value = q.level;
  document.getElementById('addQuestionModal').style.display = 'flex';
}

function deleteQuestion(id) {
  if (!confirm('Yakin ingin menghapus soal ini?')) return;
  questionDB = questionDB.filter(q => q.id !== id);
  renderQuestionTable();
  showToast('🗑️ Soal berhasil dihapus!');
}

// ============================
// EXCEL UPLOAD (Simulated)
// ============================
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (file) processUpload(file);
}

function handleFileDrop(event) {
  event.preventDefault();
  document.getElementById('uploadZone').classList.remove('drag-active');
  const file = event.dataTransfer.files[0];
  if (file) processUpload(file);
}

function processUpload(file) {
  const preview = document.getElementById('uploadPreview');
  const status = document.getElementById('uploadStatus');
  const fill = document.getElementById('uploadProgressFill');
  const msg = document.getElementById('uploadMsg');

  preview.style.display = 'block';
  status.textContent = `📁 Memproses: ${file.name}`;
  fill.style.width = '0%';
  msg.textContent = 'Membaca file...';

  // Simulate progress
  let progress = 0;
  const interval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 100) {
      progress = 100;
      clearInterval(interval);
      fill.style.width = '100%';
      const fakeCount = Math.floor(Math.random() * 15) + 5;
      status.textContent = `✅ ${file.name}`;
      msg.textContent = `Berhasil! ${fakeCount} soal baru berhasil ditambahkan ke bank soal.`;
      showToast(`✅ ${fakeCount} soal berhasil diimpor!`);

      // Add dummy questions
      for (let i = 0; i < fakeCount; i++) {
        questionDB.push({
          id: nextId++,
          q: `[Import] Pertanyaan contoh nomor ${nextId - 20} dari file Excel`,
          opts: ['Opsi A', 'Opsi B', 'Opsi C', 'Opsi D'],
          ans: 0,
          cat: ['Matematika','IPA','PPKn'][Math.floor(Math.random() * 3)],
          level: ['Mudah','Sedang','Menantang'][Math.floor(Math.random() * 3)],
        });
      }
      renderQuestionTable();
    } else {
      fill.style.width = progress + '%';
      msg.textContent = `Memproses baris... ${Math.floor(progress)}%`;
    }
  }, 150);
}

// ============================
// DOWNLOAD TEMPLATE
// ============================
function downloadTemplate() {
  const csv = `Pertanyaan,Opsi A,Opsi B,Opsi C,Opsi D,Kunci Jawaban,Kategori,Kesulitan
Berapakah 5 + 3?,8,7,6,9,A,Matematika,Mudah
Apa warna langit?,Biru,Merah,Hijau,Kuning,A,IPA,Mudah
Pancasila terdiri dari berapa sila?,5,4,6,3,A,PPKn,Mudah`;

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'template_soal_edu_tictactoe.csv';
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 Template berhasil diunduh!');
}

// ============================
// EXPORT REPORT
// ============================
function exportReport() {
  // Legacy: keep for backwards compat
  printDashboardPDF();
}

// ============================
// PDF PRINT FUNCTIONS
// ============================
function printDashboardPDF() {
  // Ensure teacher dashboard is active for print
  const timestamp = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  const title = document.title;
  document.title = `Laporan Edu-TicTacToe — ${timestamp}`;
  window.print();
  document.title = title;
}

function printStudentPDF() {
  if (!currentStudent) { showToast('Silakan login siswa terlebih dahulu!'); return; }
  const timestamp = new Date().toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' });
  const title = document.title;
  document.title = `Riwayat ${currentStudent.name} \u2014 ${timestamp}`;
  window.print();
  document.title = title;
}

// ============================
// MISC HELPERS
// ============================
function filterStudentTable(val) {
  // Simple filter by status column
  const rows = document.querySelectorAll('#studentTable tbody tr');
  rows.forEach(row => {
    const status = row.querySelector('td:last-child')?.textContent?.trim() || '';
    if (val === 'all') row.style.display = '';
    else if (val === 'aktif') row.style.display = status.includes('Aktif') ? '' : 'none';
    else row.style.display = status.includes('Aktif') ? 'none' : '';
  });
}

// ============================
// INIT
// ============================
document.addEventListener('DOMContentLoaded', () => {
  // Close modals on overlay click
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.style.display = 'none';
      }
    });
  });

  // Init sound button state
  document.getElementById('soundToggle').textContent = '🔊';

  // Update KPI
  const kpi = document.getElementById('kpiTotalSoal');
  if (kpi) kpi.textContent = questionDB.length;

  console.log('🎲 Edu-TicTacToe initialized! UAD 2026');
});

// Click Speed Tester - Guided TODOs
// You'll implement: timers, state, DOM updates, and localStorage.

// === Config ===
const TEST_WINDOW_MS = 5000; // 5 seconds

// === DOM elements ===
const elTime = document.getElementById('time');
const elClicks = document.getElementById('clicks');
const elCps = document.getElementById('cps');
const elBest = document.getElementById('best');

const btnStart = document.getElementById('start');
const btnClick = document.getElementById('click');
const btnReset = document.getElementById('reset');

// === State ===
let clicks = 0;
let startAt = null; // number (ms since epoch) or null
let tickId = null; // interval id
let endAt = null; // end time in ms

// Load best CPS from localStorage
const BEST_KEY = 'cps_best';
let best = Number(localStorage.getItem(BEST_KEY) || '0');
renderBest(best);

// Wire up events
btnStart.addEventListener('click', onStart);
btnClick.addEventListener('click', onUserClick);
btnReset.addEventListener('click', onReset);

// Also allow Space to click during a run
window.addEventListener('keydown', (e) => {
  if (e.code === 'Space' && !btnClick.disabled) {
    e.preventDefault();
    onUserClick();
  }
});

// === Handlers ===
function onStart() {
  if (tickId !== null) return; // already running

  clicks = 0;
  startAt = Date.now();
  endAt = startAt + TEST_WINDOW_MS;

  renderClicks(clicks);
  renderCps(0);

  // enable click, disable start
  btnClick.disabled = false;
  btnStart.disabled = true;

  tickId = setInterval(() => {
    const now = Date.now();
    const remaining = endAt - now;

    renderTime(remaining);

    if (remaining <= 0) {
      finish();
      return;
    }

    const elapsedSec = (now - startAt) / 1000;
    if (elapsedSec > 0) renderCps(clicks / elapsedSec);
  }, 33);
}

function onUserClick() {
  if (tickId === null) return; // not running
  clicks += 1;
  renderClicks(clicks);
  // tiny feedback
  btnClick.style.transform = 'translateY(1px)';
  setTimeout(() => (btnClick.style.transform = ''), 40);
}

function finish() {
  stopInterval();
  btnClick.disabled = true;
  btnStart.disabled = false;

  renderTime(0);

  const finalCps = clicks / (TEST_WINDOW_MS / 1000);
  renderCps(finalCps);

  if (finalCps > best) {
    best = finalCps;
    localStorage.setItem(BEST_KEY, String(best));
    renderBest(best);
  }
}

function onReset() {
  // Resets everything back to initial state (but keep best)
  // - If running, stop first
  stopInterval();
  clicks = 0;
  startAt = null;
  endAt = null;
  btnClick.disabled = true;
  btnStart.disabled = false;
  renderClicks(0);
  renderTime(TEST_WINDOW_MS);
  renderCps(0);
  // keep best
}

// === Helpers ===
function stopInterval() {
  if (tickId !== null) {
    clearInterval(tickId);
    tickId = null;
  }
}

function renderTime(msRemaining) {
  const s = Math.max(msRemaining, 0) / 1000;
  elTime.textContent = s.toFixed(2) + 's';
  // Bonus: show remaining time in tab title while running
  if (tickId !== null) {
    document.title = `${s.toFixed(2)}s • Click Speed Tester`;
  } else {
    document.title = 'Click Speed Tester';
  }
}

function renderClicks(n) {
  elClicks.textContent = String(n);
}

function renderCps(n) {
  elCps.textContent = n.toFixed(2);
}

function renderBest(n) {
  elBest.textContent = n.toFixed(2);
}

// Initialize UI
renderTime(TEST_WINDOW_MS);
renderClicks(0);
renderCps(0);
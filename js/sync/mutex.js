// ─── MUTEX — MUTUAL EXCLUSION ────────────────────────────
let mutexLocked  = false;
let mutexOwner   = null;
let mutexWaiting = [];

function initMutex() {
  const c = document.getElementById('mutex-content');
  c.innerHTML = `
    <div class="two-col">
      <div class="card">
        <div class="card-title">// Mutex State</div>
        <div style="text-align:center;padding:10px 0;">
          <div id="mutex-lock-icon" style="font-size:48px;transition:all .3s;">🔓</div>
          <div id="mutex-status" style="margin-top:8px;font-size:12px;color:var(--green);letter-spacing:2px;">UNLOCKED</div>
          <div id="mutex-owner"  style="font-size:10px;color:var(--muted);margin-top:4px;"></div>
        </div>
        <div style="margin-top:12px;">
          <div class="input-row" style="justify-content:center;">
            <input class="input wide" id="mutex-thread" value="Thread-1" placeholder="Thread name"/>
            <button class="btn btn-g" onclick="mutexLock()">🔒 Lock</button>
            <button class="btn btn-r" onclick="mutexUnlock()">🔓 Unlock</button>
          </div>
        </div>
      </div>
      <div class="card">
        <div class="card-title">// Waiting Queue</div>
        <div id="mutex-queue" style="min-height:60px;">
          <div style="color:var(--muted);font-size:10px;">No threads waiting.</div>
        </div>
        <div class="card-title" style="margin-top:12px;">// Critical Section</div>
        <div id="mutex-cs" style="background:var(--bg);border:1px solid var(--border);border-radius:3px;padding:10px;font-size:10px;color:var(--dim);height:60px;overflow-y:auto;"></div>
      </div>
    </div>
    <div class="card"><div class="card-title">// Log</div>${makeLog('mutex-log')}</div>`;
}

function mutexLock() {
  const t = document.getElementById('mutex-thread').value.trim() || 'Thread-X';
  if (!mutexLocked) {
    mutexLocked = true;
    mutexOwner  = t;
    document.getElementById('mutex-lock-icon').textContent   = '🔒';
    document.getElementById('mutex-status').textContent      = 'LOCKED';
    document.getElementById('mutex-status').style.color      = 'var(--red)';
    document.getElementById('mutex-owner').textContent       = `Owner: ${t}`;
    addLog('mutex-log', `${t} acquired mutex lock`, 'ok');
    _mutexUpdateCS(t, 'entered critical section');
  } else {
    mutexWaiting.push(t);
    addLog('mutex-log', `${t} blocked — mutex held by ${mutexOwner}`, 'warn');
    _mutexUpdateQueue();
  }
}

function mutexUnlock() {
  if (!mutexLocked) { addLog('mutex-log', 'No lock to release', 'err'); return; }
  const prev = mutexOwner;
  addLog('mutex-log', `${prev} released mutex lock`, 'info');

  if (mutexWaiting.length) {
    mutexOwner = mutexWaiting.shift();
    document.getElementById('mutex-owner').textContent = `Owner: ${mutexOwner}`;
    addLog('mutex-log', `${mutexOwner} acquired mutex lock (from queue)`, 'ok');
    _mutexUpdateCS(mutexOwner, 'entered critical section');
  } else {
    mutexLocked = false;
    mutexOwner  = null;
    document.getElementById('mutex-lock-icon').textContent = '🔓';
    document.getElementById('mutex-status').textContent    = 'UNLOCKED';
    document.getElementById('mutex-status').style.color   = 'var(--green)';
    document.getElementById('mutex-owner').textContent    = '';
  }
  _mutexUpdateQueue();
}

function _mutexUpdateQueue() {
  const el = document.getElementById('mutex-queue');
  if (!mutexWaiting.length) {
    el.innerHTML = '<div style="color:var(--muted);font-size:10px;">No threads waiting.</div>';
    return;
  }
  el.innerHTML = '<div class="thread-list">' +
    mutexWaiting.map(t => `<div class="thread-item waiting">⏳ ${t} — waiting</div>`).join('') +
    '</div>';
}

function _mutexUpdateCS(t, msg) {
  const el = document.getElementById('mutex-cs');
  el.innerHTML += `<div>› <span style="color:var(--cyan)">${t}</span> ${msg}</div>`;
  el.scrollTop = el.scrollHeight;
}

// ─── SEMAPHORE
let semVal      = 3;
let semMax      = 3;
let semWaiting2 = [];

function initSemaphore() {
  const c = document.getElementById('semaphore-content');
  c.innerHTML = `
    <div class="two-col">
      <div class="card">
        <div class="card-title">// Semaphore Counter</div>
        <div class="semaphore-counter" id="sem-counter">3</div>
        <div style="text-align:center;font-size:10px;color:var(--muted);">Available slots / <span id="sem-max">3</span> total</div>
        <div style="margin:12px 0;">
          <div class="input-row" style="justify-content:center;align-items:center;">
            <div class="input-group">
              <div class="input-label">Initial Value</div>
              <input class="input" id="sem-init" type="number" value="3" min="1" max="10"/>
            </div>
            <div class="input-group">
              <div class="input-label">&nbsp;</div>
              <button class="btn btn-b" onclick="semReset()">Reset</button>
            </div>
          </div>
        </div>
        <div class="input-row" style="justify-content:center;">
          <input class="input wide" id="sem-thread" value="Thread-1" placeholder="Thread name"/>
        </div>
        <div class="sem-btn-row">
          <button class="btn btn-r" onclick="semWait()">wait() — P()</button>
          <button class="btn btn-g" onclick="semSignal()">signal() — V()</button>
        </div>
      </div>
      <div class="card">
        <div class="card-title">// Resource Slots</div>
        <div id="sem-slots"></div>
        <div class="card-title" style="margin-top:12px;">// Blocked Threads</div>
        <div id="sem-blocked"><div style="color:var(--muted);font-size:10px;">None blocked.</div></div>
      </div>
    </div>
    <div class="card"><div class="card-title">// Log</div>${makeLog('semaphore-log')}</div>`;

  _renderSemSlots();
}

function semWait() {
  const t = document.getElementById('sem-thread').value.trim() || 'Thread-X';
  if (semVal > 0) {
    semVal--;
    addLog('semaphore-log', `${t} — wait() called → counter=${semVal}`, 'ok');
    _renderSemSlots();
  } else {
    semWaiting2.push(t);
    addLog('semaphore-log', `${t} — blocked (counter=0)`, 'warn');
    _renderSemBlocked();
  }
}

function semSignal() {
  const t = document.getElementById('sem-thread').value.trim() || 'Thread-X';
  if (semWaiting2.length) {
    const wt = semWaiting2.shift();
    addLog('semaphore-log', `${t} — signal() → ${wt} unblocked`, 'info');
    _renderSemBlocked();
  } else {
    semVal = Math.min(semMax, semVal + 1);
    addLog('semaphore-log', `${t} — signal() → counter=${semVal}`, 'ok');
    _renderSemSlots();
  }
}

function semReset() {
  semMax      = +(document.getElementById('sem-init').value) || 3;
  semVal      = semMax;
  semWaiting2 = [];
  document.getElementById('sem-max').textContent = semMax;
  _renderSemBlocked();
  _renderSemSlots();
  addLog('semaphore-log', `Semaphore reset to ${semMax}`, 'info');
}

function _renderSemSlots() {
  const el = document.getElementById('sem-slots');
  if (!el) return;
  let html = '<div style="display:flex;flex-wrap:wrap;gap:6px;">';
  for (let i = 0; i < semMax; i++) {
    const used = i >= semVal;
    html += `<div style="width:36px;height:36px;border-radius:3px;display:flex;align-items:center;justify-content:center;font-size:18px;
      border:1px solid ${used ? 'rgba(255,71,87,.4)' : 'rgba(0,255,136,.3)'};
      background:${used ? 'rgba(255,71,87,.1)' : 'rgba(0,255,136,.08)'};">${used ? '🔴' : '🟢'}</div>`;
  }
  html += '</div>';
  el.innerHTML = html;
  const counter = document.getElementById('sem-counter');
  counter.textContent  = semVal;
  counter.style.color  = semVal === 0 ? 'var(--red)' : semVal === semMax ? 'var(--green)' : 'var(--cyan)';
}

function _renderSemBlocked() {
  const el = document.getElementById('sem-blocked');
  if (!el) return;
  el.innerHTML = semWaiting2.length
    ? '<div class="thread-list">' + semWaiting2.map(x => `<div class="thread-item waiting">⏳ ${x}</div>`).join('') + '</div>'
    : '<div style="color:var(--muted);font-size:10px;">None blocked.</div>';
}

// ─── MONITOR — PRODUCER CONSUMER ─────────────────────────
let monBuf      = 0;
let monMax      = 5;
let monWaitProd = 0;
let monWaitCons = 0;

function initMonitor() {
  const c = document.getElementById('monitor-content');
  c.innerHTML = `
    <div class="card">
      <div class="card-title">// Producer-Consumer Monitor Simulation</div>
      <div class="two-col">
        <div>
          <div class="resource-box" style="margin-bottom:10px;">
            <div class="resource-title">MONITOR STATE</div>
            <div style="font-size:11px;color:var(--dim);">
              <div class="info-row"><span class="info-key">Buffer:</span>   <span id="mon-buf"      class="info-val">0 / 5</span></div>
              <div class="info-row"><span class="info-key">notFull:</span>  <span id="mon-notfull"  class="info-val" style="color:var(--green)">signalable</span></div>
              <div class="info-row"><span class="info-key">notEmpty:</span> <span id="mon-notempty" class="info-val" style="color:var(--red)">waiting</span></div>
            </div>
          </div>
          <div class="resource-box">
            <div class="resource-title">BUFFER VISUALIZATION</div>
            <div id="mon-buffer-vis" style="display:flex;gap:4px;flex-wrap:wrap;margin-top:4px;"></div>
          </div>
        </div>
        <div>
          <div class="resource-box">
            <div class="resource-title">ACTIONS</div>
            <div style="display:flex;flex-direction:column;gap:8px;">
              <button class="btn btn-g" style="width:100%" onclick="monitorProduce()">▲ Producer: produce()</button>
              <button class="btn btn-b" style="width:100%" onclick="monitorConsume()">▼ Consumer: consume()</button>
              <button class="btn btn-a" style="width:100%" onclick="monitorReset()">↺ Reset</button>
            </div>
          </div>
          <div class="resource-box" style="margin-top:10px;">
            <div class="resource-title">WAITING THREADS</div>
            <div id="mon-waiting"><div style="color:var(--muted);font-size:10px;">None waiting.</div></div>
          </div>
        </div>
      </div>
    </div>
    <div class="card"><div class="card-title">// Log</div>${makeLog('monitor-log')}</div>`;

  _renderMonBuffer();
}

function monitorProduce() {
  if (monBuf >= monMax) {
    monWaitProd++;
    addLog('monitor-log', 'Producer: buffer full → wait on notFull condition', 'warn');
    _renderMonWaiting();
    return;
  }
  monBuf++;
  addLog('monitor-log', `Producer: produced item → buffer=${monBuf}/${monMax}`, 'ok');
  if (monWaitCons > 0) {
    monWaitCons--;
    addLog('monitor-log', 'Producer: signaled notEmpty → Consumer unblocked', 'info');
    _renderMonWaiting();
  }
  _renderMonBuffer();
}

function monitorConsume() {
  if (monBuf <= 0) {
    monWaitCons++;
    addLog('monitor-log', 'Consumer: buffer empty → wait on notEmpty condition', 'warn');
    _renderMonWaiting();
    return;
  }
  monBuf--;
  addLog('monitor-log', `Consumer: consumed item → buffer=${monBuf}/${monMax}`, 'info');
  if (monWaitProd > 0) {
    monWaitProd--;
    addLog('monitor-log', 'Consumer: signaled notFull → Producer unblocked', 'ok');
    _renderMonWaiting();
  }
  _renderMonBuffer();
}

function monitorReset() {
  monBuf = 0; monWaitProd = 0; monWaitCons = 0;
  _renderMonBuffer();
  _renderMonWaiting();
  addLog('monitor-log', 'Monitor reset', 'info');
}

function _renderMonBuffer() {
  const vis = document.getElementById('mon-buffer-vis');
  if (!vis) return;
  let html = '';
  for (let i = 0; i < monMax; i++) {
    const filled = i < monBuf;
    html += `<div style="width:28px;height:28px;border-radius:2px;
      border:1px solid ${filled ? 'rgba(0,255,136,.4)' : 'var(--border)'};
      background:${filled ? 'rgba(0,255,136,.15)' : 'transparent'};
      display:flex;align-items:center;justify-content:center;font-size:12px;">${filled ? '📦' : ''}</div>`;
  }
  vis.innerHTML = html;
  document.getElementById('mon-buf').textContent      = `${monBuf} / ${monMax}`;
  document.getElementById('mon-notfull').textContent  = monBuf < monMax ? 'signalable' : 'waiting';
  document.getElementById('mon-notfull').style.color  = monBuf < monMax ? 'var(--green)' : 'var(--amber)';
  document.getElementById('mon-notempty').textContent = monBuf > 0 ? 'signalable' : 'waiting';
  document.getElementById('mon-notempty').style.color = monBuf > 0 ? 'var(--green)' : 'var(--red)';
}

function _renderMonWaiting() {
  const el = document.getElementById('mon-waiting');
  const items = [];
  for (let i = 0; i < monWaitProd; i++) items.push(`<div class="thread-item waiting">⏳ Producer-${i+1} waiting (buffer full)</div>`);
  for (let i = 0; i < monWaitCons; i++) items.push(`<div class="thread-item waiting">⏳ Consumer-${i+1} waiting (buffer empty)</div>`);
  el.innerHTML = items.length
    ? `<div class="thread-list">${items.join('')}</div>`
    : '<div style="color:var(--muted);font-size:10px;">None waiting.</div>';
}

// ─── PROCESS COLORS ───────────────────────────────────────
const COLORS = [
  { bg: 'rgba(0,255,136,.18)',   fg: '#00ff88', b: 'rgba(0,255,136,.4)' },
  { bg: 'rgba(59,158,255,.18)',  fg: '#3b9eff', b: 'rgba(59,158,255,.4)' },
  { bg: 'rgba(245,158,11,.18)',  fg: '#f59e0b', b: 'rgba(245,158,11,.4)' },
  { bg: 'rgba(139,92,246,.18)',  fg: '#8b5cf6', b: 'rgba(139,92,246,.4)' },
  { bg: 'rgba(6,214,214,.18)',   fg: '#06d6d6', b: 'rgba(6,214,214,.4)' },
  { bg: 'rgba(255,71,87,.18)',   fg: '#ff4757', b: 'rgba(255,71,87,.4)' },
];

// ─── THEME TOGGLE ─────────────────────────────────────────
function toggleTheme() {
  const btn = document.getElementById('theme-btn');
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    document.documentElement.removeAttribute('data-theme');
    btn.textContent = '☀ Light';
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
    btn.textContent = '☾ Dark';
  }
}

// ─── NAVIGATION ───────────────────────────────────────────
const inited = {};

function showPage(id, el) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById('page-' + id).classList.add('active');
  if (el) el.classList.add('active');

  const inits = {
    fcfs:      () => initFCFS(),
    sjf:       () => initSJF(),
    rr:        () => initRR(),
    priority:  () => initPriority(),
    mutex:     () => initMutex(),
    semaphore: () => initSemaphore(),
    monitor:   () => initMonitor(),
    pcb:       () => initPCB(),
    queue:     () => initQueue(),
  };
  if (inits[id] && !inited[id]) { inits[id](); inited[id] = true; }
}

// ─── LOG ──────────────────────────────────────────────────
function makeLog(id) {
  return `<div class="log" id="${id}"></div>`;
}

function addLog(id, msg, type = 'ok') {
  const el = document.getElementById(id);
  if (!el) return;
  const ts = new Date().toLocaleTimeString('en', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const div = document.createElement('div');
  div.className = `log-entry ${type}`;
  div.innerHTML = `<span class="ts">[${ts}]</span><span class="msg">${msg}</span>`;
  el.prepend(div);
}

// ─── GANTT RENDERER ───────────────────────────────────────
function renderGantt(containerId, blocks) {
  const wrap = document.getElementById(containerId + '-gantt');
  if (!blocks.length) return;
  const total = blocks[blocks.length - 1].end;
  const W = Math.max(30, Math.min(60, Math.floor(700 / total)));
  let html = '<div class="gantt">';
  blocks.forEach(b => {
    const c = b.pid === 'IDLE'
      ? { bg: 'rgba(255,255,255,.04)', fg: 'var(--muted)', b: 'var(--border)' }
      : COLORS[b.ci % COLORS.length];
    const w = (b.end - b.start) * W;
    html += `<div class="gantt-block" style="width:${w}px;background:${c.bg};color:${c.fg};border:1px solid ${c.b};">${b.pid}</div>`;
  });
  html += '</div><div class="gantt-ticks">';
  blocks.forEach(b => {
    const w = (b.end - b.start) * W;
    html += `<div class="gantt-tick" style="width:${w}px;">${b.start}</div>`;
  });
  html += `<div class="gantt-tick">${blocks[blocks.length - 1].end}</div></div>`;
  wrap.innerHTML = html;
}

// ─── METRICS RENDERER ─────────────────────────────────────
function renderMetrics(containerId, wt, tat, n, totalTime) {
  const m = document.getElementById(containerId + '-metrics');
  const avgWT  = (wt / n).toFixed(2);
  const avgTAT = (tat / n).toFixed(2);
  const tp     = (n / totalTime).toFixed(3);
  m.innerHTML = `
    <div class="metric"><div class="metric-val">${avgWT}</div><div class="metric-label">Avg Wait (ms)</div></div>
    <div class="metric"><div class="metric-val">${avgTAT}</div><div class="metric-label">Avg TAT (ms)</div></div>
    <div class="metric"><div class="metric-val">${tp}</div><div class="metric-label">Throughput</div></div>
    <div class="metric"><div class="metric-val">${n}</div><div class="metric-label">Processes</div></div>`;
}

// ─── PROCESS TABLE RENDERER ───────────────────────────────
function renderProcTable(containerId, procs, cols) {
  const tbody = document.getElementById(containerId + '-tbody');
  if (!tbody) return;
  tbody.innerHTML = procs.map(p => {
    const c = COLORS[p.ci % COLORS.length];
    return `<tr>
      <td><span class="pid" style="color:${c.fg}">${p.pid}</span></td>
      <td>${p.arr ?? '—'}</td>
      <td>${p.burst}</td>
      ${cols.includes('pri') ? `<td>${p.pri ?? '—'}</td>` : ''}
      <td><button class="btn btn-r" style="padding:3px 8px;font-size:9px" onclick="removeProc('${containerId}','${p.pid}')">×</button></td>
    </tr>`;
  }).join('');
}

// ─── SCHEDULER UI BUILDER ─────────────────────────────────
function buildSchedulerUI(containerId, algoFn, extraInputs = '', extraHeader = '') {
  const c = document.getElementById(containerId);
  c.innerHTML = `
    <div class="card">
      <div class="card-title">// Add Process</div>
      <div class="input-row">
        <div class="input-group"><div class="input-label">PID</div><input class="input" id="${containerId}-pid" value="P1" placeholder="P1"/></div>
        <div class="input-group"><div class="input-label">Arrival</div><input class="input" id="${containerId}-arr" type="number" value="0" min="0"/></div>
        <div class="input-group"><div class="input-label">Burst</div><input class="input" id="${containerId}-burst" type="number" value="5" min="1"/></div>
        ${extraInputs}
        <div class="input-group"><div class="input-label">&nbsp;</div><button class="btn btn-g" onclick="${algoFn}_add()">+ Add</button></div>
        <div class="input-group"><div class="input-label">&nbsp;</div><button class="btn btn-r" onclick="${algoFn}_clear()">Clear</button></div>
        <div class="input-group"><div class="input-label">&nbsp;</div><button class="btn btn-solid" onclick="${algoFn}_run()">▶ Run</button></div>
      </div>
    </div>
    <div class="two-col">
      <div class="card">
        <div class="card-title">// Process List</div>
        <table class="process-table">
          <thead><tr><th>PID</th><th>Arrival</th><th>Burst</th>${extraHeader}<th></th></tr></thead>
          <tbody id="${containerId}-tbody"></tbody>
        </table>
      </div>
      <div class="card">
        <div class="card-title">// Metrics</div>
        <div class="metrics-grid" id="${containerId}-metrics">
          <div class="metric"><div class="metric-val">—</div><div class="metric-label">Avg Wait</div></div>
          <div class="metric"><div class="metric-val">—</div><div class="metric-label">Avg TAT</div></div>
          <div class="metric"><div class="metric-val">—</div><div class="metric-label">Throughput</div></div>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">// Gantt Chart</div>
      <div class="gantt-wrap" id="${containerId}-gantt">
        <div style="color:var(--muted);font-size:11px;">Add processes and click Run to generate Gantt chart.</div>
      </div>
    </div>
    <div class="card">
      <div class="card-title">// Execution Log</div>
      ${makeLog(containerId + '-log')}
    </div>`;
}

// ─── REMOVE PROCESS (shared across schedulers) ────────────
function removeProc(containerId, pid) {
  if      (containerId.startsWith('fcfs'))     { fcfsProcs     = fcfsProcs.filter(p => p.pid !== pid);     renderProcTable('fcfs-content',     fcfsProcs,     ['arr','burst']); }
  else if (containerId.startsWith('sjf'))      { sjfProcs      = sjfProcs.filter(p => p.pid !== pid);      renderProcTable('sjf-content',      sjfProcs,      ['arr','burst']); }
  else if (containerId.startsWith('rr'))       { rrProcs       = rrProcs.filter(p => p.pid !== pid);       renderProcTable('rr-content',       rrProcs,       ['arr','burst']); }
  else if (containerId.startsWith('priority')) { priorityProcs = priorityProcs.filter(p => p.pid !== pid); renderProcTable('priority-content', priorityProcs, ['arr','burst','pri']); }
}

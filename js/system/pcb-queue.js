// ─── PCB VIEWER ───────────────────────────────────────────
const PCB_PROCESSES = [
  { pid:1001, name:'chrome',  state:'Running',    priority:10, pc:'0x7f8a', sp:'0x7fff', cpu:'85%', mem:'256MB', files:['stdin','stdout','socket'] },
  { pid:1002, name:'node',    state:'Waiting',    priority:15, pc:'0x4a2b', sp:'0x6fff', cpu:'12%', mem:'128MB', files:['server.js','log.txt'] },
  { pid:1003, name:'python3', state:'Ready',      priority:20, pc:'0x3c1d', sp:'0x5fff', cpu:'0%',  mem:'64MB',  files:['script.py'] },
  { pid:1004, name:'bash',    state:'Blocked',    priority:5,  pc:'0x2b4e', sp:'0x4fff', cpu:'0%',  mem:'8MB',   files:['stdin','stdout'] },
];

function initPCB() {
  const c = document.getElementById('pcb-content');
  const statMap = { Running:'running', Waiting:'waiting', Ready:'ready', Blocked:'blocked' };

  const cards = PCB_PROCESSES.map((p, i) => {
    const cl = COLORS[i % COLORS.length];
    return `<div class="card" style="cursor:pointer;border-color:${cl.b}" onclick="showPCBDetail(${i})">
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:10px;">
        <span class="pid" style="color:${cl.fg}">PID: ${p.pid}</span>
        <span class="badge ${statMap[p.state]}">${p.state}</span>
      </div>
      <div class="info-row"><span class="info-key">Name:</span>     <span class="info-val">${p.name}</span></div>
      <div class="info-row"><span class="info-key">Priority:</span> <span class="info-val">${p.priority}</span></div>
      <div class="info-row"><span class="info-key">CPU:</span>      <span class="info-val">${p.cpu}</span></div>
      <div class="info-row"><span class="info-key">Memory:</span>   <span class="info-val">${p.mem}</span></div>
    </div>`;
  }).join('');

  c.innerHTML = `<div class="overview-grid">${cards}</div><div id="pcb-detail" class="card" style="display:none;"></div>`;
}

function showPCBDetail(i) {
  const p  = PCB_PROCESSES[i];
  const cl = COLORS[i % COLORS.length];
  const statMap = { Running:'running', Waiting:'waiting', Ready:'ready', Blocked:'blocked' };
  const el = document.getElementById('pcb-detail');
  el.style.display = 'block';
  el.innerHTML = `
    <div class="card-title">// PCB Detail — <span style="color:${cl.fg}">PID ${p.pid} (${p.name})</span></div>
    <div class="two-col">
      <div>
        <div class="info-row"><span class="info-key">Process ID:</span>   <span class="info-val" style="color:${cl.fg}">${p.pid}</span></div>
        <div class="info-row"><span class="info-key">Process Name:</span> <span class="info-val">${p.name}</span></div>
        <div class="info-row"><span class="info-key">State:</span>        <span class="info-val"><span class="badge ${statMap[p.state]}">${p.state}</span></span></div>
        <div class="info-row"><span class="info-key">Priority:</span>     <span class="info-val">${p.priority}</span></div>
        <div class="info-row"><span class="info-key">CPU Usage:</span>    <span class="info-val">${p.cpu}</span></div>
        <div class="info-row"><span class="info-key">Memory:</span>       <span class="info-val">${p.mem}</span></div>
      </div>
      <div>
        <div class="info-row"><span class="info-key">Program Counter:</span> <span class="info-val" style="color:var(--cyan)">${p.pc}</span></div>
        <div class="info-row"><span class="info-key">Stack Pointer:</span>   <span class="info-val" style="color:var(--cyan)">${p.sp}</span></div>
        <div class="info-row"><span class="info-key">Open Files:</span>      <span class="info-val">${p.files.join(', ')}</span></div>
        <div class="info-row"><span class="info-key">Context Switch:</span>  <span class="info-val">Saved</span></div>
        <div class="info-row"><span class="info-key">Parent PID:</span>      <span class="info-val">1000 (init)</span></div>
        <div class="info-row"><span class="info-key">Child PIDs:</span>      <span class="info-val">—</span></div>
      </div>
    </div>`;
}

// ─── PROCESS QUEUE ────────────────────────────────────────
let queueData = {};

function initQueue() {
  const c = document.getElementById('queue-content');
  c.innerHTML = `
    <div class="two-col">
      <div>
        <div class="card">
          <div class="card-title" style="color:var(--green)">// Ready Queue</div>
          <div id="rq-list"></div>
          <div class="input-row" style="margin-top:10px;">
            <input class="input wide" id="rq-pid" value="P5" placeholder="PID"/>
            <button class="btn btn-g" onclick="queueAdd('ready')">+ Enqueue</button>
            <button class="btn btn-b" onclick="queueDequeue('ready')">Dequeue →</button>
          </div>
        </div>
        <div class="card">
          <div class="card-title" style="color:var(--amber)">// Waiting Queue</div>
          <div id="wq-list"></div>
          <div class="input-row" style="margin-top:10px;">
            <input class="input wide" id="wq-pid" value="P6" placeholder="PID"/>
            <button class="btn btn-a" onclick="queueAdd('waiting')">+ Enqueue</button>
            <button class="btn btn-b" onclick="queueDequeue('waiting')">Dequeue →</button>
          </div>
        </div>
      </div>
      <div>
        <div class="card">
          <div class="card-title" style="color:var(--blue)">// Job Queue (New → Ready)</div>
          <div id="jq-list"></div>
          <div class="input-row" style="margin-top:10px;">
            <input class="input wide" id="jq-pid" value="P7" placeholder="PID"/>
            <button class="btn btn-b" onclick="queueAdd('job')">+ Submit Job</button>
            <button class="btn btn-g" onclick="queueDequeue('job')">Admit →</button>
          </div>
        </div>
        <div class="card">
          <div class="card-title" style="color:var(--dim)">// Terminated</div>
          <div id="tq-list"><div style="color:var(--muted);font-size:10px;">No terminated processes.</div></div>
        </div>
      </div>
    </div>
    <div class="card"><div class="card-title">// Log</div>${makeLog('queue-log')}</div>`;

  queueData = { ready:['P1','P2','P3'], waiting:['P4'], job:['P8','P9'], terminated:[] };
  _renderQueues();
}

function queueAdd(type) {
  const ids = { ready:'rq-pid', waiting:'wq-pid', job:'jq-pid' };
  const el  = document.getElementById(ids[type]);
  const pid = el.value.trim();
  if (!pid) return;
  queueData[type].push(pid);
  _renderQueues();
  addLog('queue-log', `${pid} enqueued to ${type} queue`, 'ok');
  el.value = '';
}

function queueDequeue(type) {
  if (!queueData[type].length) { addLog('queue-log', `${type} queue is empty`, 'err'); return; }
  const pid = queueData[type].shift();
  if      (type === 'job')     { queueData.ready.push(pid); addLog('queue-log', `${pid} admitted: job → ready`, 'info'); }
  else if (type === 'ready')   { queueData.terminated.push(pid); addLog('queue-log', `${pid} dispatched to CPU`, 'ok'); }
  else if (type === 'waiting') { queueData.ready.push(pid); addLog('queue-log', `${pid} I/O complete: waiting → ready`, 'info'); }
  _renderQueues();
}

function _renderQueues() {
  const cols = { ready:'var(--green)', waiting:'var(--amber)', job:'var(--blue)' };
  ['ready','waiting','job'].forEach(type => {
    const el = document.getElementById(type[0] + 'q-list');
    if (!el) return;
    if (!queueData[type].length) { el.innerHTML = `<div style="color:var(--muted);font-size:10px;">Queue empty.</div>`; return; }
    el.innerHTML = `<div style="display:flex;gap:6px;flex-wrap:wrap;align-items:center;">` +
      queueData[type].map((pid, i) =>
        `<div style="padding:5px 10px;background:rgba(255,255,255,.04);border:1px solid ${cols[type]};border-radius:2px;font-size:10px;color:${cols[type]};">
          ${i === 0 && type === 'ready' ? '▶ ' : ''}${pid}
        </div>`
      ).join('<span style="color:var(--muted);font-size:10px;">→</span>') +
      `</div>`;
  });

  const tel = document.getElementById('tq-list');
  if (tel) {
    tel.innerHTML = queueData.terminated.length
      ? `<div style="display:flex;gap:6px;flex-wrap:wrap;">${queueData.terminated.map(p =>
          `<span style="font-size:10px;color:var(--muted);text-decoration:line-through;border:1px solid var(--border);padding:3px 8px;border-radius:2px;">${p}</span>`
        ).join('')}</div>`
      : '<div style="color:var(--muted);font-size:10px;">No terminated processes.</div>';
  }
}

// ─── PRIORITY SCHEDULING ─────────────────────────────────
let priorityProcs = [];

function initPriority() {
  const extraInputs = `
    <div class="input-group">
      <div class="input-label">Priority</div>
      <input class="input" id="priority-content-pri" type="number" value="1" min="1" style="width:70px"/>
    </div>`;
  buildSchedulerUI('priority-content', 'priority_', extraInputs, '<th>Priority</th>');
  priorityProcs = [];
  [
    { pid: 'P1', arr: 0, burst: 4, pri: 2 },
    { pid: 'P2', arr: 1, burst: 3, pri: 1 },
    { pid: 'P3', arr: 2, burst: 5, pri: 3 },
    { pid: 'P4', arr: 3, burst: 2, pri: 1 },
  ].forEach((p, i) => priorityProcs.push({ ...p, ci: i }));
  renderProcTable('priority-content', priorityProcs, ['arr', 'burst', 'pri']);
}

function priority__add() {
  const pid   = document.getElementById('priority-content-pid').value.trim() || `P${priorityProcs.length + 1}`;
  const arr   = +document.getElementById('priority-content-arr').value || 0;
  const burst = +document.getElementById('priority-content-burst').value || 1;
  const pri   = +document.getElementById('priority-content-pri').value || 1;
  priorityProcs.push({ pid, arr, burst, pri, ci: priorityProcs.length });
  renderProcTable('priority-content', priorityProcs, ['arr', 'burst', 'pri']);
  document.getElementById('priority-content-pid').value = `P${priorityProcs.length + 1}`;
}

function priority__clear() {
  priorityProcs = [];
  renderProcTable('priority-content', priorityProcs, ['arr', 'burst', 'pri']);
}

function priority__run() {
  if (!priorityProcs.length) return;
  let procs = priorityProcs.map(p => ({ ...p, done: false }));
  let time = 0, done = 0, blocks = [], wt = 0, tat = 0;
  const n = procs.length;

  while (done < n) {
    // Lower number = higher priority
    const avail = procs.filter(p => !p.done && p.arr <= time).sort((a, b) => a.pri - b.pri);
    if (!avail.length) { time++; continue; }
    const p = avail[0];
    const start = time, end = time + p.burst;
    blocks.push({ pid: p.pid, start, end, ci: p.ci });
    const w = start - p.arr, ta = end - p.arr;
    wt += w; tat += ta; time = end; p.done = true; done++;
    addLog('priority-content-log', `${p.pid}: Priority=${p.pri}  Wait=${w}  TAT=${ta}`, 'ok');
  }

  renderGantt('priority-content', blocks);
  renderMetrics('priority-content', wt, tat, n, time);
}

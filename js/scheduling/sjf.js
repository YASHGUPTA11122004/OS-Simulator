// ─── SJF — SHORTEST JOB FIRST ────────────────────────────
let sjfProcs = [];

function initSJF() {
  buildSchedulerUI('sjf-content', 'sjf', '', '');
  sjfProcs = [];
  [
    { pid: 'P1', arr: 0, burst: 7 },
    { pid: 'P2', arr: 2, burst: 3 },
    { pid: 'P3', arr: 4, burst: 1 },
    { pid: 'P4', arr: 6, burst: 4 },
  ].forEach((p, i) => sjfProcs.push({ ...p, ci: i }));
  renderProcTable('sjf-content', sjfProcs, ['arr', 'burst']);
}

function sjf_add() {
  const pid   = document.getElementById('sjf-content-pid').value.trim() || `P${sjfProcs.length + 1}`;
  const arr   = +document.getElementById('sjf-content-arr').value || 0;
  const burst = +document.getElementById('sjf-content-burst').value || 1;
  sjfProcs.push({ pid, arr, burst, ci: sjfProcs.length });
  renderProcTable('sjf-content', sjfProcs, ['arr', 'burst']);
  document.getElementById('sjf-content-pid').value = `P${sjfProcs.length + 1}`;
}

function sjf_clear() {
  sjfProcs = [];
  renderProcTable('sjf-content', sjfProcs, ['arr', 'burst']);
}

function sjf_run() {
  if (!sjfProcs.length) return;
  let procs = sjfProcs.map(p => ({ ...p, done: false }));
  let time = 0, done = 0, blocks = [], wt = 0, tat = 0;
  const n = procs.length;

  while (done < n) {
    const avail = procs.filter(p => !p.done && p.arr <= time).sort((a, b) => a.burst - b.burst);
    if (!avail.length) { time++; continue; }
    const p = avail[0];
    const start = time, end = time + p.burst;
    blocks.push({ pid: p.pid, start, end, ci: p.ci });
    const w = start - p.arr, ta = end - p.arr;
    wt += w; tat += ta; time = end; p.done = true; done++;
    addLog('sjf-content-log', `${p.pid}: Burst=${p.burst}  Wait=${w}  TAT=${ta}`, 'ok');
  }

  renderGantt('sjf-content', blocks);
  renderMetrics('sjf-content', wt, tat, n, time);
}

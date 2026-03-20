// ─── FCFS — FIRST COME FIRST SERVED ──────────────────────
let fcfsProcs = [];

function initFCFS() {
  buildSchedulerUI('fcfs-content', 'fcfs', '', '');
  fcfsProcs = [];
  // Sample processes
  [
    { pid: 'P1', arr: 0, burst: 6 },
    { pid: 'P2', arr: 2, burst: 4 },
    { pid: 'P3', arr: 4, burst: 3 },
    { pid: 'P4', arr: 6, burst: 5 },
  ].forEach((p, i) => fcfsProcs.push({ ...p, ci: i }));
  renderProcTable('fcfs-content', fcfsProcs, ['arr', 'burst']);
}

function fcfs_add() {
  const pid   = document.getElementById('fcfs-content-pid').value.trim() || `P${fcfsProcs.length + 1}`;
  const arr   = +document.getElementById('fcfs-content-arr').value || 0;
  const burst = +document.getElementById('fcfs-content-burst').value || 1;
  fcfsProcs.push({ pid, arr, burst, ci: fcfsProcs.length });
  renderProcTable('fcfs-content', fcfsProcs, ['arr', 'burst']);
  document.getElementById('fcfs-content-pid').value = `P${fcfsProcs.length + 1}`;
  document.getElementById('fcfs-content-arr').value = 0;
}

function fcfs_clear() {
  fcfsProcs = [];
  renderProcTable('fcfs-content', fcfsProcs, ['arr', 'burst']);
}

function fcfs_run() {
  if (!fcfsProcs.length) return;
  const procs = [...fcfsProcs].sort((a, b) => a.arr - b.arr);
  let time = 0, wt = 0, tat = 0, blocks = [];

  procs.forEach(p => {
    if (time < p.arr) {
      blocks.push({ pid: 'IDLE', start: time, end: p.arr, ci: 99 });
      time = p.arr;
    }
    const start = time, end = time + p.burst;
    blocks.push({ pid: p.pid, start, end, ci: p.ci });
    const w = start - p.arr, ta = end - p.arr;
    wt += w; tat += ta; time = end;
    addLog('fcfs-content-log', `${p.pid}: Arrival=${p.arr}  Burst=${p.burst}  Wait=${w}  TAT=${ta}`, 'ok');
  });

  renderGantt('fcfs-content', blocks);
  renderMetrics('fcfs-content', wt, tat, procs.length, time);
}

// ─── ROUND ROBIN ─────────────────────────────────────────
let rrProcs = [];
let rrQuantum = 2;

function initRR() {
  const extraInputs = `
    <div class="input-group">
      <div class="input-label">Quantum</div>
      <input class="input" id="rr-quantum" type="number" value="2" min="1" style="width:60px" onchange="rrQuantum=+this.value"/>
    </div>`;
  buildSchedulerUI('rr-content', 'rr', extraInputs, '');
  rrProcs = [];
  [
    { pid: 'P1', arr: 0, burst: 5 },
    { pid: 'P2', arr: 1, burst: 3 },
    { pid: 'P3', arr: 2, burst: 6 },
    { pid: 'P4', arr: 3, burst: 2 },
  ].forEach((p, i) => rrProcs.push({ ...p, ci: i }));
  renderProcTable('rr-content', rrProcs, ['arr', 'burst']);
}

function rr_add() {
  const pid   = document.getElementById('rr-content-pid').value.trim() || `P${rrProcs.length + 1}`;
  const arr   = +document.getElementById('rr-content-arr').value || 0;
  const burst = +document.getElementById('rr-content-burst').value || 1;
  rrProcs.push({ pid, arr, burst, ci: rrProcs.length });
  renderProcTable('rr-content', rrProcs, ['arr', 'burst']);
  document.getElementById('rr-content-pid').value = `P${rrProcs.length + 1}`;
}

function rr_clear() {
  rrProcs = [];
  renderProcTable('rr-content', rrProcs, ['arr', 'burst']);
}

function rr_run() {
  if (!rrProcs.length) return;
  const q = +(document.getElementById('rr-quantum')?.value || 2);
  let procs   = rrProcs.map(p => ({ ...p, rem: p.burst, finish: 0, wt: 0, tat: 0 }));
  let time    = 0, blocks = [], queue = [];
  const sorted  = [...procs].sort((a, b) => a.arr - b.arr);
  const arrived = new Set();

  sorted.filter(p => p.arr === 0).forEach(p => { queue.push(p); arrived.add(p.pid); });

  let safety = 0;
  while (queue.length > 0 && safety++ < 10000) {
    const p    = queue.shift();
    const exec = Math.min(p.rem, q);
    blocks.push({ pid: p.pid, start: time, end: time + exec, ci: p.ci });
    time    += exec;
    p.rem   -= exec;

    // Admit newly arrived processes
    sorted.filter(p2 => !arrived.has(p2.pid) && p2.arr <= time).forEach(p2 => {
      queue.push(p2); arrived.add(p2.pid);
    });

    if (p.rem > 0) {
      queue.push(p);
    } else {
      p.finish = time;
      p.tat    = time - p.arr;
      p.wt     = p.tat - p.burst;
    }
  }

  const wt  = procs.reduce((s, p) => s + p.wt, 0);
  const tat = procs.reduce((s, p) => s + p.tat, 0);
  procs.forEach(p => addLog('rr-content-log', `${p.pid}: Finish=${p.finish}  Wait=${p.wt}  TAT=${p.tat}`, 'ok'));

  renderGantt('rr-content', blocks);
  renderMetrics('rr-content', wt, tat, procs.length, time);
}

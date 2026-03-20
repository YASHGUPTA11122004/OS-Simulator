# 🗂️ TECHNICAL.md — OS Process Management Simulator

> Live URL: https://os-simulator-black.vercel.app
> GitHub: https://github.com/YASHGUPTA11122004/OS-Simulator

---

## 📁 Project Structure

```
OS-Simulator/
├── index.html                  ← Sirf HTML structure + imports (no logic here)
├── README.md                   ← Public-facing project description
├── TECHNICAL.md                ← Yeh file (AI context)
├── css/
│   ├── variables.css           ← Dark/Light theme CSS variables ONLY
│   ├── layout.css              ← Header, sidebar, main, footer, page structure
│   └── components.css          ← Buttons, tables, badges, gantt, metrics, log, sync UI
└── js/
    ├── utils.js                ← Navigation, shared helpers, ALL renderers
    ├── scheduling/
    │   ├── fcfs.js             ← FCFS algorithm + UI init
    │   ├── sjf.js              ← SJF algorithm + UI init
    │   ├── roundrobin.js       ← Round Robin algorithm + UI init
    │   └── priority.js         ← Priority algorithm + UI init
    ├── sync/
    │   ├── mutex.js            ← Mutex lock/unlock logic + UI
    │   ├── semaphore.js        ← Semaphore wait/signal logic + UI
    │   └── monitor.js          ← Monitor producer/consumer logic + UI
    └── system/
        └── pcb-queue.js        ← PCB Viewer + Process Queue logic + UI
```

---

## 🛠️ Tech Stack

| Item | Detail |
|------|--------|
| Language | Vanilla HTML + CSS + JavaScript (no frameworks) |
| Architecture | Multi-file modular (1 HTML + 3 CSS + 9 JS files) |
| Fonts | IBM Plex Mono + IBM Plex Sans (Google Fonts) |
| Hosting | Vercel (auto-deploy on GitHub push) |
| Repo | github.com/YASHGUPTA11122004/OS-Simulator |
| Live URL | os-simulator-black.vercel.app |

---

## 🎨 Theme System (Dark / Light)

### Kaise kaam karta hai:
1. `css/variables.css` mein CSS variables defined hain — `:root` (dark) aur `[data-theme="light"]`
2. Default dark mode — `<html>` pe koi attribute nahi = dark
3. `js/utils.js` mein `toggleTheme()` function — `document.documentElement.setAttribute("data-theme", "light")`
4. Saare colors CSS variables se aate hain — ek jagah change karo, poora app update

### Theme toggle button:
- `index.html` mein header ke andar — `<button onclick="toggleTheme()" id="theme-btn">`
- `toggleTheme()` function — `js/utils.js` mein

### Colors change karne ke liye:
- **Dark mode** → `css/variables.css` mein `:root { }` block
- **Light mode** → `css/variables.css` mein `[data-theme="light"] { }` block

---

## 🏗️ Architecture — `index.html`

`index.html` mein **sirf HTML structure** hai — koi logic nahi. Sab kuch JS files mein hai.

### Page structure:
```
Header (fixed top)
  └── Scheduler bars SVG icon (left)
  └── "PROCESS MANAGEMENT SYSTEM" title (center)
  └── LIVE badge + theme toggle (right)

Layout (grid: 215px sidebar + 1fr main)
  ├── Sidebar (fixed left)
  │   ├── System section → Overview
  │   ├── Scheduling section → FCFS, SJF, Round Robin, Priority
  │   ├── Synchronization section → Mutex, Semaphore, Monitor
  │   └── Process section → PCB Viewer, Process Queue
  └── Main content
      └── Pages (div#page-{id}) — hidden/shown via JS

Footer (fixed bottom)
  └── "Process Management System — OS Simulator" + Yash Gupta link
```

### Page IDs (each section = one div):
```
page-overview
page-fcfs
page-sjf
page-rr
page-priority
page-mutex
page-semaphore
page-monitor
page-pcb
page-queue
```

### Content divs (JS inject karta hai yahan):
```
fcfs-content, sjf-content, rr-content, priority-content
mutex-content, semaphore-content, monitor-content
pcb-content, queue-content
```

---

## 🔧 `js/utils.js` — Shared Functions

Yeh file SABSE important hai — sab JS files isko use karti hain.

### `COLORS` array
```js
const COLORS = [
  { bg: 'rgba(0,255,136,.18)', fg: '#00ff88', b: 'rgba(0,255,136,.4)' },
  // ... 6 colors total
]
// Use: COLORS[process.ci % COLORS.length]
// process.ci = color index (assigned when process is added)
```

### `toggleTheme()`
Dark/Light toggle. Button text bhi update karta hai.

### `showPage(id, el)`
- `id` = page name (e.g., `'fcfs'`)
- `el` = clicked nav-item element
- Sab pages hide karta hai, selected page show karta hai
- `inited` object check karta hai — page pehli baar khulne par `init{Page}()` call karta hai

### `inited` object
```js
const inited = {};
// Har page ek baar hi initialize hota hai — performance optimization
```

### `makeLog(id)`
Log div ka HTML return karta hai.
```js
makeLog('fcfs-content-log') // → <div class="log" id="fcfs-content-log"></div>
```

### `addLog(id, msg, type)`
Log mein entry add karta hai.
```js
addLog('fcfs-content-log', 'P1: Wait=2 TAT=8', 'ok')
// type: 'ok' (green) | 'warn' (amber) | 'err' (red) | 'info' (blue)
```

### `renderGantt(containerId, blocks)`
Gantt chart render karta hai.
```js
// blocks array format:
blocks = [
  { pid: 'P1', start: 0, end: 6, ci: 0 },  // ci = color index
  { pid: 'IDLE', start: 6, end: 8, ci: 99 }, // IDLE = gray block
  { pid: 'P2', start: 8, end: 12, ci: 1 },
]
renderGantt('fcfs-content', blocks)
```

### `renderMetrics(containerId, wt, tat, n, totalTime)`
Metrics cards update karta hai.
```js
// wt = total waiting time, tat = total turnaround time
// n = number of processes, totalTime = total execution time
renderMetrics('fcfs-content', 12, 28, 4, 18)
```

### `renderProcTable(containerId, procs, cols)`
Process table render karta hai.
```js
// cols: which extra columns to show
renderProcTable('priority-content', priorityProcs, ['arr', 'burst', 'pri'])
renderProcTable('fcfs-content', fcfsProcs, ['arr', 'burst'])
```

### `buildSchedulerUI(containerId, algoFn, extraInputs, extraHeader)`
Scheduling pages ka poora UI HTML inject karta hai.
```js
// algoFn = function prefix (e.g., 'fcfs' → fcfs_add(), fcfs_clear(), fcfs_run())
// extraInputs = additional input HTML (e.g., quantum input for RR)
// extraHeader = extra table header (e.g., '<th>Priority</th>')
buildSchedulerUI('rr-content', 'rr', quantumInputHTML, '')
```

### `removeProc(containerId, pid)`
Process table se process remove karta hai. Internally `fcfsProcs`, `sjfProcs` etc. arrays update karta hai.

---

## 📅 Scheduling Algorithms

### Common Process Object Format:
```js
{
  pid: 'P1',      // Process ID (string)
  arr: 0,         // Arrival time (number)
  burst: 5,       // Burst time (number)
  pri: 1,         // Priority (only in priority.js)
  ci: 0,          // Color index (assigned on add, for COLORS array)
}
```

### `js/scheduling/fcfs.js`

**Variables:**
```js
let fcfsProcs = []  // Array of process objects
```

**Functions:**
```js
initFCFS()      // Page initialize karo + sample data load karo
fcfs_add()      // Input fields se process add karo
fcfs_clear()    // Sab processes clear karo
fcfs_run()      // FCFS algorithm run karo → Gantt + Metrics render
```

**Algorithm logic:**
- Processes ko arrival time se sort karo
- Ek-ek execute karo, IDLE blocks add karo jab gap ho
- Wait = start_time - arrival, TAT = end_time - arrival

---

### `js/scheduling/sjf.js`

**Variables:**
```js
let sjfProcs = []
```

**Functions:**
```js
initSJF()
sjf_add()
sjf_clear()
sjf_run()
```

**Algorithm logic:**
- Non-preemptive — available processes mein se shortest burst select karo
- `done` flag use karta hai processed processes ke liye

---

### `js/scheduling/roundrobin.js`

**Variables:**
```js
let rrProcs = []
let rrQuantum = 2   // Default time quantum
```

**Functions:**
```js
initRR()    // Extra input: quantum field
rr_add()
rr_clear()
rr_run()
```

**Algorithm logic:**
- Queue-based simulation
- `arrived` Set track karta hai kaun aa gaya
- `rem` field = remaining burst time
- Safety counter 10000 iterations tak — infinite loop prevent karta hai

---

### `js/scheduling/priority.js`

**Variables:**
```js
let priorityProcs = []
```

**Functions:**
```js
initPriority()    // Extra input: priority field, extra header: <th>Priority</th>
priority__add()   // Double underscore — naming convention
priority__clear()
priority__run()
```

**Note:** Functions mein double underscore `priority__` hai kyunki `priority_` se conflict tha.

**Algorithm logic:**
- Available processes mein se lowest priority number select karo (lower = higher priority)

---

## 🔒 Synchronization

### `js/sync/mutex.js`

**Variables:**
```js
let mutexLocked = false    // Lock state
let mutexOwner = null      // Current owner thread name
let mutexWaiting = []      // Waiting threads queue
```

**Functions:**
```js
initMutex()         // UI inject karo mutex-content mein
mutexLock()         // Thread name input se lock acquire karo ya queue mein daalo
mutexUnlock()       // Lock release karo, next waiting thread ko do
_mutexUpdateQueue() // Private — waiting queue UI update
_mutexUpdateCS()    // Private — critical section log update
```

---

### `js/sync/semaphore.js`

**Variables:**
```js
let semVal = 3        // Current counter value
let semMax = 3        // Maximum value (set by reset)
let semWaiting2 = []  // Blocked threads (semWaiting1 name conflict avoid kiya)
```

**Functions:**
```js
initSemaphore()
semWait()         // P() operation — counter decrement ya block
semSignal()       // V() operation — counter increment ya unblock
semReset()        // Counter reset to initial value
_renderSemSlots() // Private — green/red slot boxes render
_renderSemBlocked() // Private — blocked threads list render
```

---

### `js/sync/monitor.js`

**Variables:**
```js
let monBuf = 0       // Current buffer fill count
let monMax = 5       // Buffer capacity
let monWaitProd = 0  // Waiting producer count
let monWaitCons = 0  // Waiting consumer count
```

**Functions:**
```js
initMonitor()
monitorProduce()    // Buffer mein item add karo ya wait karo
monitorConsume()    // Buffer se item remove karo ya wait karo
monitorReset()      // Sab reset
_renderMonBuffer()  // Private — buffer visualization render
_renderMonWaiting() // Private — waiting threads render
```

---

## 🖥️ System Pages

### `js/system/pcb-queue.js`

#### PCB Viewer

**Data:**
```js
const PCB_PROCESSES = [
  {
    pid: 1001,
    name: 'chrome',
    state: 'Running',   // Running | Waiting | Ready | Blocked
    priority: 10,
    pc: '0x7f8a',       // Program Counter
    sp: '0x7fff',       // Stack Pointer
    cpu: '85%',
    mem: '256MB',
    files: ['stdin', 'stdout', 'socket']
  },
  // ... 4 processes total
]
```

**Functions:**
```js
initPCB()           // Cards grid render karo
showPCBDetail(i)    // Index i ka detail panel show karo (onclick)
```

#### Process Queue

**Variables:**
```js
let queueData = {
  ready: ['P1','P2','P3'],
  waiting: ['P4'],
  job: ['P8','P9'],
  terminated: []
}
```

**Functions:**
```js
initQueue()
queueAdd(type)      // type: 'ready' | 'waiting' | 'job'
queueDequeue(type)  // FIFO dequeue with state transition logic
_renderQueues()     // Private — sab queues render
```

**State transitions:**
- `job` dequeue → `ready` queue mein jaata hai
- `ready` dequeue → `terminated` mein jaata hai (CPU dispatch simulate)
- `waiting` dequeue → `ready` queue mein jaata hai (I/O complete simulate)

---

## 🎨 CSS Variables (css/variables.css)

```css
/* Backgrounds */
--bg          /* Page background (darkest) */
--surface     /* Card/sidebar background */
--surface2    /* Input/metric card background */
--surface3    /* Elevated elements */

/* Borders */
--border      /* Default border */
--border2     /* Hover/active border */

/* Accent Colors */
--blue:   #4f8ef7
--blue2:  #3b7de8  /* Hover state of blue */
--purple: #7c6af7
--cyan:   #38bdf8
--green:  #34d399
--amber:  #fbbf24
--red:    #f87171

/* Text */
--text    /* Primary text */
--dim     /* Secondary text */
--muted   /* Placeholder/label text */

/* Typography */
--mono: 'IBM Plex Mono', monospace
--sans: 'IBM Plex Sans', sans-serif

/* Layout */
--radius:    8px
--radius-sm: 5px
```

---

## 🧩 CSS Classes (css/components.css)

```
.badge.running / .waiting / .ready / .terminated / .blocked
  → Colored dot + text badges for process states

.process-table
  → Standard table for process lists

.btn-g / .btn-r / .btn-b / .btn-a / .btn-solid
  → Green / Red / Blue / Amber / Blue-filled buttons

.metric / .metric-val / .metric-label
  → Stat cards with gradient number text

.gantt / .gantt-block / .gantt-ticks / .gantt-tick
  → Gantt chart components

.log / .log-entry.ok / .warn / .err / .info
  → Execution log with colored messages

.resource-box / .resource-title
  → Sync pages ke liye inner cards

.thread-item.locked / .free / .waiting
  → Colored thread state indicators

.semaphore-counter
  → Big gradient number for semaphore value

.info-row / .info-key / .info-val
  → Key-value pairs for PCB detail view
```

---

## 🧱 CSS Classes (css/layout.css)

```
.header
  → Fixed top bar, height 54px, sticky, blur backdrop

.header-icon
  → Left side SVG icon box (scheduler bars) — background surface2, border, radius 6px

.header-title
  → Center title — IBM Plex Mono, uppercase, letter-spacing 3px

.header-right
  → Right side flex container (LIVE badge + theme button)

.live-badge
  → Green pulsing dot + "LIVE" text — animated ::before circle

.theme-btn
  → Rounded pill button — hover pe blue border + color

.layout
  → CSS Grid — 215px sidebar + 1fr main content

.sidebar
  → Left panel, border-right, overflow-y auto

.sidebar-label
  → Section heading inside sidebar — 9px mono, muted, uppercase, letter-spacing 2.5px

.nav-item
  → Sidebar link — flex, 13px, font-weight 500, border-left 2px transparent
  → Hover: background surface2
  → .active: color blue, background blue 8% opacity, border-left blue

.nav-icon
  → 13px symbol inside nav-item, width 16px fixed

.nav-dot
  → Green pulsing dot — shows only on Overview (active indicator)

.main
  → Right content area — padding 32px 36px, background var(--bg)

.page
  → Each section div — display:none by default
  → .active → display:block + fadeUp animation

.page-title
  → 26px, font-weight 700, letter-spacing -0.5px

.page-sub
  → 13px, color dim, max-width 640px

.page-line
  → 1px gradient line (blue → purple → transparent) under page header

.card
  → Content card — surface bg, border, border-radius 10px, padding 22px

.card-title
  → 11px mono, font-weight 700, dim color, uppercase, letter-spacing 1.8px

.two-col
  → CSS Grid 1fr 1fr — responsive (single col below 900px)

.footer
  → Bottom bar, height 44px, flex space-between, 11px mono
```

---

## 🔍 `showPage()` Detailed Flow

```js
function showPage(id, el) {
  // Step 1: Sab pages hide karo
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'))

  // Step 2: Sab nav items deactivate karo
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'))

  // Step 3: Selected page show karo
  document.getElementById('page-' + id).classList.add('active')

  // Step 4: Clicked nav item highlight karo
  if (el) el.classList.add('active')

  // Step 5: Lazy initialization
  // inited[id] check karo — agar false/undefined hai toh init function call karo
  // Ek baar initialize hone ke baad inited[id] = true — dobara init nahi hoga
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
  }
  if (inits[id] && !inited[id]) { inits[id](); inited[id] = true }
}
```

**Important:** Overview page (`page-overview`) ka koi init function nahi — vo static HTML hai `index.html` mein directly.

---

## 🏗️ `buildSchedulerUI()` — Exact HTML Output

Yeh function scheduling pages ka complete HTML inject karta hai. Output structure:

```html
<!-- Card 1: Add Process form -->
<div class="card">
  <div class="card-title">Add Process</div>
  <div class="input-row">
    <!-- PID, Arrival, Burst inputs -->
    <!-- extraInputs (e.g., Quantum for RR, Priority for Priority) -->
    <!-- + Add, Clear, ▶ Run buttons -->
  </div>
</div>

<!-- Row: Process List + Metrics side by side (.two-col) -->
<div class="two-col">
  <div class="card">
    <div class="card-title">Process List</div>
    <table class="process-table">
      <thead><tr><th>PID</th><th>Arrival</th><th>Burst</th><!-- extraHeader --><th></th></tr></thead>
      <tbody id="{containerId}-tbody"></tbody>  <!-- JS yahan rows inject karta hai -->
    </table>
  </div>
  <div class="card">
    <div class="card-title">Metrics</div>
    <div class="metrics-grid" id="{containerId}-metrics">
      <!-- 3 placeholder metric cards — Run ke baad JS update karta hai -->
    </div>
  </div>
</div>

<!-- Card 3: Gantt Chart -->
<div class="card">
  <div class="card-title">Gantt Chart</div>
  <div class="gantt-wrap" id="{containerId}-gantt">
    <!-- Placeholder text — Run ke baad JS gantt blocks inject karta hai -->
  </div>
</div>

<!-- Card 4: Execution Log -->
<div class="card">
  <div class="card-title">Execution Log</div>
  <div class="log" id="{containerId}-log"></div>
</div>
```

**Generated element IDs** (containerId = e.g., `fcfs-content`):
```
{containerId}-pid      → PID input
{containerId}-arr      → Arrival input
{containerId}-burst    → Burst input
{containerId}-tbody    → Table body (rows inject hoti hain)
{containerId}-metrics  → Metrics grid (Run ke baad update)
{containerId}-gantt    → Gantt chart wrapper
{containerId}-log      → Log div
```

---

## 🌓 Light Mode — Visual Differences

Dark vs Light mein kya-kya change hota hai:

| Element | Dark | Light |
|---------|------|-------|
| Page background `--bg` | `#0d0f14` | `#f7f8fc` |
| Card background `--surface` | `#13161e` | `#ffffff` |
| Input background `--surface2` | `#181c26` | `#f0f2f8` |
| Border `--border` | `#232840` | `#dde1ef` |
| Primary text `--text` | `#e8ecf4` | `#111827` |
| Secondary text `--dim` | `#8892a4` | `#4b5675` |
| Muted text `--muted` | `#3d4560` | `#9aa3be` |
| Accent colors | Same in both modes | Same in both modes |
| Scanline overlay | Visible (subtle) | Not visible (light bg) |

**Accent colors (blue, purple, green, etc.) dark/light dono mein same rehte hain** — sirf backgrounds aur text change hote hain.

---

## 📄 `index.html` — Exact Cache Busting Lines

Version number yahan hain — jab bhi update karo `?v=3` → `?v=4`:

```html
<!-- HEAD mein CSS (line ~8-10) -->
<link rel="stylesheet" href="css/variables.css?v=3"/>
<link rel="stylesheet" href="css/layout.css?v=3"/>
<link rel="stylesheet" href="css/components.css?v=3"/>

<!-- BODY bottom mein JS (line ~229-238) -->
<script src="js/utils.js?v=3"></script>
<script src="js/scheduling/fcfs.js?v=3"></script>
<script src="js/scheduling/sjf.js?v=3"></script>
<script src="js/scheduling/roundrobin.js?v=3"></script>
<script src="js/scheduling/priority.js?v=3"></script>
<script src="js/sync/mutex.js?v=3"></script>
<script src="js/sync/semaphore.js?v=3"></script>
<script src="js/sync/monitor.js?v=3"></script>
<script src="js/system/pcb-queue.js?v=3"></script>
```

---

## 🔮 Future Enhancement Ideas

Agar future mein kuch add karna ho:

| Feature | File | Effort |
|---------|------|--------|
| Preemptive SJF (SRTF) | js/scheduling/srtf.js (new) | Medium |
| Preemptive Priority | js/scheduling/priority.js update | Medium |
| Aging algorithm (starvation fix) | js/scheduling/priority.js update | Medium |
| Deadlock detection demo | js/sync/deadlock.js (new) | High |
| Memory allocation (First Fit, Best Fit) | js/system/memory.js (new) | High |
| Page replacement (FIFO, LRU, Optimal) | js/system/paging.js (new) | High |
| Disk scheduling (FCFS, SSTF, SCAN) | js/system/disk.js (new) | Medium |
| Export Gantt chart as image | js/utils.js update | Low |
| Process comparison (run multiple algos same data) | js/utils.js update | High |
| Mobile responsive sidebar (hamburger menu) | css/layout.css update | Low |

---

## 🔧 How to Make Changes

### Kisi AI ko context dene ka tarika:
```
"Mera OS Simulator project hai. TECHNICAL.md padho context ke liye.
[relevant file paste karo]
Mujhe [YEH CHANGE] karni hai..."
```

### Common changes — kahan karein:

| Change | File | Search karo |
|--------|------|-------------|
| Dark theme colors | css/variables.css | :root { |
| Light theme colors | css/variables.css | [data-theme="light"] |
| New scheduling algo add | js/scheduling/new-algo.js | (nai file banao) |
| Sample processes change | js/scheduling/fcfs.js | initFCFS() |
| PCB processes change | js/system/pcb-queue.js | PCB_PROCESSES |
| Mutex/Semaphore reset defaults | js/sync/mutex.js / semaphore.js | let mutexLocked / let semVal |
| Footer text | index.html | footer div |
| Page title/description | index.html | page-title / page-sub |
| Button colors | css/components.css | .btn-g / .btn-r |
| Metric card gradient | css/components.css | .metric-val |
| Sidebar nav items | index.html | nav-item |
| Header icon | index.html | header-icon svg |

### Naya scheduling algorithm add karna:
1. `js/scheduling/new-algo.js` banao — `fcfs.js` ko template ki tarah use karo
2. `index.html` mein sidebar mein nav-item add karo
3. `index.html` mein page div add karo (`<div class="page" id="page-new">`)
4. `index.html` ke bottom mein script tag add karo
5. `js/utils.js` mein `inits` object mein entry add karo:
   ```js
   const inits = {
     // ...existing...
     new: () => initNewAlgo(),
   }
   ```

---

## ⚠️ Important Rules

1. **JS load order matters** — `utils.js` HAMESHA pehle load hona chahiye (sab files isko use karti hain)
2. **Cache busting** — `index.html` mein CSS/JS files ke saath `?v=N` version number hai. Jab bhi koi file update karo, version number badhao: `?v=3` → `?v=4`
3. **Content divs** — Scheduling/sync pages ka UI JS dynamically inject karta hai respective content divs mein. `index.html` mein sirf empty div hoti hai.
4. **Private functions** — `_` prefix wale functions (e.g., `_renderSemSlots`) sirf apni file mein use hote hain — bahar se mat bulao
5. **Color index** — Har process ko add karte waqt `ci: procs.length` assign karo taaki consistent colors milein
6. **Double underscore** — `priority__add()` etc. — intentional naming, mat change karo

---

## 🚀 Deploy Process

```
GitHub push (main branch) → Vercel auto-detect → Build → Live
```

- Repo: YASHGUPTA11122004/OS-Simulator
- Branch: main
- Framework: Other (static site)
- Root Directory: ./
- No build command needed

---

## 📦 Version History

| Version | Changes |
|---------|---------|
| v1 | Single file (index.html) — all code inline |
| v2 | Multi-file architecture — CSS + JS separated |
| v3 | Premium dark theme, typography overhaul, scheduler icon, cache busting |

---

*Last updated: March 2026*

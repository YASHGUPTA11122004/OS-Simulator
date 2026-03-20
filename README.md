# Process Management System

An interactive, browser-based OS Process Management Simulator built to visualize core Operating System concepts — scheduling algorithms, synchronization mechanisms, and process lifecycle management.

**Live Demo → [os-simulator-black.vercel.app](https://os-simulator-black.vercel.app)**

---

## Features

### CPU Scheduling Algorithms
| Algorithm | Type | Description |
|-----------|------|-------------|
| FCFS | Non-preemptive | Processes execute in arrival order |
| SJF | Non-preemptive | Shortest burst time executes first |
| Round Robin | Preemptive | Fixed time quantum, configurable |
| Priority | Non-preemptive | Lower number = higher priority |

Each algorithm includes:
- Live Gantt chart visualization
- Average Waiting Time, Turnaround Time, Throughput metrics
- Add / remove processes dynamically
- Execution log with timestamps

### Synchronization Mechanisms
- **Mutex** — Binary lock with waiting queue and critical section demo
- **Semaphore** — Counting semaphore with wait() / signal() operations and slot visualization
- **Monitor** — Producer-Consumer simulation with condition variables (notFull / notEmpty)

### Process Management
- **PCB Viewer** — Process Control Block with state, registers, memory, open files
- **Process Queue** — Ready queue, waiting queue, and job queue with live enqueue/dequeue

---

## Tech Stack

- HTML5, CSS3, Vanilla JavaScript
- No frameworks, no dependencies
- Modular multi-file architecture

---

## Project Structure

```
OS-Simulator/
├── index.html
├── css/
│   ├── variables.css       # Theme variables (dark / light)
│   ├── layout.css          # Header, sidebar, main, footer
│   └── components.css      # Buttons, tables, badges, gantt, metrics
└── js/
    ├── utils.js            # Navigation, shared helpers, renderers
    ├── scheduling/
    │   ├── fcfs.js
    │   ├── sjf.js
    │   ├── roundrobin.js
    │   └── priority.js
    ├── sync/
    │   ├── mutex.js
    │   ├── semaphore.js
    │   └── monitor.js
    └── system/
        └── pcb-queue.js
```

---

## Getting Started

No installation required. Just open `index.html` in any browser.

```bash
git clone https://github.com/YASHGUPTA11122004/OS-Simulator.git
cd OS-Simulator
open index.html
```

Or visit the live deployment: **[os-simulator-black.vercel.app](https://os-simulator-black.vercel.app)**

---

## Screenshots

> Dark mode — FCFS Scheduling with Gantt chart

> Light mode — System Overview

---

## Concepts Covered

This simulator covers the following OS concepts from B.Tech CSE curriculum:

- Process scheduling (FCFS, SJF, Round Robin, Priority)
- Gantt chart generation and scheduling metrics
- Critical section problem and Mutex locks
- Semaphore — P() / V() operations
- Monitor and condition variables
- Process Control Block (PCB) structure
- Process state transitions (New → Ready → Running → Waiting → Terminated)
- Ready queue, waiting queue, job queue

---

## Author

**Yash Gupta**
B.Tech CSE — Graphic Era Hill University, Bhimtal (2022–2026)

[![Portfolio](https://img.shields.io/badge/Portfolio-Visit-blue?style=flat&logo=vercel)](https://portfolio-sdab.vercel.app)
[![LinkedIn](https://img.shields.io/badge/LinkedIn-Connect-blue?style=flat&logo=linkedin)](https://linkedin.com/in/yashgupta11122004)
[![GitHub](https://img.shields.io/badge/GitHub-Follow-black?style=flat&logo=github)](https://github.com/YASHGUPTA11122004)

---

## License

This project is open source and available under the [MIT License](LICENSE).

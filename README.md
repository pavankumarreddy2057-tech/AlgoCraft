# AlgoCraft — Offline Coding Practice Platform

A self-contained, offline-first coding practice application functionally similar to LeetCode. Browse problems, write and execute code against sample and hidden test cases, track progress, and reinforce algorithmic patterns using SuperMemo-2 (SM-2) spaced repetition intervals — **with zero internet dependency after install**.

---

## Key Features

1. **Problem Browser & Instant Search**:
   - Filter by Difficulty (**Easy**, **Medium**, **Hard**) and Topic Tags (Arrays, Two Pointers, Sliding Window, DP, Trees, Graphs, Stack, Binary Search, Intervals, Bit Manipulation).
   - Filter by status (**Solved**, **Attempted**, **Todo**).
   - Full-text search with **Ctrl+K / Cmd+K** fuzzy search dialog.

2. **Full IDE Problem Workspace**:
   - **Monaco Code Editor** (VS Code engine offline) with syntax highlighting, bracket pairing, line numbers, and auto-indent.
   - Multi-language support: **Python 3** and **JavaScript** natively supported out-of-the-box (plus optional Judge0 Docker integration for C++, Java, Rust, Go).
   - Integrated Stopwatch timer for tracking time-to-solve.
   - Resizable split-pane layout.

3. **Sandboxed Execution Engine & Diff Viewer**:
   - **Run Sample Cases**: Interactive testing on non-hidden examples or custom inputs.
   - **Submit**: Evaluates against the entire test suite (sample + hidden test cases) under enforced time and memory ceilings.
   - Visual expected vs actual output comparison with error tracebacks and captured `stdout` (print statements).

4. **SuperMemo-2 (SM-2) Spaced Repetition Queue**:
   - Automatically computes optimal review intervals based on recall confidence (`Again`, `Hard`, `Good`, `Easy`).
   - Daily practice queue surfaces problems due for review so you master patterns long-term without cramming.

5. **Analytics & Performance Dashboard**:
   - 365-day commit-style activity heatmap.
   - Current and maximum streak counters.
   - Topic mastery breakdown (percentage completed per data structure / algorithm).
   - Submission history table with execution runtimes.

6. **Problem Bank Scalability & Validation Pipeline**:
   - Problems stored as plain, portable JSON files under `problems/<category>/<slug>.json`.
   - SQLite database indexed with FTS5 for instant search.
   - Automated CLI & UI validator (`npm run validate`) that verifies reference solutions pass 100% of test cases before admission.
   - Built-in Import & Export for sharing custom problem packs.

---

## Quick Start Guide

### Prerequisites
- **Node.js** (v18+)
- **Python 3** (for Python code execution)
- *(Optional)* Docker (only if running Judge0 for compiled languages like C++ / Java / Rust)

### 1. Install & Setup
```bash
# Install root, server, and client dependencies
npm run install:all
```

### 2. Generate Seed Problem Bank & Initialize Database
```bash
# Seeds SQLite database from problem JSON files
npm run seed

# Run the automated problem validator to verify reference solutions
npm run validate
```

### 3. Start Application
```bash
# Starts both the backend API server and frontend client concurrently
npm run dev
```
Open your browser at **`http://localhost:5173`** (or the server at `http://localhost:4000`).

---

## Project Structure

```
offline-leetcode/
├── server/                         # Node.js + Express + TypeScript API Server
│   ├── src/
│   │   ├── index.ts                # Server entry point & API route registration
│   │   ├── db/
│   │   │   ├── database.ts         # Pure WebAssembly SQLite database manager
│   │   │   ├── schema.sql          # Table definitions & FTS5 full-text search triggers
│   │   │   └── seed-loader.ts      # Bi-directional JSON problem pack loader
│   │   ├── runner/
│   │   │   ├── index.ts            # Execution dispatcher
│   │   │   ├── native-runner.ts    # Sandboxed subprocess runner (Python/JS)
│   │   │   ├── judge0-runner.ts    # Local Docker Judge0 REST client
│   │   │   └── wrappers/           # Multi-language test harnesses (TreeNode/ListNode)
│   │   ├── spaced-repetition/
│   │   │   └── sm2.ts              # SuperMemo-2 calculation engine
│   │   ├── validator/
│   │   │   └── problem-validator.ts # Automated test harness validator
│   │   └── routes/                 # Express REST endpoints
│   │       ├── problems.ts         # GET /api/problems, GET /api/problems/:slug
│   │       ├── submissions.ts      # POST /api/problems/:slug/run, POST /api/problems/:slug/submit
│   │       ├── review.ts           # GET /api/review/queue, POST /api/review/:slug/record
│   │       ├── stats.ts            # GET /api/stats (heatmaps, topic mastery, streaks)
│   │       └── admin.ts            # JSON export, import, and validator report
├── client/                         # React + Vite + TypeScript + Monaco Editor Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.tsx          # Navigation, streak badges, quick search trigger
│   │   │   ├── ProblemBrowser.tsx  # Difficulty pills, tags, search bar, problem table
│   │   │   ├── Workspace.tsx       # IDE split pane with problem description & hints
│   │   │   ├── CodeEditor.tsx      # Monaco editor with language switcher & hotkeys
│   │   │   ├── TestRunnerPanel.tsx # Sample case tabs, diff viewer, stdout logs, SM-2 rating
│   │   │   ├── HintsAndSolution.tsx# Progressive hints & reference editorial
│   │   │   ├── SpacedRepetitionModal.tsx # Daily review queue & confidence grading
│   │   │   ├── StatsDashboard.tsx  # 365-day activity heatmap & topic mastery grid
│   │   │   ├── ProblemManagerModal.tsx # Pack import/export & integrity validator UI
│   │   │   └── QuickSearchModal.tsx # Ctrl+K global fuzzy search
│   │   ├── lib/api.ts              # Typed API client
│   │   └── types/index.ts          # Shared TypeScript interfaces
├── problems/                       # Plain JSON problem library organized by categories
│   ├── arrays-and-hashing/
│   ├── two-pointers/
│   ├── sliding-window/
│   ├── stack/
│   ├── binary-search/
│   ├── linked-list/
│   ├── trees/
│   ├── backtracking/
│   ├── graphs/
│   ├── dynamic-programming/
│   ├── greedy/
│   ├── intervals/
│   └── bit-manipulation/
├── docker-compose.judge0.yml       # Optional Docker compose config for local Judge0
├── package.json                    # Root script orchestration
└── README.md
```

---

## Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| `Ctrl + K` / `Cmd + K` | Open Quick Search dialog anywhere |
| `Ctrl + Enter` | Run code against Sample Test Cases |
| `Ctrl + Shift + Enter` | Submit code against all Hidden Test Cases |
| `Esc` | Close search / modal dialogs |

---

## Problem JSON Schema Specification

Custom problems are stored as JSON files with the following structure:

```json
{
  "slug": "two-sum",
  "title": "Two Sum",
  "difficulty": "Easy",
  "tags": ["Arrays", "Hash Table"],
  "statement_md": "Given an array of integers `nums` and an integer `target`, return indices...",
  "constraints": [
    "2 <= nums.length <= 10^4",
    "-10^9 <= nums[i] <= 10^9"
  ],
  "examples": [
    {
      "input": { "nums": [2, 7, 11, 15], "target": 9 },
      "output": [0, 1],
      "explanation": "Because nums[0] + nums[1] == 9, we return [0, 1]."
    }
  ],
  "starter_code": {
    "python": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass\n",
    "javascript": "function twoSum(nums, target) {\n    // Your solution here\n}\n"
  },
  "test_cases": [
    {
      "input": { "nums": [2, 7, 11, 15], "target": 9 },
      "expected_output": [0, 1],
      "hidden": false
    },
    {
      "input": { "nums": [-1, -2, -3, -4, -5], "target": -8 },
      "expected_output": [2, 4],
      "hidden": true
    }
  ],
  "reference_solution": {
    "python": "class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in seen:\n                return [seen[diff], i]\n            seen[n] = i\n        return []\n",
    "javascript": "function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n"
  },
  "hints": [
    "Use a hash map to store visited numbers and their indices."
  ],
  "editorial_md": "### Method: Hash Map (One-Pass)\n\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$",
  "time_limit_ms": 2000,
  "memory_limit_mb": 128
}
```

---

## (Optional) Judge0 Docker Setup

If you wish to practice in compiled languages such as **C++**, **Java**, **Rust**, or **Go**:
```bash
docker compose -f docker-compose.judge0.yml up -d
```
The application will automatically detect the local Judge0 service at `http://localhost:2358`.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

interface ProblemDef {
  category: string;
  slug: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  statement_md: string;
  constraints: string[];
  examples: Array<{ input: any; output: any; explanation?: string }>;
  starter_code: { python: string; javascript: string };
  test_cases: Array<{ input?: any; schema_ddl?: string; expected_output: any; hidden: boolean }>;
  reference_solution: { python?: string; javascript?: string; sql?: string };
  hints: string[];
  editorial_md: string;
  time_limit_ms?: number;
  memory_limit_mb?: number;
}

const MEGA_PROBLEMS: ProblemDef[] = [
  // 1. Generate Parentheses
  {
    category: 'backtracking',
    slug: 'generate-parentheses',
    title: 'Generate Parentheses',
    difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming', 'Backtracking'],
    statement_md: 'Given `n` pairs of parentheses, write a function to *generate all combinations of well-formed parentheses*.',
    constraints: ['1 <= n <= 8'],
    examples: [
      { input: { n: 3 }, output: ["((()))","(()())","(())()","()(())","()()()"] },
      { input: { n: 1 }, output: ["()"] }
    ],
    starter_code: {
      python: 'class Solution:\n    def generateParenthesis(self, n: int) -> List[str]:\n        pass\n',
      javascript: 'function generateParenthesis(n) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { n: 3 }, expected_output: ["((()))","(()())","(())()","()(())","()()()"], hidden: false },
      { input: { n: 1 }, expected_output: ["()"], hidden: false },
      { input: { n: 2 }, expected_output: ["(())","()()"], hidden: true },
      { input: { n: 4 }, expected_output: ["(((())))","((()()))","((())())","((()))()","(()(()))","(()()())","(()())()","(())(())","(())()()","()((()))","()(()())","()(())()","()()(())","()()()()"], hidden: true },
      { input: { n: 5 }, expected_output: ["((((()))))","(((()())))","(((())()))","(((()))())","(((())))()","((()(())))","((()()()))","((()())())","((())(()))","((())()())","((())())()","((()))(())","((()))()()","(()((())))","(()(()()))","(()(())())","(()(()))()","(()()(()))","(()()()())","(()()())()","(()())(())","(()())()()","(())(()())","(())(())()","(())()(())","(())()()()","()(((())))","()((()()))","()((())())","()((()))()","()(()(()))","()(()()())","()(()())()","()(())(())","()(())()()","()()((()))","()()(()())","()()(())()","()()()(())","()()()()()"], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def generateParenthesis(self, n: int) -> List[str]:\n        res = []\n        def backtrack(open_c, close_c, cur):\n            if open_c == close_c == n:\n                res.append("".join(cur))\n                return\n            if open_c < n:\n                cur.append("(")\n                backtrack(open_c + 1, close_c, cur)\n                cur.pop()\n            if close_c < open_c:\n                cur.append(")")\n                backtrack(open_c, close_c + 1, cur)\n                cur.pop()\n        backtrack(0, 0, [])\n        return res\n',
      javascript: 'function generateParenthesis(n) {\n    const res = [];\n    function backtrack(openC, closeC, cur) {\n        if (openC === n && closeC === n) {\n            res.push(cur.join(""));\n            return;\n        }\n        if (openC < n) {\n            cur.push("(");\n            backtrack(openC + 1, closeC, cur);\n            cur.pop();\n        }\n        if (closeC < openC) {\n            cur.push(")");\n            backtrack(openC, closeC + 1, cur);\n            cur.pop();\n        }\n    }\n    backtrack(0, 0, []);\n    return res;\n}\n'
    },
    hints: ['Only add open parenthesis if `open < n`. Only add close parenthesis if `close < open`.'],
    editorial_md: '### Method: Backtracking with Open/Close Constraints\n- **Time Complexity**: $\\mathcal{O}(\\frac{4^n}{\\sqrt{n}})$\n- **Space Complexity**: $\\mathcal{O}(n)$'
  },

  // 2. Letter Combinations of a Phone Number
  {
    category: 'backtracking',
    slug: 'letter-combinations-of-a-phone-number',
    title: 'Letter Combinations of a Phone Number',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Backtracking'],
    statement_md: 'Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.\n\nA mapping of digits to letters (just like on telephone buttons) is given below. Note that 1 does not map to any letters.\n`2: "abc"`, `3: "def"`, `4: "ghi"`, `5: "jkl"`, `6: "mno"`, `7: "pqrs"`, `8: "tuv"`, `9: "wxyz"`.',
    constraints: ['0 <= digits.length <= 4', 'digits[i] is a digit in the range [\'2\', \'9\'].'],
    examples: [
      { input: { digits: "23" }, output: ["ad","ae","af","bd","be","bf","cd","ce","cf"] },
      { input: { digits: "" }, output: [] },
      { input: { digits: "2" }, output: ["a","b","c"] }
    ],
    starter_code: {
      python: 'class Solution:\n    def letterCombinations(self, digits: str) -> List[str]:\n        pass\n',
      javascript: 'function letterCombinations(digits) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { digits: "23" }, expected_output: ["ad","ae","af","bd","be","bf","cd","ce","cf"], hidden: false },
      { input: { digits: "" }, expected_output: [], hidden: false },
      { input: { digits: "2" }, expected_output: ["a","b","c"], hidden: false },
      { input: { digits: "7" }, expected_output: ["p","q","r","s"], hidden: true },
      { input: { digits: "234" }, expected_output: ["adg","adh","adi","aeg","aeh","aei","afg","afh","afi","bdg","bdh","bdi","beg","beh","bei","bfg","bfh","bfi","cdg","cdh","cdi","ceg","ceh","cei","cfg","cfh","cfi"], hidden: true },
      { input: { digits: "9" }, expected_output: ["w","x","y","z"], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def letterCombinations(self, digits: str) -> List[str]:\n        if not digits:\n            return []\n        phone = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}\n        res = []\n        def backtrack(i, cur):\n            if i == len(digits):\n                res.append("".join(cur))\n                return\n            for c in phone[digits[i]]:\n                cur.append(c)\n                backtrack(i + 1, cur)\n                cur.pop()\n        backtrack(0, [])\n        return res\n',
      javascript: 'function letterCombinations(digits) {\n    if (!digits) return [];\n    const phone = { "2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz" };\n    const res = [];\n    function backtrack(i, cur) {\n        if (i === digits.length) {\n            res.push(cur.join(""));\n            return;\n        }\n        for (const c of phone[digits[i]]) {\n            cur.push(c);\n            backtrack(i + 1, cur);\n            cur.pop();\n        }\n    }\n    backtrack(0, []);\n    return res;\n}\n'
    },
    hints: ['Map each digit to its corresponding characters and use recursion to build all branches.'],
    editorial_md: '### Method: Backtracking Branching\n- **Time Complexity**: $\\mathcal{O}(4^N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 3. Rotting Oranges
  {
    category: 'graphs',
    slug: 'rotting-oranges',
    title: 'Rotting Oranges',
    difficulty: 'Medium',
    tags: ['Array', 'Breadth-First Search', 'Matrix'],
    statement_md: 'You are given an `m x n` grid where each cell can have one of three values:\n- `0` representing an empty cell,\n- `1` representing a fresh orange, or\n- `2` representing a rotten orange.\n\nEvery minute, any fresh orange that is **4-directionally adjacent** to a rotten orange becomes rotten.\n\nReturn *the minimum number of minutes that must elapse until no cell has a fresh orange*. If this is impossible, return `-1`.',
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 10', 'grid[i][j] is 0, 1, or 2.'],
    examples: [
      { input: { grid: [[2,1,1],[1,1,0],[0,1,1]] }, output: 4 },
      { input: { grid: [[2,1,1],[0,1,1],[1,0,1]] }, output: -1 },
      { input: { grid: [[0,2]] }, output: 0 }
    ],
    starter_code: {
      python: 'class Solution:\n    def orangesRotting(self, grid: List[List[int]]) -> int:\n        pass\n',
      javascript: 'function orangesRotting(grid) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { grid: [[2,1,1],[1,1,0],[0,1,1]] }, expected_output: 4, hidden: false },
      { input: { grid: [[2,1,1],[0,1,1],[1,0,1]] }, expected_output: -1, hidden: false },
      { input: { grid: [[0,2]] }, expected_output: 0, hidden: false },
      { input: { grid: [[0]] }, expected_output: 0, hidden: true },
      { input: { grid: [[1]] }, expected_output: -1, hidden: true },
      { input: { grid: [[2,2],[1,1],[0,0],[2,0]] }, expected_output: 1, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def orangesRotting(self, grid: List[List[int]]) -> int:\n        from collections import deque\n        rows, cols = len(grid), len(grid[0])\n        q = deque()\n        fresh = 0\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == 2:\n                    q.append((r, c))\n                elif grid[r][c] == 1:\n                    fresh += 1\n        if fresh == 0:\n            return 0\n        minutes = 0\n        directions = [(0, 1), (0, -1), (1, 0), (-1, 0)]\n        while q and fresh > 0:\n            minutes += 1\n            for _ in range(len(q)):\n                r, c = q.popleft()\n                for dr, dc in directions:\n                    nr, nc = r + dr, c + dc\n                    if 0 <= nr < rows and 0 <= nc < cols and grid[nr][nc] == 1:\n                        grid[nr][nc] = 2\n                        fresh -= 1\n                        q.append((nr, nc))\n        return minutes if fresh == 0 else -1\n',
      javascript: 'function orangesRotting(grid) {\n    const rows = grid.length, cols = grid[0].length;\n    const q = [];\n    let fresh = 0;\n    for (let r = 0; r < rows; r++) {\n        for (let c = 0; c < cols; c++) {\n            if (grid[r][c] === 2) q.push([r, c]);\n            else if (grid[r][c] === 1) fresh++;\n        }\n    }\n    if (fresh === 0) return 0;\n    let minutes = 0;\n    const directions = [[0, 1], [0, -1], [1, 0], [-1, 0]];\n    let head = 0;\n    while (head < q.length && fresh > 0) {\n        const levelSize = q.length - head;\n        minutes++;\n        for (let i = 0; i < levelSize; i++) {\n            const [r, c] = q[head++];\n            for (const [dr, dc] of directions) {\n                const nr = r + dr, nc = c + dc;\n                if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc] === 1) {\n                    grid[nr][nc] = 2;\n                    fresh--;\n                    q.push([nr, nc]);\n                }\n            }\n        }\n    }\n    return fresh === 0 ? minutes : -1;\n}\n'
    },
    hints: ['Use Multi-Source BFS starting simultaneously from all initial rotten oranges.'],
    editorial_md: '### Method: Multi-Source BFS\n- **Time Complexity**: $\\mathcal{O}(M \\cdot N)$\n- **Space Complexity**: $\\mathcal{O}(M \\cdot N)$'
  },

  // 4. Pacific Atlantic Water Flow
  {
    category: 'graphs',
    slug: 'pacific-atlantic-water-flow',
    title: 'Pacific Atlantic Water Flow',
    difficulty: 'Medium',
    tags: ['Array', 'Depth-First Search', 'Breadth-First Search', 'Matrix'],
    statement_md: 'There is an `m x n` rectangular island that borders both the **Pacific Ocean** (top and left edges) and **Atlantic Ocean** (bottom and right edges).\n\nReturn *a 2D list of grid coordinates `[r, c]` where water can flow to **both** the Pacific and Atlantic oceans*. Water flows from cell to adjacent cell with equal or lower height.',
    constraints: ['m == heights.length', 'n == heights[r].length', '1 <= m, n <= 200', '0 <= heights[r][c] <= 10^5'],
    examples: [
      { input: { heights: [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]] }, output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]] },
      { input: { heights: [[1]] }, output: [[0,0]] }
    ],
    starter_code: {
      python: 'class Solution:\n    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:\n        pass\n',
      javascript: 'function pacificAtlantic(heights) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { heights: [[1,2,2,3,5],[3,2,3,4,4],[2,4,5,3,1],[6,7,1,4,5],[5,1,1,2,4]] }, expected_output: [[0,4],[1,3],[1,4],[2,2],[3,0],[3,1],[4,0]], hidden: false },
      { input: { heights: [[1]] }, expected_output: [[0,0]], hidden: false },
      { input: { heights: [[2,1],[1,2]] }, expected_output: [[0,0],[0,1],[1,0],[1,1]], hidden: true },
      { input: { heights: [[1,2,3],[8,9,4],[7,6,5]] }, expected_output: [[0,2],[1,0],[1,1],[1,2],[2,0],[2,1],[2,2]], hidden: true },
      { input: { heights: [[1,1],[1,1]] }, expected_output: [[0,0],[0,1],[1,0],[1,1]], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def pacificAtlantic(self, heights: List[List[int]]) -> List[List[int]]:\n        ROWS, COLS = len(heights), len(heights[0])\n        pac, atl = set(), set()\n        def dfs(r, c, visit, prev_h):\n            if (r, c) in visit or r < 0 or c < 0 or r >= ROWS or c >= COLS or heights[r][c] < prev_h:\n                return\n            visit.add((r, c))\n            dfs(r + 1, c, visit, heights[r][c])\n            dfs(r - 1, c, visit, heights[r][c])\n            dfs(r, c + 1, visit, heights[r][c])\n            dfs(r, c - 1, visit, heights[r][c])\n        for c in range(COLS):\n            dfs(0, c, pac, heights[0][c])\n            dfs(ROWS - 1, c, atl, heights[ROWS - 1][c])\n        for r in range(ROWS):\n            dfs(r, 0, pac, heights[r][0])\n            dfs(r, COLS - 1, atl, heights[r][COLS - 1])\n        res = []\n        for r in range(ROWS):\n            for c in range(COLS):\n                if (r, c) in pac and (r, c) in atl:\n                    res.append([r, c])\n        return res\n',
      javascript: 'function pacificAtlantic(heights) {\n    const ROWS = heights.length, COLS = heights[0].length;\n    const pac = new Set(), atl = new Set();\n    function dfs(r, c, visit, prevH) {\n        const key = `${r},${c}`;\n        if (visit.has(key) || r < 0 || c < 0 || r >= ROWS || c >= COLS || heights[r][c] < prevH) return;\n        visit.add(key);\n        dfs(r + 1, c, visit, heights[r][c]);\n        dfs(r - 1, c, visit, heights[r][c]);\n        dfs(r, c + 1, visit, heights[r][c]);\n        dfs(r, c - 1, visit, heights[r][c]);\n    }\n    for (let c = 0; c < COLS; c++) {\n        dfs(0, c, pac, heights[0][c]);\n        dfs(ROWS - 1, c, atl, heights[ROWS - 1][c]);\n    }\n    for (let r = 0; r < ROWS; r++) {\n        dfs(r, 0, pac, heights[r][0]);\n        dfs(r, COLS - 1, atl, heights[r][COLS - 1]);\n    }\n    const res = [];\n    for (let r = 0; r < ROWS; r++) {\n        for (let c = 0; c < COLS; c++) {\n            if (pac.has(`${r},${c}`) && atl.has(`${r},${c}`)) res.push([r, c]);\n        }\n    }\n    return res;\n}\n'
    },
    hints: ['Reverse the flow: Start DFS from the borders inward to cells with height >= current cell.'],
    editorial_md: '### Method: Reverse Boundary DFS\n- **Time Complexity**: $\\mathcal{O}(M \\cdot N)$\n- **Space Complexity**: $\\mathcal{O}(M \\cdot N)$'
  },

  // 5. Coin Change II
  {
    category: 'dynamic-programming',
    slug: 'coin-change-ii',
    title: 'Coin Change II',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    statement_md: 'You are given an integer array `coins` representing coins of different denominations and an integer `amount` representing a total amount of money.\n\nReturn *the number of combinations that make up that amount*. If that amount of money cannot be made up by any combination of the coins, return `0`.\n\nYou may assume that you have an infinite number of each kind of coin.',
    constraints: ['1 <= coins.length <= 300', '1 <= coins[i] <= 5000', '0 <= amount <= 5000'],
    examples: [
      { input: { amount: 5, coins: [1, 2, 5] }, output: 4 },
      { input: { amount: 3, coins: [2] }, output: 0 },
      { input: { amount: 10, coins: [10] }, output: 1 }
    ],
    starter_code: {
      python: 'class Solution:\n    def change(self, amount: int, coins: List[int]) -> int:\n        pass\n',
      javascript: 'function change(amount, coins) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { amount: 5, coins: [1, 2, 5] }, expected_output: 4, hidden: false },
      { input: { amount: 3, coins: [2] }, expected_output: 0, hidden: false },
      { input: { amount: 10, coins: [10] }, expected_output: 1, hidden: false },
      { input: { amount: 0, coins: [7] }, expected_output: 1, hidden: true },
      { input: { amount: 12, coins: [1, 2, 5] }, expected_output: 13, hidden: true },
      { input: { amount: 100, coins: [1, 5, 10, 25] }, expected_output: 242, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def change(self, amount: int, coins: List[int]) -> int:\n        dp = [0] * (amount + 1)\n        dp[0] = 1\n        for c in coins:\n            for a in range(c, amount + 1):\n                dp[a] += dp[a - c]\n        return dp[amount]\n',
      javascript: 'function change(amount, coins) {\n    const dp = new Array(amount + 1).fill(0);\n    dp[0] = 1;\n    for (const c of coins) {\n        for (let a = c; a <= amount; a++) {\n            dp[a] += dp[a - c];\n        }\n    }\n    return dp[amount];\n}\n'
    },
    hints: ['Iterate through coins on the outer loop and amount on the inner loop to prevent counting permutations.'],
    editorial_md: '### Method: Unbounded Knapsack DP (Combinations)\n- **Time Complexity**: $\\mathcal{O}(A \\cdot C)$\n- **Space Complexity**: $\\mathcal{O}(A)$'
  },

  // 6. Partition Equal Subset Sum
  {
    category: 'dynamic-programming',
    slug: 'partition-equal-subset-sum',
    title: 'Partition Equal Subset Sum',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    statement_md: 'Given an integer array `nums`, return `true` *if you can partition the array into two subsets such that the sum of the elements in both subsets is equal or* `false` *otherwise*.',
    constraints: ['1 <= nums.length <= 200', '1 <= nums[i] <= 100'],
    examples: [
      { input: { nums: [1, 5, 11, 5] }, output: true },
      { input: { nums: [1, 2, 3, 5] }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def canPartition(self, nums: List[int]) -> bool:\n        pass\n',
      javascript: 'function canPartition(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [1, 5, 11, 5] }, expected_output: true, hidden: false },
      { input: { nums: [1, 2, 3, 5] }, expected_output: false, hidden: false },
      { input: { nums: [1] }, expected_output: false, hidden: true },
      { input: { nums: [2, 2, 2, 2] }, expected_output: true, hidden: true },
      { input: { nums: [1, 2, 5] }, expected_output: false, hidden: true },
      { input: { nums: [14, 9, 8, 4, 3, 2] }, expected_output: true, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def canPartition(self, nums: List[int]) -> bool:\n        total = sum(nums)\n        if total % 2 != 0:\n            return False\n        target = total // 2\n        dp = set([0])\n        for n in nums:\n            next_dp = set()\n            for t in dp:\n                if t + n == target:\n                    return True\n                if t + n < target:\n                    next_dp.add(t + n)\n                next_dp.add(t)\n            dp = next_dp\n        return target in dp\n',
      javascript: 'function canPartition(nums) {\n    const total = nums.reduce((a, b) => a + b, 0);\n    if (total % 2 !== 0) return false;\n    const target = total / 2;\n    let dp = new Set([0]);\n    for (const n of nums) {\n        const nextDp = new Set();\n        for (const t of dp) {\n            if (t + n === target) return true;\n            if (t + n < target) nextDp.add(t + n);\n            nextDp.add(t);\n        }\n        dp = nextDp;\n    }\n    return dp.has(target);\n}\n'
    },
    hints: ['If total sum is odd, partition is impossible. Target is sum(nums) / 2 (0/1 Knapsack).'],
    editorial_md: '### Method: 0/1 Knapsack DP Subset Sum\n- **Time Complexity**: $\\mathcal{O}(N \\cdot \\text{target})$\n- **Space Complexity**: $\\mathcal{O}(\\text{target})$'
  },

  // 7. Edit Distance
  {
    category: 'dynamic-programming',
    slug: 'edit-distance',
    title: 'Edit Distance',
    difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming'],
    statement_md: 'Given two strings `word1` and `word2`, return *the minimum number of operations required to convert `word1` to `word2`*.\n\nYou have the following three operations permitted on a word:\n- Insert a character\n- Delete a character\n- Replace a character',
    constraints: ['0 <= word1.length, word2.length <= 500', 'word1 and word2 consist of lowercase English letters.'],
    examples: [
      { input: { word1: "horse", word2: "ros" }, output: 3 },
      { input: { word1: "intention", word2: "execution" }, output: 5 }
    ],
    starter_code: {
      python: 'class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        pass\n',
      javascript: 'function minDistance(word1, word2) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { word1: "horse", word2: "ros" }, expected_output: 3, hidden: false },
      { input: { word1: "intention", word2: "execution" }, expected_output: 5, hidden: false },
      { input: { word1: "", word2: "" }, expected_output: 0, hidden: true },
      { input: { word1: "a", word2: "b" }, expected_output: 1, hidden: true },
      { input: { word1: "zoologico", word2: "zoologo" }, expected_output: 2, hidden: true },
      { input: { word1: "kitten", word2: "sitting" }, expected_output: 3, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def minDistance(self, word1: str, word2: str) -> int:\n        m, n = len(word1), len(word2)\n        dp = [[0] * (n + 1) for _ in range(m + 1)]\n        for i in range(m + 1):\n            dp[i][0] = i\n        for j in range(n + 1):\n            dp[0][j] = j\n        for i in range(1, m + 1):\n            for j in range(1, n + 1):\n                if word1[i - 1] == word2[j - 1]:\n                    dp[i][j] = dp[i - 1][j - 1]\n                else:\n                    dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n        return dp[m][n]\n',
      javascript: 'function minDistance(word1, word2) {\n    const m = word1.length, n = word2.length;\n    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n    for (let i = 0; i <= m; i++) dp[i][0] = i;\n    for (let j = 0; j <= n; j++) dp[0][j] = j;\n    for (let i = 1; i <= m; i++) {\n        for (let j = 1; j <= n; j++) {\n            if (word1[i - 1] === word2[j - 1]) {\n                dp[i][j] = dp[i - 1][j - 1];\n            } else {\n                dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n            }\n        }\n    }\n    return dp[m][n];\n}\n'
    },
    hints: ['If characters match, `dp[i][j] = dp[i-1][j-1]`. Otherwise take 1 + min(insert, delete, replace).'],
    editorial_md: '### Method: 2D Matrix DP (Levenshtein Distance)\n- **Time Complexity**: $\\mathcal{O}(M \\cdot N)$\n- **Space Complexity**: $\\mathcal{O}(M \\cdot N)$'
  },

  // 8. Reorder List
  {
    category: 'linked-list',
    slug: 'reorder-list',
    title: 'Reorder List',
    difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers', 'Stack', 'Recursion'],
    statement_md: 'You are given the head of a singly linked-list:\n`L0 → L1 → … → Ln-1 → Ln`\n\nReorder the list to be on the following form in-place:\n`L0 → Ln → L1 → Ln-1 → L2 → Ln-2 → …`',
    constraints: ['The number of nodes in the list is in the range [1, 5 * 10^4].', '1 <= Node.val <= 1000'],
    examples: [
      { input: { head: [1, 2, 3, 4] }, output: [1, 4, 2, 3] },
      { input: { head: [1, 2, 3, 4, 5] }, output: [1, 5, 2, 4, 3] }
    ],
    starter_code: {
      python: 'class Solution:\n    def reorderList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass\n',
      javascript: 'function reorderList(head) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { head: [1, 2, 3, 4] }, expected_output: [1, 4, 2, 3], hidden: false },
      { input: { head: [1, 2, 3, 4, 5] }, expected_output: [1, 5, 2, 4, 3], hidden: false },
      { input: { head: [1] }, expected_output: [1], hidden: true },
      { input: { head: [1, 2] }, expected_output: [1, 2], hidden: true },
      { input: { head: [1, 2, 3] }, expected_output: [1, 3, 2], hidden: true },
      { input: { head: [10, 20, 30, 40, 50, 60] }, expected_output: [10, 60, 20, 50, 30, 40], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def reorderList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        if not head or not head.next:\n            return head\n        slow, fast = head, head.next\n        while fast and fast.next:\n            slow = slow.next\n            fast = fast.next.next\n        second = slow.next\n        slow.next = None\n        prev = None\n        while second:\n            nxt = second.next\n            second.next = prev\n            prev = second\n            second = nxt\n        first, second = head, prev\n        while second:\n            t1, t2 = first.next, second.next\n            first.next = second\n            second.next = t1\n            first, second = t1, t2\n        return head\n',
      javascript: 'function reorderList(head) {\n    if (!head || !head.next) return head;\n    let slow = head, fast = head.next;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n    }\n    let second = slow.next;\n    slow.next = null;\n    let prev = null;\n    while (second) {\n        const nxt = second.next;\n        second.next = prev;\n        prev = second;\n        second = nxt;\n    }\n    let first = head;\n    second = prev;\n    while (second) {\n        const t1 = first.next, t2 = second.next;\n        first.next = second;\n        second.next = t1;\n        first = t1;\n        second = t2;\n    }\n    return head;\n}\n'
    },
    hints: ['1. Find midpoint using fast/slow pointer. 2. Reverse second half. 3. Merge two halves alternately.'],
    editorial_md: '### Method: Midpoint Split, Reverse & Weave\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 9. Non-overlapping Intervals
  {
    category: 'intervals',
    slug: 'non-overlapping-intervals',
    title: 'Non-overlapping Intervals',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming', 'Greedy', 'Sorting'],
    statement_md: 'Given an array of intervals `intervals` where `intervals[i] = [start_i, end_i]`, return *the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping*.',
    constraints: ['1 <= intervals.length <= 10^5', 'intervals[i].length == 2', '-5 * 10^4 <= start_i < end_i <= 5 * 10^4'],
    examples: [
      { input: { intervals: [[1,2],[2,3],[3,4],[1,3]] }, output: 1 },
      { input: { intervals: [[1,2],[1,2],[1,2]] }, output: 2 },
      { input: { intervals: [[1,2],[2,3]] }, output: 0 }
    ],
    starter_code: {
      python: 'class Solution:\n    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:\n        pass\n',
      javascript: 'function eraseOverlapIntervals(intervals) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { intervals: [[1,2],[2,3],[3,4],[1,3]] }, expected_output: 1, hidden: false },
      { input: { intervals: [[1,2],[1,2],[1,2]] }, expected_output: 2, hidden: false },
      { input: { intervals: [[1,2],[2,3]] }, expected_output: 0, hidden: false },
      { input: { intervals: [[1,100],[11,22],[1,11],[2,12]] }, expected_output: 2, hidden: true },
      { input: { intervals: [[1,2]] }, expected_output: 0, hidden: true },
      { input: { intervals: [[1,4],[2,3],[3,5],[4,6]] }, expected_output: 1, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def eraseOverlapIntervals(self, intervals: List[List[int]]) -> int:\n        intervals.sort(key=lambda x: x[1])\n        count = 0\n        prev_end = float("-inf")\n        for start, end in intervals:\n            if start >= prev_end:\n                prev_end = end\n            else:\n                count += 1\n        return count\n',
      javascript: 'function eraseOverlapIntervals(intervals) {\n    intervals.sort((a, b) => a[1] - b[1]);\n    let count = 0;\n    let prevEnd = -Infinity;\n    for (const [start, end] of intervals) {\n        if (start >= prevEnd) {\n            prevEnd = end;\n        } else {\n            count++;\n        }\n    }\n    return count;\n}\n'
    },
    hints: ['Greedily sort by interval end times to maximize remaining compatible intervals.'],
    editorial_md: '### Method: Greedy Interval Scheduling\n- **Time Complexity**: $\\mathcal{O}(N \\log N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 10. Missing Number
  {
    category: 'bit-manipulation',
    slug: 'missing-number',
    title: 'Missing Number',
    difficulty: 'Easy',
    tags: ['Array', 'Hash Table', 'Math', 'Binary Search', 'Bit Manipulation', 'Sorting'],
    statement_md: 'Given an array `nums` containing `n` distinct numbers in the range `[0, n]`, return *the only number in the range that is missing from the array*.',
    constraints: ['n == nums.length', '1 <= n <= 10^4', '0 <= nums[i] <= n', 'All the numbers of nums are unique.'],
    examples: [
      { input: { nums: [3, 0, 1] }, output: 2 },
      { input: { nums: [0, 1] }, output: 2 },
      { input: { nums: [9,6,4,2,3,5,7,0,1] }, output: 8 }
    ],
    starter_code: {
      python: 'class Solution:\n    def missingNumber(self, nums: List[int]) -> int:\n        pass\n',
      javascript: 'function missingNumber(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [3, 0, 1] }, expected_output: 2, hidden: false },
      { input: { nums: [0, 1] }, expected_output: 2, hidden: false },
      { input: { nums: [9,6,4,2,3,5,7,0,1] }, expected_output: 8, hidden: false },
      { input: { nums: [0] }, expected_output: 1, hidden: true },
      { input: { nums: [1] }, expected_output: 0, hidden: true },
      { input: { nums: [1, 2] }, expected_output: 0, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def missingNumber(self, nums: List[int]) -> int:\n        res = len(nums)\n        for i, n in enumerate(nums):\n            res ^= (i ^ n)\n        return res\n',
      javascript: 'function missingNumber(nums) {\n    let res = nums.length;\n    for (let i = 0; i < nums.length; i++) {\n        res ^= (i ^ nums[i]);\n    }\n    return res;\n}\n'
    },
    hints: ['XOR of a number with itself is 0 (`a ^ a = 0`). XOR all indices with all values.'],
    editorial_md: '### Method: Bitwise XOR Arithmetic\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 11. Reverse Bits
  {
    category: 'bit-manipulation',
    slug: 'reverse-bits',
    title: 'Reverse Bits',
    difficulty: 'Easy',
    tags: ['Divide and Conquer', 'Bit Manipulation'],
    statement_md: 'Reverse bits of a given 32 bits unsigned integer `n`.',
    constraints: ['The input must be a binary string of length 32 or integer.'],
    examples: [
      { input: { n: 43261596 }, output: 964176192 }
    ],
    starter_code: {
      python: 'class Solution:\n    def reverseBits(self, n: int) -> int:\n        pass\n',
      javascript: 'function reverseBits(n) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { n: 43261596 }, expected_output: 964176192, hidden: false },
      { input: { n: 1 }, expected_output: 2147483648, hidden: true },
      { input: { n: 0 }, expected_output: 0, hidden: true },
      { input: { n: 4294967295 }, expected_output: 4294967295, hidden: true },
      { input: { n: 2147483648 }, expected_output: 1, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def reverseBits(self, n: int) -> int:\n        res = 0\n        for i in range(32):\n            bit = (n >> i) & 1\n            res |= (bit << (31 - i))\n        return res\n',
      javascript: 'function reverseBits(n) {\n    let res = 0;\n    for (let i = 0; i < 32; i++) {\n        const bit = (n >>> i) & 1;\n        res = (res | (bit << (31 - i))) >>> 0;\n    }\n    return res;\n}\n'
    },
    hints: ['Bit shift each bit from pos `i` to pos `31 - i`.'],
    editorial_md: '### Method: 32-Bit Bitwise Shifting\n- **Time Complexity**: $\\mathcal{O}(1)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 12. Find Peak Element
  {
    category: 'binary-search',
    slug: 'find-peak-element',
    title: 'Find Peak Element',
    difficulty: 'Medium',
    tags: ['Array', 'Binary Search'],
    statement_md: 'A peak element is an element that is strictly greater than its neighbors.\n\nGiven a **0-indexed** integer array `nums`, find a peak element, and return its index. If the array contains multiple peaks, return the index to **any of the peaks**.\n\nYou must write an algorithm that runs in `O(log n)` time.',
    constraints: ['1 <= nums.length <= 1000', '-2^31 <= nums[i] <= 2^31 - 1', 'nums[i] != nums[i + 1] for all valid i.'],
    examples: [
      { input: { nums: [1, 2, 3, 1] }, output: 2 },
      { input: { nums: [1, 2, 1, 3, 5, 6, 4] }, output: 5 }
    ],
    starter_code: {
      python: 'class Solution:\n    def findPeakElement(self, nums: List[int]) -> int:\n        pass\n',
      javascript: 'function findPeakElement(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [1, 2, 3, 1] }, expected_output: 2, hidden: false },
      { input: { nums: [1, 2, 1, 3, 5, 6, 4] }, expected_output: 5, hidden: false },
      { input: { nums: [1] }, expected_output: 0, hidden: true },
      { input: { nums: [1, 2] }, expected_output: 1, hidden: true },
      { input: { nums: [2, 1] }, expected_output: 0, hidden: true },
      { input: { nums: [1, 3, 2, 4, 1] }, expected_output: 1, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def findPeakElement(self, nums: List[int]) -> int:\n        l, r = 0, len(nums) - 1\n        while l < r:\n            mid = (l + r) // 2\n            if nums[mid] > nums[mid + 1]:\n                r = mid\n            else:\n                l = mid + 1\n        return l\n',
      javascript: 'function findPeakElement(nums) {\n    let l = 0, r = nums.length - 1;\n    while (l < r) {\n        const mid = Math.floor((l + r) / 2);\n        if (nums[mid] > nums[mid + 1]) {\n            r = mid;\n        } else {\n            l = mid + 1;\n        }\n    }\n    return l;\n}\n'
    },
    hints: ['If `nums[mid] < nums[mid + 1]`, a peak must lie on the right side. Else, it lies on the left.'],
    editorial_md: '### Method: Binary Search on Monotonic Slopes\n- **Time Complexity**: $\\mathcal{O}(\\log N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 13. Rising Temperature (SQL)
  {
    category: 'sql',
    slug: 'rising-temperature',
    title: 'Rising Temperature',
    difficulty: 'Easy',
    tags: ['Database', 'SQL'],
    statement_md: 'Write a solution to find all dates\' `id` with higher temperatures compared to its previous dates (yesterday).\n\nReturn the result table in **any order**.',
    constraints: ['id is the primary key for Weather table.', 'There are no different rows with the same recordDate.'],
    examples: [
      {
        input: { table: "Weather" },
        output: [{ id: 2 }, { id: 4 }]
      }
    ],
    starter_code: {
      python: '-- Write your SQL query below\nSELECT w1.id\nFROM Weather w1\nJOIN Weather w2 ON date(w1.recordDate) = date(w2.recordDate, "+1 day")\nWHERE w1.temperature > w2.temperature;',
      javascript: '-- Write your SQL query below\nSELECT w1.id\nFROM Weather w1\nJOIN Weather w2 ON date(w1.recordDate) = date(w2.recordDate, "+1 day")\nWHERE w1.temperature > w2.temperature;'
    },
    test_cases: [
      {
        schema_ddl: `
          CREATE TABLE Weather (id INT, recordDate DATE, temperature INT);
          INSERT INTO Weather VALUES (1, '2015-01-01', 10), (2, '2015-01-02', 25), (3, '2015-01-03', 20), (4, '2015-01-04', 30);
        `,
        expected_output: [{ id: 2 }, { id: 4 }],
        hidden: false
      },
      {
        schema_ddl: `
          CREATE TABLE Weather (id INT, recordDate DATE, temperature INT);
          INSERT INTO Weather VALUES (1, '2020-01-01', 30), (2, '2020-01-02', 20), (3, '2020-01-03', 10);
        `,
        expected_output: [],
        hidden: true
      },
      {
        schema_ddl: `
          CREATE TABLE Weather (id INT, recordDate DATE, temperature INT);
          INSERT INTO Weather VALUES (1, '2020-01-01', 15), (2, '2020-01-02', 16);
        `,
        expected_output: [{ id: 2 }],
        hidden: true
      },
      {
        schema_ddl: `
          CREATE TABLE Weather (id INT, recordDate DATE, temperature INT);
          INSERT INTO Weather VALUES (1, '2022-05-01', 100);
        `,
        expected_output: [],
        hidden: true
      },
      {
        schema_ddl: `
          CREATE TABLE Weather (id INT, recordDate DATE, temperature INT);
          INSERT INTO Weather VALUES (1, '2021-03-01', 20), (2, '2021-03-03', 25);
        `,
        expected_output: [],
        hidden: true
      }
    ],
    reference_solution: {
      sql: 'SELECT w1.id FROM Weather w1 JOIN Weather w2 ON date(w1.recordDate) = date(w2.recordDate, "+1 day") WHERE w1.temperature > w2.temperature;'
    },
    hints: ['Self join Weather table on `date(w1.recordDate) = date(w2.recordDate, "+1 day")`.'],
    editorial_md: '### Method: Date Arithmetic Self Join\n- Join consecutive calendar dates.'
  },

  // 14. Gas Station
  {
    category: 'greedy',
    slug: 'gas-station',
    title: 'Gas Station',
    difficulty: 'Medium',
    tags: ['Array', 'Greedy'],
    statement_md: 'There are `n` gas stations along a circular route, where the amount of gas at the `i-th` station is `gas[i]`.\n\nYou have a car with an unlimited gas tank and it costs `cost[i]` of gas to travel from the `i-th` station to its next `(i + 1)-th` station. You begin the journey with an empty tank at one of the gas stations.\n\nGiven two integer arrays `gas` and `cost`, return *the starting gas station\'s index if you can travel around the circuit once in the clockwise direction, otherwise return* `-1`.',
    constraints: ['n == gas.length == cost.length', '1 <= n <= 10^5', '0 <= gas[i], cost[i] <= 10^4'],
    examples: [
      { input: { gas: [1,2,3,4,5], cost: [3,4,5,1,2] }, output: 3 },
      { input: { gas: [2,3,4], cost: [3,4,3] }, output: -1 }
    ],
    starter_code: {
      python: 'class Solution:\n    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:\n        pass\n',
      javascript: 'function canCompleteCircuit(gas, cost) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { gas: [1,2,3,4,5], cost: [3,4,5,1,2] }, expected_output: 3, hidden: false },
      { input: { gas: [2,3,4], cost: [3,4,3] }, expected_output: -1, hidden: false },
      { input: { gas: [5,1,2,3,4], cost: [4,4,1,5,1] }, expected_output: 4, hidden: true },
      { input: { gas: [2], cost: [2] }, expected_output: 0, hidden: true },
      { input: { gas: [2], cost: [3] }, expected_output: -1, hidden: true },
      { input: { gas: [3,1,1], cost: [1,2,2] }, expected_output: 0, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def canCompleteCircuit(self, gas: List[int], cost: List[int]) -> int:\n        if sum(gas) < sum(cost):\n            return -1\n        total = 0\n        res = 0\n        for i in range(len(gas)):\n            total += (gas[i] - cost[i])\n            if total < 0:\n                total = 0\n                res = i + 1\n        return res\n',
      javascript: 'function canCompleteCircuit(gas, cost) {\n    const totalGas = gas.reduce((a, b) => a + b, 0);\n    const totalCost = cost.reduce((a, b) => a + b, 0);\n    if (totalGas < totalCost) return -1;\n    let total = 0, res = 0;\n    for (let i = 0; i < gas.length; i++) {\n        total += (gas[i] - cost[i]);\n        if (total < 0) {\n            total = 0;\n            res = i + 1;\n        }\n    }\n    return res;\n}\n'
    },
    hints: ['If total gas < total cost, return -1. Otherwise, reset start index whenever tank drops below zero.'],
    editorial_md: '### Method: Single-Pass Greedy\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 15. Partition Labels
  {
    category: 'greedy',
    slug: 'partition-labels',
    title: 'Partition Labels',
    difficulty: 'Medium',
    tags: ['Hash Table', 'Two Pointers', 'String', 'Greedy'],
    statement_md: 'You are given a string `s`. We want to partition the string into as many parts as possible so that each letter appears in at most one part.\n\nReturn *a list of integers representing the size of these parts*.',
    constraints: ['1 <= s.length <= 500', 's consists of lowercase English letters.'],
    examples: [
      { input: { s: "ababcbacadefegdehijhklij" }, output: [9, 7, 8] },
      { input: { s: "eccbbbbdec" }, output: [10] }
    ],
    starter_code: {
      python: 'class Solution:\n    def partitionLabels(self, s: str) -> List[int]:\n        pass\n',
      javascript: 'function partitionLabels(s) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { s: "ababcbacadefegdehijhklij" }, expected_output: [9, 7, 8], hidden: false },
      { input: { s: "eccbbbbdec" }, expected_output: [10], hidden: false },
      { input: { s: "a" }, expected_output: [1], hidden: true },
      { input: { s: "abcdef" }, expected_output: [1, 1, 1, 1, 1, 1], hidden: true },
      { input: { s: "caedbdedda" }, expected_output: [1, 9], hidden: true },
      { input: { s: "qiejxqfnqceoxmmyswx" }, expected_output: [13, 1, 1, 4], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def partitionLabels(self, s: str) -> List[int]:\n        last_idx = {c: i for i, c in enumerate(s)}\n        res = []\n        size, end = 0, 0\n        for i, c in enumerate(s):\n            size += 1\n            end = max(end, last_idx[c])\n            if i == end:\n                res.append(size)\n                size = 0\n        return res\n',
      javascript: 'function partitionLabels(s) {\n    const lastIdx = {};\n    for (let i = 0; i < s.length; i++) lastIdx[s[i]] = i;\n    const res = [];\n    let size = 0, end = 0;\n    for (let i = 0; i < s.length; i++) {\n        size++;\n        end = Math.max(end, lastIdx[s[i]]);\n        if (i === end) {\n            res.push(size);\n            size = 0;\n        }\n    }\n    return res;\n}\n'
    },
    hints: ['Record the last index of every character first. Then expand the boundary until the current index reaches the furthest needed index.'],
    editorial_md: '### Method: Greedy Last-Index Intervals\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$ (26 characters)'
  },

  // 16. Decode Ways
  {
    category: 'dynamic-programming',
    slug: 'decode-ways',
    title: 'Decode Ways',
    difficulty: 'Medium',
    tags: ['String', 'Dynamic Programming'],
    statement_md: 'A message containing letters from `A-Z` can be encoded into numbers using the mapping `\'A\' -> "1"`, `\'B\' -> "2"`, ..., `\'Z\' -> "26"`.\n\nGiven a string `s` containing only digits, return *the **number** of ways to **decode** it*.',
    constraints: ['1 <= s.length <= 100', 's contains only digits and may contain leading zero(s).'],
    examples: [
      { input: { s: "12" }, output: 2 },
      { input: { s: "226" }, output: 3 },
      { input: { s: "06" }, output: 0 }
    ],
    starter_code: {
      python: 'class Solution:\n    def numDecodings(self, s: str) -> int:\n        pass\n',
      javascript: 'function numDecodings(s) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { s: "12" }, expected_output: 2, hidden: false },
      { input: { s: "226" }, expected_output: 3, hidden: false },
      { input: { s: "06" }, expected_output: 0, hidden: false },
      { input: { s: "10" }, expected_output: 1, hidden: true },
      { input: { s: "27" }, expected_output: 1, hidden: true },
      { input: { s: "11106" }, expected_output: 2, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def numDecodings(self, s: str) -> int:\n        if not s or s[0] == "0":\n            return 0\n        dp = {len(s): 1}\n        for i in range(len(s) - 1, -1, -1):\n            if s[i] == "0":\n                dp[i] = 0\n            else:\n                dp[i] = dp.get(i + 1, 0)\n                if i + 1 < len(s) and (s[i] == "1" or (s[i] == "2" and s[i + 1] in "0123456")):\n                    dp[i] += dp.get(i + 2, 0)\n        return dp[0]\n',
      javascript: 'function numDecodings(s) {\n    if (!s || s[0] === "0") return 0;\n    const dp = new Array(s.length + 1).fill(0);\n    dp[s.length] = 1;\n    for (let i = s.length - 1; i >= 0; i--) {\n        if (s[i] === "0") {\n            dp[i] = 0;\n        } else {\n            dp[i] = dp[i + 1];\n            if (i + 1 < s.length && (s[i] === "1" || (s[i] === "2" && "0123456".includes(s[i + 1])))) {\n                dp[i] += dp[i + 2];\n            }\n        }\n    }\n    return dp[0];\n}\n'
    },
    hints: ['Check single digit `1-9` and double digits `10-26`.'],
    editorial_md: '### Method: 1D Dynamic Programming\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 17. Rank Scores (SQL)
  {
    category: 'sql',
    slug: 'rank-scores',
    title: 'Rank Scores',
    difficulty: 'Medium',
    tags: ['Database', 'SQL'],
    statement_md: 'Write a solution to find the rank of the scores. The ranking should be calculated according to the following rules:\n- The scores should be ranked from the highest to the lowest.\n- If there is a tie between two scores, both should have the same ranking.\n- After a tie, the next ranking number should be the next consecutive integer value (i.e. dense rank).\n\nReturn the result table ordered by `score` in descending order.',
    constraints: ['id is the primary key for Scores table.'],
    examples: [
      {
        input: { table: "Scores" },
        output: [
          { score: 4.00, rank: 1 },
          { score: 4.00, rank: 1 },
          { score: 3.85, rank: 2 },
          { score: 3.65, rank: 3 },
          { score: 3.65, rank: 3 },
          { score: 3.50, rank: 4 }
        ]
      }
    ],
    starter_code: {
      python: '-- Write your SQL query below\nSELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as rank\nFROM Scores\nORDER BY score DESC;',
      javascript: '-- Write your SQL query below\nSELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as rank\nFROM Scores\nORDER BY score DESC;'
    },
    test_cases: [
      {
        schema_ddl: `
          CREATE TABLE Scores (id INT, score DECIMAL(3,2));
          INSERT INTO Scores VALUES (1, 3.50), (2, 3.65), (3, 4.00), (4, 3.85), (5, 4.00), (6, 3.65);
        `,
        expected_output: [
          { score: 4.00, rank: 1 },
          { score: 4.00, rank: 1 },
          { score: 3.85, rank: 2 },
          { score: 3.65, rank: 3 },
          { score: 3.65, rank: 3 },
          { score: 3.50, rank: 4 }
        ],
        hidden: false
      },
      {
        schema_ddl: `
          CREATE TABLE Scores (id INT, score DECIMAL(3,2));
          INSERT INTO Scores VALUES (1, 1.00), (2, 2.00), (3, 3.00);
        `,
        expected_output: [
          { score: 3.00, rank: 1 },
          { score: 2.00, rank: 2 },
          { score: 1.00, rank: 3 }
        ],
        hidden: true
      },
      {
        schema_ddl: `
          CREATE TABLE Scores (id INT, score DECIMAL(3,2));
          INSERT INTO Scores VALUES (1, 5.00), (2, 5.00), (3, 5.00);
        `,
        expected_output: [
          { score: 5.00, rank: 1 },
          { score: 5.00, rank: 1 },
          { score: 5.00, rank: 1 }
        ],
        hidden: true
      },
      {
        schema_ddl: `
          CREATE TABLE Scores (id INT, score DECIMAL(3,2));
          INSERT INTO Scores VALUES (1, 10.00);
        `,
        expected_output: [
          { score: 10.00, rank: 1 }
        ],
        hidden: true
      },
      {
        schema_ddl: `
          CREATE TABLE Scores (id INT, score DECIMAL(3,2));
          INSERT INTO Scores VALUES (1, 9.1), (2, 8.5), (3, 8.5), (4, 7.0), (5, 6.0);
        `,
        expected_output: [
          { score: 9.1, rank: 1 },
          { score: 8.5, rank: 2 },
          { score: 8.5, rank: 2 },
          { score: 7.0, rank: 3 },
          { score: 6.0, rank: 4 }
        ],
        hidden: true
      }
    ],
    reference_solution: {
      sql: 'SELECT score, DENSE_RANK() OVER (ORDER BY score DESC) as rank FROM Scores ORDER BY score DESC;'
    },
    hints: ['Use window function `DENSE_RANK() OVER (ORDER BY score DESC)`.'],
    editorial_md: '### Method: DENSE_RANK Window Function\n- Assigns rank without gaps for equal values.'
  }
];

export function generateMegaPack() {
  console.log(`[Mega Pack] Generating ${MEGA_PROBLEMS.length} new problems...`);
  for (const prob of MEGA_PROBLEMS) {
    const dir = path.join(ROOT_PROBLEMS_DIR, prob.category);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `${prob.slug}.json`);
    const { category, ...data } = prob;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  + Created: ${prob.category}/${prob.slug}.json`);
  }
  console.log('[Mega Pack] Done!');
}

if (process.argv[1] && process.argv[1].includes('generate-mega-pack')) {
  generateMegaPack();
}

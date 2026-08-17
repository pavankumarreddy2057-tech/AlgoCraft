import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

const BOLLWARM_PROBLEMS = [
  // 1. Sort Colors (Dutch National Flag)
  {
    category: 'two-pointers',
    slug: 'sort-colors',
    title: 'Sort Colors (Dutch National Flag)',
    difficulty: 'Medium',
    tags: ['Array', 'Two Pointers', 'Sorting'],
    statement_md: 'Given an array `nums` with `n` objects colored red, white, or blue, sort them **in-place** so that objects of the same color are adjacent, with the colors in the order red, white, and blue.\n\nWe will use the integers `0`, `1`, and `2` to represent the color red, white, and blue, respectively.\n\nYou must solve this problem without using the library\'s sort function.',
    constraints: ['n == nums.length', '1 <= n <= 300', 'nums[i] is either 0, 1, or 2.'],
    examples: [
      { input: { nums: [2, 0, 2, 1, 1, 0] }, output: [0, 0, 1, 1, 2, 2] },
      { input: { nums: [2, 0, 1] }, output: [0, 1, 2] }
    ],
    starter_code: {
      python: 'class Solution:\n    def sortColors(self, nums: List[int]) -> List[int]:\n        pass\n',
      javascript: 'function sortColors(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [2, 0, 2, 1, 1, 0] }, expected_output: [0, 0, 1, 1, 2, 2], hidden: false },
      { input: { nums: [2, 0, 1] }, expected_output: [0, 1, 2], hidden: false },
      { input: { nums: [0] }, expected_output: [0], hidden: true },
      { input: { nums: [1] }, expected_output: [1], hidden: true },
      { input: { nums: [2, 2, 2, 1, 1, 0, 0, 1, 2] }, expected_output: [0, 0, 1, 1, 1, 2, 2, 2, 2], hidden: true },
      { input: { nums: [1, 2, 0] }, expected_output: [0, 1, 2], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def sortColors(self, nums: List[int]) -> List[int]:\n        l, r = 0, len(nums) - 1\n        i = 0\n        while i <= r:\n            if nums[i] == 0:\n                nums[l], nums[i] = nums[i], nums[l]\n                l += 1\n                i += 1\n            elif nums[i] == 2:\n                nums[i], nums[r] = nums[r], nums[i]\n                r -= 1\n            else:\n                i += 1\n        return nums\n',
      javascript: 'function sortColors(nums) {\n    let l = 0, r = nums.length - 1, i = 0;\n    while (i <= r) {\n        if (nums[i] === 0) {\n            [nums[l], nums[i]] = [nums[i], nums[l]];\n            l++;\n            i++;\n        } else if (nums[i] === 2) {\n            [nums[i], nums[r]] = [nums[r], nums[i]];\n            r--;\n        } else {\n            i++;\n        }\n    }\n    return nums;\n}\n'
    },
    hints: ['Use three pointers: `l` for 0s boundary, `r` for 2s boundary, and `i` to scan.'],
    editorial_md: '### Method: Dutch National Flag 3-Way Partition\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 2. Subarray Sum Equals K
  {
    category: 'arrays-and-hashing',
    slug: 'subarray-sum-equals-k',
    title: 'Subarray Sum Equals K',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'Prefix Sum'],
    statement_md: 'Given an array of integers `nums` and an integer `k`, return *the total number of subarrays whose sum equals to* `k`.\n\nA subarray is a contiguous non-empty sequence of elements within an array.',
    constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    examples: [
      { input: { nums: [1, 1, 1], k: 2 }, output: 2 },
      { input: { nums: [1, 2, 3], k: 3 }, output: 2 }
    ],
    starter_code: {
      python: 'class Solution:\n    def subarraySum(self, nums: List[int], k: int) -> int:\n        pass\n',
      javascript: 'function subarraySum(nums, k) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [1, 1, 1], k: 2 }, expected_output: 2, hidden: false },
      { input: { nums: [1, 2, 3], k: 3 }, expected_output: 2, hidden: false },
      { input: { nums: [1], k: 0 }, expected_output: 0, hidden: true },
      { input: { nums: [-1, -1, 1], k: 0 }, expected_output: 1, hidden: true },
      { input: { nums: [1, -1, 0], k: 0 }, expected_output: 3, hidden: true },
      { input: { nums: [3, 4, 7, 2, -3, 1, 4, 2], k: 7 }, expected_output: 4, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def subarraySum(self, nums: List[int], k: int) -> int:\n        res = 0\n        cur_sum = 0\n        prefix_sums = {0: 1}\n        for n in nums:\n            cur_sum += n\n            diff = cur_sum - k\n            res += prefix_sums.get(diff, 0)\n            prefix_sums[cur_sum] = prefix_sums.get(cur_sum, 0) + 1\n        return res\n',
      javascript: 'function subarraySum(nums, k) {\n    let res = 0, curSum = 0;\n    const map = new Map();\n    map.set(0, 1);\n    for (const n of nums) {\n        curSum += n;\n        const diff = curSum - k;\n        if (map.has(diff)) res += map.get(diff);\n        map.set(curSum, (map.get(curSum) || 0) + 1);\n    }\n    return res;\n}\n'
    },
    hints: ['Use a prefix sum hash map tracking counts of previous sums encountered.'],
    editorial_md: '### Method: Prefix Sum Hash Map\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 3. Maximum Product Subarray
  {
    category: 'dynamic-programming',
    slug: 'maximum-product-subarray',
    title: 'Maximum Product Subarray',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    statement_md: 'Given an integer array `nums`, find a subarray that has the largest product, and return *the product*.',
    constraints: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10'],
    examples: [
      { input: { nums: [2, 3, -2, 4] }, output: 6 },
      { input: { nums: [-2, 0, -1] }, output: 0 }
    ],
    starter_code: {
      python: 'class Solution:\n    def maxProduct(self, nums: List[int]) -> int:\n        pass\n',
      javascript: 'function maxProduct(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [2, 3, -2, 4] }, expected_output: 6, hidden: false },
      { input: { nums: [-2, 0, -1] }, expected_output: 0, hidden: false },
      { input: { nums: [-2] }, expected_output: -2, hidden: true },
      { input: { nums: [-2, 3, -4] }, expected_output: 24, hidden: true },
      { input: { nums: [0, 2] }, expected_output: 2, hidden: true },
      { input: { nums: [2, -5, -2, -4, 3] }, expected_output: 24, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def maxProduct(self, nums: List[int]) -> int:\n        res = max(nums)\n        cur_min, cur_max = 1, 1\n        for n in nums:\n            if n == 0:\n                cur_min, cur_max = 1, 1\n                continue\n            tmp = cur_max * n\n            cur_max = max(n * cur_max, n * cur_min, n)\n            cur_min = min(tmp, n * cur_min, n)\n            res = max(res, cur_max)\n        return res\n',
      javascript: 'function maxProduct(nums) {\n    let res = Math.max(...nums);\n    let curMin = 1, curMax = 1;\n    for (const n of nums) {\n        if (n === 0) {\n            curMin = 1;\n            curMax = 1;\n            continue;\n        }\n        const tmp = curMax * n;\n        curMax = Math.max(n * curMax, n * curMin, n);\n        curMin = Math.min(tmp, n * curMin, n);\n        res = Math.max(res, curMax);\n    }\n    return res;\n}\n'
    },
    hints: ['Track both the running minimum and running maximum because multiplying two negatives yields a positive.'],
    editorial_md: '### Method: Dual State DP (Min & Max Product)\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 4. Sliding Window Maximum
  {
    category: 'sliding-window',
    slug: 'sliding-window-maximum',
    title: 'Sliding Window Maximum',
    difficulty: 'Hard',
    tags: ['Array', 'Queue', 'Sliding Window', 'Heap (Priority Queue)', 'Monotonic Queue'],
    statement_md: 'You are given an array of integers `nums`, there is a sliding window of size `k` which is moving from the very left of the array to the very right. You can only see the `k` numbers in the window. Each time the sliding window moves right by one position.\n\nReturn *the max sliding window*.',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    examples: [
      { input: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, output: [3, 3, 5, 5, 6, 7] },
      { input: { nums: [1], k: 1 }, output: [1] }
    ],
    starter_code: {
      python: 'class Solution:\n    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:\n        pass\n',
      javascript: 'function maxSlidingWindow(nums, k) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 }, expected_output: [3, 3, 5, 5, 6, 7], hidden: false },
      { input: { nums: [1], k: 1 }, expected_output: [1], hidden: false },
      { input: { nums: [1, -1], k: 1 }, expected_output: [1, -1], hidden: true },
      { input: { nums: [9, 11], k: 2 }, expected_output: [11], hidden: true },
      { input: { nums: [4, -2], k: 2 }, expected_output: [4], hidden: true },
      { input: { nums: [7, 2, 4], k: 2 }, expected_output: [7, 4], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def maxSlidingWindow(self, nums: List[int], k: int) -> List[int]:\n        import collections\n        output = []\n        q = collections.deque()\n        l = r = 0\n        while r < len(nums):\n            while q and nums[q[-1]] < nums[r]:\n                q.pop()\n            q.append(r)\n            if l > q[0]:\n                q.popleft()\n            if (r + 1) >= k:\n                output.append(nums[q[0]])\n                l += 1\n            r += 1\n        return output\n',
      javascript: 'function maxSlidingWindow(nums, k) {\n    const output = [];\n    const q = []; // store indices\n    let l = 0, r = 0;\n    while (r < nums.length) {\n        while (q.length > 0 && nums[q[q.length - 1]] < nums[r]) {\n            q.pop();\n        }\n        q.push(r);\n        if (l > q[0]) {\n            q.shift();\n        }\n        if (r + 1 >= k) {\n            output.push(nums[q[0]]);\n            l++;\n        }\n        r++;\n    }\n    return output;\n}\n'
    },
    hints: ['Maintain a Monotonically Decreasing Deque of indices.'],
    editorial_md: '### Method: Monotonic Deque\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(K)$'
  },

  // 5. Word Search
  {
    category: 'backtracking',
    slug: 'word-search',
    title: 'Word Search',
    difficulty: 'Medium',
    tags: ['Array', 'String', 'Backtracking', 'Matrix'],
    statement_md: 'Given an `m x n` grid of characters `board` and a string `word`, return `true` *if* `word` *exists in the grid*.\n\nThe word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15'],
    examples: [
      { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "ABCCED" }, output: true },
      { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "SEE" }, output: true },
      { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "ABCB" }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def exist(self, board: List[List[str]], word: str) -> bool:\n        pass\n',
      javascript: 'function exist(board, word) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "ABCCED" }, expected_output: true, hidden: false },
      { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "SEE" }, expected_output: true, hidden: false },
      { input: { board: [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word: "ABCB" }, expected_output: false, hidden: false },
      { input: { board: [["a"]], word: "a" }, expected_output: true, hidden: true },
      { input: { board: [["a","b"],["c","d"]], word: "abcd" }, expected_output: false, hidden: true },
      { input: { board: [["A","B"],["C","D"]], word: "ACDB" }, expected_output: true, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def exist(self, board: List[List[str]], word: str) -> bool:\n        ROWS, COLS = len(board), len(board[0])\n        path = set()\n        def dfs(r, c, i):\n            if i == len(word):\n                return True\n            if r < 0 or c < 0 or r >= ROWS or c >= COLS or word[i] != board[r][c] or (r, c) in path:\n                return False\n            path.add((r, c))\n            res = dfs(r + 1, c, i + 1) or dfs(r - 1, c, i + 1) or dfs(r, c + 1, i + 1) or dfs(r, c - 1, i + 1)\n            path.remove((r, c))\n            return res\n        for r in range(ROWS):\n            for c in range(COLS):\n                if dfs(r, c, 0):\n                    return True\n        return False\n',
      javascript: 'function exist(board, word) {\n    const ROWS = board.length, COLS = board[0].length;\n    const path = new Set();\n    function dfs(r, c, i) {\n        if (i === word.length) return true;\n        if (r < 0 || c < 0 || r >= ROWS || c >= COLS || board[r][c] !== word[i] || path.has(`${r},${c}`)) {\n            return false;\n        }\n        path.add(`${r},${c}`);\n        const res = dfs(r + 1, c, i + 1) || dfs(r - 1, c, i + 1) || dfs(r, c + 1, i + 1) || dfs(r, c - 1, i + 1);\n        path.delete(`${r},${c}`);\n        return res;\n    }\n    for (let r = 0; r < ROWS; r++) {\n        for (let c = 0; c < COLS; c++) {\n            if (dfs(r, c, 0)) return true;\n        }\n    }\n    return false;\n}\n'
    },
    hints: ['DFS from each cell matching word[0] and backtrack using a visited set.'],
    editorial_md: '### Method: Backtracking Matrix DFS\n- **Time Complexity**: $\\mathcal{O}(N \\cdot M \\cdot 4^L)$\n- **Space Complexity**: $\\mathcal{O}(L)$'
  },

  // 6. Diameter of Binary Tree
  {
    category: 'trees',
    slug: 'diameter-of-binary-tree',
    title: 'Diameter of Binary Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Binary Tree'],
    statement_md: 'Given the `root` of a binary tree, return *the length of the **diameter** of the tree*.\n\nThe **diameter** of a binary tree is the **length** of the longest path between any two nodes in a tree. This path may or may not pass through the `root`.',
    constraints: ['The number of nodes in the tree is in the range [1, 10^4].', '-100 <= Node.val <= 100'],
    examples: [
      { input: { root: [1, 2, 3, 4, 5] }, output: 3 },
      { input: { root: [1, 2] }, output: 1 }
    ],
    starter_code: {
      python: 'class Solution:\n    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:\n        pass\n',
      javascript: 'function diameterOfBinaryTree(root) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { root: [1, 2, 3, 4, 5] }, expected_output: 3, hidden: false },
      { input: { root: [1, 2] }, expected_output: 1, hidden: false },
      { input: { root: [1] }, expected_output: 0, hidden: true },
      { input: { root: [4, -7, -3, null, null, -9, -3, 9, -7, -4, null, 6, null, -6, -6, null, null, 0, 6, 5, null, 9, null, null, -1, -4, null, null, null, -2] }, expected_output: 8, hidden: true },
      { input: { root: [2, 3, null, 1] }, expected_output: 2, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def diameterOfBinaryTree(self, root: Optional[TreeNode]) -> int:\n        res = [0]\n        def dfs(curr):\n            if not curr:\n                return -1\n            left = dfs(curr.left)\n            right = dfs(curr.right)\n            res[0] = max(res[0], 2 + left + right)\n            return 1 + max(left, right)\n        dfs(root)\n        return res[0]\n',
      javascript: 'function diameterOfBinaryTree(root) {\n    let res = 0;\n    function dfs(curr) {\n        if (!curr) return -1;\n        const left = dfs(curr.left);\n        const right = dfs(curr.right);\n        res = Math.max(res, 2 + left + right);\n        return 1 + Math.max(left, right);\n    }\n    dfs(root);\n    return res;\n}\n'
    },
    hints: ['The longest path through a node is `height(left) + height(right) + 2`.'],
    editorial_md: '### Method: Post-Order DFS with Global Max\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(H)$'
  }
];

export function generateBollwarmPack() {
  console.log(`[Bollwarm Pack] Writing ${BOLLWARM_PROBLEMS.length} problems...`);
  for (const prob of BOLLWARM_PROBLEMS) {
    const dir = path.join(ROOT_PROBLEMS_DIR, prob.category);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const filePath = path.join(dir, `${prob.slug}.json`);
    const { category, ...data } = prob;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  + Created: ${prob.category}/${prob.slug}.json`);
  }
}

if (process.argv[1] && process.argv[1].includes('generate-bollwarm-pack')) {
  generateBollwarmPack();
}

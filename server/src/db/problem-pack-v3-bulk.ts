import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ProblemPackItem } from './problem-pack-v3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

export const BULK_V3_PROBLEMS: ProblemPackItem[] = [
  // 18. Trees: Construct Binary Tree from Preorder and Inorder Traversal
  {
    slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    category: 'trees',
    difficulty: 'Medium',
    tags: ['Trees', 'Binary Tree', 'Divide and Conquer', 'Blind 75', 'NeetCode 150', 'Amazon', 'Microsoft'],
    statement_md: 'Given two integer arrays `preorder` and `inorder` where `preorder` is the preorder traversal of a binary tree and `inorder` is the inorder traversal of the same tree, construct and return the *binary tree* in level-order list format.',
    constraints: ['1 <= preorder.length <= 3000', 'inorder.length == preorder.length', '-3000 <= preorder[i], inorder[i] <= 3000', 'preorder and inorder consist of unique values.'],
    examples: [{ input: { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7] }, output: [3,9,20,null,null,15,7] }],
    starter_code: { python: 'def buildTree(preorder: list[int], inorder: list[int]) -> list:\n    # Write your solution here\n    pass\n', javascript: 'function buildTree(preorder, inorder) {\n  // Write your solution here\n}\n' },
    reference_solution: {
      python: `def buildTree(preorder: list[int], inorder: list[int]) -> list:
    if not preorder or not inorder:
        return []
    root_val = preorder[0]
    mid = inorder.index(root_val)
    # Serialize level order
    def build(pre, inord):
        if not pre or not inord:
            return None
        r = TreeNode(pre[0])
        m = inord.index(pre[0])
        r.left = build(pre[1:m+1], inord[:m])
        r.right = build(pre[m+1:], inord[m+1:])
        return r
    root_node = build(preorder, inorder)
    return treeToList(root_node)
`,
      javascript: `function buildTree(preorder, inorder) {
  if (!preorder || !inorder || preorder.length === 0) return [];
  function build(pre, inord) {
    if (!pre.length || !inord.length) return null;
    const r = new TreeNode(pre[0]);
    const m = inord.indexOf(pre[0]);
    r.left = build(pre.slice(1, m + 1), inord.slice(0, m));
    r.right = build(pre.slice(m + 1), inord.slice(m + 1));
    return r;
  }
  const root = build(preorder, inorder);
  return treeToList(root);
}
`
    },
    sample_test_cases: [{ input: { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7] }, expected_output: [3,9,20,null,null,15,7] }],
    test_cases: [
      { input: { preorder: [3,9,20,15,7], inorder: [9,3,15,20,7] }, expected_output: [3,9,20,null,null,15,7] },
      { input: { preorder: [-1], inorder: [-1] }, expected_output: [-1], hidden: true }
    ],
    hints: ['First element of preorder is always root.', 'Find root in inorder to split into left and right subtrees.'],
    editorial_md: 'Recursive divide and conquer on root index split in inorder traversal.'
  },

  // 19. Trees: Populating Next Right Pointers in Each Node
  {
    slug: 'populating-next-right-pointers-in-each-node',
    title: 'Populating Next Right Pointers in Each Node',
    category: 'trees',
    difficulty: 'Medium',
    tags: ['Trees', 'BFS', 'DFS', 'Microsoft', 'Meta'],
    statement_md: 'You are given a **perfect binary tree** where all leaves are on the same level, and every parent has two children. Populate each next pointer to point to its next right node. Return the nodes level-by-level separated by \'#\'.',
    constraints: ['The number of nodes in the tree is in the range [0, 2^12 - 1].', '-1000 <= Node.val <= 1000'],
    examples: [{ input: { root: [1,2,3,4,5,6,7] }, output: [1,'#',2,3,'#',4,5,6,7,'#'] }],
    starter_code: { python: 'def connect(root: list) -> list:\n    # Write your solution here\n    pass\n', javascript: 'function connect(root) {\n  // Write your solution here\n}\n' },
    reference_solution: {
      python: `def connect(root: list) -> list:
    if not root:
        return []
    res = []
    level_size = 1
    idx = 0
    while idx < len(root):
        level_items = []
        for _ in range(level_size):
            if idx < len(root) and root[idx] is not None:
                level_items.append(root[idx])
            idx += 1
        if level_items:
            res.extend(level_items)
            res.append("#")
        level_size *= 2
    return res
`,
      javascript: `function connect(root) {
  if (!root || root.length === 0) return [];
  const res = [];
  let levelSize = 1;
  let idx = 0;
  while (idx < root.length) {
    const level = [];
    for (let i = 0; i < levelSize; i++) {
      if (idx < root.length && root[idx] !== null && root[idx] !== undefined) {
        level.push(root[idx]);
      }
      idx++;
    }
    if (level.length) {
      res.push(...level, '#');
    }
    levelSize *= 2;
  }
  return res;
}
`
    },
    sample_test_cases: [{ input: { root: [1,2,3,4,5,6,7] }, expected_output: [1,'#',2,3,'#',4,5,6,7,'#'] }],
    test_cases: [
      { input: { root: [1,2,3,4,5,6,7] }, expected_output: [1,'#',2,3,'#',4,5,6,7,'#'] },
      { input: { root: [] }, expected_output: [], hidden: true }
    ],
    hints: ['Connect left child next to right child.', 'Connect right child next to current next node left child.'],
    editorial_md: 'Level order BFS pointer connection.'
  },

  // 20. Graphs: Surrounded Regions (Medium - Blind 75 / Google / Amazon)
  {
    slug: 'surrounded-regions',
    title: 'Surrounded Regions',
    category: 'graphs',
    difficulty: 'Medium',
    tags: ['Graphs', 'BFS', 'DFS', 'Matrix', 'Blind 75', 'NeetCode 150', 'Google', 'Amazon'],
    statement_md: 'Given an `m x n` matrix `board` containing `\'X\'` and `\'O\'`, capture all regions that are 4-directionally **surrounded by** `\'X\'`.\n\nA region is captured by flipping all `\'O\'`s into `\'X\'`s in that surrounded region.',
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 200', 'board[i][j] is \'X\' or \'O\'.'],
    examples: [
      { input: { board: [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']] }, output: [['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']] }
    ],
    starter_code: { python: 'def solve(board: list[list[str]]) -> list[list[str]]:\n    # Modify board in-place and return it\n    pass\n', javascript: 'function solve(board) {\n  // Modify board in-place and return it\n}\n' },
    reference_solution: {
      python: `def solve(board: list[list[str]]) -> list[list[str]]:
    if not board:
        return board
    R, C = len(board), len(board[0])
    
    def dfs(r, c):
        if r < 0 or r >= R or c < 0 or c >= C or board[r][c] != 'O':
            return
        board[r][c] = 'T'
        dfs(r + 1, c)
        dfs(r - 1, c)
        dfs(r, c + 1)
        dfs(r, c - 1)
        
    # Mark border-connected 'O's as 'T'
    for r in range(R):
        dfs(r, 0)
        dfs(r, C - 1)
    for c in range(C):
        dfs(0, c)
        dfs(R - 1, c)
        
    for r in range(R):
        for c in range(C):
            if board[r][c] == 'O':
                board[r][c] = 'X'
            elif board[r][c] == 'T':
                board[r][c] = 'O'
    return board
`,
      javascript: `function solve(board) {
  if (!board || board.length === 0) return board;
  const R = board.length, C = board[0].length;
  function dfs(r, c) {
    if (r < 0 || r >= R || c < 0 || c >= C || board[r][c] !== 'O') return;
    board[r][c] = 'T';
    dfs(r + 1, c);
    dfs(r - 1, c);
    dfs(r, c + 1);
    dfs(r, c - 1);
  }
  for (let r = 0; r < R; r++) { dfs(r, 0); dfs(r, C - 1); }
  for (let c = 0; c < C; c++) { dfs(0, c); dfs(R - 1, c); }
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (board[r][c] === 'O') board[r][c] = 'X';
      else if (board[r][c] === 'T') board[r][c] = 'O';
    }
  }
  return board;
}
`
    },
    sample_test_cases: [
      { input: { board: [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']] }, expected_output: [['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']] }
    ],
    test_cases: [
      { input: { board: [['X','X','X','X'],['X','O','O','X'],['X','X','O','X'],['X','O','X','X']] }, expected_output: [['X','X','X','X'],['X','X','X','X'],['X','X','X','X'],['X','O','X','X']] },
      { input: { board: [['X']] }, expected_output: [['X']], hidden: true }
    ],
    hints: ['Capture everything except the regions connected to the border \'O\'s.', 'Run DFS/BFS from the borders first.'],
    editorial_md: 'Boundary DFS uncapture marking.'
  },

  // 21. DP: Target Sum (Medium - Blind 75 / NeetCode 150 / Meta / Amazon)
  {
    slug: 'target-sum',
    title: 'Target Sum',
    category: 'dynamic-programming',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Backtracking', 'Knapsack', 'Blind 75', 'NeetCode 150', 'Meta', 'Amazon'],
    statement_md: 'You are given an integer array `nums` and an integer `target`.\n\nYou want to build an expression out of nums by adding one of the symbols `\'+\'` and `\'-\'` before each integer in nums and then concatenate all the integers.\n\nReturn the number of different **expressions** that you can build, which evaluates to `target`.',
    constraints: ['1 <= nums.length <= 20', '0 <= nums[i] <= 1000', '0 <= sum(nums[i]) <= 1000', '-1000 <= target <= 1000'],
    examples: [
      { input: { nums: [1,1,1,1,1], target: 3 }, output: 5, explanation: '-1+1+1+1+1=3, +1-1+1+1+1=3, +1+1-1+1+1=3, +1+1+1-1+1=3, +1+1+1+1-1=3' },
      { input: { nums: [1], target: 1 }, output: 1 }
    ],
    starter_code: { python: 'def findTargetSumWays(nums: list[int], target: int) -> int:\n    # Write your solution here\n    pass\n', javascript: 'function findTargetSumWays(nums, target) {\n  // Write your solution here\n}\n' },
    reference_solution: {
      python: `def findTargetSumWays(nums: list[int], target: int) -> int:
    memo = {}
    def backtrack(i, total):
        if i == len(nums):
            return 1 if total == target else 0
        if (i, total) in memo:
            return memo[(i, total)]
        memo[(i, total)] = backtrack(i + 1, total + nums[i]) + backtrack(i + 1, total - nums[i])
        return memo[(i, total)]
    return backtrack(0, 0)
`,
      javascript: `function findTargetSumWays(nums, target) {
  const memo = new Map();
  function backtrack(i, total) {
    if (i === nums.length) return total === target ? 1 : 0;
    const key = \`\${i},\${total}\`;
    if (memo.has(key)) return memo.get(key);
    const ways = backtrack(i + 1, total + nums[i]) + backtrack(i + 1, total - nums[i]);
    memo.set(key, ways);
    return ways;
  }
  return backtrack(0, 0);
}
`
    },
    sample_test_cases: [
      { input: { nums: [1,1,1,1,1], target: 3 }, expected_output: 5 },
      { input: { nums: [1], target: 1 }, expected_output: 1 }
    ],
    test_cases: [
      { input: { nums: [1,1,1,1,1], target: 3 }, expected_output: 5 },
      { input: { nums: [1], target: 1 }, expected_output: 1 },
      { input: { nums: [1,0], target: 1 }, expected_output: 2, hidden: true }
    ],
    hints: ['Formulate as subset sum: `P - N = target` and `P + N = sum` -> `2P = target + sum`.', 'Or use memoized DFS on `(index, current_sum)`.'],
    editorial_md: '0/1 Knapsack reduction or memoized DFS.'
  },

  // 22. DP: Interleaving String (Medium - Blind 75 / Google / Amazon)
  {
    slug: 'interleaving-string',
    title: 'Interleaving String',
    category: 'dynamic-programming',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'String', 'Blind 75', 'NeetCode 150', 'Google', 'Amazon'],
    statement_md: 'Given strings `s1`, `s2`, and `s3`, find whether `s3` is formed by an **interleaving** of `s1` and `s2`.\n\nAn interleaving of two strings `s` and `t` is a configuration where `s` and `t` are divided into `n` and `m` substrings respectively, such that `s = s1 + s2 + ... + sn` and `t = t1 + t2 + ... + tm` and the concatenation matches `s3`.',
    constraints: ['0 <= s1.length, s2.length <= 100', '0 <= s3.length <= 200', 's1, s2, and s3 consist of lowercase English letters.'],
    examples: [
      { input: { s1: 'aabcc', s2: 'dbbca', s3: 'aadbbcbcac' }, output: true },
      { input: { s1: 'aabcc', s2: 'dbbca', s3: 'aadbbbaccc' }, output: false },
      { input: { s1: '', s2: '', s3: '' }, output: true }
    ],
    starter_code: { python: 'def isInterleave(s1: str, s2: str, s3: str) -> bool:\n    # Write your solution here\n    pass\n', javascript: 'function isInterleave(s1, s2, s3) {\n  // Write your solution here\n}\n' },
    reference_solution: {
      python: `def isInterleave(s1: str, s2: str, s3: str) -> bool:
    if len(s1) + len(s2) != len(s3):
        return False
    memo = {}
    def dfs(i, j):
        if i == len(s1) and j == len(s2):
            return True
        if (i, j) in memo:
            return memo[(i, j)]
        k = i + j
        ans = False
        if i < len(s1) and s1[i] == s3[k]:
            ans = ans or dfs(i + 1, j)
        if j < len(s2) and s2[j] == s3[k]:
            ans = ans or dfs(i, j + 1)
        memo[(i, j)] = ans
        return ans
    return dfs(0, 0)
`,
      javascript: `function isInterleave(s1, s2, s3) {
  if (s1.length + s2.length !== s3.length) return false;
  const memo = new Map();
  function dfs(i, j) {
    if (i === s1.length && j === s2.length) return true;
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key);
    const k = i + j;
    let ans = false;
    if (i < s1.length && s1[i] === s3[k]) ans = ans || dfs(i + 1, j);
    if (j < s2.length && s2[j] === s3[k]) ans = ans || dfs(i, j + 1);
    memo.set(key, ans);
    return ans;
  }
  return dfs(0, 0);
}
`
    },
    sample_test_cases: [
      { input: { s1: 'aabcc', s2: 'dbbca', s3: 'aadbbcbcac' }, expected_output: true },
      { input: { s1: 'aabcc', s2: 'dbbca', s3: 'aadbbbaccc' }, expected_output: false },
      { input: { s1: '', s2: '', s3: '' }, expected_output: true }
    ],
    test_cases: [
      { input: { s1: 'aabcc', s2: 'dbbca', s3: 'aadbbcbcac' }, expected_output: true },
      { input: { s1: 'aabcc', s2: 'dbbca', s3: 'aadbbbaccc' }, expected_output: false },
      { input: { s1: '', s2: '', s3: '' }, expected_output: true }
    ],
    hints: ['2D DP state: `dp[i][j]` represents whether `s3[0...i+j]` is formed by `s1[0...i]` and `s2[0...j]`.'],
    editorial_md: '2D Dynamic programming on string indices.'
  },

  // 23. DP: Maximal Square (Medium - Blind 75 / Apple / Amazon)
  {
    slug: 'maximal-square',
    title: 'Maximal Square',
    category: 'dynamic-programming',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Matrix', 'Apple', 'Amazon', 'Google'],
    statement_md: 'Given an `m x n` binary `matrix` filled with `0`\'s and `1`\'s, find the largest square containing only `1`\'s and return *its area*.',
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 300', 'matrix[i][j] is \'0\' or \'1\'.'],
    examples: [
      { input: { matrix: [['1','0','1','0','0'],['1','0','1','1','1'],['1','1','1','1','1'],['1','0','0','1','0']] }, output: 4 },
      { input: { matrix: [['0','1'],['1','0']] }, output: 1 },
      { input: { matrix: [['0']] }, output: 0 }
    ],
    starter_code: { python: 'def maximalSquare(matrix: list[list[str]]) -> int:\n    # Write your solution here\n    pass\n', javascript: 'function maximalSquare(matrix) {\n  // Write your solution here\n}\n' },
    reference_solution: {
      python: `def maximalSquare(matrix: list[list[str]]) -> int:
    if not matrix:
        return 0
    R, C = len(matrix), len(matrix[0])
    dp = [[0] * (C + 1) for _ in range(R + 1)]
    max_side = 0
    for r in range(R):
        for c in range(C):
            if matrix[r][c] == '1':
                dp[r + 1][c + 1] = min(dp[r][c + 1], dp[r + 1][c], dp[r][c]) + 1
                max_side = max(max_side, dp[r + 1][c + 1])
    return max_side * max_side
`,
      javascript: `function maximalSquare(matrix) {
  if (!matrix || matrix.length === 0) return 0;
  const R = matrix.length, C = matrix[0].length;
  const dp = Array.from({ length: R + 1 }, () => Array(C + 1).fill(0));
  let maxSide = 0;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (matrix[r][c] === '1') {
        dp[r + 1][c + 1] = Math.min(dp[r][c + 1], dp[r + 1][c], dp[r][c]) + 1;
        maxSide = Math.max(maxSide, dp[r + 1][c + 1]);
      }
    }
  }
  return maxSide * maxSide;
}
`
    },
    sample_test_cases: [
      { input: { matrix: [['1','0','1','0','0'],['1','0','1','1','1'],['1','1','1','1','1'],['1','0','0','1','0']] }, expected_output: 4 },
      { input: { matrix: [['0','1'],['1','0']] }, expected_output: 1 },
      { input: { matrix: [['0']] }, expected_output: 0 }
    ],
    test_cases: [
      { input: { matrix: [['1','0','1','0','0'],['1','0','1','1','1'],['1','1','1','1','1'],['1','0','0','1','0']] }, expected_output: 4 },
      { input: { matrix: [['0','1'],['1','0']] }, expected_output: 1 },
      { input: { matrix: [['0']] }, expected_output: 0 }
    ],
    hints: ['`dp[r][c]` is max square side ending at `(r, c)`.', '`dp[r][c] = min(top, left, topleft) + 1`.'],
    editorial_md: 'Bottom-up dynamic programming computing square edge lengths.'
  },

  // 24. Stack: Asteroid Collision (Medium - Blind 75 / Amazon / DoorDash)
  {
    slug: 'asteroid-collision',
    title: 'Asteroid Collision',
    category: 'stack',
    difficulty: 'Medium',
    tags: ['Stack', 'Array', 'Simulation', 'Amazon', 'DoorDash'],
    statement_md: 'We are given an array `asteroids` of integers representing asteroids in a row. For each asteroid, the absolute value represents its size, and the sign represents its direction (positive meaning right, negative meaning left). Each asteroid moves at the same speed.\n\nFind out the state of the asteroids after all collisions. If two asteroids meet, the smaller one will explode. If both are the same size, both will explode. Two asteroids moving in the same direction will never meet.',
    constraints: ['2 <= asteroids.length <= 10^4', '-1000 <= asteroids[i] <= 1000', 'asteroids[i] != 0'],
    examples: [
      { input: { asteroids: [5,10,-5] }, output: [5,10] },
      { input: { asteroids: [8,-8] }, output: [] },
      { input: { asteroids: [10,2,-5] }, output: [10] }
    ],
    starter_code: { python: 'def asteroidCollision(asteroids: list[int]) -> list[int]:\n    # Write your solution here\n    pass\n', javascript: 'function asteroidCollision(asteroids) {\n  // Write your solution here\n}\n' },
    reference_solution: {
      python: `def asteroidCollision(asteroids: list[int]) -> list[int]:
    stack = []
    for a in asteroids:
        while stack and a < 0 and stack[-1] > 0:
            diff = a + stack[-1]
            if diff < 0:
                stack.pop()
            elif diff > 0:
                a = 0
            else:
                a = 0
                stack.pop()
        if a:
            stack.append(a)
    return stack
`,
      javascript: `function asteroidCollision(asteroids) {
  const stack = [];
  for (let a of asteroids) {
    while (stack.length > 0 && a < 0 && stack[stack.length - 1] > 0) {
      const diff = a + stack[stack.length - 1];
      if (diff < 0) {
        stack.pop();
      } else if (diff > 0) {
        a = 0;
      } else {
        a = 0;
        stack.pop();
      }
    }
    if (a !== 0) stack.push(a);
  }
  return stack;
}
`
    },
    sample_test_cases: [
      { input: { asteroids: [5,10,-5] }, expected_output: [5,10] },
      { input: { asteroids: [8,-8] }, expected_output: [] },
      { input: { asteroids: [10,2,-5] }, expected_output: [10] }
    ],
    test_cases: [
      { input: { asteroids: [5,10,-5] }, expected_output: [5,10] },
      { input: { asteroids: [8,-8] }, expected_output: [] },
      { input: { asteroids: [10,2,-5] }, expected_output: [10] },
      { input: { asteroids: [-2,-1,1,2] }, expected_output: [-2,-1,1,2], hidden: true }
    ],
    hints: ['Collision occurs ONLY when stack top is positive and current asteroid is negative.', 'Simulate destruction until one survives or both explode.'],
    editorial_md: 'Stack collision simulation with magnitude comparison.'
  },

  // 25. Stack: Evaluate Reverse Polish Notation (Medium - Blind 75 / NeetCode 150 / LinkedIn)
  {
    slug: 'evaluate-reverse-polish-notation',
    title: 'Evaluate Reverse Polish Notation',
    category: 'stack',
    difficulty: 'Medium',
    tags: ['Stack', 'Array', 'Math', 'Blind 75', 'NeetCode 150', 'LinkedIn'],
    statement_md: 'You are given an array of strings `tokens` that represents an arithmetic expression in a **Reverse Polish Notation**.\n\nEvaluate the expression. Return *an integer that represents the value of the expression*.\n\nNote that division between two integers should truncate toward zero.',
    constraints: ['1 <= tokens.length <= 10^4', 'tokens[i] is either an operator: \'+\', \'-\', \'*\', or \'/\', or an integer in the range [-200, 200].'],
    examples: [
      { input: { tokens: ['2','1','+','3','*'] }, output: 9 },
      { input: { tokens: ['4','13','5','/','+'] }, output: 6 },
      { input: { tokens: ['10','6','9','3','+','-11','*','/','*','17','+','5','+'] }, output: 22 }
    ],
    starter_code: { python: 'def evalRPN(tokens: list[str]) -> int:\n    # Write your solution here\n    pass\n', javascript: 'function evalRPN(tokens) {\n  // Write your solution here\n}\n' },
    reference_solution: {
      python: `def evalRPN(tokens: list[str]) -> int:
    stack = []
    for t in tokens:
        if t in "+-*/":
            b = stack.pop()
            a = stack.pop()
            if t == '+': stack.append(a + b)
            elif t == '-': stack.append(a - b)
            elif t == '*': stack.append(a * b)
            elif t == '/': stack.append(int(a / b))
        else:
            stack.append(int(t))
    return stack[0]
`,
      javascript: `function evalRPN(tokens) {
  const stack = [];
  for (const t of tokens) {
    if (t === '+' || t === '-' || t === '*' || t === '/') {
      const b = stack.pop();
      const a = stack.pop();
      if (t === '+') stack.push(a + b);
      else if (t === '-') stack.push(a - b);
      else if (t === '*') stack.push(a * b);
      else if (t === '/') stack.push(Math.trunc(a / b));
    } else {
      stack.push(Number(t));
    }
  }
  return stack[0];
}
`
    },
    sample_test_cases: [
      { input: { tokens: ['2','1','+','3','*'] }, expected_output: 9 },
      { input: { tokens: ['4','13','5','/','+'] }, expected_output: 6 }
    ],
    test_cases: [
      { input: { tokens: ['2','1','+','3','*'] }, expected_output: 9 },
      { input: { tokens: ['4','13','5','/','+'] }, expected_output: 6 },
      { input: { tokens: ['10','6','9','3','+','-11','*','/','*','17','+','5','+'] }, expected_output: 22 }
    ],
    hints: ['Push numbers to stack.', 'When operator appears, pop two numbers, apply operation, and push result back.'],
    editorial_md: 'Postfix arithmetic stack evaluation.'
  },

  // 26. Matrix: Set Matrix Zeroes (Medium - Blind 75 / Meta / Microsoft)
  {
    slug: 'set-matrix-zeroes',
    title: 'Set Matrix Zeroes',
    category: 'arrays-and-hashing',
    difficulty: 'Medium',
    tags: ['Matrix', 'Array', 'Blind 75', 'NeetCode 150', 'Meta', 'Microsoft'],
    statement_md: 'Given an `m x n` integer matrix `matrix`, if an element is `0`, set its entire row and column to `0`\'s.\n\nYou must do it in place with `O(1)` constant extra space.',
    constraints: ['m == matrix.length', 'n == matrix[0].length', '1 <= m, n <= 200', '-2^31 <= matrix[i][j] <= 2^31 - 1'],
    examples: [
      { input: { matrix: [[1,1,1],[1,0,1],[1,1,1]] }, output: [[1,0,1],[0,0,0],[1,0,1]] },
      { input: { matrix: [[0,1,2,0],[3,4,5,2],[1,3,1,5]] }, output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]] }
    ],
    starter_code: { python: 'def setZeroes(matrix: list[list[int]]) -> list[list[int]]:\n    # Modify matrix in-place and return it\n    pass\n', javascript: 'function setZeroes(matrix) {\n  // Modify matrix in-place and return it\n}\n' },
    reference_solution: {
      python: `def setZeroes(matrix: list[list[int]]) -> list[list[int]]:
    R, C = len(matrix), len(matrix[0])
    row_zero = False
    for r in range(R):
        for c in range(C):
            if matrix[r][c] == 0:
                matrix[0][c] = 0
                if r > 0:
                    matrix[r][0] = 0
                else:
                    row_zero = True
    for r in range(1, R):
        for c in range(1, C):
            if matrix[0][c] == 0 or matrix[r][0] == 0:
                matrix[r][c] = 0
    if matrix[0][0] == 0:
        for r in range(R):
            matrix[r][0] = 0
    if row_zero:
        for c in range(C):
            matrix[0][c] = 0
    return matrix
`,
      javascript: `function setZeroes(matrix) {
  const R = matrix.length, C = matrix[0].length;
  let rowZero = false;
  for (let r = 0; r < R; r++) {
    for (let c = 0; c < C; c++) {
      if (matrix[r][c] === 0) {
        matrix[0][c] = 0;
        if (r > 0) matrix[r][0] = 0;
        else rowZero = true;
      }
    }
  }
  for (let r = 1; r < R; r++) {
    for (let c = 1; c < C; c++) {
      if (matrix[0][c] === 0 || matrix[r][0] === 0) {
        matrix[r][c] = 0;
      }
    }
  }
  if (matrix[0][0] === 0) {
    for (let r = 0; r < R; r++) matrix[r][0] = 0;
  }
  if (rowZero) {
    for (let c = 0; c < C; c++) matrix[0][c] = 0;
  }
  return matrix;
}
`
    },
    sample_test_cases: [
      { input: { matrix: [[1,1,1],[1,0,1],[1,1,1]] }, expected_output: [[1,0,1],[0,0,0],[1,0,1]] },
      { input: { matrix: [[0,1,2,0],[3,4,5,2],[1,3,1,5]] }, expected_output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]] }
    ],
    test_cases: [
      { input: { matrix: [[1,1,1],[1,0,1],[1,1,1]] }, expected_output: [[1,0,1],[0,0,0],[1,0,1]] },
      { input: { matrix: [[0,1,2,0],[3,4,5,2],[1,3,1,5]] }, expected_output: [[0,0,0,0],[0,4,5,0],[0,3,1,0]] }
    ],
    hints: ['Use the first row and first column as in-place storage flags.', 'Use a separate boolean variable `row_zero` for the first row.'],
    editorial_md: 'O(1) space matrix zero marking using row/column headers.'
  }
];

export function writeBulkProblems() {
  let count = 0;
  for (const prob of BULK_V3_PROBLEMS) {
    const dir = path.join(PROBLEMS_DIR, prob.category);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, `${prob.slug}.json`), JSON.stringify(prob, null, 2), 'utf-8');
    count++;
  }
  console.log(`[Bulk V3] Wrote ${count} new problems.`);
}

writeBulkProblems();

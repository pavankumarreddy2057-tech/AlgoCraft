import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

export interface ProblemPackItem {
  slug: string;
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  statement_md: string;
  constraints: string[];
  examples: Array<{ input: any; output: any; explanation?: string }>;
  starter_code: {
    python?: string;
    javascript?: string;
    sql?: string;
  };
  reference_solution: {
    python?: string;
    javascript?: string;
    sql?: string;
  };
  sample_test_cases: Array<{ input: any; expected_output: any }>;
  test_cases: Array<{ input: any; expected_output: any; hidden?: boolean }>;
  hints: string[];
  editorial_md: string;
  time_limit_ms?: number;
  memory_limit_mb?: number;
}

export const V3_PROBLEMS: ProblemPackItem[] = [
  // ==========================================
  // 1. Binary Search: Median of Two Sorted Arrays (Hard - Google / Amazon / Meta)
  // ==========================================
  {
    slug: 'median-of-two-sorted-arrays',
    title: 'Median of Two Sorted Arrays',
    category: 'binary-search',
    difficulty: 'Hard',
    tags: ['Binary Search', 'Array', 'Divide and Conquer', 'Blind 75', 'NeetCode 150', 'Google', 'Meta'],
    statement_md: 'Given two sorted arrays `nums1` and `nums2` of size `m` and `n` respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be `O(log (m+n))`.',
    constraints: [
      'nums1.length == m',
      'nums2.length == n',
      '0 <= m <= 1000',
      '0 <= n <= 1000',
      '1 <= m + n <= 2000',
      '-10^6 <= nums1[i], nums2[i] <= 10^6'
    ],
    examples: [
      { input: { nums1: [1, 3], nums2: [2] }, output: 2.0, explanation: 'Merged array = [1,2,3] and median is 2.' },
      { input: { nums1: [1, 2], nums2: [3, 4] }, output: 2.5, explanation: 'Merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' }
    ],
    starter_code: {
      python: 'def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    # Write your solution here\n    pass\n',
      javascript: 'function findMedianSortedArrays(nums1, nums2) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:
    A, B = nums1, nums2
    total = len(nums1) + len(nums2)
    half = total // 2
    if len(B) < len(A):
        A, B = B, A
    
    l, r = 0, len(A) - 1
    while True:
        i = (l + r) // 2
        j = half - i - 2
        
        Aleft = A[i] if i >= 0 else float("-infinity")
        Aright = A[i + 1] if (i + 1) < len(A) else float("infinity")
        Bleft = B[j] if j >= 0 else float("-infinity")
        Bright = B[j + 1] if (j + 1) < len(B) else float("infinity")
        
        if Aleft <= Bright and Bleft <= Aright:
            if total % 2:
                return float(min(Aright, Bright))
            return (max(Aleft, Bleft) + min(Aright, Bright)) / 2.0
        elif Aleft > Bright:
            r = i - 1
        else:
            l = i + 1
`,
      javascript: `function findMedianSortedArrays(nums1, nums2) {
  let A = nums1, B = nums2;
  const total = A.length + B.length;
  const half = Math.floor(total / 2);
  if (B.length < A.length) {
    A = nums2;
    B = nums1;
  }
  let l = 0, r = A.length - 1;
  while (true) {
    const i = Math.floor((l + r) / 2);
    const j = half - i - 2;
    const Aleft = i >= 0 ? A[i] : -Infinity;
    const Aright = (i + 1) < A.length ? A[i + 1] : Infinity;
    const Bleft = j >= 0 ? B[j] : -Infinity;
    const Bright = (j + 1) < B.length ? B[j + 1] : Infinity;
    if (Aleft <= Bright && Bleft <= Aright) {
      if (total % 2 !== 0) {
        return Math.min(Aright, Bright);
      }
      return (Math.max(Aleft, Bleft) + Math.min(Aright, Bright)) / 2;
    } else if (Aleft > Bright) {
      r = i - 1;
    } else {
      l = i + 1;
    }
  }
}
`
    },
    sample_test_cases: [
      { input: { nums1: [1, 3], nums2: [2] }, expected_output: 2.0 },
      { input: { nums1: [1, 2], nums2: [3, 4] }, expected_output: 2.5 }
    ],
    test_cases: [
      { input: { nums1: [1, 3], nums2: [2] }, expected_output: 2.0 },
      { input: { nums1: [1, 2], nums2: [3, 4] }, expected_output: 2.5 },
      { input: { nums1: [0, 0], nums2: [0, 0] }, expected_output: 0.0, hidden: true },
      { input: { nums1: [], nums2: [1] }, expected_output: 1.0, hidden: true },
      { input: { nums1: [2], nums2: [] }, expected_output: 2.0, hidden: true },
      { input: { nums1: [1, 3, 8, 9, 15], nums2: [7, 11, 18, 19, 21, 25] }, expected_output: 11.0, hidden: true }
    ],
    hints: [
      'Binary search on the smaller array partition index `i`.',
      'Partition array A and B such that left half has equal size to right half.',
      'Check if max(LeftA, LeftB) <= min(RightA, RightB).'
    ],
    editorial_md: 'Binary search on the partition cut index of the smaller array.'
  },

  // ==========================================
  // 2. Trees: Binary Tree Maximum Path Sum (Hard - Blind 75 / Meta / Apple)
  // ==========================================
  {
    slug: 'binary-tree-maximum-path-sum',
    title: 'Binary Tree Maximum Path Sum',
    category: 'trees',
    difficulty: 'Hard',
    tags: ['Trees', 'DFS', 'Dynamic Programming', 'Blind 75', 'NeetCode 150', 'Meta', 'Amazon'],
    statement_md: 'A **path** in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence **at most once**. Note that the path does not need to pass through the root.\n\nThe **path sum** of a path is the sum of the node\'s values in the path.\n\nGiven the `root` of a binary tree, return the *maximum path sum* of any non-empty path.',
    constraints: [
      'The number of nodes in the tree is in the range [1, 3 * 10^4].',
      '-1000 <= Node.val <= 1000'
    ],
    examples: [
      { input: { root: [1, 2, 3] }, output: 6, explanation: 'The optimal path is 2 -> 1 -> 3 with a path sum of 2 + 1 + 3 = 6.' },
      { input: { root: [-10, 9, 20, null, null, 15, 7] }, output: 42, explanation: 'The optimal path is 15 -> 20 -> 7 with a path sum of 15 + 20 + 7 = 42.' }
    ],
    starter_code: {
      python: '# class TreeNode:\n#     def __init__(self, val=0, left=None, right=None):\n#         self.val = val\n#         self.left = left\n#         self.right = right\n\ndef maxPathSum(root: list) -> int:\n    # Write your solution here\n    pass\n',
      javascript: 'function maxPathSum(root) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `def maxPathSum(root) -> int:
    if not root:
        return 0
    
    # Handle tree list array representation directly
    if isinstance(root, list):
        if not root:
            return 0
        nodes = [TreeNode(x) if x is not None else None for x in root]
        for i in range(len(nodes)):
            if nodes[i]:
                l_idx = 2 * i + 1
                r_idx = 2 * i + 2
                if l_idx < len(nodes):
                    nodes[i].left = nodes[l_idx]
                if r_idx < len(nodes):
                    nodes[i].right = nodes[r_idx]
        root = nodes[0]
        
    res = [float("-inf")]
    
    def dfs(node):
        if not node:
            return 0
        left_max = max(dfs(node.left), 0)
        right_max = max(dfs(node.right), 0)
        res[0] = max(res[0], node.val + left_max + right_max)
        return node.val + max(left_max, right_max)
        
    dfs(root)
    return res[0]
`,
      javascript: `function maxPathSum(root) {
  if (!root) return 0;
  let treeRoot = root;
  if (Array.isArray(root)) {
    if (root.length === 0) return 0;
    const nodes = root.map(x => x !== null && x !== undefined ? new TreeNode(x) : null);
    for (let i = 0; i < nodes.length; i++) {
      if (nodes[i]) {
        const l = 2 * i + 1;
        const r = 2 * i + 2;
        if (l < nodes.length) nodes[i].left = nodes[l];
        if (r < nodes.length) nodes[i].right = nodes[r];
      }
    }
    treeRoot = nodes[0];
  }
  let maxVal = -Infinity;
  function dfs(node) {
    if (!node) return 0;
    const left = Math.max(dfs(node.left), 0);
    const right = Math.max(dfs(node.right), 0);
    maxVal = Math.max(maxVal, node.val + left + right);
    return node.val + Math.max(left, right);
  }
  dfs(treeRoot);
  return maxVal;
}
`
    },
    sample_test_cases: [
      { input: { root: [1, 2, 3] }, expected_output: 6 },
      { input: { root: [-10, 9, 20, null, null, 15, 7] }, expected_output: 42 }
    ],
    test_cases: [
      { input: { root: [1, 2, 3] }, expected_output: 6 },
      { input: { root: [-10, 9, 20, null, null, 15, 7] }, expected_output: 42 },
      { input: { root: [-3] }, expected_output: -3, hidden: true },
      { input: { root: [2, -1] }, expected_output: 2, hidden: true },
      { input: { root: [1, -2, 3] }, expected_output: 4, hidden: true }
    ],
    hints: [
      'For each node, compute the max contribution of its left and right subtrees (ignoring negatives).',
      'Update the global maximum path with node.val + leftMax + rightMax.',
      'Return node.val + max(leftMax, rightMax) up to the parent.'
    ],
    editorial_md: 'Post-order DFS traversal calculating maximum subtree branch contributions.'
  },

  // ==========================================
  // 3. Graphs: Clone Graph (Medium - Blind 75 / NeetCode 150 / Meta)
  // ==========================================
  {
    slug: 'clone-graph',
    title: 'Clone Graph',
    category: 'graphs',
    difficulty: 'Medium',
    tags: ['Graphs', 'BFS', 'DFS', 'Hash Table', 'Blind 75', 'NeetCode 150', 'Meta', 'Amazon'],
    statement_md: 'Given a reference of a node in a **connected** undirected graph represented as an adjacency list, return a **deep copy** (clone) of the graph.\n\nEach node in the graph contains a value (`val`) and a list (`neighbors`) of its neighbors.',
    constraints: [
      'The number of nodes in the graph is in the range [0, 100].',
      '1 <= Node.val <= 100',
      'Node.val is unique for each node.',
      'There are no repeated edges and no self-loops in the graph.'
    ],
    examples: [
      { input: { adjList: [[2,4],[1,3],[2,4],[1,3]] }, output: [[2,4],[1,3],[2,4],[1,3]], explanation: '4 nodes connected in a cycle.' },
      { input: { adjList: [[]] }, output: [[]], explanation: '1 node with no neighbors.' },
      { input: { adjList: [] }, output: [], explanation: 'Empty graph.' }
    ],
    starter_code: {
      python: 'def cloneGraph(adjList: list[list[int]]) -> list[list[int]]:\n    # Write your solution here\n    pass\n',
      javascript: 'function cloneGraph(adjList) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `def cloneGraph(adjList: list[list[int]]) -> list[list[int]]:
    if not adjList:
        return []
    if adjList == [[]]:
        return [[]]
    
    # Deep copy the adjacency list representation
    return [list(neighbors) for neighbors in adjList]
`,
      javascript: `function cloneGraph(adjList) {
  if (!adjList || adjList.length === 0) return [];
  if (adjList.length === 1 && adjList[0].length === 0) return [[]];
  return adjList.map(neighbors => [...neighbors]);
}
`
    },
    sample_test_cases: [
      { input: { adjList: [[2,4],[1,3],[2,4],[1,3]] }, expected_output: [[2,4],[1,3],[2,4],[1,3]] },
      { input: { adjList: [[]] }, expected_output: [[]] },
      { input: { adjList: [] }, expected_output: [] }
    ],
    test_cases: [
      { input: { adjList: [[2,4],[1,3],[2,4],[1,3]] }, expected_output: [[2,4],[1,3],[2,4],[1,3]] },
      { input: { adjList: [[]] }, expected_output: [[]] },
      { input: { adjList: [] }, expected_output: [] },
      { input: { adjList: [[2],[1]] }, expected_output: [[2],[1]], hidden: true }
    ],
    hints: [
      'Use a Hash Map to map original nodes to their cloned copies.',
      'Perform BFS or DFS. When visiting a neighbor, create its clone if not already created, and link them.'
    ],
    editorial_md: 'Graph traversal with a HashMap mapping old nodes to cloned nodes.'
  },

  // ==========================================
  // 4. Matrix: Spiral Matrix (Medium - Blind 75 / Microsoft / Apple)
  // ==========================================
  {
    slug: 'spiral-matrix',
    title: 'Spiral Matrix',
    category: 'arrays-and-hashing',
    difficulty: 'Medium',
    tags: ['Matrix', 'Array', 'Simulation', 'Blind 75', 'NeetCode 150', 'Microsoft', 'Apple'],
    statement_md: 'Given an `m x n` `matrix`, return *all elements of the* `matrix` *in spiral order*.',
    constraints: [
      'm == matrix.length',
      'n == matrix[i].length',
      '1 <= m, n <= 10',
      '-100 <= matrix[i][j] <= 100'
    ],
    examples: [
      { input: { matrix: [[1,2,3],[4,5,6],[7,8,9]] }, output: [1,2,3,6,9,8,7,4,5] },
      { input: { matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12]] }, output: [1,2,3,4,8,12,11,10,9,5,6,7] }
    ],
    starter_code: {
      python: 'def spiralOrder(matrix: list[list[int]]) -> list[int]:\n    # Write your solution here\n    pass\n',
      javascript: 'function spiralOrder(matrix) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `def spiralOrder(matrix: list[list[int]]) -> list[int]:
    res = []
    if not matrix:
        return res
    top, bottom = 0, len(matrix) - 1
    left, right = 0, len(matrix[0]) - 1
    
    while top <= bottom and left <= right:
        # Traverse right
        for col in range(left, right + 1):
            res.append(matrix[top][col])
        top += 1
        
        # Traverse down
        for row in range(top, bottom + 1):
            res.append(matrix[row][right])
        right -= 1
        
        if top <= bottom:
            # Traverse left
            for col in range(right, left - 1, -1):
                res.append(matrix[bottom][col])
            bottom -= 1
            
        if left <= right:
            # Traverse up
            for row in range(bottom, top - 1, -1):
                res.append(matrix[row][left])
            left += 1
            
    return res
`,
      javascript: `function spiralOrder(matrix) {
  const res = [];
  if (!matrix || matrix.length === 0) return res;
  let top = 0, bottom = matrix.length - 1;
  let left = 0, right = matrix[0].length - 1;
  
  while (top <= bottom && left <= right) {
    for (let c = left; c <= right; c++) res.push(matrix[top][c]);
    top++;
    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);
    right--;
    if (top <= bottom) {
      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);
      bottom--;
    }
    if (left <= right) {
      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);
      left++;
    }
  }
  return res;
}
`
    },
    sample_test_cases: [
      { input: { matrix: [[1,2,3],[4,5,6],[7,8,9]] }, expected_output: [1,2,3,6,9,8,7,4,5] },
      { input: { matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12]] }, expected_output: [1,2,3,4,8,12,11,10,9,5,6,7] }
    ],
    test_cases: [
      { input: { matrix: [[1,2,3],[4,5,6],[7,8,9]] }, expected_output: [1,2,3,6,9,8,7,4,5] },
      { input: { matrix: [[1,2,3,4],[5,6,7,8],[9,10,11,12]] }, expected_output: [1,2,3,4,8,12,11,10,9,5,6,7] },
      { input: { matrix: [[1]] }, expected_output: [1], hidden: true },
      { input: { matrix: [[1,2],[3,4]] }, expected_output: [1,2,4,3], hidden: true }
    ],
    hints: [
      'Maintain 4 boundary pointers: top, bottom, left, right.',
      'Iterate along top boundary, then right boundary, bottom boundary, left boundary, contracting borders after each step.'
    ],
    editorial_md: 'Boundary simulation with 4 pointers contracting inward.'
  },

  // ==========================================
  // 5. Matrix: Rotate Image (Medium - Blind 75 / Amazon / Microsoft)
  // ==========================================
  {
    slug: 'rotate-image',
    title: 'Rotate Image',
    category: 'arrays-and-hashing',
    difficulty: 'Medium',
    tags: ['Matrix', 'Math', 'Array', 'Blind 75', 'NeetCode 150', 'Amazon', 'Microsoft'],
    statement_md: 'You are given an `n x n` 2D `matrix` representing an image, rotate the image by **90 degrees clockwise**.\n\nYou have to rotate the image in-place, which means you have to modify the input 2D matrix directly.',
    constraints: [
      'n == matrix.length == matrix[i].length',
      '1 <= n <= 20',
      '-1000 <= matrix[i][j] <= 1000'
    ],
    examples: [
      { input: { matrix: [[1,2,3],[4,5,6],[7,8,9]] }, output: [[7,4,1],[8,5,2],[9,6,3]] },
      { input: { matrix: [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]] }, output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]] }
    ],
    starter_code: {
      python: 'def rotate(matrix: list[list[int]]) -> list[list[int]]:\n    # Modify matrix in-place and return it\n    pass\n',
      javascript: 'function rotate(matrix) {\n  // Modify matrix in-place and return it\n}\n'
    },
    reference_solution: {
      python: `def rotate(matrix: list[list[int]]) -> list[list[int]]:
    n = len(matrix)
    # Transpose matrix
    for i in range(n):
        for j in range(i + 1, n):
            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]
    # Reverse each row
    for i in range(n):
        matrix[i].reverse()
    return matrix
`,
      javascript: `function rotate(matrix) {
  const n = matrix.length;
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const temp = matrix[i][j];
      matrix[i][j] = matrix[j][i];
      matrix[j][i] = temp;
    }
  }
  for (let i = 0; i < n; i++) {
    matrix[i].reverse();
  }
  return matrix;
}
`
    },
    sample_test_cases: [
      { input: { matrix: [[1,2,3],[4,5,6],[7,8,9]] }, expected_output: [[7,4,1],[8,5,2],[9,6,3]] },
      { input: { matrix: [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]] }, expected_output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]] }
    ],
    test_cases: [
      { input: { matrix: [[1,2,3],[4,5,6],[7,8,9]] }, expected_output: [[7,4,1],[8,5,2],[9,6,3]] },
      { input: { matrix: [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]] }, expected_output: [[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]] },
      { input: { matrix: [[1]] }, expected_output: [[1]], hidden: true },
      { input: { matrix: [[1,2],[3,4]] }, expected_output: [[3,1],[4,2]], hidden: true }
    ],
    hints: [
      'A 90-degree clockwise rotation is equivalent to a Transpose followed by a horizontal Reflection (reversing each row).',
      'Swap matrix[i][j] with matrix[j][i], then reverse each row.'
    ],
    editorial_md: 'Transpose the matrix along the main diagonal, then reverse each row horizontally.'
  },

  // ==========================================
  // 6. Design: LRU Cache (Medium - Blind 75 / NeetCode 150 / Amazon / Google)
  // ==========================================
  {
    slug: 'lru-cache',
    title: 'LRU Cache',
    category: 'arrays-and-hashing',
    difficulty: 'Medium',
    tags: ['Design', 'Hash Table', 'Linked List', 'Doubly-Linked List', 'Blind 75', 'NeetCode 150', 'Google', 'Amazon'],
    statement_md: 'Design a data structure that follows the constraints of a **Least Recently Used (LRU) cache**.\n\nImplement the `LRUCache` class:\n- `LRUCache(int capacity)` Initialize the LRU cache with positive size `capacity`.\n- `int get(int key)` Return the value of the `key` if the key exists, otherwise return `-1`.\n- `void put(int key, int value)` Update the value of the `key` if the `key` exists. Otherwise, add the `key-value` pair to the cache. If the number of keys exceeds the `capacity` from this operation, **evict** the least recently used key.\n\nThe functions `get` and `put` must each run in `O(1)` average time complexity.',
    constraints: [
      '1 <= capacity <= 3000',
      '0 <= key <= 10^4',
      '0 <= value <= 10^5',
      'At most 2 * 10^5 calls will be made to get and put.'
    ],
    examples: [
      {
        input: {
          operations: ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'],
          values: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
        },
        output: [null, null, null, 1, null, -1, null, -1, 3, 4]
      }
    ],
    starter_code: {
      python: `class LRUCache:
    def __init__(self, capacity: int):
        pass

    def get(self, key: int) -> int:
        pass

    def put(self, key: int, value: int) -> None:
        pass

def solve(operations: list[str], values: list[list[int]]) -> list:
    # Test runner adapter
    pass
`,
      javascript: `class LRUCache {
  constructor(capacity) {}
  get(key) {}
  put(key, value) {}
}

function solve(operations, values) {
  // Test runner adapter
}
`
    },
    reference_solution: {
      python: `class Node:
    def __init__(self, key, val):
        self.key = key
        self.val = val
        self.prev = None
        self.next = None

class LRUCache:
    def __init__(self, capacity: int):
        self.cap = capacity
        self.cache = {}
        self.left = Node(0, 0)
        self.right = Node(0, 0)
        self.left.next = self.right
        self.right.prev = self.left

    def remove(self, node):
        prev, nxt = node.prev, node.next
        prev.next = nxt
        nxt.prev = prev

    def insert(self, node):
        prev, nxt = self.right.prev, self.right
        prev.next = node
        nxt.prev = node
        node.prev = prev
        node.next = nxt

    def get(self, key: int) -> int:
        if key in self.cache:
            self.remove(self.cache[key])
            self.insert(self.cache[key])
            return self.cache[key].val
        return -1

    def put(self, key: int, value: int) -> None:
        if key in self.cache:
            self.remove(self.cache[key])
        self.cache[key] = Node(key, value)
        self.insert(self.cache[key])

        if len(self.cache) > self.cap:
            lru = self.left.next
            self.remove(lru)
            del self.cache[lru.key]

def solve(operations: list[str], values: list[list[int]]) -> list:
    res = []
    cache = None
    for op, val in zip(operations, values):
        if op == "LRUCache":
            cache = LRUCache(val[0])
            res.append(None)
        elif op == "put":
            cache.put(val[0], val[1])
            res.append(None)
        elif op == "get":
            res.append(cache.get(val[0]))
    return res
`,
      javascript: `class Node {
  constructor(key, val) {
    this.key = key;
    this.val = val;
    this.prev = null;
    this.next = null;
  }
}

class LRUCache {
  constructor(capacity) {
    this.cap = capacity;
    this.cache = new Map();
    this.left = new Node(0, 0);
    this.right = new Node(0, 0);
    this.left.next = this.right;
    this.right.prev = this.left;
  }

  remove(node) {
    const prev = node.prev;
    const next = node.next;
    prev.next = next;
    next.prev = prev;
  }

  insert(node) {
    const prev = this.right.prev;
    const next = this.right;
    prev.next = node;
    next.prev = node;
    node.prev = prev;
    node.next = next;
  }

  get(key) {
    if (this.cache.has(key)) {
      const node = this.cache.get(key);
      this.remove(node);
      this.insert(node);
      return node.val;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.remove(this.cache.get(key));
    }
    const node = new Node(key, value);
    this.cache.set(key, node);
    this.insert(node);

    if (this.cache.size > this.cap) {
      const lru = this.left.next;
      this.remove(lru);
      this.cache.delete(lru.key);
    }
  }
}

function solve(operations, values) {
  const res = [];
  let cache = null;
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const val = values[i];
    if (op === "LRUCache") {
      cache = new LRUCache(val[0]);
      res.push(null);
    } else if (op === "put") {
      cache.put(val[0], val[1]);
      res.push(null);
    } else if (op === "get") {
      res.push(cache.get(val[0]));
    }
  }
  return res;
}
`
    },
    sample_test_cases: [
      {
        input: {
          operations: ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'],
          values: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
        },
        expected_output: [null, null, null, 1, null, -1, null, -1, 3, 4]
      }
    ],
    test_cases: [
      {
        input: {
          operations: ['LRUCache', 'put', 'put', 'get', 'put', 'get', 'put', 'get', 'get', 'get'],
          values: [[2], [1, 1], [2, 2], [1], [3, 3], [2], [4, 4], [1], [3], [4]]
        },
        expected_output: [null, null, null, 1, null, -1, null, -1, 3, 4]
      },
      {
        input: {
          operations: ['LRUCache', 'put', 'get'],
          values: [[1], [2, 1], [2]]
        },
        expected_output: [null, null, 1],
        hidden: true
      },
      {
        input: {
          operations: ['LRUCache', 'get'],
          values: [[1], [1]]
        },
        expected_output: [null, -1],
        hidden: true
      }
    ],
    hints: [
      'Combine a Hash Map with a Doubly Linked List.',
      'The Hash Map provides O(1) key lookups.',
      'The Doubly Linked List maintains access order and allows O(1) removal and insertion.'
    ],
    editorial_md: 'HashMap + Doubly Linked List for O(1) LRU eviction and lookup.'
  },

  // ==========================================
  // 7. Backtracking: Letter Combinations of a Phone Number (Medium - Blind 75 / Meta / Amazon)
  // ==========================================
  {
    slug: 'letter-combinations-of-a-phone-number',
    title: 'Letter Combinations of a Phone Number',
    category: 'backtracking',
    difficulty: 'Medium',
    tags: ['Backtracking', 'String', 'Recursion', 'Blind 75', 'NeetCode 150', 'Meta', 'Amazon'],
    statement_md: 'Given a string containing digits from `2-9` inclusive, return all possible letter combinations that the number could represent. Return the answer in **any order**.\n\nA mapping of digits to letters (just like on telephone buttons) is given below:\n- 2: abc\n- 3: def\n- 4: ghi\n- 5: jkl\n- 6: mno\n- 7: pqrs\n- 8: tuv\n- 9: wxyz',
    constraints: [
      '0 <= digits.length <= 4',
      'digits[i] is a digit in the range [\'2\', \'9\'].'
    ],
    examples: [
      { input: { digits: '23' }, output: ['ad','ae','af','bd','be','bf','cd','ce','cf'] },
      { input: { digits: '' }, output: [] },
      { input: { digits: '2' }, output: ['a','b','c'] }
    ],
    starter_code: {
      python: 'def letterCombinations(digits: str) -> list[str]:\n    # Write your solution here\n    pass\n',
      javascript: 'function letterCombinations(digits) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `def letterCombinations(digits: str) -> list[str]:
    if not digits:
        return []
    phone = {
        '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
        '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
    }
    res = []
    def backtrack(idx, path):
        if idx == len(digits):
            res.append("".join(path))
            return
        for ch in phone[digits[idx]]:
            path.append(ch)
            backtrack(idx + 1, path)
            path.pop()
    backtrack(0, [])
    return res
`,
      javascript: `function letterCombinations(digits) {
  if (!digits || digits.length === 0) return [];
  const phone = {
    '2': 'abc', '3': 'def', '4': 'ghi', '5': 'jkl',
    '6': 'mno', '7': 'pqrs', '8': 'tuv', '9': 'wxyz'
  };
  const res = [];
  function backtrack(idx, path) {
    if (idx === digits.length) {
      res.push(path.join(''));
      return;
    }
    const letters = phone[digits[idx]];
    for (let i = 0; i < letters.length; i++) {
      path.push(letters[i]);
      backtrack(idx + 1, path);
      path.pop();
    }
  }
  backtrack(0, []);
  return res;
}
`
    },
    sample_test_cases: [
      { input: { digits: '23' }, expected_output: ['ad','ae','af','bd','be','bf','cd','ce','cf'] },
      { input: { digits: '' }, expected_output: [] },
      { input: { digits: '2' }, expected_output: ['a','b','c'] }
    ],
    test_cases: [
      { input: { digits: '23' }, expected_output: ['ad','ae','af','bd','be','bf','cd','ce','cf'] },
      { input: { digits: '' }, expected_output: [] },
      { input: { digits: '2' }, expected_output: ['a','b','c'] },
      { input: { digits: '7' }, expected_output: ['p','q','r','s'], hidden: true }
    ],
    hints: [
      'Use backtracking / DFS recursion.',
      'For each digit at index `i`, iterate through mapped characters and recurse to `i + 1`.'
    ],
    editorial_md: 'Depth-first search backtracking mapping digits to phone characters.'
  },

  // ==========================================
  // 8. Backtracking: Combination Sum II (Medium - Blind 75 / Amazon / Meta)
  // ==========================================
  {
    slug: 'combination-sum-ii',
    title: 'Combination Sum II',
    category: 'backtracking',
    difficulty: 'Medium',
    tags: ['Backtracking', 'Array', 'Blind 75', 'NeetCode 150', 'Amazon', 'Meta'],
    statement_md: 'Given a collection of candidate numbers (`candidates`) and a target number (`target`), find all unique combinations in `candidates` where the candidate numbers sum to `target`.\n\nEach number in `candidates` may only be used **once** in the combination.\n\n**Note:** The solution set must not contain duplicate combinations.',
    constraints: [
      '1 <= candidates.length <= 100',
      '1 <= candidates[i] <= 50',
      '1 <= target <= 30'
    ],
    examples: [
      {
        input: { candidates: [10,1,2,7,6,1,5], target: 8 },
        output: [[1,1,6],[1,2,5],[1,7],[2,6]]
      },
      {
        input: { candidates: [2,5,2,1,2], target: 5 },
        output: [[1,2,2],[5]]
      }
    ],
    starter_code: {
      python: 'def combinationSum2(candidates: list[int], target: int) -> list[list[int]]:\n    # Write your solution here\n    pass\n',
      javascript: 'function combinationSum2(candidates, target) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `def combinationSum2(candidates: list[int], target: int) -> list[list[int]]:
    candidates.sort()
    res = []
    def backtrack(start, curr_target, path):
        if curr_target == 0:
            res.append(list(path))
            return
        if curr_target < 0:
            return
        for i in range(start, len(candidates)):
            if i > start and candidates[i] == candidates[i - 1]:
                continue
            if candidates[i] > curr_target:
                break
            path.append(candidates[i])
            backtrack(i + 1, curr_target - candidates[i], path)
            path.pop()
    backtrack(0, target, [])
    return res
`,
      javascript: `function combinationSum2(candidates, target) {
  candidates.sort((a, b) => a - b);
  const res = [];
  function backtrack(start, currTarget, path) {
    if (currTarget === 0) {
      res.push([...path]);
      return;
    }
    if (currTarget < 0) return;
    for (let i = start; i < candidates.length; i++) {
      if (i > start && candidates[i] === candidates[i - 1]) continue;
      if (candidates[i] > currTarget) break;
      path.push(candidates[i]);
      backtrack(i + 1, currTarget - candidates[i], path);
      path.pop();
    }
  }
  backtrack(0, target, []);
  return res;
}
`
    },
    sample_test_cases: [
      { input: { candidates: [10,1,2,7,6,1,5], target: 8 }, expected_output: [[1,1,6],[1,2,5],[1,7],[2,6]] },
      { input: { candidates: [2,5,2,1,2], target: 5 }, expected_output: [[1,2,2],[5]] }
    ],
    test_cases: [
      { input: { candidates: [10,1,2,7,6,1,5], target: 8 }, expected_output: [[1,1,6],[1,2,5],[1,7],[2,6]] },
      { input: { candidates: [2,5,2,1,2], target: 5 }, expected_output: [[1,2,2],[5]] },
      { input: { candidates: [1], target: 1 }, expected_output: [[1]], hidden: true },
      { input: { candidates: [1], target: 2 }, expected_output: [], hidden: true }
    ],
    hints: [
      'Sort candidates first to easily skip duplicates at the same recursive depth (`i > start and candidates[i] == candidates[i-1]`).',
      'Pass `i + 1` into the next recursive call since each element can only be used once.'
    ],
    editorial_md: 'Sort candidates and skip duplicate consecutive elements during backtracking.'
  },

  // ==========================================
  // 9. Backtracking: N-Queens (Hard - Blind 75 / Google / Meta)
  // ==========================================
  {
    slug: 'n-queens',
    title: 'N-Queens',
    category: 'backtracking',
    difficulty: 'Hard',
    tags: ['Backtracking', 'Recursion', 'Blind 75', 'NeetCode 150', 'Google', 'Meta'],
    statement_md: 'The **n-queens** puzzle is the problem of placing `n` queens on an `n x n` chessboard such that no two queens attack each other.\n\nGiven an integer `n`, return *all distinct solutions to the **n-queens puzzle***. You may return the answer in **any order**.\n\nEach solution contains a distinct board configuration of the n-queens\' placement, where `\'Q\'` and `\'.\'` both indicate a queen and an empty space, respectively.',
    constraints: [
      '1 <= n <= 9'
    ],
    examples: [
      {
        input: { n: 4 },
        output: [
          ['.Q..','...Q','Q...','..Q.'],
          ['..Q.','Q...','...Q','.Q..']
        ]
      },
      {
        input: { n: 1 },
        output: [['Q']]
      }
    ],
    starter_code: {
      python: 'def solveNQueens(n: int) -> list[list[str]]:\n    # Write your solution here\n    pass\n',
      javascript: 'function solveNQueens(n) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `def solveNQueens(n: int) -> list[list[str]]:
    col_set = set()
    pos_diag = set() # (r + c)
    neg_diag = set() # (r - c)
    res = []
    board = [["."] * n for _ in range(n)]
    
    def backtrack(r):
        if r == n:
            res.append(["".join(row) for row in board])
            return
        for c in range(n):
            if c in col_set or (r + c) in pos_diag or (r - c) in neg_diag:
                continue
            col_set.add(c)
            pos_diag.add(r + c)
            neg_diag.add(r - c)
            board[r][c] = "Q"
            
            backtrack(r + 1)
            
            col_set.remove(c)
            pos_diag.remove(r + c)
            neg_diag.remove(r - c)
            board[r][c] = "."
            
    backtrack(0)
    return res
`,
      javascript: `function solveNQueens(n) {
  const colSet = new Set();
  const posDiag = new Set(); // r + c
  const negDiag = new Set(); // r - c
  const res = [];
  const board = Array.from({ length: n }, () => Array(n).fill('.'));
  
  function backtrack(r) {
    if (r === n) {
      res.push(board.map(row => row.join('')));
      return;
    }
    for (let c = 0; c < n; c++) {
      if (colSet.has(c) || posDiag.has(r + c) || negDiag.has(r - c)) continue;
      colSet.add(c);
      posDiag.add(r + c);
      negDiag.add(r - c);
      board[r][c] = 'Q';
      
      backtrack(r + 1);
      
      colSet.delete(c);
      posDiag.delete(r + c);
      negDiag.delete(r - c);
      board[r][c] = '.';
    }
  }
  backtrack(0);
  return res;
}
`
    },
    sample_test_cases: [
      {
        input: { n: 4 },
        expected_output: [
          ['.Q..','...Q','Q...','..Q.'],
          ['..Q.','Q...','...Q','.Q..']
        ]
      },
      { input: { n: 1 }, expected_output: [['Q']] }
    ],
    test_cases: [
      {
        input: { n: 4 },
        expected_output: [
          ['.Q..','...Q','Q...','..Q.'],
          ['..Q.','Q...','...Q','.Q..']
        ]
      },
      { input: { n: 1 }, expected_output: [['Q']] },
      { input: { n: 2 }, expected_output: [], hidden: true },
      { input: { n: 3 }, expected_output: [], hidden: true }
    ],
    hints: [
      'Place one queen per row.',
      'Use 3 sets: columns, positive diagonals `(r + c)`, and negative diagonals `(r - c)`.'
    ],
    editorial_md: 'Row-by-row backtracking with diagonal sets.'
  },

  // ==========================================
  // 10. Stack: Basic Calculator II (Medium - Meta / Amazon / Microsoft)
  // ==========================================
  {
    slug: 'basic-calculator-ii',
    title: 'Basic Calculator II',
    category: 'stack',
    difficulty: 'Medium',
    tags: ['Stack', 'Math', 'String', 'Meta', 'Amazon', 'Microsoft'],
    statement_md: 'Given a string `s` which represents an expression, *evaluate this expression and return its value*.\n\nThe integer division should truncate toward zero.\n\nYou may assume that the given expression is always valid. All intermediate results will be in the range of `[-2^31, 2^31 - 1]`.',
    constraints: [
      '1 <= s.length <= 3 * 10^5',
      's consists of integers and operators (\'+\', \'-\', \'*\', \'/\') separated by some number of spaces.',
      's represents a valid expression.',
      'All the integers in the expression are non-negative integers in the range [0, 2^31 - 1].'
    ],
    examples: [
      { input: { s: '3+2*2' }, output: 7 },
      { input: { s: ' 3/2 ' }, output: 1 },
      { input: { s: ' 3+5 / 2 ' }, output: 5 }
    ],
    starter_code: {
      python: 'def calculate(s: str) -> int:\n    # Write your solution here\n    pass\n',
      javascript: 'function calculate(s) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `def calculate(s: str) -> int:
    stack = []
    curr_num = 0
    op = '+'
    for i, ch in enumerate(s):
        if ch.isdigit():
            curr_num = curr_num * 10 + int(ch)
        if ch in "+-*/" or i == len(s) - 1:
            if ch == ' ' and i == len(s) - 1:
                pass
            if op == '+':
                stack.append(curr_num)
            elif op == '-':
                stack.append(-curr_num)
            elif op == '*':
                stack.append(stack.pop() * curr_num)
            elif op == '/':
                top = stack.pop()
                stack.append(int(top / curr_num)) # truncate towards 0
            op = ch
            curr_num = 0
    return sum(stack)
`,
      javascript: `function calculate(s) {
  const stack = [];
  let currNum = 0;
  let op = '+';
  for (let i = 0; i < s.length; i++) {
    const ch = s[i];
    if (ch >= '0' && ch <= '9') {
      currNum = currNum * 10 + Number(ch);
    }
    if ((ch === '+' || ch === '-' || ch === '*' || ch === '/') || i === s.length - 1) {
      if (op === '+') {
        stack.push(currNum);
      } else if (op === '-') {
        stack.push(-currNum);
      } else if (op === '*') {
        stack.push(stack.pop() * currNum);
      } else if (op === '/') {
        const top = stack.pop();
        stack.push(Math.trunc(top / currNum));
      }
      op = ch;
      currNum = 0;
    }
  }
  return stack.reduce((acc, val) => acc + val, 0);
}
`
    },
    sample_test_cases: [
      { input: { s: '3+2*2' }, expected_output: 7 },
      { input: { s: ' 3/2 ' }, expected_output: 1 },
      { input: { s: ' 3+5 / 2 ' }, expected_output: 5 }
    ],
    test_cases: [
      { input: { s: '3+2*2' }, expected_output: 7 },
      { input: { s: ' 3/2 ' }, expected_output: 1 },
      { input: { s: ' 3+5 / 2 ' }, expected_output: 5 },
      { input: { s: '42' }, expected_output: 42, hidden: true },
      { input: { s: '1-1+1' }, expected_output: 1, hidden: true }
    ],
    hints: [
      'Maintain previous operator `op`. When an operator or end of string is encountered, push number onto stack according to `op`.',
      '`*` and `/` resolve immediately with `stack.pop()`. At the end, sum the stack.'
    ],
    editorial_md: 'Single pass using a stack to handle operator precedence.'
  },

  // ==========================================
  // 11. Stack: Decode String (Medium - Google / Bloomberg / Cisco)
  // ==========================================
  {
    slug: 'decode-string',
    title: 'Decode String',
    category: 'stack',
    difficulty: 'Medium',
    tags: ['Stack', 'String', 'Recursion', 'Google', 'Bloomberg', 'Cisco'],
    statement_md: 'Given an encoded string, return its decoded string.\n\nThe encoding rule is: `k[encoded_string]`, where the `encoded_string` inside the square brackets is being repeated exactly `k` times. Note that `k` is guaranteed to be a positive integer.',
    constraints: [
      '1 <= s.length <= 30',
      's consists of lowercase English letters, digits, and square brackets \'[]\'.',
      's is guaranteed to be a valid input.',
      'All the integers in s are in the range [1, 300].'
    ],
    examples: [
      { input: { s: '3[a]2[bc]' }, output: 'aaabcbc' },
      { input: { s: '3[a2[c]]' }, output: 'accaccacc' },
      { input: { s: '2[abc]3[cd]ef' }, output: 'abcabccdcdcdef' }
    ],
    starter_code: {
      python: 'def decodeString(s: str) -> str:\n    # Write your solution here\n    pass\n',
      javascript: 'function decodeString(s) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `def decodeString(s: str) -> str:
    stack = []
    curr_str = ""
    curr_num = 0
    for ch in s:
        if ch.isdigit():
            curr_num = curr_num * 10 + int(ch)
        elif ch == '[':
            stack.append((curr_str, curr_num))
            curr_str = ""
            curr_num = 0
        elif ch == ']':
            prev_str, num = stack.pop()
            curr_str = prev_str + curr_str * num
        else:
            curr_str += ch
    return curr_str
`,
      javascript: `function decodeString(s) {
  const stack = [];
  let currStr = '';
  let currNum = 0;
  for (const ch of s) {
    if (ch >= '0' && ch <= '9') {
      currNum = currNum * 10 + Number(ch);
    } else if (ch === '[') {
      stack.push([currStr, currNum]);
      currStr = '';
      currNum = 0;
    } else if (ch === ']') {
      const [prevStr, num] = stack.pop();
      currStr = prevStr + currStr.repeat(num);
    } else {
      currStr += ch;
    }
  }
  return currStr;
}
`
    },
    sample_test_cases: [
      { input: { s: '3[a]2[bc]' }, expected_output: 'aaabcbc' },
      { input: { s: '3[a2[c]]' }, expected_output: 'accaccacc' },
      { input: { s: '2[abc]3[cd]ef' }, expected_output: 'abcabccdcdcdef' }
    ],
    test_cases: [
      { input: { s: '3[a]2[bc]' }, expected_output: 'aaabcbc' },
      { input: { s: '3[a2[c]]' }, expected_output: 'accaccacc' },
      { input: { s: '2[abc]3[cd]ef' }, expected_output: 'abcabccdcdcdef' },
      { input: { s: 'abc' }, expected_output: 'abc', hidden: true }
    ],
    hints: [
      'Use a stack storing `(previous_string, multiplier)`.',
      'When encountering `[`, push current state and reset.',
      'When encountering `]`, pop and concatenate `prev_str + curr_str * num`.'
    ],
    editorial_md: 'Stack-based bracket expansion with nested multipliers.'
  },

  // ==========================================
  // 12. SQL: Consecutive Numbers (Medium - SQL 50 / LeetCode)
  // ==========================================
  {
    slug: 'consecutive-numbers',
    title: 'Consecutive Numbers',
    category: 'sql',
    difficulty: 'Medium',
    tags: ['SQL', 'Database', 'SQL 50', 'Amazon', 'Adobe'],
    statement_md: 'Find all numbers that appear at least three times consecutively in the `Logs` table.\n\nReturn the result table with column name `ConsecutiveNums` in any order.\n\nTable: `Logs` (`id INT PRIMARY KEY, num INT`)',
    constraints: [
      'id is an autoincrement column starting from 1.'
    ],
    examples: [
      {
        input: {
          schema: 'CREATE TABLE Logs (id INT PRIMARY KEY, num INT); INSERT INTO Logs VALUES (1, 1), (2, 1), (3, 1), (4, 2), (5, 1), (6, 2), (7, 2);',
          query: 'SELECT DISTINCT l1.num as ConsecutiveNums FROM Logs l1 JOIN Logs l2 ON l1.id = l2.id - 1 JOIN Logs l3 ON l1.id = l3.id - 2 WHERE l1.num = l2.num AND l2.num = l3.num;'
        },
        output: [{ ConsecutiveNums: 1 }]
      }
    ],
    starter_code: {
      sql: `-- Write your PostgreSQL/SQLite query here\nSELECT DISTINCT l1.num as ConsecutiveNums\nFROM Logs l1\nJOIN Logs l2 ON l1.id = l2.id - 1\nJOIN Logs l3 ON l1.id = l3.id - 2\nWHERE l1.num = l2.num AND l2.num = l3.num;\n`
    },
    reference_solution: {
      sql: `SELECT DISTINCT l1.num as ConsecutiveNums
FROM Logs l1
JOIN Logs l2 ON l1.id = l2.id - 1
JOIN Logs l3 ON l1.id = l3.id - 2
WHERE l1.num = l2.num AND l2.num = l3.num;`
    },
    sample_test_cases: [
      {
        input: {
          init_sql: 'CREATE TABLE Logs (id INT PRIMARY KEY, num INT); INSERT INTO Logs VALUES (1, 1), (2, 1), (3, 1), (4, 2), (5, 1), (6, 2), (7, 2);'
        },
        expected_output: [{ ConsecutiveNums: 1 }]
      }
    ],
    test_cases: [
      {
        input: {
          init_sql: 'CREATE TABLE Logs (id INT PRIMARY KEY, num INT); INSERT INTO Logs VALUES (1, 1), (2, 1), (3, 1), (4, 2), (5, 1), (6, 2), (7, 2);'
        },
        expected_output: [{ ConsecutiveNums: 1 }]
      },
      {
        input: {
          init_sql: 'CREATE TABLE Logs (id INT PRIMARY KEY, num INT); INSERT INTO Logs VALUES (1, 1), (2, 2), (3, 3);'
        },
        expected_output: [],
        hidden: true
      }
    ],
    hints: [
      'Join Logs with itself twice on consecutive IDs `id + 1` and `id + 2`.',
      'Filter where `l1.num = l2.num AND l2.num = l3.num` and use `DISTINCT`.'
    ],
    editorial_md: 'Self-join on consecutive ID sequence.'
  },

  // ==========================================
  // 13. SQL: Exchange Seats (Medium - SQL 50 / LeetCode)
  // ==========================================
  {
    slug: 'exchange-seats',
    title: 'Exchange Seats',
    category: 'sql',
    difficulty: 'Medium',
    tags: ['SQL', 'Database', 'SQL 50', 'Amazon'],
    statement_md: 'Write a solution to swap the seat id of every two consecutive students. If the number of students is odd, the id of the last student is not swapped.\n\nReturn the result table ordered by `id` in **ascending order**.\n\nTable: `Seat` (`id INT PRIMARY KEY, student VARCHAR(255)`)',
    constraints: [
      'id is an autoincrement column starting from 1.'
    ],
    examples: [
      {
        input: {
          schema: 'CREATE TABLE Seat (id INT PRIMARY KEY, student VARCHAR(255)); INSERT INTO Seat VALUES (1, "Abbot"), (2, "Doris"), (3, "Emerson"), (4, "Green"), (5, "Jeames");',
          query: 'SELECT CASE WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id WHEN id % 2 = 1 THEN id + 1 ELSE id - 1 END AS id, student FROM Seat ORDER BY id;'
        },
        output: [
          { id: 1, student: 'Doris' },
          { id: 2, student: 'Abbot' },
          { id: 3, student: 'Green' },
          { id: 4, student: 'Emerson' },
          { id: 5, student: 'Jeames' }
        ]
      }
    ],
    starter_code: {
      sql: `-- Write your SQL query here\nSELECT \n  CASE \n    WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id \n    WHEN id % 2 = 1 THEN id + 1 \n    ELSE id - 1 \n  END AS id, \n  student \nFROM Seat \nORDER BY id;\n`
    },
    reference_solution: {
      sql: `SELECT 
  CASE 
    WHEN id % 2 = 1 AND id = (SELECT COUNT(*) FROM Seat) THEN id 
    WHEN id % 2 = 1 THEN id + 1 
    ELSE id - 1 
  END AS id, 
  student 
FROM Seat 
ORDER BY id;`
    },
    sample_test_cases: [
      {
        input: {
          init_sql: 'CREATE TABLE Seat (id INT PRIMARY KEY, student VARCHAR(255)); INSERT INTO Seat VALUES (1, "Abbot"), (2, "Doris"), (3, "Emerson"), (4, "Green"), (5, "Jeames");'
        },
        expected_output: [
          { id: 1, student: 'Doris' },
          { id: 2, student: 'Abbot' },
          { id: 3, student: 'Green' },
          { id: 4, student: 'Emerson' },
          { id: 5, student: 'Jeames' }
        ]
      }
    ],
    test_cases: [
      {
        input: {
          init_sql: 'CREATE TABLE Seat (id INT PRIMARY KEY, student VARCHAR(255)); INSERT INTO Seat VALUES (1, "Abbot"), (2, "Doris"), (3, "Emerson"), (4, "Green"), (5, "Jeames");'
        },
        expected_output: [
          { id: 1, student: 'Doris' },
          { id: 2, student: 'Abbot' },
          { id: 3, student: 'Green' },
          { id: 4, student: 'Emerson' },
          { id: 5, student: 'Jeames' }
        ]
      }
    ],
    hints: [
      'Use a `CASE` statement on `id % 2`.',
      'For odd `id`, change to `id + 1` (unless it is the max id). For even `id`, change to `id - 1`.'
    ],
    editorial_md: 'Conditional ID manipulation using CASE.'
  }
];

export function writeProblemPackFiles() {
  let created = 0;
  for (const prob of V3_PROBLEMS) {
    const dir = path.join(PROBLEMS_DIR, prob.category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${prob.slug}.json`);
    fs.writeFileSync(filePath, JSON.stringify(prob, null, 2), 'utf-8');
    created++;
  }
  console.log(`[Problem Pack V3] Wrote ${created} problems to ${PROBLEMS_DIR}`);
}

if (process.argv[1] && process.argv[1].includes('problem-pack-v3')) {
  writeProblemPackFiles();
}

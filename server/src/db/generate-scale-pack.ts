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
  starter_code: { python?: string; javascript?: string; sql?: string; [lang: string]: string | undefined };
  test_cases: Array<{ input?: any; schema_ddl?: string; expected_output: any; hidden?: boolean; explanation?: string }>;
  reference_solution: { python?: string; javascript?: string; sql?: string; [lang: string]: string | undefined };
  hints: string[];
  editorial_md: string;
  time_limit_ms?: number;
  memory_limit_mb?: number;
}

const SCALE_PROBLEMS: ProblemDef[] = [
  // ==================== LINKED LISTS ====================
  {
    category: 'linked-list',
    slug: 'merge-two-sorted-lists',
    title: 'Merge Two Sorted Lists',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion', 'Two Pointers'],
    statement_md: 'You are given the heads of two sorted linked lists `list1` and `list2`.\n\nMerge the two lists into one **sorted** list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.',
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both list1 and list2 are sorted in non-decreasing order.'],
    examples: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, output: [1, 1, 2, 3, 4, 4] },
      { input: { list1: [], list2: [] }, output: [] },
      { input: { list1: [], list2: [0] }, output: [0] }
    ],
    starter_code: {
      python: 'class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        pass\n',
      javascript: 'function mergeTwoLists(list1, list2) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { list1: [1, 2, 4], list2: [1, 3, 4] }, expected_output: [1, 1, 2, 3, 4, 4], hidden: false },
      { input: { list1: [], list2: [] }, expected_output: [], hidden: false },
      { input: { list1: [], list2: [0] }, expected_output: [0], hidden: false },
      { input: { list1: [5], list2: [1, 2, 4] }, expected_output: [1, 2, 4, 5], hidden: true },
      { input: { list1: [-10, -5, 0], list2: [-8, -6, 2, 7] }, expected_output: [-10, -8, -6, -5, 0, 2, 7], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def mergeTwoLists(self, list1: Optional[ListNode], list2: Optional[ListNode]) -> Optional[ListNode]:\n        dummy = ListNode(0)\n        curr = dummy\n        while list1 and list2:\n            if list1.val <= list2.val:\n                curr.next = list1\n                list1 = list1.next\n            else:\n                curr.next = list2\n                list2 = list2.next\n            curr = curr.next\n        curr.next = list1 if list1 else list2\n        return dummy.next\n',
      javascript: 'function mergeTwoLists(list1, list2) {\n    const dummy = new ListNode(0);\n    let curr = dummy;\n    while (list1 && list2) {\n        if (list1.val <= list2.val) {\n            curr.next = list1;\n            list1 = list1.next;\n        } else {\n            curr.next = list2;\n            list2 = list2.next;\n        }\n        curr = curr.next;\n    }\n    curr.next = list1 || list2;\n    return dummy.next;\n}\n'
    },
    hints: ['Use a dummy head node to simplify edge cases with an empty initial merged list.'],
    editorial_md: '### Method: Iterative Splicing with Dummy Node\n- **Time Complexity**: $\\mathcal{O}(N + M)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  {
    category: 'linked-list',
    slug: 'remove-nth-node-from-end-of-list',
    title: 'Remove Nth Node From End of List',
    difficulty: 'Medium',
    tags: ['Linked List', 'Two Pointers'],
    statement_md: 'Given the `head` of a linked list, remove the `n`-th node from the end of the list and return its head.',
    constraints: ['The number of nodes in the list is sz.', '1 <= sz <= 30', '0 <= Node.val <= 100', '1 <= n <= sz'],
    examples: [
      { input: { head: [1, 2, 3, 4, 5], n: 2 }, output: [1, 2, 3, 5] },
      { input: { head: [1], n: 1 }, output: [] },
      { input: { head: [1, 2], n: 1 }, output: [1] }
    ],
    starter_code: {
      python: 'class Solution:\n    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:\n        pass\n',
      javascript: 'function removeNthFromEnd(head, n) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { head: [1, 2, 3, 4, 5], n: 2 }, expected_output: [1, 2, 3, 5], hidden: false },
      { input: { head: [1], n: 1 }, expected_output: [], hidden: false },
      { input: { head: [1, 2], n: 1 }, expected_output: [1], hidden: false },
      { input: { head: [1, 2], n: 2 }, expected_output: [2], hidden: true },
      { input: { head: [10, 20, 30, 40, 50, 60], n: 6 }, expected_output: [20, 30, 40, 50, 60], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def removeNthFromEnd(self, head: Optional[ListNode], n: int) -> Optional[ListNode]:\n        dummy = ListNode(0, head)\n        left = dummy\n        right = head\n        while n > 0 and right:\n            right = right.next\n            n -= 1\n        while right:\n            left = left.next\n            right = right.next\n        left.next = left.next.next\n        return dummy.next\n',
      javascript: 'function removeNthFromEnd(head, n) {\n    const dummy = new ListNode(0, head);\n    let left = dummy;\n    let right = head;\n    while (n > 0 && right) {\n        right = right.next;\n        n--;\n    }\n    while (right) {\n        left = left.next;\n        right = right.next;\n    }\n    left.next = left.next.next;\n    return dummy.next;\n}\n'
    },
    hints: ['Advance the fast pointer by `n` nodes first. Then advance both pointers simultaneously.'],
    editorial_md: '### Method: Fast & Slow Pointer with Dummy Node\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  {
    category: 'linked-list',
    slug: 'linked-list-cycle',
    title: 'Linked List Cycle',
    difficulty: 'Easy',
    tags: ['Linked List', 'Two Pointers', 'Hash Table'],
    statement_md: 'Given `head`, the head of a linked list, determine if the linked list has a cycle in it.\n\nThere is a cycle in a linked list if there is some node in the list that can be reached again by continuously following the `next` pointer.\n\nReturn `true` *if there is a cycle in the linked list. Otherwise, return* `false`.',
    constraints: ['The number of the nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5'],
    examples: [
      { input: { head: [3, 2, 0, -4] }, output: false },
      { input: { head: [1, 2] }, output: false },
      { input: { head: [1] }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        pass\n',
      javascript: 'function hasCycle(head) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { head: [3, 2, 0, -4] }, expected_output: false, hidden: false },
      { input: { head: [1, 2] }, expected_output: false, hidden: false },
      { input: { head: [1] }, expected_output: false, hidden: false },
      { input: { head: [] }, expected_output: false, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def hasCycle(self, head: Optional[ListNode]) -> bool:\n        slow, fast = head, head\n        while fast and fast.next:\n            slow = slow.next\n            fast = fast.next.next\n            if slow == fast:\n                return True\n        return False\n',
      javascript: 'function hasCycle(head) {\n    let slow = head, fast = head;\n    while (fast && fast.next) {\n        slow = slow.next;\n        fast = fast.next.next;\n        if (slow === fast) return true;\n    }\n    return false;\n}\n'
    },
    hints: ["Use Floyd's Tortoise and Hare algorithm (fast moves 2 steps, slow moves 1 step)."],
    editorial_md: "### Method: Floyd's Cycle Finding Algorithm\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$"
  },

  // ==================== TREES & TRIES ====================
  {
    category: 'trees',
    slug: 'same-tree',
    title: 'Same Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Depth-First Search', 'Breadth-First Search', 'Binary Tree'],
    statement_md: 'Given the roots of two binary trees `p` and `q`, write a function to check if they are the same or not.\n\nTwo binary trees are considered the same if they are structurally identical, and the nodes have the same value.',
    constraints: ['The number of nodes in both trees is in the range [0, 100].', '-10^4 <= Node.val <= 10^4'],
    examples: [
      { input: { p: [1, 2, 3], q: [1, 2, 3] }, output: true },
      { input: { p: [1, 2], q: [1, null, 2] }, output: false },
      { input: { p: [1, 2, 1], q: [1, 1, 2] }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:\n        pass\n',
      javascript: 'function isSameTree(p, q) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { p: [1, 2, 3], q: [1, 2, 3] }, expected_output: true, hidden: false },
      { input: { p: [1, 2], q: [1, null, 2] }, expected_output: false, hidden: false },
      { input: { p: [1, 2, 1], q: [1, 1, 2] }, expected_output: false, hidden: false },
      { input: { p: [], q: [] }, expected_output: true, hidden: true },
      { input: { p: [10], q: [10] }, expected_output: true, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def isSameTree(self, p: Optional[TreeNode], q: Optional[TreeNode]) -> bool:\n        if not p and not q:\n            return True\n        if not p or not q or p.val != q.val:\n            return False\n        return self.isSameTree(p.left, q.left) and self.isSameTree(p.right, q.right)\n',
      javascript: 'function isSameTree(p, q) {\n    if (!p && !q) return true;\n    if (!p || !q || p.val !== q.val) return false;\n    return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n}\n'
    },
    hints: ['Check if both nodes are null (True), or one is null / values differ (False), then recurse.'],
    editorial_md: '### Method: Recursive DFS\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(H)$'
  },

  {
    category: 'trees',
    slug: 'binary-tree-level-order-traversal',
    title: 'Binary Tree Level Order Traversal',
    difficulty: 'Medium',
    tags: ['Tree', 'Breadth-First Search', 'Binary Tree'],
    statement_md: 'Given the `root` of a binary tree, return *the level order traversal of its nodes\' values*. (i.e., from left to right, level by level).',
    constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    examples: [
      { input: { root: [3, 9, 20, null, null, 15, 7] }, output: [[3], [9, 20], [15, 7]] },
      { input: { root: [1] }, output: [[1]] },
      { input: { root: [] }, output: [] }
    ],
    starter_code: {
      python: 'class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\n        pass\n',
      javascript: 'function levelOrder(root) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { root: [3, 9, 20, null, null, 15, 7] }, expected_output: [[3], [9, 20], [15, 7]], hidden: false },
      { input: { root: [1] }, expected_output: [[1]], hidden: false },
      { input: { root: [] }, expected_output: [], hidden: false },
      { input: { root: [1, 2, 3, 4, 5] }, expected_output: [[1], [2, 3], [4, 5]], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def levelOrder(self, root: Optional[TreeNode]) -> List[List[int]]:\n        res = []\n        if not root:\n            return res\n        q = [root]\n        while q:\n            level = []\n            for _ in range(len(q)):\n                node = q.pop(0)\n                level.append(node.val)\n                if node.left:\n                    q.append(node.left)\n                if node.right:\n                    q.append(node.right)\n            res.append(level)\n        return res\n',
      javascript: 'function levelOrder(root) {\n    const res = [];\n    if (!root) return res;\n    const q = [root];\n    while (q.length > 0) {\n        const level = [];\n        const len = q.length;\n        for (let i = 0; i < len; i++) {\n            const node = q.shift();\n            level.push(node.val);\n            if (node.left) q.push(node.left);\n            if (node.right) q.push(node.right);\n        }\n        res.push(level);\n    }\n    return res;\n}\n'
    },
    hints: ['Use a Queue for standard BFS traversal and iterate level-by-level using queue length.'],
    editorial_md: '### Method: Queue-based BFS\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  {
    category: 'trees',
    slug: 'kth-smallest-element-in-a-bst',
    title: 'Kth Smallest Element in a BST',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement_md: 'Given the `root` of a binary search tree, and an integer `k`, return *the* `k`-th *smallest value (**1-indexed**) of all the values of the nodes in the tree*.',
    constraints: ['The number of nodes in the tree is n.', '1 <= k <= n <= 10^4', '0 <= Node.val <= 10^4'],
    examples: [
      { input: { root: [3, 1, 4, null, 2], k: 1 }, output: 1 },
      { input: { root: [5, 3, 6, 2, 4, null, null, 1], k: 3 }, output: 3 }
    ],
    starter_code: {
      python: 'class Solution:\n    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:\n        pass\n',
      javascript: 'function kthSmallest(root, k) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { root: [3, 1, 4, null, 2], k: 1 }, expected_output: 1, hidden: false },
      { input: { root: [5, 3, 6, 2, 4, null, null, 1], k: 3 }, expected_output: 3, hidden: false },
      { input: { root: [2, 1, 3], k: 2 }, expected_output: 2, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def kthSmallest(self, root: Optional[TreeNode], k: int) -> int:\n        stack = []\n        curr = root\n        while stack or curr:\n            while curr:\n                stack.append(curr)\n                curr = curr.left\n            curr = stack.pop()\n            k -= 1\n            if k == 0:\n                return curr.val\n            curr = curr.right\n        return -1\n',
      javascript: 'function kthSmallest(root, k) {\n    const stack = [];\n    let curr = root;\n    while (stack.length > 0 || curr) {\n        while (curr) {\n            stack.push(curr);\n            curr = curr.left;\n        }\n        curr = stack.pop();\n        k--;\n        if (k === 0) return curr.val;\n        curr = curr.right;\n    }\n    return -1;\n}\n'
    },
    hints: ['In-order traversal of a BST yields elements in strictly ascending order.'],
    editorial_md: '### Method: Iterative In-Order Traversal with Stack\n- **Time Complexity**: $\\mathcal{O}(H + k)$\n- **Space Complexity**: $\\mathcal{O}(H)$'
  },

  // ==================== HEAPS & PRIORITY QUEUES ====================
  {
    category: 'heaps',
    slug: 'last-stone-weight',
    title: 'Last Stone Weight',
    difficulty: 'Easy',
    tags: ['Array', 'Heap (Priority Queue)'],
    statement_md: 'You are given an array of integers `stones` where `stones[i]` is the weight of the `i`-th stone.\n\nWe are playing a game with the stones. On each turn, we choose the **heaviest two stones** and smash them together. Suppose the heaviest two stones have weights `x` and `y` with `x <= y`:\n- If `x == y`, both stones are destroyed.\n- If `x != y`, the stone of weight `x` is destroyed, and the stone of weight `y` has new weight `y - x`.\n\nReturn *the weight of the last remaining stone*. If there are no stones left, return `0`.',
    constraints: ['1 <= stones.length <= 30', '1 <= stones[i] <= 1000'],
    examples: [
      { input: { stones: [2, 7, 4, 1, 8, 1] }, output: 1 },
      { input: { stones: [1] }, output: 1 }
    ],
    starter_code: {
      python: 'class Solution:\n    def lastStoneWeight(self, stones: List[int]) -> int:\n        pass\n',
      javascript: 'function lastStoneWeight(stones) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { stones: [2, 7, 4, 1, 8, 1] }, expected_output: 1, hidden: false },
      { input: { stones: [1] }, expected_output: 1, hidden: false },
      { input: { stones: [2, 2] }, expected_output: 0, hidden: true },
      { input: { stones: [1, 3] }, expected_output: 2, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def lastStoneWeight(self, stones: List[int]) -> int:\n        import heapq\n        stones = [-s for s in stones]\n        heapq.heapify(stones)\n        while len(stones) > 1:\n            first = heapq.heappop(stones)\n            second = heapq.heappop(stones)\n            if second > first:\n                heapq.heappush(stones, first - second)\n        return -stones[0] if stones else 0\n',
      javascript: 'function lastStoneWeight(stones) {\n    while (stones.length > 1) {\n        stones.sort((a, b) => b - a);\n        const first = stones.shift();\n        const second = stones.shift();\n        if (first !== second) {\n            stones.push(first - second);\n        }\n    }\n    return stones.length === 1 ? stones[0] : 0;\n}\n'
    },
    hints: ['Use a Max-Heap to extract the two largest stones in O(log N) time per smash.'],
    editorial_md: '### Method: Max Heap Simulation\n- **Time Complexity**: $\\mathcal{O}(N \\log N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  {
    category: 'heaps',
    slug: 'k-closest-points-to-origin',
    title: 'K Closest Points to Origin',
    difficulty: 'Medium',
    tags: ['Array', 'Math', 'Divide and Conquer', 'Geometry', 'Sorting', 'Heap (Priority Queue)', 'Quickselect'],
    statement_md: 'Given an array of `points` where `points[i] = [xi, yi]` represents a point on the X-Y plane and an integer `k`, return the `k` closest points to the origin `(0, 0)`.\n\nThe distance between two points on the X-Y plane is the Euclidean distance (i.e., $\\sqrt{(x_1 - x_2)^2 + (y_1 - y_2)^2}$).\n\nYou may return the answer in **any order**.',
    constraints: ['1 <= k <= points.length <= 10^4', '-10^4 <= xi, yi <= 10^4'],
    examples: [
      { input: { points: [[1, 3], [-2, 2]], k: 1 }, output: [[-2, 2]] },
      { input: { points: [[3, 3], [5, -1], [-2, 4]], k: 2 }, output: [[3, 3], [-2, 4]] }
    ],
    starter_code: {
      python: 'class Solution:\n    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:\n        pass\n',
      javascript: 'function kClosest(points, k) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { points: [[1, 3], [-2, 2]], k: 1 }, expected_output: [[-2, 2]], hidden: false },
      { input: { points: [[3, 3], [5, -1], [-2, 4]], k: 2 }, expected_output: [[3, 3], [-2, 4]], hidden: false },
      { input: { points: [[0, 1], [1, 0]], k: 2 }, expected_output: [[0, 1], [1, 0]], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def kClosest(self, points: List[List[int]], k: int) -> List[List[int]]:\n        points.sort(key=lambda p: p[0]**2 + p[1]**2)\n        return points[:k]\n',
      javascript: 'function kClosest(points, k) {\n    points.sort((a, b) => (a[0]**2 + a[1]**2) - (b[0]**2 + b[1]**2));\n    return points.slice(0, k);\n}\n'
    },
    hints: ['Sort points by their squared distance $x^2 + y^2$ or maintain a max heap of size $k$.'],
    editorial_md: '### Method: Max Heap / Sorting\n- **Time Complexity**: $\\mathcal{O}(N \\log k)$\n- **Space Complexity**: $\\mathcal{O}(k)$'
  },

  // ==================== ADVANCED BINARY SEARCH ====================
  {
    category: 'binary-search',
    slug: 'koko-eating-bananas',
    title: 'Koko Eating Bananas',
    difficulty: 'Medium',
    tags: ['Array', 'Binary Search'],
    statement_md: 'Koko loves to eat bananas. There are `n` piles of bananas, the `i`-th pile has `piles[i]` bananas. The guards have gone and will come back in `h` hours.\n\nKoko can decide her bananas-per-hour eating speed of `k`. Each hour, she chooses some pile of bananas and eats `k` bananas from that pile. If the pile has less than `k` bananas, she eats all of them instead and will not eat any more bananas during this hour.\n\nReturn *the minimum integer* `k` *such that she can eat all the bananas within* `h` *hours*.',
    constraints: ['1 <= piles.length <= 10^4', 'piles.length <= h <= 10^9', '1 <= piles[i] <= 10^9'],
    examples: [
      { input: { piles: [3, 6, 7, 11], h: 8 }, output: 4 },
      { input: { piles: [30, 11, 23, 4, 20], h: 5 }, output: 30 },
      { input: { piles: [30, 11, 23, 4, 20], h: 6 }, output: 23 }
    ],
    starter_code: {
      python: 'class Solution:\n    def minEatingSpeed(self, piles: List[int], h: int) -> int:\n        pass\n',
      javascript: 'function minEatingSpeed(piles, h) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { piles: [3, 6, 7, 11], h: 8 }, expected_output: 4, hidden: false },
      { input: { piles: [30, 11, 23, 4, 20], h: 5 }, expected_output: 30, hidden: false },
      { input: { piles: [30, 11, 23, 4, 20], h: 6 }, expected_output: 23, hidden: false },
      { input: { piles: [312884470], h: 312884469 }, expected_output: 2, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def minEatingSpeed(self, piles: List[int], h: int) -> int:\n        import math\n        l, r = 1, max(piles)\n        res = r\n        while l <= r:\n            k = (l + r) // 2\n            total_time = sum(math.ceil(p / k) for p in piles)\n            if total_time <= h:\n                res = k\n                r = k - 1\n            else:\n                l = k + 1\n        return res\n',
      javascript: 'function minEatingSpeed(piles, h) {\n    let l = 1, r = Math.max(...piles);\n    let res = r;\n    while (l <= r) {\n        const k = Math.floor((l + r) / 2);\n        let totalTime = 0;\n        for (const p of piles) {\n            totalTime += Math.ceil(p / k);\n        }\n        if (totalTime <= h) {\n            res = k;\n            r = k - 1;\n        } else {\n            l = k + 1;\n        }\n    }\n    return res;\n}\n'
    },
    hints: ['Binary search the eating speed `k` between `1` and `max(piles)`.'],
    editorial_md: '### Method: Binary Search on Answer\n- **Time Complexity**: $\\mathcal{O}(N \\log(\\max(P)))$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // ==================== ADVANCED DYNAMIC PROGRAMMING ====================
  {
    category: 'dynamic-programming',
    slug: 'house-robber-ii',
    title: 'House Robber II',
    difficulty: 'Medium',
    tags: ['Array', 'Dynamic Programming'],
    statement_md: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. All houses at this place are **arranged in a circle**.\n\nReturn the maximum amount of money you can rob tonight without alerting the police.',
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 1000'],
    examples: [
      { input: { nums: [2, 3, 2] }, output: 3 },
      { input: { nums: [1, 2, 3, 1] }, output: 4 },
      { input: { nums: [1, 2, 3] }, output: 3 }
    ],
    starter_code: {
      python: 'class Solution:\n    def rob(self, nums: List[int]) -> int:\n        pass\n',
      javascript: 'function rob(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [2, 3, 2] }, expected_output: 3, hidden: false },
      { input: { nums: [1, 2, 3, 1] }, expected_output: 4, hidden: false },
      { input: { nums: [1, 2, 3] }, expected_output: 3, hidden: false },
      { input: { nums: [1] }, expected_output: 1, hidden: true },
      { input: { nums: [200, 3, 140, 20, 10] }, expected_output: 340, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def rob(self, nums: List[int]) -> int:\n        if len(nums) == 1:\n            return nums[0]\n        def rob_helper(sub):\n            rob1, rob2 = 0, 0\n            for n in sub:\n                new_rob = max(rob1 + n, rob2)\n                rob1 = rob2\n                rob2 = new_rob\n            return rob2\n        return max(rob_helper(nums[:-1]), rob_helper(nums[1:]))\n',
      javascript: 'function rob(nums) {\n    if (nums.length === 1) return nums[0];\n    function robHelper(sub) {\n        let rob1 = 0, rob2 = 0;\n        for (const n of sub) {\n            const newRob = Math.max(rob1 + n, rob2);\n            rob1 = rob2;\n            rob2 = newRob;\n        }\n        return rob2;\n    }\n    return Math.max(robHelper(nums.slice(0, -1)), robHelper(nums.slice(1)));\n}\n'
    },
    hints: ['Split into two standard House Robber cases: skip the first house OR skip the last house.'],
    editorial_md: '### Method: 1D DP on Split Subarrays\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  {
    category: 'dynamic-programming',
    slug: 'word-break',
    title: 'Word Break',
    difficulty: 'Medium',
    tags: ['Array', 'Hash Table', 'String', 'Dynamic Programming', 'Trie', 'Memoization'],
    statement_md: 'Given a string `s` and a dictionary of strings `wordDict`, return `true` if `s` can be segmented into a space-separated sequence of one or more dictionary words.',
    constraints: ['1 <= s.length <= 300', '1 <= wordDict.length <= 1000', '1 <= wordDict[i].length <= 20'],
    examples: [
      { input: { s: 'leetcode', wordDict: ['leet', 'code'] }, output: true },
      { input: { s: 'applepenapple', wordDict: ['apple', 'pen'] }, output: true },
      { input: { s: 'catsandog', wordDict: ['cats', 'dog', 'sand', 'and', 'cat'] }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def wordBreak(self, s: str, wordDict: List[str]) -> bool:\n        pass\n',
      javascript: 'function wordBreak(s, wordDict) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { s: 'leetcode', wordDict: ['leet', 'code'] }, expected_output: true, hidden: false },
      { input: { s: 'applepenapple', wordDict: ['apple', 'pen'] }, expected_output: true, hidden: false },
      { input: { s: 'catsandog', wordDict: ['cats', 'dog', 'sand', 'and', 'cat'] }, expected_output: false, hidden: false },
      { input: { s: 'a', wordDict: ['a'] }, expected_output: true, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def wordBreak(self, s: str, wordDict: List[str]) -> bool:\n        dp = [False] * (len(s) + 1)\n        dp[len(s)] = True\n        for i in range(len(s) - 1, -1, -1):\n            for w in wordDict:\n                if (i + len(w)) <= len(s) and s[i:i + len(w)] == w:\n                    dp[i] = dp[i + len(w)]\n                if dp[i]:\n                    break\n        return dp[0]\n',
      javascript: 'function wordBreak(s, wordDict) {\n    const dp = new Array(s.length + 1).fill(false);\n    dp[s.length] = true;\n    for (let i = s.length - 1; i >= 0; i--) {\n        for (const w of wordDict) {\n            if (i + w.length <= s.length && s.slice(i, i + w.length) === w) {\n                dp[i] = dp[i + w.length];\n            }\n            if (dp[i]) break;\n        }\n    }\n    return dp[0];\n}\n'
    },
    hints: ['dp[i] is True if s[i:] can be matched with words in wordDict starting at i.'],
    editorial_md: '### Method: Bottom-Up 1D DP\n- **Time Complexity**: $\\mathcal{O}(N \\cdot M \\cdot K)$ where $M = |\\text{wordDict}|$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  {
    category: 'dynamic-programming',
    slug: 'longest-increasing-subsequence',
    title: 'Longest Increasing Subsequence',
    difficulty: 'Medium',
    tags: ['Array', 'Binary Search', 'Dynamic Programming'],
    statement_md: 'Given an integer array `nums`, return the length of the longest strictly increasing subsequence.',
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    examples: [
      { input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, output: 4 },
      { input: { nums: [0, 1, 0, 3, 2, 3] }, output: 4 },
      { input: { nums: [7, 7, 7, 7, 7, 7, 7] }, output: 1 }
    ],
    starter_code: {
      python: 'class Solution:\n    def lengthOfLIS(self, nums: List[int]) -> int:\n        pass\n',
      javascript: 'function lengthOfLIS(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [10, 9, 2, 5, 3, 7, 101, 18] }, expected_output: 4, hidden: false },
      { input: { nums: [0, 1, 0, 3, 2, 3] }, expected_output: 4, hidden: false },
      { input: { nums: [7, 7, 7, 7, 7, 7, 7] }, expected_output: 1, hidden: false },
      { input: { nums: [1, 3, 6, 7, 9, 4, 10, 5, 6] }, expected_output: 6, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def lengthOfLIS(self, nums: List[int]) -> int:\n        import bisect\n        sub = []\n        for x in nums:\n            i = bisect.bisect_left(sub, x)\n            if i < len(sub):\n                sub[i] = x\n            else:\n                sub.append(x)\n        return len(sub)\n',
      javascript: 'function lengthOfLIS(nums) {\n    const sub = [];\n    for (const x of nums) {\n        let l = 0, r = sub.length;\n        while (l < r) {\n            const mid = Math.floor((l + r) / 2);\n            if (sub[mid] < x) l = mid + 1;\n            else r = mid;\n        }\n        if (l < sub.length) sub[l] = x;\n        else sub.push(x);\n    }\n    return sub.length;\n}\n'
    },
    hints: ['Use Patience Sorting with Binary Search (bisect_left) for O(N log N) runtime.'],
    editorial_md: '### Method: Patience Sorting / Binary Search\n- **Time Complexity**: $\\mathcal{O}(N \\log N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // ==================== ADVANCED GRAPHS ====================
  {
    category: 'graphs',
    slug: 'course-schedule',
    title: 'Course Schedule',
    difficulty: 'Medium',
    tags: ['Depth-First Search', 'Breadth-First Search', 'Graph', 'Topological Sort'],
    statement_md: 'There are a total of `numCourses` courses you have to take, labeled from `0` to `numCourses - 1`. You are given an array `prerequisites` where `prerequisites[i] = [ai, bi]` indicates that you **must** take course `bi` first if you want to take course `ai`.\n\nReturn `true` if you can finish all courses. Otherwise, return `false`.',
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2'],
    examples: [
      { input: { numCourses: 2, prerequisites: [[1, 0]] }, output: true },
      { input: { numCourses: 2, prerequisites: [[1, 0], [0, 1]] }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        pass\n',
      javascript: 'function canFinish(numCourses, prerequisites) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { numCourses: 2, prerequisites: [[1, 0]] }, expected_output: true, hidden: false },
      { input: { numCourses: 2, prerequisites: [[1, 0], [0, 1]] }, expected_output: false, hidden: false },
      { input: { numCourses: 3, prerequisites: [[0, 1], [0, 2], [1, 2]] }, expected_output: true, hidden: true },
      { input: { numCourses: 4, prerequisites: [[2, 0], [1, 0], [3, 1], [3, 2], [1, 3]] }, expected_output: false, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def canFinish(self, numCourses: int, prerequisites: List[List[int]]) -> bool:\n        pre_map = {i: [] for i in range(numCourses)}\n        for crs, pre in prerequisites:\n            pre_map[crs].append(pre)\n        visiting = set()\n        def dfs(crs):\n            if crs in visiting:\n                return False\n            if pre_map[crs] == []:\n                return True\n            visiting.add(crs)\n            for pre in pre_map[crs]:\n                if not dfs(pre):\n                    return False\n            visiting.remove(crs)\n            pre_map[crs] = []\n            return True\n        for c in range(numCourses):\n            if not dfs(c):\n                return False\n        return True\n',
      javascript: 'function canFinish(numCourses, prerequisites) {\n    const adj = Array.from({ length: numCourses }, () => []);\n    for (const [crs, pre] of prerequisites) {\n        adj[crs].push(pre);\n    }\n    const visiting = new Set();\n    const visited = new Set();\n    function dfs(crs) {\n        if (visiting.has(crs)) return false;\n        if (visited.has(crs)) return true;\n        visiting.add(crs);\n        for (const pre of adj[crs]) {\n            if (!dfs(pre)) return false;\n        }\n        visiting.delete(crs);\n        visited.add(crs);\n        return true;\n    }\n    for (let i = 0; i < numCourses; i++) {\n        if (!dfs(i)) return false;\n    }\n    return true;\n}\n'
    },
    hints: ['Check for cycles in a directed graph using DFS or Topological Sort (Kahn\'s Algorithm).'],
    editorial_md: '### Method: Cycle Detection via DFS\n- **Time Complexity**: $\\mathcal{O}(V + E)$\n- **Space Complexity**: $\\mathcal{O}(V + E)$'
  },

  // ==================== ADVANCED INTERVALS ====================
  {
    category: 'intervals',
    slug: 'insert-interval',
    title: 'Insert Interval',
    difficulty: 'Medium',
    tags: ['Array', 'Intervals'],
    statement_md: 'You are given an array of non-overlapping intervals `intervals` where `intervals[i] = [starti, endi]` sorted in ascending order by `starti` and an interval `newInterval = [start, end]`.\n\nInsert `newInterval` into `intervals` such that `intervals` is still sorted and has no overlapping intervals.',
    constraints: ['0 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^5'],
    examples: [
      { input: { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] }, output: [[1, 5], [6, 9]] },
      { input: { intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval: [4, 8] }, output: [[1, 2], [3, 10], [12, 16]] }
    ],
    starter_code: {
      python: 'class Solution:\n    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:\n        pass\n',
      javascript: 'function insert(intervals, newInterval) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] }, expected_output: [[1, 5], [6, 9]], hidden: false },
      { input: { intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval: [4, 8] }, expected_output: [[1, 2], [3, 10], [12, 16]], hidden: false },
      { input: { intervals: [], newInterval: [5, 7] }, expected_output: [[5, 7]], hidden: true },
      { input: { intervals: [[1, 5]], newInterval: [6, 8] }, expected_output: [[1, 5], [6, 8]], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def insert(self, intervals: List[List[int]], newInterval: List[int]) -> List[List[int]]:\n        res = []\n        for i in range(len(intervals)):\n            if newInterval[1] < intervals[i][0]:\n                res.append(newInterval)\n                return res + intervals[i:]\n            elif newInterval[0] > intervals[i][1]:\n                res.append(intervals[i])\n            else:\n                newInterval = [min(newInterval[0], intervals[i][0]), max(newInterval[1], intervals[i][1])]\n        res.append(newInterval)\n        return res\n',
      javascript: 'function insert(intervals, newInterval) {\n    const res = [];\n    for (let i = 0; i < intervals.length; i++) {\n        if (newInterval[1] < intervals[i][0]) {\n            res.push(newInterval);\n            return res.concat(intervals.slice(i));\n        } else if (newInterval[0] > intervals[i][1]) {\n            res.push(intervals[i]);\n        } else {\n            newInterval = [\n                Math.min(newInterval[0], intervals[i][0]),\n                Math.max(newInterval[1], intervals[i][1])\n            ];\n        }\n    }\n    res.push(newInterval);\n    return res;\n}\n'
    },
    hints: ['Three cases: interval comes strictly before newInterval, strictly after, or overlaps.'],
    editorial_md: '### Method: Single-Pass Linear Merge\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // ==================== ADVANCED SQL ====================
  {
    category: 'sql',
    slug: 'employees-earning-more-than-their-managers',
    title: 'Employees Earning More Than Their Managers',
    difficulty: 'Easy',
    tags: ['Database', 'SQL'],
    statement_md: 'Write a solution to find the employees who earn more than their managers.',
    constraints: ['id is the primary key column for Employee table.'],
    examples: [
      {
        input: 'Table Employee:\n+----+-------+--------+-----------+\n| id | name  | salary | managerId |\n+----+-------+--------+-----------+\n| 1  | Joe   | 70000  | 3         |\n| 2  | Henry | 80000  | 4         |\n| 3  | Sam   | 60000  | Null      |\n| 4  | Max   | 90000  | Null      |\n+----+-------+--------+-----------+',
        output: '+----------+\n| Employee |\n+----------+\n| Joe      |\n+----------+'
      }
    ],
    starter_code: {
      sql: '-- Write your SQL query statement below\nSELECT \n'
    },
    test_cases: [
      {
        schema_ddl: `
          CREATE TABLE Employee (id INT, name VARCHAR(255), salary INT, managerId INT);
          INSERT INTO Employee VALUES (1, 'Joe', 70000, 3), (2, 'Henry', 80000, 4), (3, 'Sam', 60000, NULL), (4, 'Max', 90000, NULL);
        `,
        expected_output: {
          columns: ['Employee'],
          values: [['Joe']]
        },
        hidden: false
      }
    ],
    reference_solution: {
      sql: `SELECT e.name AS Employee
FROM Employee e
JOIN Employee m ON e.managerId = m.id
WHERE e.salary > m.salary;`
    },
    hints: ['Self-join `Employee e` with `Employee m` on `e.managerId = m.id`.'],
    editorial_md: '### Method: Self JOIN\n\n```sql\nSELECT e.name AS Employee\nFROM Employee e\nJOIN Employee m ON e.managerId = m.id\nWHERE e.salary > m.salary;\n```'
  },

  {
    category: 'sql',
    slug: 'department-highest-salary',
    title: 'Department Highest Salary',
    difficulty: 'Medium',
    tags: ['Database', 'SQL'],
    statement_md: 'Write a solution to find employees who have the highest salary in each of the departments.',
    constraints: ['id is the primary key column for Employee and Department tables.'],
    examples: [
      {
        input: 'Table Employee:\n+----+-------+--------+--------------+\n| id | name  | salary | departmentId |\n+----+-------+--------+--------------+\n| 1  | Joe   | 70000  | 1            |\n| 2  | Jim   | 90000  | 1            |\n| 3  | Henry | 80000  | 2            |\n| 4  | Sam   | 60000  | 2            |\n| 5  | Max   | 90000  | 1            |\n+----+-------+--------+--------------+\nTable Department:\n+----+-------+\n| id | name  |\n+----+-------+\n| 1  | IT    |\n| 2  | Sales |\n+----+-------+',
        output: '+------------+----------+--------+\n| Department | Employee | Salary |\n+------------+----------+--------+\n| IT         | Jim      | 90000  |\n| IT         | Max      | 90000  |\n| Sales      | Henry    | 80000  |\n+------------+----------+--------+'
      }
    ],
    starter_code: {
      sql: '-- Write your SQL query statement below\nSELECT \n'
    },
    test_cases: [
      {
        schema_ddl: `
          CREATE TABLE Department (id INT, name VARCHAR(255));
          CREATE TABLE Employee (id INT, name VARCHAR(255), salary INT, departmentId INT);
          INSERT INTO Department VALUES (1, 'IT'), (2, 'Sales');
          INSERT INTO Employee VALUES (1, 'Joe', 70000, 1), (2, 'Jim', 90000, 1), (3, 'Henry', 80000, 2), (4, 'Sam', 60000, 2), (5, 'Max', 90000, 1);
        `,
        expected_output: {
          columns: ['Department', 'Employee', 'Salary'],
          values: [
            ['IT', 'Jim', 90000],
            ['IT', 'Max', 90000],
            ['Sales', 'Henry', 80000]
          ]
        },
        hidden: false
      }
    ],
    reference_solution: {
      sql: `SELECT d.name AS Department, e.name AS Employee, e.salary AS Salary
FROM Employee e
JOIN Department d ON e.departmentId = d.id
WHERE (e.departmentId, e.salary) IN (
    SELECT departmentId, MAX(salary)
    FROM Employee
    GROUP BY departmentId
);`
    },
    hints: ['Filter with subquery `WHERE (e.departmentId, e.salary) IN (SELECT departmentId, MAX(salary)...)`.'],
    editorial_md: '### Method: Subquery with IN (Tuple)\n\n```sql\nSELECT d.name AS Department, e.name AS Employee, e.salary AS Salary\nFROM Employee e\nJOIN Department d ON e.departmentId = d.id\nWHERE (e.departmentId, e.salary) IN (\n    SELECT departmentId, MAX(salary)\n    FROM Employee\n    GROUP BY departmentId\n);\n```'
  }
];

export function generateScalePack() {
  console.log(`[Scale Pack Generator] Writing ${SCALE_PROBLEMS.length} curated problems...`);
  for (const prob of SCALE_PROBLEMS) {
    const dir = path.join(ROOT_PROBLEMS_DIR, prob.category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${prob.slug}.json`);
    const { category, ...data } = prob;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  + Created: ${prob.category}/${prob.slug}.json`);
  }
  console.log('[Scale Pack Generator] Finished successfully!');
}

if (process.argv[1] && process.argv[1].includes('generate-scale-pack')) {
  generateScalePack();
}

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { V3_PROBLEMS, ProblemPackItem } from './problem-pack-v3.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

const ADDITIONAL_PROBLEMS: ProblemPackItem[] = [
  // ==========================================
  // 14. Heaps: Find Median from Data Stream (Hard - Blind 75 / Google / Amazon)
  // ==========================================
  {
    slug: 'find-median-from-data-stream',
    title: 'Find Median from Data Stream',
    category: 'heaps',
    difficulty: 'Hard',
    tags: ['Heaps', 'Design', 'Two Heaps', 'Blind 75', 'NeetCode 150', 'Google', 'Amazon'],
    statement_md: 'The **median** is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values.\n\nImplement the `MedianFinder` class:\n- `MedianFinder()` initializes the `MedianFinder` object.\n- `void addNum(int num)` adds the integer `num` from the data stream to the data structure.\n- `double findMedian()` returns the median of all elements so far.',
    constraints: [
      '-10^5 <= num <= 10^5',
      'There will be at least one element in the data structure before calling findMedian.',
      'At most 5 * 10^4 calls will be made to addNum and findMedian.'
    ],
    examples: [
      {
        input: {
          operations: ['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'],
          values: [[], [1], [2], [], [3], []]
        },
        output: [null, null, null, 1.5, null, 2.0]
      }
    ],
    starter_code: {
      python: `class MedianFinder:
    def __init__(self):
        pass

    def addNum(self, num: int) -> None:
        pass

    def findMedian(self) -> float:
        pass

def solve(operations: list[str], values: list[list[int]]) -> list:
    pass
`,
      javascript: `class MedianFinder {
  constructor() {}
  addNum(num) {}
  findMedian() {}
}

function solve(operations, values) {}
`
    },
    reference_solution: {
      python: `import bisect

class MedianFinder:
    def __init__(self):
        self.arr = []

    def addNum(self, num: int) -> None:
        bisect.insort(self.arr, num)

    def findMedian(self) -> float:
        n = len(self.arr)
        if n % 2 == 1:
            return float(self.arr[n // 2])
        return (self.arr[n // 2 - 1] + self.arr[n // 2]) / 2.0

def solve(operations: list[str], values: list[list[int]]) -> list:
    res = []
    mf = None
    for op, val in zip(operations, values):
        if op == "MedianFinder":
            mf = MedianFinder()
            res.append(None)
        elif op == "addNum":
            mf.addNum(val[0])
            res.append(None)
        elif op == "findMedian":
            res.append(mf.findMedian())
    return res
`,
      javascript: `class MedianFinder {
  constructor() {
    this.arr = [];
  }
  addNum(num) {
    let l = 0, r = this.arr.length;
    while (l < r) {
      const mid = (l + r) >> 1;
      if (this.arr[mid] < num) l = mid + 1;
      else r = mid;
    }
    this.arr.splice(l, 0, num);
  }
  findMedian() {
    const n = this.arr.length;
    if (n % 2 === 1) return this.arr[Math.floor(n / 2)];
    return (this.arr[n / 2 - 1] + this.arr[n / 2]) / 2;
  }
}

function solve(operations, values) {
  const res = [];
  let mf = null;
  for (let i = 0; i < operations.length; i++) {
    const op = operations[i];
    const val = values[i];
    if (op === "MedianFinder") {
      mf = new MedianFinder();
      res.push(null);
    } else if (op === "addNum") {
      mf.addNum(val[0]);
      res.push(null);
    } else if (op === "findMedian") {
      res.push(mf.findMedian());
    }
  }
  return res;
}
`
    },
    sample_test_cases: [
      {
        input: {
          operations: ['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'],
          values: [[], [1], [2], [], [3], []]
        },
        expected_output: [null, null, null, 1.5, null, 2.0]
      }
    ],
    test_cases: [
      {
        input: {
          operations: ['MedianFinder', 'addNum', 'addNum', 'findMedian', 'addNum', 'findMedian'],
          values: [[], [1], [2], [], [3], []]
        },
        expected_output: [null, null, null, 1.5, null, 2.0]
      },
      {
        input: {
          operations: ['MedianFinder', 'addNum', 'findMedian'],
          values: [[], [5], []]
        },
        expected_output: [null, null, 5.0],
        hidden: true
      }
    ],
    hints: [
      'Two heaps: Max Heap for the smaller half of numbers, Min Heap for the larger half.',
      'Maintain equal size (or max heap with 1 extra element).'
    ],
    editorial_md: 'Two heaps (Min-Heap and Max-Heap) to balance and access the median in O(1).'
  },

  // ==========================================
  // 15. Heaps: Task Scheduler (Medium - Blind 75 / Meta / Uber)
  // ==========================================
  {
    slug: 'task-scheduler',
    title: 'Task Scheduler',
    category: 'heaps',
    difficulty: 'Medium',
    tags: ['Heaps', 'Greedy', 'Hash Table', 'Counting', 'Blind 75', 'NeetCode 150', 'Meta', 'Uber'],
    statement_md: 'You are given an array of CPU `tasks`, each represented by letters A to Z, and a cooldown period `n`. Each cycle or interval allows the completion of one task. Tasks can be completed in any order, but there\'s a constraint: **identical** tasks must be separated by at least `n` intervals due to cooling time.\n\nReturn the *minimum number of intervals* required to complete all tasks.',
    constraints: [
      '1 <= tasks.length <= 10^4',
      'tasks[i] is an uppercase English letter.',
      '0 <= n <= 100'
    ],
    examples: [
      { input: { tasks: ['A','A','A','B','B','B'], n: 2 }, output: 8, explanation: 'A -> B -> idle -> A -> B -> idle -> A -> B' },
      { input: { tasks: ['A','C','A','B','D','B'], n: 1 }, output: 6, explanation: 'A -> B -> C -> D -> A -> B' },
      { input: { tasks: ['A','A','A','B','B','B'], n: 3 }, output: 10 }
    ],
    starter_code: {
      python: 'def leastInterval(tasks: list[str], n: int) -> int:\n    # Write your solution here\n    pass\n',
      javascript: 'function leastInterval(tasks, n) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `from collections import Counter

def leastInterval(tasks: list[str], n: int) -> int:
    counts = Counter(tasks)
    max_count = max(counts.values())
    max_count_tasks = sum(1 for count in counts.values() if count == max_count)
    
    empty_slots = (max_count - 1) * (n + 1) + max_count_tasks
    return max(len(tasks), empty_slots)
`,
      javascript: `function leastInterval(tasks, n) {
  const map = {};
  for (const t of tasks) map[t] = (map[t] || 0) + 1;
  const values = Object.values(map);
  const maxCount = Math.max(...values);
  const maxCountTasks = values.filter(v => v === maxCount).length;
  
  const minIntervals = (maxCount - 1) * (n + 1) + maxCountTasks;
  return Math.max(tasks.length, minIntervals);
}
`
    },
    sample_test_cases: [
      { input: { tasks: ['A','A','A','B','B','B'], n: 2 }, expected_output: 8 },
      { input: { tasks: ['A','C','A','B','D','B'], n: 1 }, expected_output: 6 },
      { input: { tasks: ['A','A','A','B','B','B'], n: 3 }, expected_output: 10 }
    ],
    test_cases: [
      { input: { tasks: ['A','A','A','B','B','B'], n: 2 }, expected_output: 8 },
      { input: { tasks: ['A','C','A','B','D','B'], n: 1 }, expected_output: 6 },
      { input: { tasks: ['A','A','A','B','B','B'], n: 3 }, expected_output: 10 },
      { input: { tasks: ['A'], n: 2 }, expected_output: 1, hidden: true }
    ],
    hints: [
      'The most frequent task dictates the minimum number of chunks `(max_freq - 1) * (n + 1)`.',
      'Add the count of tasks that share the maximum frequency.'
    ],
    editorial_md: 'Greedy slot arrangement based on the highest frequency task.'
  },

  // ==========================================
  // 16. DP: Regular Expression Matching (Hard - Google / Meta / Apple)
  // ==========================================
  {
    slug: 'regular-expression-matching',
    title: 'Regular Expression Matching',
    category: 'dynamic-programming',
    difficulty: 'Hard',
    tags: ['Dynamic Programming', 'Recursion', 'String', 'Google', 'Meta', 'Apple'],
    statement_md: 'Given an input string `s` and a pattern `p`, implement regular expression matching with support for `\'.\'` and `\'*\'` where:\n- `\'.\'` Matches any single character.\n- `\'*\'` Matches zero or more of the preceding element.\n\nThe matching should cover the **entire** input string (not partial).',
    constraints: [
      '1 <= s.length <= 20',
      '1 <= p.length <= 20',
      's contains only lowercase English letters.',
      'p contains only lowercase English letters, \'.\', and \'*\'.',
      'It is guaranteed for each appearance of the character \'*\', there will be a previous valid character to match.'
    ],
    examples: [
      { input: { s: 'aa', p: 'a' }, output: false },
      { input: { s: 'aa', p: 'a*' }, output: true },
      { input: { s: 'ab', p: '.*' }, output: true }
    ],
    starter_code: {
      python: 'def isMatch(s: str, p: str) -> bool:\n    # Write your solution here\n    pass\n',
      javascript: 'function isMatch(s, p) {\n  // Write your solution here\n}\n'
    },
    reference_solution: {
      python: `def isMatch(s: str, p: str) -> bool:
    memo = {}
    
    def dfs(i, j):
        if (i, j) in memo:
            return memo[(i, j)]
        if i >= len(s) and j >= len(p):
            return True
        if j >= len(p):
            return False
            
        match = i < len(s) and (s[i] == p[j] or p[j] == '.')
        
        if (j + 1) < len(p) and p[j + 1] == '*':
            memo[(i, j)] = dfs(i, j + 2) or (match and dfs(i + 1, j))
            return memo[(i, j)]
            
        if match:
            memo[(i, j)] = dfs(i + 1, j + 1)
            return memo[(i, j)]
            
        memo[(i, j)] = False
        return False
        
    return dfs(0, 0)
`,
      javascript: `function isMatch(s, p) {
  const memo = new Map();
  function dfs(i, j) {
    const key = \`\${i},\${j}\`;
    if (memo.has(key)) return memo.get(key);
    if (i >= s.length && j >= p.length) return true;
    if (j >= p.length) return false;
    
    const match = i < s.length && (s[i] === p[j] || p[j] === '.');
    let res = false;
    if (j + 1 < p.length && p[j + 1] === '*') {
      res = dfs(i, j + 2) || (match && dfs(i + 1, j));
    } else if (match) {
      res = dfs(i + 1, j + 1);
    }
    memo.set(key, res);
    return res;
  }
  return dfs(0, 0);
}
`
    },
    sample_test_cases: [
      { input: { s: 'aa', p: 'a' }, expected_output: false },
      { input: { s: 'aa', p: 'a*' }, expected_output: true },
      { input: { s: 'ab', p: '.*' }, expected_output: true }
    ],
    test_cases: [
      { input: { s: 'aa', p: 'a' }, expected_output: false },
      { input: { s: 'aa', p: 'a*' }, expected_output: true },
      { input: { s: 'ab', p: '.*' }, expected_output: true },
      { input: { s: 'aab', p: 'c*a*b' }, expected_output: true, hidden: true },
      { input: { s: 'mississippi', p: 'mis*is*p*.' }, expected_output: false, hidden: true }
    ],
    hints: [
      'Top-down memoization on `(i, j)` where `i` indexes `s` and `j` indexes `p`.',
      'Handle `*` either by skipping `j + 2` or consuming one matching character `i + 1`.'
    ],
    editorial_md: 'Top-down Dynamic Programming covering `*` repeat and skip transitions.'
  },

  // ==========================================
  // 17. Two Pointers: Next Permutation (Medium - Blind 75 / Google / Amazon)
  // ==========================================
  {
    slug: 'next-permutation',
    title: 'Next Permutation',
    category: 'two-pointers',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Array', 'Blind 75', 'NeetCode 150', 'Google', 'Amazon'],
    statement_md: 'A **permutation** of an array of integers is an arrangement of its members into a sequence or linear order.\n\nGiven an array of integers `nums`, find the next lexicographical greater permutation of its numbers.\n\nIf such an arrangement is not possible, rearrange it as the lowest possible order (i.e., sorted in ascending order).\n\nThe replacement must be **in place** and use only constant extra memory.',
    constraints: [
      '1 <= nums.length <= 100',
      '0 <= nums[i] <= 100'
    ],
    examples: [
      { input: { nums: [1,2,3] }, output: [1,3,2] },
      { input: { nums: [3,2,1] }, output: [1,2,3] },
      { input: { nums: [1,1,5] }, output: [1,5,1] }
    ],
    starter_code: {
      python: 'def nextPermutation(nums: list[int]) -> list[int]:\n    # Modify nums in-place and return it\n    pass\n',
      javascript: 'function nextPermutation(nums) {\n  // Modify nums in-place and return it\n}\n'
    },
    reference_solution: {
      python: `def nextPermutation(nums: list[int]) -> list[int]:
    i = len(nums) - 2
    while i >= 0 and nums[i] >= nums[i + 1]:
        i -= 1
    if i >= 0:
        j = len(nums) - 1
        while nums[j] <= nums[i]:
            j -= 1
        nums[i], nums[j] = nums[j], nums[i]
    
    # Reverse from i + 1 to end
    l, r = i + 1, len(nums) - 1
    while l < r:
        nums[l], nums[r] = nums[r], nums[l]
        l += 1
        r -= 1
    return nums
`,
      javascript: `function nextPermutation(nums) {
  let i = nums.length - 2;
  while (i >= 0 && nums[i] >= nums[i + 1]) i--;
  if (i >= 0) {
    let j = nums.length - 1;
    while (nums[j] <= nums[i]) j--;
    const temp = nums[i];
    nums[i] = nums[j];
    nums[j] = temp;
  }
  let l = i + 1, r = nums.length - 1;
  while (l < r) {
    const temp = nums[l];
    nums[l] = nums[r];
    nums[r] = temp;
    l++;
    r--;
  }
  return nums;
}
`
    },
    sample_test_cases: [
      { input: { nums: [1,2,3] }, expected_output: [1,3,2] },
      { input: { nums: [3,2,1] }, expected_output: [1,2,3] },
      { input: { nums: [1,1,5] }, expected_output: [1,5,1] }
    ],
    test_cases: [
      { input: { nums: [1,2,3] }, expected_output: [1,3,2] },
      { input: { nums: [3,2,1] }, expected_output: [1,2,3] },
      { input: { nums: [1,1,5] }, expected_output: [1,5,1] },
      { input: { nums: [1] }, expected_output: [1], hidden: true }
    ],
    hints: [
      'Find the first decreasing element from the right `nums[i] < nums[i+1]`.',
      'Swap `nums[i]` with the next larger element from the right, then reverse the suffix from `i + 1`.'
    ],
    editorial_md: 'Single-pass scan from right finding pivot, swap, and suffix reversal.'
  }
];

export function writeAllV3Problems() {
  const allProbs = [...V3_PROBLEMS, ...ADDITIONAL_PROBLEMS];
  let created = 0;
  for (const prob of allProbs) {
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

writeAllV3Problems();

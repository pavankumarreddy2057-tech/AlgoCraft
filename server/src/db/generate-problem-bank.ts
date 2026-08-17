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
  test_cases: Array<{ input: any; expected_output: any; hidden?: boolean; explanation?: string }>;
  reference_solution: { python: string; javascript: string };
  hints: string[];
  editorial_md: string;
  time_limit_ms?: number;
  memory_limit_mb?: number;
}

const PROBLEMS: ProblemDef[] = [
  // 1. Two Sum
  {
    category: 'arrays-and-hashing',
    slug: 'two-sum',
    title: 'Two Sum',
    difficulty: 'Easy',
    tags: ['Arrays', 'Hash Table'],
    statement_md: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.',
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', '-10^9 <= target <= 10^9', 'Only one valid answer exists.'],
    examples: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, output: [0, 1], explanation: 'nums[0] + nums[1] == 9, return [0, 1].' },
      { input: { nums: [3, 2, 4], target: 6 }, output: [1, 2] },
      { input: { nums: [3, 3], target: 6 }, output: [0, 1] }
    ],
    starter_code: {
      python: 'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        pass\n',
      javascript: 'function twoSum(nums, target) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [2, 7, 11, 15], target: 9 }, expected_output: [0, 1], hidden: false },
      { input: { nums: [3, 2, 4], target: 6 }, expected_output: [1, 2], hidden: false },
      { input: { nums: [3, 3], target: 6 }, expected_output: [0, 1], hidden: false },
      { input: { nums: [-1, -2, -3, -4, -5], target: -8 }, expected_output: [2, 4], hidden: true },
      { input: { nums: [100, 200, 300], target: 500 }, expected_output: [1, 2], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        seen = {}\n        for i, n in enumerate(nums):\n            diff = target - n\n            if diff in seen:\n                return [seen[diff], i]\n            seen[n] = i\n        return []\n',
      javascript: 'function twoSum(nums, target) {\n    const map = new Map();\n    for (let i = 0; i < nums.length; i++) {\n        const diff = target - nums[i];\n        if (map.has(diff)) return [map.get(diff), i];\n        map.set(nums[i], i);\n    }\n    return [];\n}\n'
    },
    hints: ['Use a hash map to store visited numbers and their indices.', 'Check if target - current exists in map.'],
    editorial_md: '### Method: Hash Map\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 2. Contains Duplicate
  {
    category: 'arrays-and-hashing',
    slug: 'contains-duplicate',
    title: 'Contains Duplicate',
    difficulty: 'Easy',
    tags: ['Arrays', 'Hash Table', 'Sorting'],
    statement_md: 'Given an integer array `nums`, return `true` if any value appears **at least twice** in the array, and return `false` if every element is distinct.',
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      { input: { nums: [1, 2, 3, 1] }, output: true },
      { input: { nums: [1, 2, 3, 4] }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        pass\n',
      javascript: 'function containsDuplicate(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [1, 2, 3, 1] }, expected_output: true, hidden: false },
      { input: { nums: [1, 2, 3, 4] }, expected_output: false, hidden: false },
      { input: { nums: [99] }, expected_output: false, hidden: true },
      { input: { nums: [0, 0] }, expected_output: true, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def containsDuplicate(self, nums: List[int]) -> bool:\n        return len(nums) != len(set(nums))\n',
      javascript: 'function containsDuplicate(nums) {\n    return new Set(nums).size !== nums.length;\n}\n'
    },
    hints: ['Check if size of set differs from length of array.'],
    editorial_md: '### Method: Hash Set\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 3. Valid Anagram
  {
    category: 'arrays-and-hashing',
    slug: 'valid-anagram',
    title: 'Valid Anagram',
    difficulty: 'Easy',
    tags: ['Strings', 'Hash Table', 'Sorting'],
    statement_md: 'Given two strings `s` and `t`, return `true` if `t` is an **anagram** of `s`, and `false` otherwise.',
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    examples: [
      { input: { s: 'anagram', t: 'nagaram' }, output: true },
      { input: { s: 'rat', t: 'car' }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        pass\n',
      javascript: 'function isAnagram(s, t) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { s: 'anagram', t: 'nagaram' }, expected_output: true, hidden: false },
      { input: { s: 'rat', t: 'car' }, expected_output: false, hidden: false },
      { input: { s: 'ab', t: 'a' }, expected_output: false, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def isAnagram(self, s: str, t: str) -> bool:\n        if len(s) != len(t):\n            return False\n        counts = {}\n        for char in s:\n            counts[char] = counts.get(char, 0) + 1\n        for char in t:\n            if char not in counts or counts[char] == 0:\n                return False\n            counts[char] -= 1\n        return True\n',
      javascript: 'function isAnagram(s, t) {\n    if (s.length !== t.length) return false;\n    const map = {};\n    for (const c of s) map[c] = (map[c] || 0) + 1;\n    for (const c of t) {\n        if (!map[c]) return false;\n        map[c]--;\n    }\n    return true;\n}\n'
    },
    hints: ['Count frequency of each character in both strings.'],
    editorial_md: '### Method: Character Frequency Counting\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 4. Group Anagrams
  {
    category: 'arrays-and-hashing',
    slug: 'group-anagrams',
    title: 'Group Anagrams',
    difficulty: 'Medium',
    tags: ['Arrays', 'Hash Table', 'Strings'],
    statement_md: 'Given an array of strings `strs`, group **the anagrams** together. You can return the answer in **any order**.',
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100'],
    examples: [
      { input: { strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] }, output: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']] }
    ],
    starter_code: {
      python: 'class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        pass\n',
      javascript: 'function groupAnagrams(strs) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { strs: ['eat', 'tea', 'tan', 'ate', 'nat', 'bat'] }, expected_output: [['eat', 'tea', 'ate'], ['tan', 'nat'], ['bat']], hidden: false },
      { input: { strs: [''] }, expected_output: [['']], hidden: false },
      { input: { strs: ['a'] }, expected_output: [['a']], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def groupAnagrams(self, strs: List[str]) -> List[List[str]]:\n        from collections import defaultdict\n        res = defaultdict(list)\n        for s in strs:\n            res["".join(sorted(s))].append(s)\n        return list(res.values())\n',
      javascript: 'function groupAnagrams(strs) {\n    const map = new Map();\n    for (const s of strs) {\n        const key = s.split("").sort().join("");\n        if (!map.has(key)) map.set(key, []);\n        map.get(key).push(s);\n    }\n    return Array.from(map.values());\n}\n'
    },
    hints: ['Sort each string to use as the grouping key.'],
    editorial_md: '### Method: Hash Map with Sorted String Keys\n- **Time Complexity**: $\\mathcal{O}(N \\cdot K \\log K)$\n- **Space Complexity**: $\\mathcal{O}(N \\cdot K)$'
  },

  // 5. Top K Frequent Elements
  {
    category: 'arrays-and-hashing',
    slug: 'top-k-frequent-elements',
    title: 'Top K Frequent Elements',
    difficulty: 'Medium',
    tags: ['Arrays', 'Hash Table', 'Bucket Sort', 'Heap'],
    statement_md: 'Given an integer array `nums` and an integer `k`, return *the* `k` *most frequent elements*. You may return the answer in **any order**.',
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array].'],
    examples: [
      { input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, output: [1, 2] },
      { input: { nums: [1], k: 1 }, output: [1] }
    ],
    starter_code: {
      python: 'class Solution:\n    def topKFrequent(self, nums: List[int], k: int) -> List[int]:\n        pass\n',
      javascript: 'function topKFrequent(nums, k) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [1, 1, 1, 2, 2, 3], k: 2 }, expected_output: [1, 2], hidden: false },
      { input: { nums: [1], k: 1 }, expected_output: [1], hidden: false },
      { input: { nums: [4, 1, -1, 2, -1, 2, 3], k: 2 }, expected_output: [-1, 2], hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def topKFrequent(self, nums: List[int], k: int) -> List[int]:\n        count = {}\n        for n in nums:\n            count[n] = count.get(n, 0) + 1\n        buckets = [[] for _ in range(len(nums) + 1)]\n        for n, c in count.items():\n            buckets[c].append(n)\n        res = []\n        for i in range(len(buckets) - 1, 0, -1):\n            for n in buckets[i]:\n                res.append(n)\n                if len(res) == k:\n                    return res\n        return res\n',
      javascript: 'function topKFrequent(nums, k) {\n    const count = new Map();\n    for (const n of nums) count.set(n, (count.get(n) || 0) + 1);\n    const buckets = Array.from({ length: nums.length + 1 }, () => []);\n    for (const [n, c] of count.entries()) buckets[c].push(n);\n    const res = [];\n    for (let i = buckets.length - 1; i > 0; i--) {\n        for (const n of buckets[i]) {\n            res.push(n);\n            if (res.length === k) return res;\n        }\n    }\n    return res;\n}\n'
    },
    hints: ['Use Bucket Sort where index represents frequency count for O(N) runtime.'],
    editorial_md: '### Method: Bucket Sort\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 6. Product of Array Except Self
  {
    category: 'arrays-and-hashing',
    slug: 'product-of-array-except-self',
    title: 'Product of Array Except Self',
    difficulty: 'Medium',
    tags: ['Arrays', 'Prefix Sum'],
    statement_md: 'Given an integer array `nums`, return an array `answer` such that `answer[i]` is equal to the product of all the elements of `nums` except `nums[i]` without using division.',
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30'],
    examples: [
      { input: { nums: [1, 2, 3, 4] }, output: [24, 12, 8, 6] },
      { input: { nums: [-1, 1, 0, -3, 3] }, output: [0, 0, 9, 0, 0] }
    ],
    starter_code: {
      python: 'class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        pass\n',
      javascript: 'function productExceptSelf(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [1, 2, 3, 4] }, expected_output: [24, 12, 8, 6], hidden: false },
      { input: { nums: [-1, 1, 0, -3, 3] }, expected_output: [0, 0, 9, 0, 0], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def productExceptSelf(self, nums: List[int]) -> List[int]:\n        n = len(nums)\n        res = [1] * n\n        p = 1\n        for i in range(n):\n            res[i] = p\n            p *= nums[i]\n        s = 1\n        for i in range(n - 1, -1, -1):\n            res[i] *= s\n            s *= nums[i]\n        return res\n',
      javascript: 'function productExceptSelf(nums) {\n    const n = nums.length;\n    const res = new Array(n).fill(1);\n    let p = 1;\n    for (let i = 0; i < n; i++) {\n        res[i] = p;\n        p *= nums[i];\n    }\n    let s = 1;\n    for (let i = n - 1; i >= 0; i--) {\n        res[i] *= s;\n        s *= nums[i];\n    }\n    return res;\n}\n'
    },
    hints: ['Prefix product pass forwards, suffix product pass backwards.'],
    editorial_md: '### Method: Prefix & Suffix Products\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 7. Longest Consecutive Sequence
  {
    category: 'arrays-and-hashing',
    slug: 'longest-consecutive-sequence',
    title: 'Longest Consecutive Sequence',
    difficulty: 'Medium',
    tags: ['Arrays', 'Hash Table', 'Union Find'],
    statement_md: 'Given an unsorted array of integers `nums`, return *the length of the longest consecutive elements sequence* in $\\mathcal{O}(n)$ time.',
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    examples: [
      { input: { nums: [100, 4, 200, 1, 3, 2] }, output: 4, explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4].' },
      { input: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] }, output: 9 }
    ],
    starter_code: {
      python: 'class Solution:\n    def longestConsecutive(self, nums: List[int]) -> int:\n        pass\n',
      javascript: 'function longestConsecutive(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [100, 4, 200, 1, 3, 2] }, expected_output: 4, hidden: false },
      { input: { nums: [0, 3, 7, 2, 5, 8, 4, 6, 0, 1] }, expected_output: 9, hidden: false },
      { input: { nums: [] }, expected_output: 0, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def longestConsecutive(self, nums: List[int]) -> int:\n        num_set = set(nums)\n        longest = 0\n        for n in num_set:\n            if (n - 1) not in num_set:\n                length = 1\n                while (n + length) in num_set:\n                    length += 1\n                longest = max(longest, length)\n        return longest\n',
      javascript: 'function longestConsecutive(nums) {\n    const set = new Set(nums);\n    let longest = 0;\n    for (const n of set) {\n        if (!set.has(n - 1)) {\n            let len = 1;\n            while (set.has(n + len)) len++;\n            longest = Math.max(longest, len);\n        }\n    }\n    return longest;\n}\n'
    },
    hints: ['Only start counting if `n - 1` is not in the set, meaning `n` is the start of a sequence.'],
    editorial_md: '### Method: Hash Set Sequence Roots\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 8. Valid Palindrome
  {
    category: 'two-pointers',
    slug: 'valid-palindrome',
    title: 'Valid Palindrome',
    difficulty: 'Easy',
    tags: ['Two Pointers', 'Strings'],
    statement_md: 'A phrase is a **palindrome** if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward.',
    constraints: ['1 <= s.length <= 2 * 10^5'],
    examples: [
      { input: { s: 'A man, a plan, a canal: Panama' }, output: true },
      { input: { s: 'race a car' }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        pass\n',
      javascript: 'function isPalindrome(s) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { s: 'A man, a plan, a canal: Panama' }, expected_output: true, hidden: false },
      { input: { s: 'race a car' }, expected_output: false, hidden: false },
      { input: { s: ' ' }, expected_output: true, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def isPalindrome(self, s: str) -> bool:\n        clean = [c.lower() for c in s if c.isalnum()]\n        return clean == clean[::-1]\n',
      javascript: 'function isPalindrome(s) {\n    const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n    let l = 0, r = clean.length - 1;\n    while (l < r) {\n        if (clean[l] !== clean[r]) return false;\n        l++;\n        r--;\n    }\n    return true;\n}\n'
    },
    hints: ['Strip non-alphanumerics and compare inward with two pointers.'],
    editorial_md: '### Method: Two Pointers\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 9. Two Sum II - Input Array Is Sorted
  {
    category: 'two-pointers',
    slug: 'two-sum-ii-input-array-is-sorted',
    title: 'Two Sum II - Input Array Is Sorted',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Arrays', 'Binary Search'],
    statement_md: 'Given a **1-indexed** array of integers `numbers` sorted in non-decreasing order, find two numbers that add up to `target`. Return `[index1, index2]`.',
    constraints: ['2 <= numbers.length <= 3 * 10^4', 'Exactly one solution exists.'],
    examples: [
      { input: { numbers: [2, 7, 11, 15], target: 9 }, output: [1, 2] }
    ],
    starter_code: {
      python: 'class Solution:\n    def twoSum(self, numbers: List[int], target: int) -> List[int]:\n        pass\n',
      javascript: 'function twoSum(numbers, target) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { numbers: [2, 7, 11, 15], target: 9 }, expected_output: [1, 2], hidden: false },
      { input: { numbers: [2, 3, 4], target: 6 }, expected_output: [1, 3], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def twoSum(self, numbers: List[int], target: int) -> List[int]:\n        l, r = 0, len(numbers) - 1\n        while l < r:\n            s = numbers[l] + numbers[r]\n            if s == target:\n                return [l + 1, r + 1]\n            elif s < target:\n                l += 1\n            else:\n                r -= 1\n        return []\n',
      javascript: 'function twoSum(numbers, target) {\n    let l = 0, r = numbers.length - 1;\n    while (l < r) {\n        const s = numbers[l] + numbers[r];\n        if (s === target) return [l + 1, r + 1];\n        if (s < target) l++;\n        else r--;\n    }\n    return [];\n}\n'
    },
    hints: ['Pointers at ends; move left rightward if sum too small, right leftward if too big.'],
    editorial_md: '### Method: Two Pointers\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 10. 3Sum
  {
    category: 'two-pointers',
    slug: '3sum',
    title: '3Sum',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Arrays', 'Sorting'],
    statement_md: 'Given an integer array `nums`, return all the triplets `[nums[i], nums[j], nums[k]]` such that `i != j != k` and `nums[i] + nums[j] + nums[k] == 0` without duplicates.',
    constraints: ['3 <= nums.length <= 3000'],
    examples: [
      { input: { nums: [-1, 0, 1, 2, -1, -4] }, output: [[-1, -1, 2], [-1, 0, 1]] }
    ],
    starter_code: {
      python: 'class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        pass\n',
      javascript: 'function threeSum(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [-1, 0, 1, 2, -1, -4] }, expected_output: [[-1, -1, 2], [-1, 0, 1]], hidden: false },
      { input: { nums: [0, 0, 0] }, expected_output: [[0, 0, 0]], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def threeSum(self, nums: List[int]) -> List[List[int]]:\n        nums.sort()\n        res = []\n        for i in range(len(nums) - 2):\n            if i > 0 and nums[i] == nums[i - 1]:\n                continue\n            l, r = i + 1, len(nums) - 1\n            while l < r:\n                s = nums[i] + nums[l] + nums[r]\n                if s < 0:\n                    l += 1\n                elif s > 0:\n                    r -= 1\n                else:\n                    res.append([nums[i], nums[l], nums[r]])\n                    while l < r and nums[l] == nums[l + 1]:\n                        l += 1\n                    while l < r and nums[r] == nums[r - 1]:\n                        r -= 1\n                    l += 1\n                    r -= 1\n        return res\n',
      javascript: 'function threeSum(nums) {\n    nums.sort((a, b) => a - b);\n    const res = [];\n    for (let i = 0; i < nums.length - 2; i++) {\n        if (i > 0 && nums[i] === nums[i - 1]) continue;\n        let l = i + 1, r = nums.length - 1;\n        while (l < r) {\n            const s = nums[i] + nums[l] + nums[r];\n            if (s === 0) {\n                res.push([nums[i], nums[l], nums[r]]);\n                while (l < r && nums[l] === nums[l + 1]) l++;\n                while (l < r && nums[r] === nums[r - 1]) r--;\n                l++;\n                r--;\n            } else if (s < 0) {\n                l++;\n            } else {\n                r--;\n            }\n        }\n    }\n    return res;\n}\n'
    },
    hints: ['Sort array, fix first number, use Two Pointers for the remaining pair.'],
    editorial_md: '### Method: Sort + Two Pointers\n- **Time Complexity**: $\\mathcal{O}(N^2)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 11. Container With Most Water
  {
    category: 'two-pointers',
    slug: 'container-with-most-water',
    title: 'Container With Most Water',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'Arrays', 'Greedy'],
    statement_md: 'Find two lines that together with the x-axis form a container storing the maximum water.',
    constraints: ['2 <= height.length <= 10^5'],
    examples: [
      { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, output: 49 }
    ],
    starter_code: {
      python: 'class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        pass\n',
      javascript: 'function maxArea(height) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { height: [1, 8, 6, 2, 5, 4, 8, 3, 7] }, expected_output: 49, hidden: false },
      { input: { height: [1, 1] }, expected_output: 1, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def maxArea(self, height: List[int]) -> int:\n        l, r = 0, len(height) - 1\n        max_water = 0\n        while l < r:\n            h = min(height[l], height[r])\n            max_water = max(max_water, h * (r - l))\n            if height[l] < height[r]:\n                l += 1\n            else:\n                r -= 1\n        return max_water\n',
      javascript: 'function maxArea(height) {\n    let l = 0, r = height.length - 1;\n    let maxWater = 0;\n    while (l < r) {\n        const h = Math.min(height[l], height[r]);\n        maxWater = Math.max(maxWater, h * (r - l));\n        if (height[l] < height[r]) l++;\n        else r--;\n    }\n    return maxWater;\n}\n'
    },
    hints: ['Move pointer pointing to the shorter line.'],
    editorial_md: '### Method: Greedy Two Pointers\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 12. Trapping Rain Water
  {
    category: 'two-pointers',
    slug: 'trapping-rain-water',
    title: 'Trapping Rain Water',
    difficulty: 'Hard',
    tags: ['Two Pointers', 'Dynamic Programming', 'Stack'],
    statement_md: 'Given `n` non-negative integers representing an elevation map where the width of each bar is `1`, compute how much water it can trap after raining.',
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    examples: [
      { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, output: 6 },
      { input: { height: [4, 2, 0, 3, 2, 5] }, output: 9 }
    ],
    starter_code: {
      python: 'class Solution:\n    def trap(self, height: List[int]) -> int:\n        pass\n',
      javascript: 'function trap(height) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] }, expected_output: 6, hidden: false },
      { input: { height: [4, 2, 0, 3, 2, 5] }, expected_output: 9, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def trap(self, height: List[int]) -> int:\n        if not height:\n            return 0\n        l, r = 0, len(height) - 1\n        left_max, right_max = height[l], height[r]\n        water = 0\n        while l < r:\n            if left_max < right_max:\n                l += 1\n                left_max = max(left_max, height[l])\n                water += left_max - height[l]\n            else:\n                r -= 1\n                right_max = max(right_max, height[r])\n                water += right_max - height[r]\n        return water\n',
      javascript: 'function trap(height) {\n    if (!height || height.length === 0) return 0;\n    let l = 0, r = height.length - 1;\n    let leftMax = height[l], rightMax = height[r];\n    let water = 0;\n    while (l < r) {\n        if (leftMax < rightMax) {\n            l++;\n            leftMax = Math.max(leftMax, height[l]);\n            water += leftMax - height[l];\n        } else {\n            r--;\n            rightMax = Math.max(rightMax, height[r]);\n            water += rightMax - height[r];\n        }\n    }\n    return water;\n}\n'
    },
    hints: ['Water trapped at position i is `min(max_left, max_right) - height[i]`.'],
    editorial_md: '### Method: Two Pointers\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 13. Best Time to Buy and Sell Stock
  {
    category: 'sliding-window',
    slug: 'best-time-to-buy-and-sell-stock',
    title: 'Best Time to Buy and Sell Stock',
    difficulty: 'Easy',
    tags: ['Arrays', 'Dynamic Programming', 'Sliding Window'],
    statement_md: 'Maximize profit by choosing a single day to buy and a single day in the future to sell.',
    constraints: ['1 <= prices.length <= 10^5'],
    examples: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, output: 5 }
    ],
    starter_code: {
      python: 'class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        pass\n',
      javascript: 'function maxProfit(prices) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { prices: [7, 1, 5, 3, 6, 4] }, expected_output: 5, hidden: false },
      { input: { prices: [7, 6, 4, 3, 1] }, expected_output: 0, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def maxProfit(self, prices: List[int]) -> int:\n        min_p = float("inf")\n        profit = 0\n        for p in prices:\n            if p < min_p:\n                min_p = p\n            elif p - min_p > profit:\n                profit = p - min_p\n        return profit\n',
      javascript: 'function maxProfit(prices) {\n    let minP = Infinity, maxP = 0;\n    for (const p of prices) {\n        if (p < minP) minP = p;\n        else if (p - minP > maxP) maxP = p - minP;\n    }\n    return maxP;\n}\n'
    },
    hints: ['Track minimum price and maximum profit seen so far.'],
    editorial_md: '### Method: One Pass Tracking Min\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 14. Longest Substring Without Repeating Characters
  {
    category: 'sliding-window',
    slug: 'longest-substring-without-repeating-characters',
    title: 'Longest Substring Without Repeating Characters',
    difficulty: 'Medium',
    tags: ['Hash Table', 'String', 'Sliding Window'],
    statement_md: 'Find the length of the longest substring without repeating characters.',
    constraints: ['0 <= s.length <= 5 * 10^4'],
    examples: [
      { input: { s: 'abcabcbb' }, output: 3 }
    ],
    starter_code: {
      python: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        pass\n',
      javascript: 'function lengthOfLongestSubstring(s) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { s: 'abcabcbb' }, expected_output: 3, hidden: false },
      { input: { s: 'bbbbb' }, expected_output: 1, hidden: false },
      { input: { s: 'pwwkew' }, expected_output: 3, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def lengthOfLongestSubstring(self, s: str) -> int:\n        char_map = {}\n        l = 0\n        max_len = 0\n        for r, c in enumerate(s):\n            if c in char_map and char_map[c] >= l:\n                l = char_map[c] + 1\n            char_map[c] = r\n            max_len = max(max_len, r - l + 1)\n        return max_len\n',
      javascript: 'function lengthOfLongestSubstring(s) {\n    const map = new Map();\n    let l = 0, maxLen = 0;\n    for (let r = 0; r < s.length; r++) {\n        const c = s[r];\n        if (map.has(c) && map.get(c) >= l) l = map.get(c) + 1;\n        map.set(c, r);\n        maxLen = Math.max(maxLen, r - l + 1);\n    }\n    return maxLen;\n}\n'
    },
    hints: ['Use sliding window with last seen index map.'],
    editorial_md: '### Method: Sliding Window\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(\\min(N, \\Sigma))$'
  },

  // 15. Valid Parentheses
  {
    category: 'stack',
    slug: 'valid-parentheses',
    title: 'Valid Parentheses',
    difficulty: 'Easy',
    tags: ['Stack', 'String'],
    statement_md: 'Determine if the input string consisting of brackets `()[]{}` is valid.',
    constraints: ['1 <= s.length <= 10^4'],
    examples: [
      { input: { s: '()[]{}' }, output: true },
      { input: { s: '(]' }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        pass\n',
      javascript: 'function isValid(s) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { s: '()[]{}' }, expected_output: true, hidden: false },
      { input: { s: '(]' }, expected_output: false, hidden: false },
      { input: { s: '{[]}' }, expected_output: true, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def isValid(self, s: str) -> bool:\n        stack = []\n        pairs = {")": "(", "}": "{", "]": "["}\n        for c in s:\n            if c in pairs:\n                if not stack or stack[-1] != pairs[c]:\n                    return False\n                stack.pop()\n            else:\n                stack.append(c)\n        return len(stack) == 0\n',
      javascript: 'function isValid(s) {\n    const stack = [];\n    const pairs = { ")": "(", "}": "{", "]": "[" };\n    for (const c of s) {\n        if (pairs[c]) {\n            if (stack.pop() !== pairs[c]) return false;\n        } else {\n            stack.push(c);\n        }\n    }\n    return stack.length === 0;\n}\n'
    },
    hints: ['Push opening brackets to stack, pop on closing brackets.'],
    editorial_md: '### Method: Stack\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 16. Min Stack
  {
    category: 'stack',
    slug: 'min-stack',
    title: 'Min Stack',
    difficulty: 'Medium',
    tags: ['Stack', 'Design'],
    statement_md: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time.\n\nImplement `evaluate(operations, values)` where operations are sequence of `["push", "pop", "top", "getMin"]` and values are corresponding integer parameters.',
    constraints: ['Methods pop, top and getMin operations will always be called on non-empty stacks.'],
    examples: [
      {
        input: {
          ops: ['push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'],
          vals: [[-2], [0], [-3], [], [], [], []]
        },
        output: [null, null, null, -3, null, 0, -2]
      }
    ],
    starter_code: {
      python: 'class Solution:\n    def evalMinStack(self, ops: List[str], vals: List[List[int]]) -> List[Any]:\n        pass\n',
      javascript: 'function evalMinStack(ops, vals) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      {
        input: {
          ops: ['push', 'push', 'push', 'getMin', 'pop', 'top', 'getMin'],
          vals: [[-2], [0], [-3], [], [], [], []]
        },
        expected_output: [null, null, null, -3, null, 0, -2],
        hidden: false
      }
    ],
    reference_solution: {
      python: 'class Solution:\n    def evalMinStack(self, ops: List[str], vals: List[List[int]]) -> List[Any]:\n        stack = []\n        min_stack = []\n        res = []\n        for op, val in zip(ops, vals):\n            if op == "push":\n                v = val[0]\n                stack.append(v)\n                min_val = min(v, min_stack[-1] if min_stack else v)\n                min_stack.append(min_val)\n                res.append(None)\n            elif op == "pop":\n                stack.pop()\n                min_stack.pop()\n                res.append(None)\n            elif op == "top":\n                res.append(stack[-1])\n            elif op == "getMin":\n                res.append(min_stack[-1])\n        return res\n',
      javascript: 'function evalMinStack(ops, vals) {\n    const stack = [];\n    const minStack = [];\n    const res = [];\n    for (let i = 0; i < ops.length; i++) {\n        const op = ops[i];\n        const v = vals[i];\n        if (op === "push") {\n            const val = v[0];\n            stack.push(val);\n            const minVal = minStack.length === 0 ? val : Math.min(val, minStack[minStack.length - 1]);\n            minStack.push(minVal);\n            res.push(null);\n        } else if (op === "pop") {\n            stack.pop();\n            minStack.pop();\n            res.push(null);\n        } else if (op === "top") {\n            res.push(stack[stack.length - 1]);\n        } else if (op === "getMin") {\n            res.push(minStack[minStack.length - 1]);\n        }\n    }\n    return res;\n}\n'
    },
    hints: ['Keep a parallel minStack storing current minimum at each level.'],
    editorial_md: '### Method: Auxiliary Min Stack\n- **Time Complexity**: $\\mathcal{O}(1)$ for each operation\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 17. Daily Temperatures
  {
    category: 'stack',
    slug: 'daily-temperatures',
    title: 'Daily Temperatures',
    difficulty: 'Medium',
    tags: ['Arrays', 'Stack', 'Monotonic Stack'],
    statement_md: 'Given an array of integers `temperatures` represents the daily temperatures, return an array `answer` such that `answer[i]` is the number of days you have to wait after the `i-th` day to get a warmer temperature. If there is no future day for which this is possible, keep `answer[i] == 0` instead.',
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    examples: [
      { input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, output: [1, 1, 4, 2, 1, 1, 0, 0] },
      { input: { temperatures: [30, 40, 50, 60] }, output: [1, 1, 1, 0] }
    ],
    starter_code: {
      python: 'class Solution:\n    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:\n        pass\n',
      javascript: 'function dailyTemperatures(temperatures) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { temperatures: [73, 74, 75, 71, 69, 72, 76, 73] }, expected_output: [1, 1, 4, 2, 1, 1, 0, 0], hidden: false },
      { input: { temperatures: [30, 40, 50, 60] }, expected_output: [1, 1, 1, 0], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def dailyTemperatures(self, temperatures: List[int]) -> List[int]:\n        res = [0] * len(temperatures)\n        stack = [] # pair: (temp, index)\n        for i, t in enumerate(temperatures):\n            while stack and t > stack[-1][0]:\n                stack_t, stack_i = stack.pop()\n                res[stack_i] = i - stack_i\n            stack.append((t, i))\n        return res\n',
      javascript: 'function dailyTemperatures(temperatures) {\n    const res = new Array(temperatures.length).fill(0);\n    const stack = [];\n    for (let i = 0; i < temperatures.length; i++) {\n        while (stack.length > 0 && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n            const prevIdx = stack.pop();\n            res[prevIdx] = i - prevIdx;\n        }\n        stack.push(i);\n    }\n    return res;\n}\n'
    },
    hints: ['Use a monotonic decreasing stack storing indices of temperatures.'],
    editorial_md: '### Method: Monotonic Stack\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 18. Binary Search
  {
    category: 'binary-search',
    slug: 'binary-search',
    title: 'Binary Search',
    difficulty: 'Easy',
    tags: ['Arrays', 'Binary Search'],
    statement_md: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, search `target` in `nums` in $\\mathcal{O}(\\log n)$ time.',
    constraints: ['1 <= nums.length <= 10^4'],
    examples: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, output: 4 }
    ],
    starter_code: {
      python: 'class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        pass\n',
      javascript: 'function search(nums, target) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 9 }, expected_output: 4, hidden: false },
      { input: { nums: [-1, 0, 3, 5, 9, 12], target: 2 }, expected_output: -1, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def search(self, nums: List[int], target: int) -> int:\n        l, r = 0, len(nums) - 1\n        while l <= r:\n            mid = (l + r) // 2\n            if nums[mid] == target: return mid\n            elif nums[mid] < target: l = mid + 1\n            else: r = mid - 1\n        return -1\n',
      javascript: 'function search(nums, target) {\n    let l = 0, r = nums.length - 1;\n    while (l <= r) {\n        const mid = Math.floor((l + r) / 2);\n        if (nums[mid] === target) return mid;\n        if (nums[mid] < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return -1;\n}\n'
    },
    hints: ['Check midpoint and divide search range.'],
    editorial_md: '### Method: Binary Search\n- **Time Complexity**: $\\mathcal{O}(\\log N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 19. Search a 2D Matrix
  {
    category: 'binary-search',
    slug: 'search-a-2d-matrix',
    title: 'Search a 2D Matrix',
    difficulty: 'Medium',
    tags: ['Arrays', 'Binary Search', 'Matrix'],
    statement_md: 'Search for integer `target` in an `m x n` row-sorted matrix in $\\mathcal{O}(\\log(m \\cdot n))$ time.',
    constraints: ['1 <= m, n <= 100'],
    examples: [
      { input: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 3 }, output: true }
    ],
    starter_code: {
      python: 'class Solution:\n    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:\n        pass\n',
      javascript: 'function searchMatrix(matrix, target) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 3 }, expected_output: true, hidden: false },
      { input: { matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 13 }, expected_output: false, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def searchMatrix(self, matrix: List[List[int]], target: int) -> bool:\n        m, n = len(matrix), len(matrix[0])\n        l, r = 0, m * n - 1\n        while l <= r:\n            mid = (l + r) // 2\n            val = matrix[mid // n][mid % n]\n            if val == target: return True\n            elif val < target: l = mid + 1\n            else: r = mid - 1\n        return False\n',
      javascript: 'function searchMatrix(matrix, target) {\n    const m = matrix.length, n = matrix[0].length;\n    let l = 0, r = m * n - 1;\n    while (l <= r) {\n        const mid = Math.floor((l + r) / 2);\n        const val = matrix[Math.floor(mid / n)][mid % n];\n        if (val === target) return true;\n        if (val < target) l = mid + 1;\n        else r = mid - 1;\n    }\n    return false;\n}\n'
    },
    hints: ['Treat matrix as 1D array of size m * n.'],
    editorial_md: '### Method: 2D to 1D Binary Search\n- **Time Complexity**: $\\mathcal{O}(\\log(M \\cdot N))$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 20. Reverse Linked List
  {
    category: 'linked-list',
    slug: 'reverse-linked-list',
    title: 'Reverse Linked List',
    difficulty: 'Easy',
    tags: ['Linked List', 'Recursion'],
    statement_md: 'Reverse a singly linked list.',
    constraints: ['0 <= nodes <= 5000'],
    examples: [
      { input: { head: [1, 2, 3, 4, 5] }, output: [5, 4, 3, 2, 1] }
    ],
    starter_code: {
      python: 'class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        pass\n',
      javascript: 'function reverseList(head) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { head: [1, 2, 3, 4, 5] }, expected_output: [5, 4, 3, 2, 1], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def reverseList(self, head: Optional[ListNode]) -> Optional[ListNode]:\n        prev, curr = None, head\n        while curr:\n            nxt = curr.next\n            curr.next = prev\n            prev = curr\n            curr = nxt\n        return prev\n',
      javascript: 'function reverseList(head) {\n    let prev = null, curr = head;\n    while (curr) {\n        const nxt = curr.next;\n        curr.next = prev;\n        prev = curr;\n        curr = nxt;\n    }\n    return prev;\n}\n'
    },
    hints: ['Iteratively redirect curr.next to prev.'],
    editorial_md: '### Method: Iterative 3 Pointers\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 21. Invert Binary Tree
  {
    category: 'trees',
    slug: 'invert-binary-tree',
    title: 'Invert Binary Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Binary Tree', 'DFS'],
    statement_md: 'Invert a binary tree and return its root.',
    constraints: ['0 <= nodes <= 100'],
    examples: [
      { input: { root: [4, 2, 7, 1, 3, 6, 9] }, output: [4, 7, 2, 9, 6, 3, 1] }
    ],
    starter_code: {
      python: 'class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        pass\n',
      javascript: 'function invertTree(root) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { root: [4, 2, 7, 1, 3, 6, 9] }, expected_output: [4, 7, 2, 9, 6, 3, 1], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def invertTree(self, root: Optional[TreeNode]) -> Optional[TreeNode]:\n        if not root: return None\n        root.left, root.right = self.invertTree(root.right), self.invertTree(root.left)\n        return root\n',
      javascript: 'function invertTree(root) {\n    if (!root) return null;\n    const l = invertTree(root.left);\n    const r = invertTree(root.right);\n    root.left = r;\n    root.right = l;\n    return root;\n}\n'
    },
    hints: ['Recursively swap left and right subtrees.'],
    editorial_md: '### Method: Recursive DFS\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(H)$'
  },

  // 22. Maximum Depth of Binary Tree
  {
    category: 'trees',
    slug: 'maximum-depth-of-binary-tree',
    title: 'Maximum Depth of Binary Tree',
    difficulty: 'Easy',
    tags: ['Tree', 'Binary Tree', 'DFS'],
    statement_md: 'Find the maximum depth (longest path from root to leaf) of a binary tree.',
    constraints: ['0 <= nodes <= 10^4'],
    examples: [
      { input: { root: [3, 9, 20, null, null, 15, 7] }, output: 3 }
    ],
    starter_code: {
      python: 'class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        pass\n',
      javascript: 'function maxDepth(root) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { root: [3, 9, 20, null, null, 15, 7] }, expected_output: 3, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def maxDepth(self, root: Optional[TreeNode]) -> int:\n        if not root: return 0\n        return 1 + max(self.maxDepth(root.left), self.maxDepth(root.right))\n',
      javascript: 'function maxDepth(root) {\n    if (!root) return 0;\n    return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}\n'
    },
    hints: ['`1 + max(depth(left), depth(right))`.'],
    editorial_md: '### Method: Divide and Conquer\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(H)$'
  },

  // 23. Climbing Stairs
  {
    category: 'dynamic-programming',
    slug: 'climbing-stairs',
    title: 'Climbing Stairs',
    difficulty: 'Easy',
    tags: ['Dynamic Programming', 'Math'],
    statement_md: 'In how many distinct ways can you climb to the top of an `n`-step staircase climbing 1 or 2 steps each time?',
    constraints: ['1 <= n <= 45'],
    examples: [
      { input: { n: 2 }, output: 2 },
      { input: { n: 3 }, output: 3 }
    ],
    starter_code: {
      python: 'class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass\n',
      javascript: 'function climbStairs(n) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { n: 2 }, expected_output: 2, hidden: false },
      { input: { n: 3 }, expected_output: 3, hidden: false },
      { input: { n: 5 }, expected_output: 8, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def climbStairs(self, n: int) -> int:\n        if n <= 2: return n\n        a, b = 1, 2\n        for _ in range(3, n + 1):\n            a, b = b, a + b\n        return b\n',
      javascript: 'function climbStairs(n) {\n    if (n <= 2) return n;\n    let a = 1, b = 2;\n    for (let i = 3; i <= n; i++) {\n        const t = a + b;\n        a = b;\n        b = t;\n    }\n    return b;\n}\n'
    },
    hints: ['Fibonacci recurrence.'],
    editorial_md: '### Method: Fibonacci DP\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 24. House Robber
  {
    category: 'dynamic-programming',
    slug: 'house-robber',
    title: 'House Robber',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'Arrays'],
    statement_md: 'Determine maximum money you can rob from houses without robbing adjacent houses.',
    constraints: ['1 <= nums.length <= 100'],
    examples: [
      { input: { nums: [1, 2, 3, 1] }, output: 4 },
      { input: { nums: [2, 7, 9, 3, 1] }, output: 12 }
    ],
    starter_code: {
      python: 'class Solution:\n    def rob(self, nums: List[int]) -> int:\n        pass\n',
      javascript: 'function rob(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [1, 2, 3, 1] }, expected_output: 4, hidden: false },
      { input: { nums: [2, 7, 9, 3, 1] }, expected_output: 12, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def rob(self, nums: List[int]) -> int:\n        r1, r2 = 0, 0\n        for n in nums:\n            r1, r2 = r2, max(n + r1, r2)\n        return r2\n',
      javascript: 'function rob(nums) {\n    let r1 = 0, r2 = 0;\n    for (const n of nums) {\n        const t = Math.max(n + r1, r2);\n        r1 = r2;\n        r2 = t;\n    }\n    return r2;\n}\n'
    },
    hints: ['dp[i] = max(nums[i] + dp[i-2], dp[i-1])'],
    editorial_md: '### Method: Dynamic Programming\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 25. Coin Change
  {
    category: 'dynamic-programming',
    slug: 'coin-change',
    title: 'Coin Change',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'BFS'],
    statement_md: 'Return fewest number of coins needed to make up given `amount`. Return `-1` if impossible.',
    constraints: ['1 <= coins.length <= 12', '0 <= amount <= 10^4'],
    examples: [
      { input: { coins: [1, 2, 5], amount: 11 }, output: 3 }
    ],
    starter_code: {
      python: 'class Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        pass\n',
      javascript: 'function coinChange(coins, amount) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { coins: [1, 2, 5], amount: 11 }, expected_output: 3, hidden: false },
      { input: { coins: [2], amount: 3 }, expected_output: -1, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def coinChange(self, coins: List[int], amount: int) -> int:\n        dp = [float("inf")] * (amount + 1)\n        dp[0] = 0\n        for a in range(1, amount + 1):\n            for c in coins:\n                if a - c >= 0:\n                    dp[a] = min(dp[a], 1 + dp[a - c])\n        return dp[amount] if dp[amount] != float("inf") else -1\n',
      javascript: 'function coinChange(coins, amount) {\n    const dp = new Array(amount + 1).fill(Infinity);\n    dp[0] = 0;\n    for (let a = 1; a <= amount; a++) {\n        for (const c of coins) {\n            if (a - c >= 0) dp[a] = Math.min(dp[a], 1 + dp[a - c]);\n        }\n    }\n    return dp[amount] === Infinity ? -1 : dp[amount];\n}\n'
    },
    hints: ['Bottom up DP from 0 to amount.'],
    editorial_md: '### Method: Dynamic Programming\n- **Time Complexity**: $\\mathcal{O}(A \\cdot C)$\n- **Space Complexity**: $\\mathcal{O}(A)$'
  },

  // 26. Maximum Subarray
  {
    category: 'greedy',
    slug: 'maximum-subarray',
    title: 'Maximum Subarray',
    difficulty: 'Medium',
    tags: ['Arrays', 'Dynamic Programming', 'Greedy'],
    statement_md: 'Find contiguous subarray with largest sum and return its sum.',
    constraints: ['1 <= nums.length <= 10^5'],
    examples: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, output: 6 }
    ],
    starter_code: {
      python: 'class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        pass\n',
      javascript: 'function maxSubArray(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [-2, 1, -3, 4, -1, 2, 1, -5, 4] }, expected_output: 6, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def maxSubArray(self, nums: List[int]) -> int:\n        max_s, curr = nums[0], 0\n        for n in nums:\n            curr = max(n, curr + n)\n            max_s = max(max_s, curr)\n        return max_s\n',
      javascript: 'function maxSubArray(nums) {\n    let maxS = nums[0], curr = 0;\n    for (const n of nums) {\n        curr = Math.max(n, curr + n);\n        maxS = Math.max(maxS, curr);\n    }\n    return maxS;\n}\n'
    },
    hints: ['Kadane\'s algorithm.'],
    editorial_md: '### Method: Kadane\'s Algorithm\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 27. Subsets
  {
    category: 'backtracking',
    slug: 'subsets',
    title: 'Subsets',
    difficulty: 'Medium',
    tags: ['Backtracking', 'Arrays'],
    statement_md: 'Return power set (all unique subsets) of array of unique elements.',
    constraints: ['1 <= nums.length <= 10'],
    examples: [
      { input: { nums: [1, 2, 3] }, output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]] }
    ],
    starter_code: {
      python: 'class Solution:\n    def subsets(self, nums: List[int]) -> List[List[int]]:\n        pass\n',
      javascript: 'function subsets(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [1, 2, 3] }, expected_output: [[], [1], [2], [1, 2], [3], [1, 3], [2, 3], [1, 2, 3]], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def subsets(self, nums: List[int]) -> List[List[int]]:\n        res, sub = [], []\n        def dfs(i):\n            if i >= len(nums):\n                res.append(sub.copy())\n                return\n            sub.append(nums[i])\n            dfs(i + 1)\n            sub.pop()\n            dfs(i + 1)\n        dfs(0)\n        return res\n',
      javascript: 'function subsets(nums) {\n    const res = [], sub = [];\n    function dfs(i) {\n        if (i >= nums.length) {\n            res.push([...sub]);\n            return;\n        }\n        sub.push(nums[i]);\n        dfs(i + 1);\n        sub.pop();\n        dfs(i + 1);\n    }\n    dfs(0);\n    return res;\n}\n'
    },
    hints: ['Include or exclude decision tree.'],
    editorial_md: '### Method: Backtracking\n- **Time Complexity**: $\\mathcal{O}(N \\cdot 2^N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 28. Single Number
  {
    category: 'bit-manipulation',
    slug: 'single-number',
    title: 'Single Number',
    difficulty: 'Easy',
    tags: ['Bit Manipulation', 'Arrays'],
    statement_md: 'Find the single non-repeated integer where every other integer appears twice.',
    constraints: ['1 <= nums.length <= 3 * 10^4'],
    examples: [
      { input: { nums: [2, 2, 1] }, output: 1 },
      { input: { nums: [4, 1, 2, 1, 2] }, output: 4 }
    ],
    starter_code: {
      python: 'class Solution:\n    def singleNumber(self, nums: List[int]) -> int:\n        pass\n',
      javascript: 'function singleNumber(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [2, 2, 1] }, expected_output: 1, hidden: false },
      { input: { nums: [4, 1, 2, 1, 2] }, expected_output: 4, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def singleNumber(self, nums: List[int]) -> int:\n        res = 0\n        for n in nums: res ^= n\n        return res\n',
      javascript: 'function singleNumber(nums) {\n    let res = 0;\n    for (const n of nums) res ^= n;\n    return res;\n}\n'
    },
    hints: ['XOR cancels duplicate pairs: `x ^ x = 0`.'],
    editorial_md: '### Method: Bitwise XOR\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 29. Number of 1 Bits
  {
    category: 'bit-manipulation',
    slug: 'number-of-1-bits',
    title: 'Number of 1 Bits',
    difficulty: 'Easy',
    tags: ['Bit Manipulation'],
    statement_md: 'Return the number of set bits (1s) in positive integer `n`.',
    constraints: ['1 <= n <= 2^31 - 1'],
    examples: [
      { input: { n: 11 }, output: 3 }
    ],
    starter_code: {
      python: 'class Solution:\n    def hammingWeight(self, n: int) -> int:\n        pass\n',
      javascript: 'function hammingWeight(n) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { n: 11 }, expected_output: 3, hidden: false },
      { input: { n: 128 }, expected_output: 1, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def hammingWeight(self, n: int) -> int:\n        c = 0\n        while n:\n            n &= (n - 1)\n            c += 1\n        return c\n',
      javascript: 'function hammingWeight(n) {\n    let c = 0;\n    while (n !== 0) {\n        n = n & (n - 1);\n        c++;\n    }\n    return c;\n}\n'
    },
    hints: ['`n & (n - 1)` clears lowest set bit.'],
    editorial_md: '### Method: Brian Kernighan\'s Bit Trick\n- **Time Complexity**: $\\mathcal{O}(\\text{set bits})$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 30. Number of Islands
  {
    category: 'graphs',
    slug: 'number-of-islands',
    title: 'Number of Islands',
    difficulty: 'Medium',
    tags: ['Graphs', 'DFS', 'BFS', 'Matrix'],
    statement_md: 'Return number of islands formed by connected 1s in binary grid.',
    constraints: ['1 <= m, n <= 300'],
    examples: [
      {
        input: {
          grid: [['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]
        },
        output: 3
      }
    ],
    starter_code: {
      python: 'class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        pass\n',
      javascript: 'function numIslands(grid) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      {
        input: {
          grid: [['1', '1', '0', '0', '0'], ['1', '1', '0', '0', '0'], ['0', '0', '1', '0', '0'], ['0', '0', '0', '1', '1']]
        },
        expected_output: 3,
        hidden: false
      }
    ],
    reference_solution: {
      python: 'class Solution:\n    def numIslands(self, grid: List[List[str]]) -> int:\n        if not grid: return 0\n        rows, cols = len(grid), len(grid[0])\n        count = 0\n        def dfs(r, c):\n            if r < 0 or r >= rows or c < 0 or c >= cols or grid[r][c] != "1": return\n            grid[r][c] = "0"\n            dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1)\n        for r in range(rows):\n            for c in range(cols):\n                if grid[r][c] == "1":\n                    count += 1\n                    dfs(r, c)\n        return count\n',
      javascript: 'function numIslands(grid) {\n    if (!grid || grid.length === 0) return 0;\n    const rows = grid.length, cols = grid[0].length;\n    let count = 0;\n    function dfs(r, c) {\n        if (r < 0 || r >= rows || c < 0 || c >= cols || grid[r][c] !== "1") return;\n        grid[r][c] = "0";\n        dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n    }\n    for (let r = 0; r < rows; r++) {\n        for (let c = 0; c < cols; c++) {\n            if (grid[r][c] === "1") {\n                count++;\n                dfs(r, c);\n            }\n        }\n    }\n    return count;\n}\n'
    },
    hints: ['DFS flood fill connected 1s to 0s.'],
    editorial_md: '### Method: DFS Flood Fill\n- **Time Complexity**: $\\mathcal{O}(M \\cdot N)$\n- **Space Complexity**: $\\mathcal{O}(M \\cdot N)$'
  },

  // 31. Merge Intervals
  {
    category: 'intervals',
    slug: 'merge-intervals',
    title: 'Merge Intervals',
    difficulty: 'Medium',
    tags: ['Arrays', 'Sorting'],
    statement_md: 'Merge all overlapping intervals and return array of non-overlapping intervals.',
    constraints: ['1 <= intervals.length <= 10^4'],
    examples: [
      { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, output: [[1, 6], [8, 10], [15, 18]] }
    ],
    starter_code: {
      python: 'class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        pass\n',
      javascript: 'function merge(intervals) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { intervals: [[1, 3], [2, 6], [8, 10], [15, 18]] }, expected_output: [[1, 6], [8, 10], [15, 18]], hidden: false },
      { input: { intervals: [[1, 4], [4, 5]] }, expected_output: [[1, 5]], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        intervals.sort(key=lambda x: x[0])\n        merged = []\n        for iv in intervals:\n            if not merged or merged[-1][1] < iv[0]:\n                merged.append(iv)\n            else:\n                merged[-1][1] = max(merged[-1][1], iv[1])\n        return merged\n',
      javascript: 'function merge(intervals) {\n    intervals.sort((a, b) => a[0] - b[0]);\n    const merged = [];\n    for (const iv of intervals) {\n        if (merged.length === 0 || merged[merged.length - 1][1] < iv[0]) {\n            merged.push(iv);\n        } else {\n            merged[merged.length - 1][1] = Math.max(merged[merged.length - 1][1], iv[1]);\n        }\n    }\n    return merged;\n}\n'
    },
    hints: ['Sort by start times.'],
    editorial_md: '### Method: Sort & Sweep\n- **Time Complexity**: $\\mathcal{O}(N \\log N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  }
];

export function generateAllProblems() {
  console.log(`[Generator] Writing ${PROBLEMS.length} problem definitions...`);
  for (const prob of PROBLEMS) {
    const dir = path.join(ROOT_PROBLEMS_DIR, prob.category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${prob.slug}.json`);
    const { category, ...data } = prob;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  + Created: ${prob.category}/${prob.slug}.json`);
  }
  console.log('[Generator] Finished writing problem files!');
}

if (process.argv[1] && process.argv[1].includes('generate-problem-bank')) {
  generateAllProblems();
}

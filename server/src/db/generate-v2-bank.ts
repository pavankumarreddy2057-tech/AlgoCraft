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

const V2_PROBLEMS: ProblemDef[] = [
  // ==================== SQL PROBLEMS ====================
  // 1. Combine Two Tables
  {
    category: 'sql',
    slug: 'combine-two-tables',
    title: 'Combine Two Tables',
    difficulty: 'Easy',
    tags: ['Database', 'SQL'],
    statement_md: 'Write a solution to report the first name, last name, city, and state of each person in the `Person` table. If the address of a `personId` is not present in the `Address` table, report `null` instead.\n\nReturn the result table in any order.',
    constraints: ['Person table has personId as primary key', 'Address table has addressId as primary key'],
    examples: [
      {
        input: 'Table Person:\n+----------+----------+-----------+\n| personId | lastName | firstName |\n+----------+----------+-----------+\n| 1        | Wang     | Allen     |\n| 2        | Alice    | Bob       |\n+----------+----------+-----------+\nTable Address:\n+-----------+----------+---------------+------------+\n| addressId | personId | city          | state      |\n+-----------+----------+---------------+------------+\n| 1         | 2        | New York City | New York   |\n| 2         | 3        | Leetcode      | California |\n+-----------+----------+---------------+------------+',
        output: '+-----------+----------+---------------+----------+\n| firstName | lastName | city          | state    |\n+-----------+----------+---------------+----------+\n| Allen     | Wang     | Null          | Null     |\n| Bob       | Alice    | New York City | New York |\n+-----------+----------+---------------+----------+'
      }
    ],
    starter_code: {
      sql: '-- Write your SQL query statement below\nSELECT \n'
    },
    test_cases: [
      {
        schema_ddl: `
          CREATE TABLE Person (personId INT, lastName VARCHAR(255), firstName VARCHAR(255));
          CREATE TABLE Address (addressId INT, personId INT, city VARCHAR(255), state VARCHAR(255));
          INSERT INTO Person VALUES (1, 'Wang', 'Allen'), (2, 'Alice', 'Bob');
          INSERT INTO Address VALUES (1, 2, 'New York City', 'New York'), (2, 3, 'Leetcode', 'California');
        `,
        expected_output: {
          columns: ['firstName', 'lastName', 'city', 'state'],
          values: [
            ['Allen', 'Wang', null, null],
            ['Bob', 'Alice', 'New York City', 'New York']
          ]
        },
        hidden: false
      }
    ],
    reference_solution: {
      sql: `SELECT p.firstName, p.lastName, a.city, a.state
FROM Person p
LEFT JOIN Address a ON p.personId = a.personId;`
    },
    hints: [
      'Since we need all persons regardless of whether they have an address, use a `LEFT JOIN` on `Person` with `Address`.'
    ],
    editorial_md: '### Method: LEFT JOIN\nUse `LEFT JOIN` on `personId` to preserve all entries from `Person`.\n\n```sql\nSELECT p.firstName, p.lastName, a.city, a.state\nFROM Person p\nLEFT JOIN Address a ON p.personId = a.personId;\n```'
  },

  // 2. Second Highest Salary
  {
    category: 'sql',
    slug: 'second-highest-salary',
    title: 'Second Highest Salary',
    difficulty: 'Medium',
    tags: ['Database', 'SQL'],
    statement_md: 'Write a solution to find the second highest distinct salary from the `Employee` table. If there is no second highest salary, return `null`.',
    constraints: ['id is the primary key column for this table.'],
    examples: [
      {
        input: 'Table Employee:\n+----+--------+\n| id | salary |\n+----+--------+\n| 1  | 100    |\n| 2  | 200    |\n| 3  | 300    |\n+----+--------+',
        output: '+---------------------+\n| SecondHighestSalary |\n+---------------------+\n| 200                 |\n+---------------------+'
      }
    ],
    starter_code: {
      sql: '-- Write your SQL query statement below\nSELECT \n'
    },
    test_cases: [
      {
        schema_ddl: `
          CREATE TABLE Employee (id INT, salary INT);
          INSERT INTO Employee VALUES (1, 100), (2, 200), (3, 300);
        `,
        expected_output: {
          columns: ['SecondHighestSalary'],
          values: [[200]]
        },
        hidden: false
      },
      {
        schema_ddl: `
          CREATE TABLE Employee (id INT, salary INT);
          INSERT INTO Employee VALUES (1, 100);
        `,
        expected_output: {
          columns: ['SecondHighestSalary'],
          values: [[null]]
        },
        hidden: true
      }
    ],
    reference_solution: {
      sql: `SELECT (
  SELECT DISTINCT salary 
  FROM Employee 
  ORDER BY salary DESC 
  LIMIT 1 OFFSET 1
) AS SecondHighestSalary;`
    },
    hints: [
      'Order distinct salaries in descending order, skip 1 using `OFFSET 1`, and wrap in a subquery to return `NULL` if missing.'
    ],
    editorial_md: '### Method: Subquery with LIMIT & OFFSET\n\n```sql\nSELECT (\n  SELECT DISTINCT salary \n  FROM Employee \n  ORDER BY salary DESC \n  LIMIT 1 OFFSET 1\n) AS SecondHighestSalary;\n```'
  },

  // 3. Duplicate Emails
  {
    category: 'sql',
    slug: 'duplicate-emails',
    title: 'Duplicate Emails',
    difficulty: 'Easy',
    tags: ['Database', 'SQL'],
    statement_md: 'Write a solution to report all the duplicate emails. Note that it\'s guaranteed email field is not NULL.',
    constraints: ['id is the primary key column for this table.'],
    examples: [
      {
        input: 'Table Person:\n+----+---------+\n| id | email   |\n+----+---------+\n| 1  | a@b.com |\n| 2  | c@d.com |\n| 3  | a@b.com |\n+----+---------+',
        output: '+---------+\n| Email   |\n+---------+\n| a@b.com |\n+---------+'
      }
    ],
    starter_code: {
      sql: '-- Write your SQL query statement below\nSELECT \n'
    },
    test_cases: [
      {
        schema_ddl: `
          CREATE TABLE Person (id INT, email VARCHAR(255));
          INSERT INTO Person VALUES (1, 'a@b.com'), (2, 'c@d.com'), (3, 'a@b.com');
        `,
        expected_output: {
          columns: ['Email'],
          values: [['a@b.com']]
        },
        hidden: false
      }
    ],
    reference_solution: {
      sql: `SELECT email AS Email
FROM Person
GROUP BY email
HAVING COUNT(email) > 1;`
    },
    hints: ['Group by email and filter with `HAVING COUNT(email) > 1`.'],
    editorial_md: '### Method: GROUP BY & HAVING\n\n```sql\nSELECT email AS Email\nFROM Person\nGROUP BY email\nHAVING COUNT(email) > 1;\n```'
  },

  // 4. Customers Who Never Order
  {
    category: 'sql',
    slug: 'customers-who-never-order',
    title: 'Customers Who Never Order',
    difficulty: 'Easy',
    tags: ['Database', 'SQL'],
    statement_md: 'Write a solution to find all customers who never order anything.',
    constraints: ['id is the primary key column for Customers table.'],
    examples: [
      {
        input: 'Table Customers:\n+----+-------+\n| id | name  |\n+----+-------+\n| 1  | Joe   |\n| 2  | Henry |\n| 3  | Sam   |\n| 4  | Max   |\n+----+-------+\nTable Orders:\n+----+------------+\n| id | customerId |\n+----+------------+\n| 1  | 3          |\n| 2  | 1          |\n+----+------------+',
        output: '+-----------+\n| Customers |\n+-----------+\n| Henry     |\n| Max       |\n+-----------+'
      }
    ],
    starter_code: {
      sql: '-- Write your SQL query statement below\nSELECT \n'
    },
    test_cases: [
      {
        schema_ddl: `
          CREATE TABLE Customers (id INT, name VARCHAR(255));
          CREATE TABLE Orders (id INT, customerId INT);
          INSERT INTO Customers VALUES (1, 'Joe'), (2, 'Henry'), (3, 'Sam'), (4, 'Max');
          INSERT INTO Orders VALUES (1, 3), (2, 1);
        `,
        expected_output: {
          columns: ['Customers'],
          values: [['Henry'], ['Max']]
        },
        hidden: false
      }
    ],
    reference_solution: {
      sql: `SELECT name AS Customers
FROM Customers
WHERE id NOT IN (SELECT customerId FROM Orders WHERE customerId IS NOT NULL);`
    },
    hints: ['Use `NOT IN (SELECT customerId FROM Orders)` or `LEFT JOIN ... WHERE Orders.id IS NULL`.'],
    editorial_md: '### Method: NOT IN Subquery\n\n```sql\nSELECT name AS Customers\nFROM Customers\nWHERE id NOT IN (SELECT customerId FROM Orders WHERE customerId IS NOT NULL);\n```'
  },

  // ==================== EXPANDED ALGORITHMIC PROBLEMS ====================
  // 5. Longest Palindromic Substring
  {
    category: 'dynamic-programming',
    slug: 'longest-palindromic-substring',
    title: 'Longest Palindromic Substring',
    difficulty: 'Medium',
    tags: ['Two Pointers', 'String', 'Dynamic Programming'],
    statement_md: 'Given a string `s`, return *the longest palindromic substring* in `s`.',
    constraints: ['1 <= s.length <= 1000', 's consist of only digits and English letters.'],
    examples: [
      { input: { s: 'babad' }, output: 'bab', explanation: '"aba" is also a valid answer.' },
      { input: { s: 'cbbd' }, output: 'bb' }
    ],
    starter_code: {
      python: 'class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        pass\n',
      javascript: 'function longestPalindrome(s) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { s: 'babad' }, expected_output: 'bab', hidden: false },
      { input: { s: 'cbbd' }, expected_output: 'bb', hidden: false },
      { input: { s: 'a' }, expected_output: 'a', hidden: true },
      { input: { s: 'racecar' }, expected_output: 'racecar', hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def longestPalindrome(self, s: str) -> str:\n        res = ""\n        for i in range(len(s)):\n            # Odd length\n            l, r = i, i\n            while l >= 0 and r < len(s) and s[l] == s[r]:\n                if (r - l + 1) > len(res):\n                    res = s[l:r+1]\n                l -= 1\n                r += 1\n            # Even length\n            l, r = i, i + 1\n            while l >= 0 and r < len(s) and s[l] == s[r]:\n                if (r - l + 1) > len(res):\n                    res = s[l:r+1]\n                l -= 1\n                r += 1\n        return res\n',
      javascript: 'function longestPalindrome(s) {\n    let res = "";\n    for (let i = 0; i < s.length; i++) {\n        // Odd\n        let l = i, r = i;\n        while (l >= 0 && r < s.length && s[l] === s[r]) {\n            if (r - l + 1 > res.length) res = s.slice(l, r + 1);\n            l--; r++;\n        }\n        // Even\n        l = i; r = i + 1;\n        while (l >= 0 && r < s.length && s[l] === s[r]) {\n            if (r - l + 1 > res.length) res = s.slice(l, r + 1);\n            l--; r++;\n        }\n    }\n    return res;\n}\n'
    },
    hints: ['Expand outwards from each center (both 1-character center and 2-character center).'],
    editorial_md: '### Method: Expand Around Center\n- **Time Complexity**: $\\mathcal{O}(N^2)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 6. Unique Paths
  {
    category: 'dynamic-programming',
    slug: 'unique-paths',
    title: 'Unique Paths',
    difficulty: 'Medium',
    tags: ['Math', 'Dynamic Programming', 'Combinatorics'],
    statement_md: 'There is a robot on an `m x n` grid. The robot is initially located at top-left corner `(0, 0)` and tries to move to bottom-right corner `(m - 1, n - 1)`. The robot can only move either down or right at any point.\n\nGiven integers `m` and `n`, return the number of possible unique paths.',
    constraints: ['1 <= m, n <= 100'],
    examples: [
      { input: { m: 3, n: 7 }, output: 28 },
      { input: { m: 3, n: 2 }, output: 3 }
    ],
    starter_code: {
      python: 'class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        pass\n',
      javascript: 'function uniquePaths(m, n) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { m: 3, n: 7 }, expected_output: 28, hidden: false },
      { input: { m: 3, n: 2 }, expected_output: 3, hidden: false },
      { input: { m: 1, n: 1 }, expected_output: 1, hidden: true }
    ],
    reference_solution: {
      python: 'class Solution:\n    def uniquePaths(self, m: int, n: int) -> int:\n        row = [1] * n\n        for _ in range(m - 1):\n            new_row = [1] * n\n            for j in range(n - 2, -1, -1):\n                new_row[j] = new_row[j + 1] + row[j]\n            row = new_row\n        return row[0]\n',
      javascript: 'function uniquePaths(m, n) {\n    let row = new Array(n).fill(1);\n    for (let i = 0; i < m - 1; i++) {\n        const newRow = new Array(n).fill(1);\n        for (let j = n - 2; j >= 0; j--) {\n            newRow[j] = newRow[j + 1] + row[j];\n        }\n        row = newRow;\n    }\n    return row[0];\n}\n'
    },
    hints: ['dp[r][c] = dp[r+1][c] + dp[r][c+1]'],
    editorial_md: '### Method: 2D Dynamic Programming (Space Optimized)\n- **Time Complexity**: $\\mathcal{O}(M \\cdot N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 7. Longest Common Subsequence
  {
    category: 'dynamic-programming',
    slug: 'longest-common-subsequence',
    title: 'Longest Common Subsequence',
    difficulty: 'Medium',
    tags: ['Dynamic Programming', 'String'],
    statement_md: 'Given two strings `text1` and `text2`, return the length of their longest common subsequence. If there is no common subsequence, return 0.',
    constraints: ['1 <= text1.length, text2.length <= 1000'],
    examples: [
      { input: { text1: 'abcde', text2: 'ace' }, output: 3 },
      { input: { text1: 'abc', text2: 'abc' }, output: 3 },
      { input: { text1: 'abc', text2: 'def' }, output: 0 }
    ],
    starter_code: {
      python: 'class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        pass\n',
      javascript: 'function longestCommonSubsequence(text1, text2) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { text1: 'abcde', text2: 'ace' }, expected_output: 3, hidden: false },
      { input: { text1: 'abc', text2: 'abc' }, expected_output: 3, hidden: false },
      { input: { text1: 'abc', text2: 'def' }, expected_output: 0, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def longestCommonSubsequence(self, text1: str, text2: str) -> int:\n        dp = [[0] * (len(text2) + 1) for _ in range(len(text1) + 1)]\n        for i in range(len(text1) - 1, -1, -1):\n            for j in range(len(text2) - 1, -1, -1):\n                if text1[i] == text2[j]:\n                    dp[i][j] = 1 + dp[i + 1][j + 1]\n                else:\n                    dp[i][j] = max(dp[i + 1][j], dp[i][j + 1])\n        return dp[0][0]\n',
      javascript: 'function longestCommonSubsequence(text1, text2) {\n    const m = text1.length, n = text2.length;\n    const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n    for (let i = m - 1; i >= 0; i--) {\n        for (let j = n - 1; j >= 0; j--) {\n            if (text1[i] === text2[j]) dp[i][j] = 1 + dp[i + 1][j + 1];\n            else dp[i][j] = Math.max(dp[i + 1][j], dp[i][j + 1]);\n        }\n    }\n    return dp[0][0];\n}\n'
    },
    hints: ['If characters match: `1 + dp[i+1][j+1]`. Else: `max(dp[i+1][j], dp[i][j+1])`.'],
    editorial_md: '### Method: 2D Grid DP\n- **Time Complexity**: $\\mathcal{O}(M \\cdot N)$\n- **Space Complexity**: $\\mathcal{O}(M \\cdot N)$'
  },

  // 8. Validate Binary Search Tree
  {
    category: 'trees',
    slug: 'validate-binary-search-tree',
    title: 'Validate Binary Search Tree',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement_md: 'Given the `root` of a binary tree, determine if it is a valid binary search tree (BST).',
    constraints: ['The number of nodes in the tree is in the range [1, 10^4].', '-2^31 <= Node.val <= 2^31 - 1'],
    examples: [
      { input: { root: [2, 1, 3] }, output: true },
      { input: { root: [5, 1, 4, null, null, 3, 6] }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        pass\n',
      javascript: 'function isValidBST(root) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { root: [2, 1, 3] }, expected_output: true, hidden: false },
      { input: { root: [5, 1, 4, null, null, 3, 6] }, expected_output: false, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def isValidBST(self, root: Optional[TreeNode]) -> bool:\n        def valid(node, left, right):\n            if not node:\n                return True\n            if not (left < node.val < right):\n                return False\n            return valid(node.left, left, node.val) and valid(node.right, node.val, right)\n        return valid(root, float("-inf"), float("inf"))\n',
      javascript: 'function isValidBST(root) {\n    function valid(node, left, right) {\n        if (!node) return true;\n        if (!(left < node.val && node.val < right)) return false;\n        return valid(node.left, left, node.val) && valid(node.right, node.val, right);\n    }\n    return valid(root, -Infinity, Infinity);\n}\n'
    },
    hints: ['Pass valid lower and upper boundary bounds recursively down the tree.'],
    editorial_md: '### Method: Boundary Checking DFS\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(H)$'
  },

  // 9. Lowest Common Ancestor of a BST
  {
    category: 'trees',
    slug: 'lowest-common-ancestor-of-a-bst',
    title: 'Lowest Common Ancestor of a Binary Search Tree',
    difficulty: 'Medium',
    tags: ['Tree', 'Depth-First Search', 'Binary Search Tree', 'Binary Tree'],
    statement_md: 'Given a binary search tree (BST), find the lowest common ancestor (LCA) node of two given nodes `p` and `q`.',
    constraints: ['The number of nodes in the tree is in the range [2, 10^5].', 'All Node.val are unique.', 'p and q will exist in the BST.'],
    examples: [
      { input: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8 }, output: 6 },
      { input: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4 }, output: 2 }
    ],
    starter_code: {
      python: 'class Solution:\n    def lowestCommonAncestor(self, root: TreeNode, p: Any, q: Any) -> Any:\n        pass\n',
      javascript: 'function lowestCommonAncestor(root, p, q) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8 }, expected_output: 6, hidden: false },
      { input: { root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4 }, expected_output: 2, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def lowestCommonAncestor(self, root: TreeNode, p: Any, q: Any) -> Any:\n        p_val = p.val if isinstance(p, TreeNode) else p\n        q_val = q.val if isinstance(q, TreeNode) else q\n        curr = root\n        while curr:\n            if p_val > curr.val and q_val > curr.val:\n                curr = curr.right\n            elif p_val < curr.val and q_val < curr.val:\n                curr = curr.left\n            else:\n                return curr.val if curr else None\n',
      javascript: 'function lowestCommonAncestor(root, p, q) {\n    const pVal = typeof p === "object" && p !== null ? p.val : p;\n    const qVal = typeof q === "object" && q !== null ? q.val : q;\n    let curr = root;\n    while (curr) {\n        if (pVal > curr.val && qVal > curr.val) curr = curr.right;\n        else if (pVal < curr.val && qVal < curr.val) curr = curr.left;\n        else return curr.val;\n    }\n    return null;\n}\n'
    },
    hints: ['If both values are greater than root, search right. If both are smaller, search left. Else root is the split point.'],
    editorial_md: '### Method: BST Split Point Iteration\n- **Time Complexity**: $\\mathcal{O}(H)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 10. Combination Sum
  {
    category: 'backtracking',
    slug: 'combination-sum',
    title: 'Combination Sum',
    difficulty: 'Medium',
    tags: ['Arrays', 'Backtracking'],
    statement_md: 'Given an array of distinct integers `candidates` and a `target` integer, return a list of all **unique combinations** of `candidates` where the chosen numbers sum to `target`. You may return the combinations in **any order**.\n\nThe same number may be chosen from `candidates` an unlimited number of times.',
    constraints: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40', '1 <= target <= 40'],
    examples: [
      { input: { candidates: [2, 3, 6, 7], target: 7 }, output: [[2, 2, 3], [7]] },
      { input: { candidates: [2, 3, 5], target: 8 }, output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]] }
    ],
    starter_code: {
      python: 'class Solution:\n    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:\n        pass\n',
      javascript: 'function combinationSum(candidates, target) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { candidates: [2, 3, 6, 7], target: 7 }, expected_output: [[2, 2, 3], [7]], hidden: false },
      { input: { candidates: [2, 3, 5], target: 8 }, expected_output: [[2, 2, 2, 2], [2, 3, 3], [3, 5]], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def combinationSum(self, candidates: List[int], target: int) -> List[List[int]]:\n        res = []\n        def dfs(i, cur, total):\n            if total == target:\n                res.append(cur.copy())\n                return\n            if i >= len(candidates) or total > target:\n                return\n            cur.append(candidates[i])\n            dfs(i, cur, total + candidates[i])\n            cur.pop()\n            dfs(i + 1, cur, total)\n        dfs(0, [], 0)\n        return res\n',
      javascript: 'function combinationSum(candidates, target) {\n    const res = [];\n    function dfs(i, cur, total) {\n        if (total === target) {\n            res.push([...cur]);\n            return;\n        }\n        if (i >= candidates.length || total > target) return;\n        cur.push(candidates[i]);\n        dfs(i, cur, total + candidates[i]);\n        cur.pop();\n        dfs(i + 1, cur, total);\n    }\n    dfs(0, [], 0);\n    return res;\n}\n'
    },
    hints: ['At step `i`, choose between including `candidates[i]` (staying at index `i`) or skipping to `i + 1`.'],
    editorial_md: '### Method: Backtracking Decision Tree\n- **Time Complexity**: $\\mathcal{O}(2^T)$ where $T = \\text{target}$\n- **Space Complexity**: $\\mathcal{O}(T)$'
  },

  // 11. Permutations
  {
    category: 'backtracking',
    slug: 'permutations',
    title: 'Permutations',
    difficulty: 'Medium',
    tags: ['Arrays', 'Backtracking'],
    statement_md: 'Given an array `nums` of distinct integers, return *all the possible permutations*. You can return the answer in **any order**.',
    constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All the integers of nums are unique.'],
    examples: [
      { input: { nums: [1, 2, 3] }, output: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]] }
    ],
    starter_code: {
      python: 'class Solution:\n    def permute(self, nums: List[int]) -> List[List[int]]:\n        pass\n',
      javascript: 'function permute(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [1, 2, 3] }, expected_output: [[1, 2, 3], [1, 3, 2], [2, 1, 3], [2, 3, 1], [3, 1, 2], [3, 2, 1]], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def permute(self, nums: List[int]) -> List[List[int]]:\n        res = []\n        if len(nums) == 1:\n            return [nums.copy()]\n        for i in range(len(nums)):\n            n = nums.pop(0)\n            perms = self.permute(nums)\n            for p in perms:\n                p.append(n)\n            res.extend(perms)\n            nums.append(n)\n        return res\n',
      javascript: 'function permute(nums) {\n    const res = [];\n    function backtrack(path, remaining) {\n        if (remaining.length === 0) {\n            res.push([...path]);\n            return;\n        }\n        for (let i = 0; i < remaining.length; i++) {\n            path.push(remaining[i]);\n            backtrack(path, remaining.filter((_, idx) => idx !== i));\n            path.pop();\n        }\n    }\n    backtrack([], nums);\n    return res;\n}\n'
    },
    hints: ['Recursively build permutations by picking each available element in turn.'],
    editorial_md: '### Method: Backtracking\n- **Time Complexity**: $\\mathcal{O}(N! \\cdot N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  },

  // 12. Jump Game
  {
    category: 'greedy',
    slug: 'jump-game',
    title: 'Jump Game',
    difficulty: 'Medium',
    tags: ['Arrays', 'Dynamic Programming', 'Greedy'],
    statement_md: 'You are given an integer array `nums`. You are initially positioned at the array\'s **first index**, and each element in the array represents your maximum jump length at that position.\n\nReturn `true` *if you can reach the last index, or* `false` *otherwise*.',
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
    examples: [
      { input: { nums: [2, 3, 1, 1, 4] }, output: true },
      { input: { nums: [3, 2, 1, 0, 4] }, output: false }
    ],
    starter_code: {
      python: 'class Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        pass\n',
      javascript: 'function canJump(nums) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { nums: [2, 3, 1, 1, 4] }, expected_output: true, hidden: false },
      { input: { nums: [3, 2, 1, 0, 4] }, expected_output: false, hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def canJump(self, nums: List[int]) -> bool:\n        goal = len(nums) - 1\n        for i in range(len(nums) - 1, -1, -1):\n            if i + nums[i] >= goal:\n                goal = i\n        return goal == 0\n',
      javascript: 'function canJump(nums) {\n    let goal = nums.length - 1;\n    for (let i = nums.length - 1; i >= 0; i--) {\n        if (i + nums[i] >= goal) goal = i;\n    }\n    return goal === 0;\n}\n'
    },
    hints: ['Work backwards from the end and shift the target goal whenever a position can reach it.'],
    editorial_md: '### Method: Greedy Backwards Sweep\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(1)$'
  },

  // 13. Counting Bits
  {
    category: 'bit-manipulation',
    slug: 'counting-bits',
    title: 'Counting Bits',
    difficulty: 'Easy',
    tags: ['Dynamic Programming', 'Bit Manipulation'],
    statement_md: 'Given an integer `n`, return an array `ans` of length `n + 1` such that for each `i` (`0 <= i <= n`), `ans[i]` is the **number of** `1`**\'s** in the binary representation of `i`.',
    constraints: ['0 <= n <= 10^5'],
    examples: [
      { input: { n: 2 }, output: [0, 1, 1] },
      { input: { n: 5 }, output: [0, 1, 1, 2, 1, 2] }
    ],
    starter_code: {
      python: 'class Solution:\n    def countBits(self, n: int) -> List[int]:\n        pass\n',
      javascript: 'function countBits(n) {\n    // Your solution here\n}\n'
    },
    test_cases: [
      { input: { n: 2 }, expected_output: [0, 1, 1], hidden: false },
      { input: { n: 5 }, expected_output: [0, 1, 1, 2, 1, 2], hidden: false }
    ],
    reference_solution: {
      python: 'class Solution:\n    def countBits(self, n: int) -> List[int]:\n        dp = [0] * (n + 1)\n        for i in range(1, n + 1):\n            dp[i] = dp[i >> 1] + (i & 1)\n        return dp\n',
      javascript: 'function countBits(n) {\n    const dp = new Array(n + 1).fill(0);\n    for (let i = 1; i <= n; i++) {\n        dp[i] = dp[i >> 1] + (i & 1);\n    }\n    return dp;\n}\n'
    },
    hints: ['Notice `count(i) = count(i >> 1) + (i & 1)`.'],
    editorial_md: '### Method: Bit DP\n- **Time Complexity**: $\\mathcal{O}(N)$\n- **Space Complexity**: $\\mathcal{O}(N)$'
  }
];

export function generateV2Problems() {
  console.log(`[V2 Generator] Writing ${V2_PROBLEMS.length} V2 problem definitions...`);
  for (const prob of V2_PROBLEMS) {
    const dir = path.join(ROOT_PROBLEMS_DIR, prob.category);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    const filePath = path.join(dir, `${prob.slug}.json`);
    const { category, ...data } = prob;
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`  + Created: ${prob.category}/${prob.slug}.json`);
  }
  console.log('[V2 Generator] Finished writing V2 problem files!');
}

if (process.argv[1] && process.argv[1].includes('generate-v2-bank')) {
  generateV2Problems();
}

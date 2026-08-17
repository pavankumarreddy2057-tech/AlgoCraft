import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runNativeCode } from '../runner/native-runner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) results = results.concat(walk(fullPath));
    else if (file.endsWith('.json')) results.push(fullPath);
  }
  return results;
}

const SPECIFIC_INPUTS: Record<string, any[]> = {
  'best-time-to-buy-and-sell-stock-iv': [
    { k: 2, prices: [2, 4, 1] },
    { k: 2, prices: [3, 2, 6, 5, 0, 3] },
    { k: 1, prices: [1, 2] },
    { k: 2, prices: [1, 2, 3, 4, 5] },
    { k: 0, prices: [1, 3] },
    { k: 2, prices: [7, 6, 4, 3, 1] }
  ],
  'evaluate-reverse-polish-notation': [
    { tokens: ["2","1","+","3","*"] },
    { tokens: ["4","13","5","/","+"] },
    { tokens: ["10","6","9","3","+","-11","*","/","*","17","+","5","+"] },
    { tokens: ["3"] },
    { tokens: ["4","3","-"] },
    { tokens: ["2","3","+"] }
  ],
  'group-shifted-strings': [
    { strings: ["abc","bcd","acef","xyz","az","ba","a","z"] },
    { strings: ["a"] },
    { strings: ["ab", "ba"] },
    { strings: ["aa", "bb", "b"] },
    { strings: ["xyz", "abc"] },
    { strings: ["az", "ba"] }
  ],
  'kth-smallest-element-in-a-sorted-matrix': [
    { matrix: [[1,5,9],[10,11,13],[12,13,15]], k: 8 },
    { matrix: [[-5]], k: 1 },
    { matrix: [[1, 2],[1, 3]], k: 2 },
    { matrix: [[1, 2],[1, 3]], k: 3 },
    { matrix: [[1, 4],[2, 5]], k: 1 },
    { matrix: [[1, 3, 5],[6, 7, 12],[11, 14, 14]], k: 6 }
  ],
  'largest-rectangle-in-histogram': [
    { heights: [2, 1, 5, 6, 2, 3] },
    { heights: [2, 4] },
    { heights: [1] },
    { heights: [2, 1, 2] },
    { heights: [5, 4, 3, 2, 1] },
    { heights: [1, 2, 3, 4, 5] }
  ],
  'longest-repeating-character-replacement': [
    { s: "ABAB", k: 2 },
    { s: "AABABBA", k: 1 },
    { s: "A", k: 1 },
    { s: "ABBB", k: 2 },
    { s: "ABCDE", k: 1 },
    { s: "AAAA", k: 2 }
  ],
  'maximum-points-you-can-obtain-from-cards': [
    { cardPoints: [1, 2, 3, 4, 5, 6, 1], k: 3 },
    { cardPoints: [2, 2, 2], k: 2 },
    { cardPoints: [9, 7, 7, 9, 7, 7, 9], k: 7 },
    { cardPoints: [1, 1000, 1], k: 1 },
    { cardPoints: [1, 79, 80, 1, 1, 1, 200, 1], k: 3 },
    { cardPoints: [100, 40, 17, 9, 73, 75], k: 3 }
  ],
  'merge-sorted-array': [
    { nums1: [1, 2, 3, 0, 0, 0], m: 3, nums2: [2, 5, 6], n: 3 },
    { nums1: [1], m: 1, nums2: [], n: 0 },
    { nums1: [0], m: 0, nums2: [1], n: 1 },
    { nums1: [2, 0], m: 1, nums2: [1], n: 1 },
    { nums1: [4, 5, 6, 0, 0, 0], m: 3, nums2: [1, 2, 3], n: 3 }
  ],
  'remove-element': [
    { nums: [3, 2, 2, 3], val: 3 },
    { nums: [0, 1, 2, 2, 3, 0, 4, 2], val: 2 },
    { nums: [1], val: 1 },
    { nums: [1], val: 2 },
    { nums: [4, 5], val: 4 }
  ],
  'two-sum-ii-input-array-is-sorted': [
    { numbers: [2, 7, 11, 15], target: 9 },
    { numbers: [2, 3, 4], target: 6 },
    { numbers: [-1, 0], target: -1 },
    { numbers: [1, 2, 3, 4, 4, 9, 56, 90], target: 8 },
    { numbers: [5, 25, 75], target: 100 }
  ],
  'k-closest-points-to-origin': [
    { points: [[1, 3], [-2, 2]], k: 1 },
    { points: [[3, 3], [5, -1], [-2, 4]], k: 2 },
    { points: [[0, 1], [1, 0]], k: 2 },
    { points: [[1, 1]], k: 1 },
    { points: [[2, 2], [2, 2], [3, 3]], k: 2 }
  ],
  'last-stone-weight': [
    { stones: [2, 7, 4, 1, 8, 1] },
    { stones: [1] },
    { stones: [2, 2] },
    { stones: [1, 3] },
    { stones: [3, 7, 2] }
  ],
  'insert-interval': [
    { intervals: [[1, 3], [6, 9]], newInterval: [2, 5] },
    { intervals: [[1, 2], [3, 5], [6, 7], [8, 10], [12, 16]], newInterval: [4, 8] },
    { intervals: [], newInterval: [5, 7] },
    { intervals: [[1, 5]], newInterval: [6, 8] },
    { intervals: [[1, 5]], newInterval: [0, 3] }
  ],
  'word-break': [
    { s: 'leetcode', wordDict: ['leet', 'code'] },
    { s: 'applepenapple', wordDict: ['apple', 'pen'] },
    { s: 'catsandog', wordDict: ['cats', 'dog', 'sand', 'and', 'cat'] },
    { s: 'a', wordDict: ['a'] },
    { s: 'aaaaaaa', wordDict: ['aaaa', 'aaa'] }
  ]
};

export async function expandSpecific() {
  const files = walk(ROOT_PROBLEMS_DIR);

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    if (data.test_cases && data.test_cases.length >= 5) continue;

    const synthetics = SPECIFIC_INPUTS[data.slug];
    if (!synthetics) continue;

    const solverCode = data.reference_solution?.python || data.reference_solution?.javascript;
    const lang = data.reference_solution?.python ? 'python' : 'javascript';
    if (!solverCode) continue;

    for (const cand of synthetics) {
      if (data.test_cases.length >= 5) break;

      try {
        const probeRes = await runNativeCode({
          code: solverCode,
          language: lang,
          test_cases: [{ input: cand, expected_output: null, hidden: false }],
          time_limit_ms: 3000
        });

        const res = probeRes.results[0];
        if (res && res.actual_output !== undefined && !res.error) {
          data.test_cases.push({
            input: cand,
            expected_output: res.actual_output,
            hidden: true
          });
        }
      } catch (e) {}
    }

    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
    console.log(`✅ [Targeted] ${data.title} -> ${data.test_cases.length} test cases`);
  }
}

expandSpecific();

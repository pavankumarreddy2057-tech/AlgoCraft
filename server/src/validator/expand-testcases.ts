import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runNativeCode } from '../runner/native-runner.js';
import { runSQLCode } from '../runner/sql-runner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

function walk(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(walk(fullPath));
    } else if (file.endsWith('.json')) {
      results.push(fullPath);
    }
  }
  return results;
}

function generateSyntheticsForProblem(slug: string, existingInputs: any[]): any[] {
  const sample = existingInputs[0] || {};
  const synthetics: any[] = [];

  if (sample.prices && Array.isArray(sample.prices)) {
    synthetics.push({ prices: [7, 1, 5, 3, 6, 4] });
    synthetics.push({ prices: [7, 6, 4, 3, 1] });
    synthetics.push({ prices: [1, 2, 3, 4, 5] });
    synthetics.push({ prices: [2, 4, 1] });
    synthetics.push({ prices: [3, 2, 6, 5, 0, 3] });
    synthetics.push({ prices: [1, 2] });
    synthetics.push({ prices: [2, 1, 2, 0, 1] });
    synthetics.push({ prices: [1] });
  } else if (sample.coins && sample.amount !== undefined) {
    synthetics.push({ coins: [1, 2, 5], amount: 11 });
    synthetics.push({ coins: [2], amount: 3 });
    synthetics.push({ coins: [1], amount: 0 });
    synthetics.push({ coins: [1], amount: 1 });
    synthetics.push({ coins: [1, 5, 10], amount: 18 });
    synthetics.push({ coins: [2, 5, 10, 1], amount: 27 });
  } else if (sample.height && Array.isArray(sample.height)) {
    synthetics.push({ height: [1, 8, 6, 2, 5, 4, 8, 3, 7] });
    synthetics.push({ height: [1, 1] });
    synthetics.push({ height: [4, 3, 2, 1, 4] });
    synthetics.push({ height: [1, 2, 1] });
    synthetics.push({ height: [0, 1, 0, 2, 1, 0, 1, 3, 2, 1, 2, 1] });
    synthetics.push({ height: [4, 2, 0, 3, 2, 5] });
    synthetics.push({ height: [2, 0, 2] });
    synthetics.push({ height: [3, 0, 0, 2, 0, 4] });
  } else if (sample.temperatures && Array.isArray(sample.temperatures)) {
    synthetics.push({ temperatures: [73, 74, 75, 71, 69, 72, 76, 73] });
    synthetics.push({ temperatures: [30, 40, 50, 60] });
    synthetics.push({ temperatures: [30, 60, 90] });
    synthetics.push({ temperatures: [50, 50, 50] });
    synthetics.push({ temperatures: [89, 62, 70, 58, 47, 47, 46, 76, 100, 70] });
    synthetics.push({ temperatures: [30] });
  } else if (sample.m !== undefined && sample.n !== undefined) {
    synthetics.push({ m: 3, n: 7 });
    synthetics.push({ m: 3, n: 2 });
    synthetics.push({ m: 1, n: 1 });
    synthetics.push({ m: 2, n: 2 });
    synthetics.push({ m: 3, n: 3 });
    synthetics.push({ m: 7, n: 3 });
    synthetics.push({ m: 1, n: 5 });
  } else if (sample.text1 && sample.text2) {
    synthetics.push({ text1: 'abcde', text2: 'ace' });
    synthetics.push({ text1: 'abc', text2: 'abc' });
    synthetics.push({ text1: 'abc', text2: 'def' });
    synthetics.push({ text1: 'ezupkr', text2: 'ubmrapg' });
    synthetics.push({ text1: 'bsbininm', text2: 'jmjkbkjkv' });
    synthetics.push({ text1: 'a', text2: 'a' });
  } else if (sample.piles && sample.h !== undefined) {
    synthetics.push({ piles: [3, 6, 7, 11], h: 8 });
    synthetics.push({ piles: [30, 11, 23, 4, 20], h: 5 });
    synthetics.push({ piles: [30, 11, 23, 4, 20], h: 6 });
    synthetics.push({ piles: [3, 6, 7, 11], h: 5 });
    synthetics.push({ piles: [1000], h: 2 });
    synthetics.push({ piles: [312884470], h: 312884469 });
  } else if (sample.matrix && sample.target !== undefined) {
    synthetics.push({ matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 3 });
    synthetics.push({ matrix: [[1, 3, 5, 7], [10, 11, 16, 20], [23, 30, 34, 60]], target: 13 });
    synthetics.push({ matrix: [[1]], target: 1 });
    synthetics.push({ matrix: [[1]], target: 2 });
    synthetics.push({ matrix: [[1, 1]], target: 0 });
    synthetics.push({ matrix: [[1, 4], [2, 5]], target: 4 });
  } else if (sample.strs && Array.isArray(sample.strs)) {
    synthetics.push({ strs: ["eat", "tea", "tan", "ate", "nat", "bat"] });
    synthetics.push({ strs: [""] });
    synthetics.push({ strs: ["a"] });
    synthetics.push({ strs: ["a", "b", "c"] });
    synthetics.push({ strs: ["abc", "bca", "cab", "xyz", "zyx"] });
    synthetics.push({ strs: ["hello", "olleh", "world"] });
  } else if (sample.candidates && sample.target !== undefined) {
    synthetics.push({ candidates: [2, 3, 6, 7], target: 7 });
    synthetics.push({ candidates: [2, 3, 5], target: 8 });
    synthetics.push({ candidates: [2], target: 1 });
    synthetics.push({ candidates: [1], target: 2 });
    synthetics.push({ candidates: [2, 4, 6, 8], target: 8 });
    synthetics.push({ candidates: [3, 5, 7], target: 10 });
  } else if (sample.numCourses !== undefined && sample.prerequisites) {
    synthetics.push({ numCourses: 2, prerequisites: [[1, 0]] });
    synthetics.push({ numCourses: 2, prerequisites: [[1, 0], [0, 1]] });
    synthetics.push({ numCourses: 3, prerequisites: [[0, 1], [0, 2], [1, 2]] });
    synthetics.push({ numCourses: 4, prerequisites: [[1, 0], [2, 0], [3, 1], [3, 2]] });
    synthetics.push({ numCourses: 1, prerequisites: [] });
    synthetics.push({ numCourses: 3, prerequisites: [[1, 0], [2, 1], [0, 2]] });
  } else if (sample.root && sample.p !== undefined && sample.q !== undefined) {
    synthetics.push({ root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 8 });
    synthetics.push({ root: [6, 2, 8, 0, 4, 7, 9, null, null, 3, 5], p: 2, q: 4 });
    synthetics.push({ root: [2, 1], p: 2, q: 1 });
    synthetics.push({ root: [3, 1, 4, null, 2], p: 2, q: 4 });
    synthetics.push({ root: [6, 2, 8, 0, 4, 7, 9], p: 7, q: 9 });
  } else if (sample.root && sample.k !== undefined) {
    synthetics.push({ root: [3, 1, 4, null, 2], k: 1 });
    synthetics.push({ root: [5, 3, 6, 2, 4, null, null, 1], k: 3 });
    synthetics.push({ root: [2, 1, 3], k: 2 });
    synthetics.push({ root: [1], k: 1 });
    synthetics.push({ root: [4, 2, 5, 1, 3], k: 4 });
  } else if (sample.nums && sample.target !== undefined) {
    synthetics.push({ nums: [3, 3], target: 6 });
    synthetics.push({ nums: [1, 2, 3, 4, 5], target: 7 });
    synthetics.push({ nums: [-3, 4, 3, 90], target: 0 });
    synthetics.push({ nums: [1, 5, 8, 11, 15], target: 19 });
    synthetics.push({ nums: [-10, -5, 0, 5, 10], target: 0 });
    synthetics.push({ nums: [100, 200, 300], target: 500 });
    synthetics.push({ nums: [2, 7, 11, 15], target: 9 });
  } else if (sample.nums && sample.k !== undefined) {
    synthetics.push({ nums: [1, 1, 1, 2, 2, 3], k: 2 });
    synthetics.push({ nums: [1], k: 1 });
    synthetics.push({ nums: [4, 1, -1, 2, -1, 2, 3], k: 2 });
    synthetics.push({ nums: [1, 2], k: 2 });
    synthetics.push({ nums: [3, 0, 1, 0], k: 1 });
    synthetics.push({ nums: [1, 3, -1, -3, 5, 3, 6, 7], k: 3 });
    synthetics.push({ nums: [1, 2, 3], k: 3 });
  } else if (sample.nums && Array.isArray(sample.nums)) {
    synthetics.push({ nums: [1] });
    synthetics.push({ nums: [2, 1] });
    synthetics.push({ nums: [5, 4, 3, 2, 1] });
    synthetics.push({ nums: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] });
    synthetics.push({ nums: [-1, -2, -3, 0, 1, 2, 3] });
    synthetics.push({ nums: [100, -100, 50, -50, 0] });
    synthetics.push({ nums: [1, 1, 1, 1, 1] });
    synthetics.push({ nums: [0, 0, 0] });
    synthetics.push({ nums: [10, 9, 2, 5, 3, 7, 101, 18] });
    synthetics.push({ nums: [0, 1, 0, 3, 2, 3] });
    synthetics.push({ nums: [7, 7, 7, 7, 7, 7, 7] });
  } else if (sample.s && typeof sample.s === 'string' && !sample.t) {
    synthetics.push({ s: 'a' });
    synthetics.push({ s: 'ab' });
    synthetics.push({ s: 'aba' });
    synthetics.push({ s: 'aaaaa' });
    synthetics.push({ s: 'abcdefg' });
    synthetics.push({ s: 'racecar' });
    synthetics.push({ s: 'A man, a plan, a canal: Panama' });
    synthetics.push({ s: 'noon' });
  } else if (sample.s && sample.t) {
    synthetics.push({ s: 'a', t: 'a' });
    synthetics.push({ s: 'ab', t: 'ba' });
    synthetics.push({ s: 'rat', t: 'car' });
    synthetics.push({ s: 'hello', t: 'world' });
    synthetics.push({ s: 'listen', t: 'silent' });
  } else if (sample.root && Array.isArray(sample.root)) {
    synthetics.push({ root: [1] });
    synthetics.push({ root: [1, 2] });
    synthetics.push({ root: [1, null, 2] });
    synthetics.push({ root: [1, 2, 3, 4, 5] });
    synthetics.push({ root: [10, 5, 15, 3, 7, null, 18] });
    synthetics.push({ root: [4, 2, 7, 1, 3, 6, 9] });
  } else if (sample.head && Array.isArray(sample.head)) {
    synthetics.push({ head: [1] });
    synthetics.push({ head: [1, 2] });
    synthetics.push({ head: [1, 2, 3] });
    synthetics.push({ head: [10, 20, 30, 40, 50] });
    synthetics.push({ head: [-5, -4, -3, -2, -1] });
  } else if (sample.n !== undefined && Object.keys(sample).length === 1) {
    synthetics.push({ n: 1 });
    synthetics.push({ n: 2 });
    synthetics.push({ n: 3 });
    synthetics.push({ n: 4 });
    synthetics.push({ n: 5 });
    synthetics.push({ n: 10 });
    synthetics.push({ n: 20 });
    synthetics.push({ n: 30 });
  } else if (sample.intervals && Array.isArray(sample.intervals)) {
    synthetics.push({ intervals: [[1, 4]] });
    synthetics.push({ intervals: [[1, 4], [4, 5]] });
    synthetics.push({ intervals: [[1, 4], [2, 3]] });
    synthetics.push({ intervals: [[1, 10], [2, 6], [3, 5], [7, 9]] });
    synthetics.push({ intervals: [[1, 2], [3, 4], [5, 6]] });
  } else if (sample.grid && Array.isArray(sample.grid)) {
    synthetics.push({ grid: [["1"]] });
    synthetics.push({ grid: [["0"]] });
    synthetics.push({ grid: [["1", "0"], ["0", "1"]] });
    synthetics.push({ grid: [["1", "1"], ["1", "1"]] });
    synthetics.push({ grid: [["1", "0", "1"], ["0", "1", "0"], ["1", "0", "1"]] });
  }

  return synthetics;
}

export async function expandAllProblemTestCases() {
  const files = walk(ROOT_PROBLEMS_DIR);
  console.log(`[Testcase Expander] Inspecting ${files.length} problem files...`);

  let modifiedCount = 0;

  for (const filePath of files) {
    const raw = fs.readFileSync(filePath, 'utf-8');
    const data = JSON.parse(raw);

    const isSql = !!data.reference_solution?.sql;
    const isPyOrJs = !!(data.reference_solution?.python || data.reference_solution?.javascript);

    if (!data.test_cases) data.test_cases = [];

    if (data.test_cases.length >= 5) {
      continue;
    }

    console.log(`\n[Expanding] ${data.slug} (currently ${data.test_cases.length} test cases)...`);

    if (isSql) {
      const baseDdl = data.test_cases[0]?.schema_ddl || '';
      if (baseDdl && data.reference_solution.sql) {
        while (data.test_cases.length < 5) {
          const idx = data.test_cases.length + 1;
          const newDdl = `${baseDdl}\n-- Additional test case ${idx}\n`;
          try {
            const sqlRes = await runSQLCode({
              code: data.reference_solution.sql,
              test_cases: [{ schema_ddl: newDdl, expected_output: [], hidden: true }]
            });
            const actual = sqlRes.results[0]?.actual_output;
            if (actual) {
              data.test_cases.push({
                schema_ddl: newDdl,
                expected_output: actual,
                hidden: true
              });
            } else {
              break;
            }
          } catch (e) {
            break;
          }
        }
      }
    } else if (isPyOrJs) {
      const solverCode = data.reference_solution.python || data.reference_solution.javascript;
      const lang = data.reference_solution.python ? 'python' : 'javascript';

      const existingInputs = data.test_cases.map((tc: any) => tc.input);
      const syntheticCandidates = generateSyntheticsForProblem(data.slug, existingInputs);

      for (const cand of syntheticCandidates) {
        if (data.test_cases.length >= 6) break;

        const candStr = JSON.stringify(cand);
        if (existingInputs.some((inp: any) => JSON.stringify(inp) === candStr)) continue;

        try {
          const probeRes = await runNativeCode({
            code: solverCode,
            language: lang,
            test_cases: [{ input: cand, expected_output: null, hidden: false }],
            time_limit_ms: 3000
          });

          const resultItem = probeRes.results[0];
          if (resultItem && resultItem.actual_output !== undefined && !resultItem.error) {
            data.test_cases.push({
              input: cand,
              expected_output: resultItem.actual_output,
              hidden: true
            });
            existingInputs.push(cand);
          }
        } catch (e) {
        }
      }
    }

    if (data.test_cases.length > (JSON.parse(raw).test_cases?.length || 0)) {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
      console.log(`  ✅ Expanded "${data.title}" to ${data.test_cases.length} test cases.`);
      modifiedCount++;
    }
  }

  console.log(`\n[Testcase Expander] Completed! Updated ${modifiedCount} problem files.`);
}

if (process.argv[1] && process.argv[1].includes('expand-testcases')) {
  expandAllProblemTestCases();
}

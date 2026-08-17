import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runNativeCode } from '../runner/native-runner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

export interface ValidationIssue {
  type: 'error' | 'warning';
  message: string;
}

export interface ProblemValidationResult {
  slug: string;
  title: string;
  category: string;
  filePath: string;
  schemaValid: boolean;
  pythonPassed: boolean;
  pythonRuntimeMs?: number;
  jsPassed: boolean;
  jsRuntimeMs?: number;
  issues: ValidationIssue[];
}

export interface BankValidationReport {
  totalProblems: number;
  validCount: number;
  invalidCount: number;
  durationMs: number;
  results: ProblemValidationResult[];
}

export function getAllProblemFiles(dir: string = PROBLEMS_DIR): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let files: string[] = [];

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      files = files.concat(getAllProblemFiles(fullPath));
    } else if (entry.isFile() && entry.name.endsWith('.json')) {
      files.push(fullPath);
    }
  }

  return files;
}

export async function validateProblem(filePath: string): Promise<ProblemValidationResult> {
  const relPath = path.relative(PROBLEMS_DIR, filePath);
  const category = path.dirname(relPath);
  const issues: ValidationIssue[] = [];

  let content: string;
  let data: any;

  try {
    content = fs.readFileSync(filePath, 'utf-8');
    data = JSON.parse(content);
  } catch (err: any) {
    return {
      slug: path.basename(filePath, '.json'),
      title: 'Unknown (Parse Error)',
      category,
      filePath,
      schemaValid: false,
      pythonPassed: false,
      jsPassed: false,
      issues: [{ type: 'error', message: `Invalid JSON syntax: ${err.message}` }]
    };
  }

  const slug = data.slug || path.basename(filePath, '.json');
  const title = data.title || slug;

  // Schema Validation
  if (!data.title) issues.push({ type: 'error', message: 'Missing title' });
  if (!data.difficulty || !['Easy', 'Medium', 'Hard'].includes(data.difficulty)) {
    issues.push({ type: 'error', message: `Invalid difficulty: ${data.difficulty}` });
  }
  if (!Array.isArray(data.tags) || data.tags.length === 0) {
    issues.push({ type: 'warning', message: 'No tags defined' });
  }
  if (!data.statement_md) issues.push({ type: 'error', message: 'Missing statement_md' });
  if (!Array.isArray(data.test_cases) || data.test_cases.length === 0) {
    issues.push({ type: 'error', message: 'No test cases defined' });
  }
  if (!data.starter_code || typeof data.starter_code !== 'object') {
    issues.push({ type: 'error', message: 'Missing starter_code object' });
  }
  if (!data.reference_solution || typeof data.reference_solution !== 'object') {
    issues.push({ type: 'error', message: 'Missing reference_solution object' });
  }

  const schemaValid = issues.filter(i => i.type === 'error').length === 0;

  // Reference Solution Testing
  let pythonPassed = false;
  let pythonRuntimeMs: number | undefined;
  let jsPassed = false;
  let jsRuntimeMs: number | undefined;

  if (schemaValid && data.reference_solution && data.test_cases) {
    // 1. Test Python reference solution
    if (data.reference_solution.python) {
      try {
        const pyResult = await runNativeCode({
          code: data.reference_solution.python,
          language: 'python',
          test_cases: data.test_cases,
          time_limit_ms: data.time_limit_ms || 3000
        });

        pythonPassed = pyResult.status === 'Accepted';
        pythonRuntimeMs = pyResult.runtime_ms;

        if (!pythonPassed) {
          const failed = pyResult.results.find(r => !r.passed);
          issues.push({
            type: 'error',
            message: `Python reference solution failed on test case ${failed ? failed.test_case_index + 1 : '?'}: ${pyResult.error_message || 'Mismatch'}`
          });
        }
      } catch (err: any) {
        issues.push({ type: 'error', message: `Python runner exception: ${err.message}` });
      }
    }

    // 2. Test JavaScript reference solution
    if (data.reference_solution.javascript) {
      try {
        const jsResult = await runNativeCode({
          code: data.reference_solution.javascript,
          language: 'javascript',
          test_cases: data.test_cases,
          time_limit_ms: data.time_limit_ms || 3000
        });

        jsPassed = jsResult.status === 'Accepted';
        jsRuntimeMs = jsResult.runtime_ms;

        if (!jsPassed) {
          const failed = jsResult.results.find(r => !r.passed);
          issues.push({
            type: 'error',
            message: `JavaScript reference solution failed on test case ${failed ? failed.test_case_index + 1 : '?'}: ${jsResult.error_message || 'Mismatch'}`
          });
        }
      } catch (err: any) {
        issues.push({ type: 'error', message: `JavaScript runner exception: ${err.message}` });
      }
    }

    // 3. Test SQL reference solution
    if (data.reference_solution.sql) {
      try {
        const { runSQLCode } = await import('../runner/sql-runner.js');
        const sqlResult = await runSQLCode({
          code: data.reference_solution.sql,
          test_cases: data.test_cases,
          time_limit_ms: data.time_limit_ms || 2000
        });

        const sqlPassed = sqlResult.status === 'Accepted';
        if (!sqlPassed) {
          const failed = sqlResult.results.find(r => !r.passed);
          issues.push({
            type: 'error',
            message: `SQL reference solution failed on test case ${failed ? failed.test_case_index + 1 : '?'}: ${sqlResult.error_message || 'Mismatch'}`
          });
        }
      } catch (err: any) {
        issues.push({ type: 'error', message: `SQL runner exception: ${err.message}` });
      }
    }
  }

  return {
    slug,
    title,
    category,
    filePath,
    schemaValid,
    pythonPassed,
    pythonRuntimeMs,
    jsPassed,
    jsRuntimeMs,
    issues
  };
}

export async function validateEntireBank(): Promise<BankValidationReport> {
  const startTime = Date.now();
  const files = getAllProblemFiles();
  const results: ProblemValidationResult[] = [];

  console.log(`[Validator] Starting validation of ${files.length} problem(s)...`);

  for (const file of files) {
    const res = await validateProblem(file);
    results.push(res);
    const hasErrors = res.issues.some(i => i.type === 'error');
    const icon = hasErrors ? '❌' : '✅';
    console.log(`  ${icon} [${res.category}] ${res.title} (${res.slug}) - Py: ${res.pythonPassed ? 'PASS' : 'FAIL'}, JS: ${res.jsPassed ? 'PASS' : 'FAIL'}`);
    if (hasErrors) {
      res.issues.forEach(iss => console.log(`     └─ ${iss.type.toUpperCase()}: ${iss.message}`));
    }
  }

  const validCount = results.filter(r => !r.issues.some(i => i.type === 'error')).length;
  const invalidCount = results.length - validCount;
  const durationMs = Date.now() - startTime;

  console.log(`\n[Validator] Complete in ${durationMs}ms: ${validCount}/${results.length} valid, ${invalidCount} with issues.`);

  return {
    totalProblems: results.length,
    validCount,
    invalidCount,
    durationMs,
    results
  };
}

// Allow direct execution
if (process.argv[1] && process.argv[1].includes('problem-validator')) {
  validateEntireBank().then(() => {
    process.exit(0);
  }).catch((err) => {
    console.error('Validation error:', err);
    process.exit(1);
  });
}

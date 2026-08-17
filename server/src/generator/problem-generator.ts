import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { runNativeCode } from '../runner/native-runner.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PROBLEMS_DIR = path.resolve(__dirname, '../../../problems');

export interface ProblemBlueprint {
  title: string;
  category: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  statement_md: string;
  constraints: string[];
  examples: Array<{ input: any; output: any; explanation?: string }>;
  starter_code: { python: string; javascript: string };
  reference_solution: { python: string; javascript: string };
  brute_force_solution?: { python?: string; javascript?: string };
  fuzz_generator?: (seed: number) => { input: any };
  hints: string[];
  editorial_md: string;
}

/**
 * Cross-validates optimal solution against brute-force solution with randomized fuzzing
 */
export async function crossValidateWithFuzzing(
  blueprint: ProblemBlueprint,
  fuzzCount: number = 20
): Promise<{ success: boolean; generatedTestCases: any[]; error?: string }> {
  const generatedTestCases = [...blueprint.examples.map(ex => ({
    input: ex.input,
    expected_output: ex.output,
    hidden: false
  }))];

  // If a fuzz generator is provided, generate random inputs and cross-verify with reference solution
  if (blueprint.fuzz_generator && blueprint.reference_solution.python) {
    console.log(`[Fuzzer] Generating and verifying ${fuzzCount} randomized test cases for "${blueprint.title}"...`);

    const randomInputs = [];
    for (let i = 0; i < fuzzCount; i++) {
      randomInputs.push(blueprint.fuzz_generator(i + 1));
    }

    // Run reference solution to obtain expected outputs
    const testCasesPayload = randomInputs.map(item => ({
      input: item.input,
      expected_output: null, // to be populated
      hidden: true
    }));

    try {
      const execRes = await runNativeCode({
        code: blueprint.reference_solution.python,
        language: 'python',
        test_cases: testCasesPayload,
        time_limit_ms: 3000
      });

      for (let i = 0; i < execRes.results.length; i++) {
        const res = execRes.results[i];
        if (res.actual_output !== undefined) {
          generatedTestCases.push({
            input: randomInputs[i].input,
            expected_output: res.actual_output,
            hidden: true
          });
        }
      }

      // If a brute force solution is provided, cross-validate all outputs
      if (blueprint.brute_force_solution?.python) {
        console.log(`[Dual-Solver] Cross-checking optimal vs brute-force solution on ${generatedTestCases.length} cases...`);
        const bruteRes = await runNativeCode({
          code: blueprint.brute_force_solution.python,
          language: 'python',
          test_cases: generatedTestCases,
          time_limit_ms: 5000
        });

        if (bruteRes.status !== 'Accepted') {
          const failed = bruteRes.results.find(r => !r.passed);
          return {
            success: false,
            generatedTestCases: [],
            error: `Dual-solver discrepancy on test case ${failed ? failed.test_case_index + 1 : '?'}: Optimal and Brute-force produced different outputs!`
          };
        }
        console.log(`  ✅ Dual-solver cross-check passed 100%!`);
      }

    } catch (err: any) {
      return {
        success: false,
        generatedTestCases: [],
        error: `Fuzz generation runner exception: ${err.message}`
      };
    }
  }

  return {
    success: true,
    generatedTestCases
  };
}

/**
 * Admits a verified problem into the problem bank JSON repository
 */
export async function admitProblemToBank(blueprint: ProblemBlueprint): Promise<{ slug: string; filePath: string }> {
  const validation = await crossValidateWithFuzzing(blueprint);
  if (!validation.success) {
    throw new Error(`Problem admission rejected: ${validation.error}`);
  }

  const slug = blueprint.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

  const categoryDir = path.join(PROBLEMS_DIR, blueprint.category);
  if (!fs.existsSync(categoryDir)) {
    fs.mkdirSync(categoryDir, { recursive: true });
  }

  const filePath = path.join(categoryDir, `${slug}.json`);
  const finalJson = {
    slug,
    title: blueprint.title,
    difficulty: blueprint.difficulty,
    tags: blueprint.tags,
    statement_md: blueprint.statement_md,
    constraints: blueprint.constraints,
    examples: blueprint.examples,
    starter_code: blueprint.starter_code,
    test_cases: validation.generatedTestCases,
    reference_solution: blueprint.reference_solution,
    hints: blueprint.hints,
    editorial_md: blueprint.editorial_md,
    time_limit_ms: 2000,
    memory_limit_mb: 128
  };

  fs.writeFileSync(filePath, JSON.stringify(finalJson, null, 2), 'utf-8');
  console.log(`[Bank Admission] Successfully admitted "${blueprint.title}" to ${filePath}`);

  return { slug, filePath };
}

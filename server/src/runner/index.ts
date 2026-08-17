import { runNativeCode } from './native-runner.js';
import type { RunOptions, ExecutionResult } from './native-runner.js';
import { runSQLCode } from './sql-runner.js';
import { isJudge0Available, submitToJudge0, JUDGE0_LANGUAGE_MAP } from './judge0-runner.js';

export async function executeCode(options: RunOptions): Promise<ExecutionResult> {
  const { language } = options;

  // SQL Execution Engine
  if (language === 'sql') {
    return (await runSQLCode(options as any)) as any;
  }

  // Use fast native runner for Python & JavaScript
  if (language === 'python' || language === 'javascript') {
    return await runNativeCode(options);
  }

  // If other compiled languages (C++, Java, Rust, Go) are requested, check Judge0
  const judge0Active = await isJudge0Available();
  if (!judge0Active) {
    throw new Error(
      `Language '${language}' requires Judge0 to be running locally via Docker. Python and JavaScript are supported natively.`
    );
  }

  const langId = JUDGE0_LANGUAGE_MAP[language];
  if (!langId) {
    throw new Error(`Unsupported language '${language}' in Judge0 mapping.`);
  }

  // Run through Judge0
  const results = [];
  let passedCount = 0;

  for (let i = 0; i < options.test_cases.length; i++) {
    const tc = options.test_cases[i];
    const judgeRes = await submitToJudge0({
      source_code: options.code,
      language_id: langId,
      stdin: JSON.stringify(tc.input),
      expected_output: JSON.stringify(tc.expected_output),
      cpu_time_limit: Math.max(1, Math.round((options.time_limit_ms || 2000) / 1000)),
      memory_limit: (options.memory_limit_mb || 128) * 1024
    });

    const passed = judgeRes.status.id === 3; // 3 = Accepted in Judge0
    if (passed) passedCount++;

    results.push({
      test_case_index: i,
      passed,
      runtime_ms: parseFloat(judgeRes.time || '0') * 1000,
      stdout: judgeRes.stdout || '',
      stderr: judgeRes.stderr || judgeRes.compile_output || '',
      hidden: !!tc.hidden,
      ...(!tc.hidden && {
        input: tc.input,
        expected_output: tc.expected_output,
        actual_output: judgeRes.stdout
      })
    });
  }

  return {
    success: passedCount === options.test_cases.length,
    status: passedCount === options.test_cases.length ? 'Accepted' : 'Wrong Answer',
    test_cases_passed: passedCount,
    total_test_cases: options.test_cases.length,
    runtime_ms: 100,
    memory_kb: 20000,
    results
  };
}

export type { RunOptions, ExecutionResult };

import initSqlJs, { Database as SqlJsDatabase } from 'sql.js';

export interface SQLTestCase {
  schema_ddl?: string; // DDL to create & populate tables, e.g. "CREATE TABLE Employee ...; INSERT INTO Employee ..."
  input?: any; // Tabular representation or DDL
  expected_output: {
    columns: string[];
    values: any[][];
  } | any[];
  hidden?: boolean;
}

export interface SQLRunOptions {
  code: string; // User's SQL query
  test_cases: SQLTestCase[];
  time_limit_ms?: number;
}

export interface SQLTestCaseResult {
  test_case_index: number;
  passed: boolean;
  runtime_ms: number;
  stdout: string;
  stderr?: string;
  hidden: boolean;
  input?: any;
  expected_output?: any;
  actual_output?: {
    columns: string[];
    values: any[][];
  } | null;
  error?: string;
}

export interface SQLExecutionResult {
  success: boolean;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error';
  test_cases_passed: number;
  total_test_cases: number;
  runtime_ms: number;
  memory_kb: number;
  error_message?: string;
  results: SQLTestCaseResult[];
}

let SQL: any = null;

async function getSqlJs() {
  if (!SQL) {
    SQL = await initSqlJs();
  }
  return SQL;
}

function normalizeSqlValue(val: any) {
  if (val === null || val === undefined) return null;
  if (typeof val === 'number') return val;
  return String(val);
}

function compareSqlTables(actual: { columns: string[]; values: any[][] }, expected: any): boolean {
  if (!actual || !actual.columns || !actual.values) return false;

  let expectedCols: string[] = [];
  let expectedVals: any[][] = [];

  if (Array.isArray(expected)) {
    if (expected.length === 0 && actual.values.length === 0) return true;
    if (expected.length > 0 && typeof expected[0] === 'object' && !Array.isArray(expected[0])) {
      expectedCols = Object.keys(expected[0]);
      expectedVals = expected.map(row => expectedCols.map(col => row[col]));
    } else {
      expectedVals = expected;
      expectedCols = actual.columns;
    }
  } else if (expected && expected.columns && expected.values) {
    expectedCols = expected.columns;
    expectedVals = expected.values;
  }

  // Case-insensitive column name matching
  const actualColsLower = actual.columns.map(c => c.toLowerCase());
  const expectedColsLower = expectedCols.map(c => c.toLowerCase());

  if (actualColsLower.length !== expectedColsLower.length) return false;
  for (let i = 0; i < actualColsLower.length; i++) {
    if (actualColsLower[i] !== expectedColsLower[i]) return false;
  }

  if (actual.values.length !== expectedVals.length) return false;

  // Compare rows (order-agnostic or exact)
  const normActual = actual.values.map(row => row.map(normalizeSqlValue).join('___')).sort();
  const normExpected = expectedVals.map(row => row.map(normalizeSqlValue).join('___')).sort();

  return JSON.stringify(normActual) === JSON.stringify(normExpected);
}

export async function runSQLCode(options: SQLRunOptions): Promise<SQLExecutionResult> {
  const sqlEngine = await getSqlJs();
  const { code, test_cases } = options;
  const results: SQLTestCaseResult[] = [];
  let passedCount = 0;

  for (let i = 0; i < test_cases.length; i++) {
    const tc = test_cases[i];
    const isHidden = !!tc.hidden;
    const db: SqlJsDatabase = new sqlEngine.Database();
    const startTime = performance.now();

    try {
      // 1. Execute schema DDL & seed data
      const ddl = tc.schema_ddl || (typeof tc.input === 'string' ? tc.input : '');
      if (ddl) {
        db.exec(ddl);
      }

      // 2. Execute user query
      const queryResult = db.exec(code);
      const elapsedMs = performance.now() - startTime;

      let actualTable: { columns: string[]; values: any[][] } = {
        columns: [],
        values: []
      };

      if (queryResult.length > 0) {
        actualTable = {
          columns: queryResult[0].columns || [],
          values: queryResult[0].values || []
        };
      }

      const passed = compareSqlTables(actualTable, tc.expected_output);
      if (passed) passedCount++;

      results.push({
        test_case_index: i,
        passed,
        runtime_ms: Number(elapsedMs.toFixed(2)),
        stdout: '',
        hidden: isHidden,
        ...(!isHidden && {
          input: ddl,
          expected_output: tc.expected_output,
          actual_output: actualTable
        })
      });

    } catch (err: any) {
      const elapsedMs = performance.now() - startTime;
      results.push({
        test_case_index: i,
        passed: false,
        runtime_ms: Number(elapsedMs.toFixed(2)),
        stdout: '',
        error: `SQL Error: ${err.message}`,
        hidden: isHidden,
        ...(!isHidden && {
          input: tc.schema_ddl,
          expected_output: tc.expected_output,
          actual_output: null
        })
      });
    } finally {
      db.close();
    }
  }

  const allPassed = passedCount === test_cases.length;
  const hasErrors = results.some(r => r.error);

  return {
    success: allPassed,
    status: allPassed ? 'Accepted' : (hasErrors ? 'Runtime Error' : 'Wrong Answer'),
    test_cases_passed: passedCount,
    total_test_cases: test_cases.length,
    runtime_ms: 12,
    memory_kb: 8000,
    results
  };
}

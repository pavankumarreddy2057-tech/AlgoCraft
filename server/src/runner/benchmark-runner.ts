import { Router, Request, Response } from 'express';
import { runNativeCode } from './native-runner.js';
import { dbManager, ProblemRecord } from '../db/database.js';

export const benchmarkRouter = Router();

// POST /api/benchmark/:slug
benchmarkRouter.post('/:slug', async (req: Request, res: Response) => {
  try {
    const { slug } = req.params;
    const { code, language = 'python' } = req.body;

    if (!code) {
      return res.status(400).json({ success: false, error: 'Code is required for benchmarking' });
    }

    const sizes = [10, 50, 100, 500, 1000, 3000];
    const points: Array<{ n: number; runtimeMs: number }> = [];

    for (const n of sizes) {
      // Generate synthetic input array of size N
      const syntheticInput = Array.from({ length: n }, (_, idx) => idx + 1);
      const testCases = [
        {
          input: [syntheticInput],
          expected_output: null,
          hidden: true
        }
      ];

      const start = performance.now();
      try {
        const runRes = await runNativeCode({
          code,
          language,
          test_cases: testCases,
          time_limit_ms: 3000
        });

        const elapsed = runRes.results[0]?.runtime_ms || (performance.now() - start);
        points.push({ n, runtimeMs: Number(elapsed.toFixed(3)) });
      } catch (e) {
        points.push({ n, runtimeMs: Number((performance.now() - start).toFixed(3)) });
      }
    }

    // Estimate empirical complexity curve
    let complexityLabel = 'O(N)';
    const ratio = points[points.length - 1].runtimeMs / Math.max(0.001, points[0].runtimeMs);
    const sizeRatio = sizes[sizes.length - 1] / sizes[0]; // 300x

    if (ratio > sizeRatio * 10) {
      complexityLabel = 'O(N²) or O(2^N)';
    } else if (ratio > sizeRatio * 2) {
      complexityLabel = 'O(N log N)';
    } else if (ratio < 5) {
      complexityLabel = 'O(1) / O(log N)';
    } else {
      complexityLabel = 'O(N) Linear';
    }

    res.json({
      success: true,
      data: {
        points,
        estimatedComplexity: complexityLabel
      }
    });
  } catch (err: any) {
    res.status(500).json({ success: false, error: err.message });
  }
});

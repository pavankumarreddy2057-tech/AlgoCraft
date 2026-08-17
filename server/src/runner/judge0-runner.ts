// Judge0 REST Client for offline execution against local Docker Judge0 instance

export interface Judge0Options {
  source_code: string;
  language_id: number;
  stdin?: string;
  expected_output?: string;
  cpu_time_limit?: number; // in seconds
  memory_limit?: number; // in KB
}

export interface Judge0Response {
  stdout: string | null;
  stderr: string | null;
  compile_output: string | null;
  message: string | null;
  time: string | null;
  memory: number | null;
  status: {
    id: number;
    description: string;
  };
}

export const JUDGE0_LANGUAGE_MAP: Record<string, number> = {
  python: 71,       // Python (3.8.1)
  javascript: 63,   // JavaScript (Node.js 12.14.0)
  cpp: 54,          // C++ (GCC 9.2.0)
  java: 62,         // Java (OpenJDK 13.0.1)
  csharp: 51,       // C# (Mono 6.6.0.161)
  golang: 60,       // Go (1.13.5)
  rust: 73          // Rust (1.40.0)
};

const JUDGE0_BASE_URL = process.env.JUDGE0_URL || 'http://localhost:2358';

export async function isJudge0Available(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`${JUDGE0_BASE_URL}/about`, { signal: controller.signal });
    clearTimeout(timeout);
    return res.ok;
  } catch {
    return false;
  }
}

export async function submitToJudge0(options: Judge0Options): Promise<Judge0Response> {
  const url = `${JUDGE0_BASE_URL}/submissions?wait=true`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(options)
  });

  if (!res.ok) {
    throw new Error(`Judge0 returned status ${res.status}: ${await res.text()}`);
  }

  return (await res.json()) as Judge0Response;
}

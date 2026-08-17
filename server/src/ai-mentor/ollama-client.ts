export interface MentorRequest {
  problemTitle: string;
  statementMd: string;
  userCode: string;
  language: string;
  userQuestion?: string;
}

export interface MentorResponse {
  hint: string;
  isLocalLLM: boolean;
  modelUsed: string;
}

const OLLAMA_BASE_URL = process.env.OLLAMA_URL || 'http://localhost:11434';

export async function isOllamaAvailable(): Promise<{ available: boolean; models: string[] }> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1000);
    const res = await fetch(`${OLLAMA_BASE_URL}/api/tags`, { signal: controller.signal });
    clearTimeout(timeout);
    if (!res.ok) return { available: false, models: [] };
    const data = (await res.json()) as any;
    const models = (data.models || []).map((m: any) => m.name);
    return { available: true, models };
  } catch {
    return { available: false, models: [] };
  }
}

export async function generateSocraticHint(req: MentorRequest): Promise<MentorResponse> {
  const { available, models } = await isOllamaAvailable();

  if (available && models.length > 0) {
    const chosenModel = models.find(m => m.includes('code') || m.includes('qwen') || m.includes('llama')) || models[0];

    const systemPrompt = `You are a world-class coding interview mentor and teacher.
Your goal is to guide the student using the Socratic method without directly writing the code solution.
Give targeted, insightful hints, point out potential edge-case traps (like empty inputs, off-by-one, or integer limits), and encourage optimal time/space complexity thinking. Keep explanations crisp, encouraging, and under 150 words.`;

    const userPrompt = `Problem: ${req.problemTitle}
Description: ${req.statementMd.slice(0, 500)}
Student Code (${req.language}):
\`\`\`${req.language}
${req.userCode || '# No code written yet'}
\`\`\`
Student Question: ${req.userQuestion || 'Can you give me a progressive hint on the optimal approach and time complexity?'}`;

    try {
      const response = await fetch(`${OLLAMA_BASE_URL}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: chosenModel,
          system: systemPrompt,
          prompt: userPrompt,
          stream: false
        })
      });

      if (response.ok) {
        const data = (await response.json()) as any;
        return {
          hint: data.response,
          isLocalLLM: true,
          modelUsed: chosenModel
        };
      }
    } catch (e) {
      console.warn('[Ollama] Call failed, falling back to heuristic mentor.');
    }
  }

  // Intelligent offline heuristic mentor fallback
  return {
    hint: generateHeuristicHint(req),
    isLocalLLM: false,
    modelUsed: 'Offline Rule Engine'
  };
}

function generateHeuristicHint(req: MentorRequest): string {
  const title = req.problemTitle.toLowerCase();
  const code = req.userCode.toLowerCase();

  if (title.includes('two sum') || title.includes('duplicate') || title.includes('anagram')) {
    if (!code.includes('map') && !code.includes('dict') && !code.includes('set') && !code.includes('{')) {
      return "💡 Socratic Hint: A brute-force approach requires O(N²) pair comparisons. Can you store visited elements in a Hash Map or Set to check complements in O(1) time?";
    }
    return "💡 Socratic Hint: Watch out for duplicate elements and index clashes! Ensure you don't use the same element twice.";
  }

  if (title.includes('palindrome') || title.includes('3sum') || title.includes('water') || title.includes('sorted')) {
    return "💡 Socratic Hint: Consider the Two Pointers pattern. If the collection is sorted or monotonic, moving left/right pointers allows eliminating search regions in O(N) linear time.";
  }

  if (title.includes('stock') || title.includes('window') || title.includes('substring')) {
    return "💡 Socratic Hint: Sliding Window technique is ideal here. Expand the right boundary `r` until a constraint breaks, then contract the left boundary `l` while maintaining running window invariants.";
  }

  if (title.includes('tree') || title.includes('depth') || title.includes('ancestor')) {
    return "💡 Socratic Hint: Trees have natural recursive subproblem structures. Formulate: (1) Base case (null node), (2) Divide work to left and right subtrees, (3) Combine child results at root.";
  }

  if (title.includes('island') || title.includes('graph') || title.includes('matrix')) {
    return "💡 Socratic Hint: When traversing grids or graphs, maintain a visited set or mutate visited cells in-place to prevent infinite cycles.";
  }

  if (title.includes('climb') || title.includes('robber') || title.includes('coin') || title.includes('path')) {
    return "💡 Socratic Hint: Dynamic Programming pattern. Define state `dp[i]` as optimal answer for subproblem size `i`. Identify the recurrence transition from `dp[i-1]` and `dp[i-2]`.";
  }

  return "💡 Socratic Hint: Analyze the input constraints. If N <= 10^5, an O(N) or O(N log N) solution is required to pass time limits. Break down subproblems and check edge cases (empty inputs, single elements, negative numbers).";
}

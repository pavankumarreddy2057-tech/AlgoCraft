import {
  ProblemListItem,
  ProblemDetail,
  ExecutionResult,
  SubmissionHistoryItem,
  ReviewQueueItem,
  DashboardStats,
  SampleTestCase,
  User,
  PersonalDashboardData,
  LeaderboardData
} from '../types/index.js';

const API_BASE = '/api';

function getAuthHeaders(headers: Record<string, string> = {}): Record<string, string> {
  const token = localStorage.getItem('algocraft_token');
  if (token) {
    return {
      ...headers,
      Authorization: `Bearer ${token}`
    };
  }
  return headers;
}

// ==============================================================================
// 1. Auth API
// ==============================================================================

export async function sendOtp(email: string): Promise<{ success: boolean; message: string; is_dev?: boolean; dev_otp?: string }> {
  const res = await fetch(`${API_BASE}/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Failed to send OTP');
  }
  return await res.json();
}

export async function verifyOtp(email: string, code: string): Promise<{ token: string; user: User }> {
  const res = await fetch(`${API_BASE}/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, code })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Verification failed');
  }
  const data = await res.json();
  if (data.token) {
    localStorage.setItem('algocraft_token', data.token);
  }
  return data;
}

export async function fetchCurrentUser(): Promise<{ authenticated: boolean; user: User }> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error('Failed to fetch user');
  return await res.json();
}

export async function updateProfile(data: { username?: string; avatar_url?: string; bio?: string; target_role?: string }): Promise<{ user: User }> {
  const res = await fetch(`${API_BASE}/auth/profile`, {
    method: 'PUT',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(data)
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Failed to update profile');
  }
  return await res.json();
}

// ==============================================================================
// 2. Personal Dashboard & Bookmarks API
// ==============================================================================

export async function fetchPersonalDashboard(): Promise<PersonalDashboardData> {
  const res = await fetch(`${API_BASE}/user/dashboard`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch dashboard: ${res.statusText}`);
  return await res.json();
}

export async function toggleBookmark(problem_slug: string): Promise<{ isBookmarked: boolean }> {
  const res = await fetch(`${API_BASE}/user/bookmarks/toggle`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ problem_slug })
  });
  if (!res.ok) throw new Error('Failed to toggle bookmark');
  return await res.json();
}

// ==============================================================================
// 3. Global Leaderboard & Pulse API
// ==============================================================================

export async function fetchLeaderboard(): Promise<LeaderboardData> {
  const [rRes, pRes, cRes, sRes] = await Promise.all([
    fetch(`${API_BASE}/leaderboard/rankings`),
    fetch(`${API_BASE}/leaderboard/pulse`),
    fetch(`${API_BASE}/leaderboard/champions`),
    fetch(`${API_BASE}/leaderboard/stats`)
  ]);

  const rankings = (await rRes.json()).rankings || [];
  const pulse = (await pRes.json()).pulse || [];
  const champions = (await cRes.json()).champions || {};
  const stats = await sRes.json();

  return { rankings, pulse, champions, stats };
}

// ==============================================================================
// 4. Problems API
// ==============================================================================

export async function fetchProblems(params: {
  difficulty?: string;
  tag?: string;
  status?: string;
  search?: string;
  sort?: string;
  order?: 'asc' | 'desc';
} = {}): Promise<{ total: number; problems: ProblemListItem[] }> {
  const query = new URLSearchParams();
  if (params.difficulty && params.difficulty !== 'All') query.set('difficulty', params.difficulty);
  if (params.tag && params.tag !== 'All') query.set('tag', params.tag);
  if (params.status && params.status !== 'All') query.set('status', params.status);
  if (params.search) query.set('search', params.search);
  if (params.sort) query.set('sort', params.sort);
  if (params.order) query.set('order', params.order);

  const res = await fetch(`${API_BASE}/problems?${query.toString()}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch problems: ${res.statusText}`);
  const data = await res.json();
  return { total: data.total, problems: data.problems };
}

export async function fetchTags(): Promise<Array<{ name: string; count: number }>> {
  const res = await fetch(`${API_BASE}/problems/meta/tags`);
  if (!res.ok) throw new Error(`Failed to fetch tags: ${res.statusText}`);
  const data = await res.json();
  return data.tags || [];
}

export async function fetchProblemDetail(slug: string): Promise<{
  problem: ProblemDetail;
  spaced_repetition: {
    interval_days: number;
    repetition_count: number;
    ease_factor: number;
    flagged_review: number;
    last_reviewed_at?: string;
    next_review_at?: string;
  };
  latest_submission?: any;
}> {
  const res = await fetch(`${API_BASE}/problems/${slug}`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch problem: ${res.statusText}`);
  return await res.json();
}

export async function runCode(
  slug: string,
  code: string,
  language: 'python' | 'javascript' | 'sql',
  customTestCases?: SampleTestCase[]
): Promise<ExecutionResult> {
  const res = await fetch(`${API_BASE}/submissions/${slug}/run`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ code, language, custom_test_cases: customTestCases })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Failed to run code');
  }
  const data = await res.json();
  return data.execution;
}

export async function submitCode(
  slug: string,
  code: string,
  language: 'python' | 'javascript' | 'sql'
): Promise<{ submissionId: number; execution: ExecutionResult }> {
  const res = await fetch(`${API_BASE}/submissions/${slug}/submit`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ code, language })
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || 'Failed to submit code');
  }
  return await res.json();
}

export async function fetchSubmissionHistory(slug: string): Promise<SubmissionHistoryItem[]> {
  const res = await fetch(`${API_BASE}/submissions/${slug}/history`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch history: ${res.statusText}`);
  const data = await res.json();
  return data.submissions || [];
}

export async function fetchGlobalSubmissions(): Promise<any[]> {
  const res = await fetch(`${API_BASE}/submissions`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch submissions: ${res.statusText}`);
  const data = await res.json();
  return data.submissions || [];
}

export async function fetchReviewQueue(): Promise<{ count: number; queue: ReviewQueueItem[] }> {
  const res = await fetch(`${API_BASE}/review/queue`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch review queue: ${res.statusText}`);
  const data = await res.json();
  return { count: data.count, queue: data.queue };
}

export async function recordReviewGrade(slug: string, grade: number): Promise<any> {
  const res = await fetch(`${API_BASE}/review/${slug}/record`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ grade })
  });
  if (!res.ok) throw new Error(`Failed to record review: ${res.statusText}`);
  return await res.json();
}

export async function toggleReviewFlag(slug: string): Promise<boolean> {
  const res = await fetch(`${API_BASE}/review/${slug}/toggle-flag`, {
    method: 'POST',
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to toggle flag: ${res.statusText}`);
  const data = await res.json();
  return data.flagged_review === 1;
}

export async function fetchStats(): Promise<DashboardStats> {
  const res = await fetch(`${API_BASE}/stats`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) throw new Error(`Failed to fetch stats: ${res.statusText}`);
  const data = await res.json();
  return data.stats;
}

export async function validateProblemBank(): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/validate`, { method: 'POST', headers: getAuthHeaders() });
  if (!res.ok) throw new Error(`Validation failed: ${res.statusText}`);
  const data = await res.json();
  return data.report;
}

export async function importProblemPack(problems: any[], targetCategory: string = 'custom'): Promise<any> {
  const res = await fetch(`${API_BASE}/admin/import`, {
    method: 'POST',
    headers: getAuthHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify({ problems, target_category: targetCategory })
  });
  if (!res.ok) throw new Error(`Import failed: ${res.statusText}`);
  return await res.json();
}

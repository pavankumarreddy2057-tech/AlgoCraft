export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type ProblemStatus = 'Solved' | 'Attempted' | 'Todo';
export type SubmissionStatus = 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Runtime Error' | 'Memory Limit Exceeded';

export interface User {
  id: number;
  email: string;
  username: string;
  avatar_url: string;
  bio: string;
  target_role: string;
  score: number;
  created_at: string;
  last_active_at: string;
}

export interface ProblemListItem {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  status: ProblemStatus;
  last_submission_status?: SubmissionStatus;
  interval_days: number;
  next_review_at?: string;
  flagged_review: number;
  has_solved: number;
  total_submissions: number;
  time_limit_ms: number;
  memory_limit_mb: number;
  is_bookmarked?: boolean;
}

export interface Example {
  input: any;
  output: any;
  explanation?: string;
}

export interface SampleTestCase {
  input: any;
  expected_output: any;
  hidden?: boolean;
  explanation?: string;
}

export interface ProblemDetail {
  id: number;
  slug: string;
  title: string;
  difficulty: Difficulty;
  tags: string[];
  statement_md: string;
  constraints: string[];
  examples: Example[];
  starter_code: {
    python?: string;
    javascript?: string;
    [lang: string]: string | undefined;
  };
  sample_test_cases: SampleTestCase[];
  total_test_cases_count: number;
  hints: string[];
  editorial_md: string;
  reference_solution: {
    python?: string;
    javascript?: string;
    [lang: string]: string | undefined;
  };
  time_limit_ms: number;
  memory_limit_mb: number;
}

export interface TestCaseResult {
  test_case_index: number;
  passed: boolean;
  runtime_ms: number;
  stdout: string;
  stderr?: string;
  hidden: boolean;
  input?: any;
  expected_output?: any;
  actual_output?: any;
  error?: string;
  traceback?: string;
}

export interface ExecutionResult {
  success: boolean;
  status: SubmissionStatus;
  test_cases_passed: number;
  total_test_cases: number;
  runtime_ms: number;
  memory_kb: number;
  error_message?: string;
  results: TestCaseResult[];
}

export interface SubmissionHistoryItem {
  id: number;
  problem_slug: string;
  problem_title?: string;
  difficulty?: Difficulty;
  language: string;
  status: SubmissionStatus;
  runtime_ms: number;
  memory_kb: number;
  test_cases_passed: number;
  total_test_cases: number;
  created_at: string;
}

export interface ReviewQueueItem {
  id: number;
  slug: string;
  problem_slug?: string;
  title: string;
  problem_title?: string;
  difficulty: Difficulty;
  tags: string[];
  interval_days: number;
  repetition_count: number;
  ease_factor: number;
  last_reviewed_at?: string;
  next_review_at?: string;
  flagged_review?: number;
  last_status?: SubmissionStatus;
}

export interface DashboardStats {
  totalSolved: number;
  totalBank: number;
  totalSubmissions: number;
  currentStreak: number;
  maxStreak: number;
  difficulty: {
    Easy: { total: number; solved: number };
    Medium: { total: number; solved: number };
    Hard: { total: number; solved: number };
  };
  heatmap: Record<string, { submissions: number; solved: number }>;
  topicMastery: Array<{
    tag: string;
    total: number;
    solved: number;
    percentage: number;
  }>;
}

export interface CalendarDay {
  date: string;
  count: number;
  solved: number;
}

export interface PersonalDashboardData {
  user: User;
  stats: {
    totalBank: number;
    totalSolved: number;
    acceptanceRate: number;
    currentStreak: number;
    longestStreak: number;
    difficulty: {
      easy: { solved: number; total: number };
      medium: { solved: number; total: number };
      hard: { solved: number; total: number };
    };
  };
  topicMastery: Array<{
    topic: string;
    total: number;
    solved: number;
    percentage: number;
  }>;
  calendar: CalendarDay[];
  recentSubmissions: SubmissionHistoryItem[];
  dueReviews: ReviewQueueItem[];
  bookmarks: Array<{
    problem_slug: string;
    problem_title: string;
    difficulty: Difficulty;
    tags: string;
    created_at: string;
  }>;
}

export interface LeaderboardUser {
  rank: number;
  id: number;
  username: string;
  avatar_url: string;
  bio: string;
  target_role: string;
  score: number;
  solved_count: number;
  total_submissions: number;
  joined_at: string;
}

export interface GlobalPulseItem {
  id: number;
  problem_slug: string;
  problem_title: string;
  difficulty: Difficulty;
  language: string;
  runtime_ms: number;
  created_at: string;
  username: string;
  avatar_url: string;
}

export interface LeaderboardData {
  rankings: LeaderboardUser[];
  pulse: GlobalPulseItem[];
  champions: Record<string, any>;
  stats: {
    totalUsers: number;
    totalSubmissions: number;
    totalAccepted: number;
    globalAcceptanceRate: number;
    languageDistribution: Array<{ language: string; cnt: number }>;
    hardestProblems: Array<{
      slug: string;
      title: string;
      difficulty: Difficulty;
      attempts: number;
      accepted: number;
    }>;
  };
}

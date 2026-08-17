export interface SM2State {
  repetitions: number;
  interval: number; // in days
  easeFactor: number;
}

export interface SM2Result {
  repetitions: number;
  interval: number;
  easeFactor: number;
  nextReviewAt: string; // ISO date string
}

/**
 * Calculates next SM-2 interval and ease factor
 * @param grade Score from 0 to 5:
 *   0: Complete blackout ("Again")
 *   3: Serious difficulty ("Hard")
 *   4: Good response with slight hesitation ("Good")
 *   5: Perfect recall ("Easy")
 * @param current Current SM-2 state
 */
export function calculateSM2(
  grade: number,
  current: SM2State = { repetitions: 0, interval: 1, easeFactor: 2.5 }
): SM2Result {
  let { repetitions, interval, easeFactor } = current;

  // Grade must be clamped between 0 and 5
  const q = Math.max(0, Math.min(5, grade));

  if (q < 3) {
    // Failed recall: reset repetitions count and set interval to 1 day
    repetitions = 0;
    interval = 1;
  } else {
    // Successful recall
    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }
    repetitions += 1;
  }

  // Update Ease Factor (EF' = EF + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)))
  easeFactor = easeFactor + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02));
  if (easeFactor < 1.3) {
    easeFactor = 1.3;
  }

  // Calculate Next Review Date
  const nextDate = new Date();
  nextDate.setDate(nextDate.getDate() + interval);
  // Set to start of day for consistent comparison
  nextDate.setHours(0, 0, 0, 0);

  return {
    repetitions,
    interval,
    easeFactor: Number(easeFactor.toFixed(2)),
    nextReviewAt: nextDate.toISOString()
  };
}

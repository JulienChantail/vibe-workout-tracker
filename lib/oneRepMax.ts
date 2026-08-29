type SetLike = { weight: number; reps: number; setType: string };

/**
 * Formule d'Epley : estimation du 1RM à partir d'une série (poids x reps).
 * Fiable surtout entre 1 et 10 répétitions.
 */
export function estimateOneRepMax(weight: number, reps: number): number {
  if (reps <= 1) return weight;
  return weight * (1 + reps / 30);
}

/**
 * 1RM d'une séance : meilleure estimation (Epley) parmi les séries de travail
 * uniquement (les séries d'échauffement/récupération ne sont pas à l'effort max
 * et fausseraient l'estimation).
 */
export function sessionOneRepMax(sets: SetLike[]): number | null {
  const working = sets.filter((s) => s.setType === 'WORKING' && s.reps > 0);
  if (working.length === 0) return null;
  return Math.max(...working.map((s) => estimateOneRepMax(s.weight, s.reps)));
}

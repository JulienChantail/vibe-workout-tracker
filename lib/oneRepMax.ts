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
 *
 * `bodyWeightKg` doit être ajouté au poids de chaque série pour les exercices
 * de catégorie BODYWEIGHT_LESTE (dips, tractions lestées...), où le poids saisi
 * n'est que le leste : le poids réellement soulevé est corps + leste.
 */
export function sessionOneRepMax(sets: SetLike[], bodyWeightKg = 0): number | null {
  const working = sets.filter((s) => s.setType === 'WORKING' && s.reps > 0);
  if (working.length === 0) return null;
  return Math.max(...working.map((s) => estimateOneRepMax(s.weight + bodyWeightKg, s.reps)));
}

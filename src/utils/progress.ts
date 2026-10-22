import type { SubObjective } from '../types/goal';

export function getProgress(subObjectives: SubObjective[]): number {
    if (subObjectives.length === 0) {
        return 0;
    }
    const completedCount = subObjectives.filter(
    (subObjective) => subObjective.completed
    ).length;

    return Math.round((completedCount / subObjectives.length) * 100);
}
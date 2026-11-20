import type { Objective, SubObjective } from '../types/goal';

export function getProgress(subObjectives: SubObjective[]): number {
    if (subObjectives.length === 0) {
        return 0;
    }
    const completedCount = subObjectives.filter(
    (subObjective) => subObjective.completed
    ).length;

    return Math.round((completedCount / subObjectives.length) * 100);
}

export function isObjectiveCompleted(objective: Objective): boolean {
    const subObjectives = objective.subObjectives ?? [];
    return (
        subObjectives.length > 0 &&
        subObjectives.every((subObjective) => subObjective.completed)
    );
}
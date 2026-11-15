import {
  createContext,
  useContext,
  useEffect,
  useState,
  type PropsWithChildren,
} from 'react';

import {
  chargerObjectifs,
  creerIdUnique,
  sauvegarder,
} from '@/data/storage';
import type { Objective,SubObjective } from '@/types/goal';
type NewSubObjective = Omit<SubObjective, 'id' | 'completed'>;
export function SubObjectivesProvider({ children }: PropsWithChildren) {

    return (
        <></>
    )
}


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
import type { Objective } from '@/types/goal';

type NewObjective = Omit<Objective, 'id' | 'completed'>;

type ObjectivesContextValue = {
  objectives: Objective[];
  loading: boolean;
  ajouterObjectif: (objective: NewObjective) => Promise<boolean>;
  deleteObjective: (objectiveId: string) => Promise<boolean>;
  updatedObjective: (objectiveId: string, name: string, dueDate: Date) => Promise<boolean>;
};

const ObjectivesContext = createContext<ObjectivesContextValue | null>(null);

// CHARGER OBJECTIFS AU DEMARRAGE 
export function ObjectivesProvider({ children }: PropsWithChildren) {
  const [objectives, setObjectives] = useState<Objective[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    chargerObjectifs().then((savedObjectives) => {
      if (active) {
        setObjectives(savedObjectives);
        setLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, []);
  
//   AJOUT d'UN OBJECTIVE  
  async function ajouterObjectif(input: NewObjective): Promise<boolean> {
    if (loading) return false;
    // CREATION D UN OBJET BASER SUR UNE ONTERFACE
    const newObjective: Objective = {
      ...input,
      id: creerIdUnique(objectives),
      completed: false,
    };
    const updatedObjectives = [...objectives, newObjective];
    const saved = await sauvegarder(updatedObjectives);

    if (!saved) return false;

    setObjectives(updatedObjectives);
    return true;
  }

  async function deleteObjective(objectiveId: string): Promise<boolean> {
    const updatedObjectives = objectives.filter(
      (objective) => objective.id !== objectiveId
    );

    if (updatedObjectives.length === objectives.length) {
      return false;
    }

    const saved = await sauvegarder(updatedObjectives);
    if (!saved) {
      return false;
    }

    setObjectives(updatedObjectives);
    return true;
  }
  // POUR MODIFIER UN OBJECTIF
  async function updatedObjective(objectiveId: string, name: string, dueDate: Date): Promise<boolean> {
    const objectiveExists = objectives.some(
      (objective) => objective.id === objectiveId
    );
    if (!objectiveExists) return false;

    const updatedObjectives = objectives.map((objective) =>
      objective.id === objectiveId
        ? { ...objective, name, dueDate }
        : objective
    );

    const saved = await sauvegarder(updatedObjectives);
    if (!saved) return false;
    setObjectives(updatedObjectives);
    return true;
  }

  return (
    // Dit ce qu'il fournis au composant
    <ObjectivesContext.Provider
      value={{ objectives, loading, ajouterObjectif, deleteObjective, updatedObjective }}
    >
      {children}
    </ObjectivesContext.Provider>
  );
}
// PERMET AUX AUTRES ECRANS D'ACCEDER A CETTE LISTE 
export function useObjectives(): ObjectivesContextValue {
  const context = useContext(ObjectivesContext);

  if (!context) {
    throw new Error('useObjectives doit être utilisé dans ObjectivesProvider.');
  }

  return context;
}

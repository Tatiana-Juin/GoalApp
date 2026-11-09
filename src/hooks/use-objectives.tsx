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

  return (
    <ObjectivesContext.Provider
      value={{ objectives, loading, ajouterObjectif }}
    >
      {children}
    </ObjectivesContext.Provider>
  );
}

export function useObjectives(): ObjectivesContextValue {
  const context = useContext(ObjectivesContext);

  if (!context) {
    throw new Error('useObjectives doit être utilisé dans ObjectivesProvider.');
  }

  return context;
}

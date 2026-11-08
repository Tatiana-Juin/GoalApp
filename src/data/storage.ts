import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Objective } from '@/types/goal';

const OBJECTIVES_KEY = '@goalapp/objectives';

export function creerIdUnique(objectifs: Objective[]): string {
	let id: string;

	do {
		id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	} while (objectifs.some((objectif) => objectif.id === id));

	return id;
}

export async function sauvegarder(objectifs: Objective[]) : Promise<boolean> {
	try {
        const donnees = JSON.stringify(objectifs);
        	await AsyncStorage.setItem(OBJECTIVES_KEY, donnees);
            return true;
    } catch (error) {
        console.log(`erreur ${objectifs}`,error);
        return false;
    }
}
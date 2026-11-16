import AsyncStorage from '@react-native-async-storage/async-storage';

import type { Objective } from '@/types/goal';

const OBJECTIVES_KEY = '@goalapp/objectives';
// FONCTION POUR CREER UN ID UNIQUE POUR LES OBJECTIFS ET SOUS OBJCTIFS
export function creerIdUnique<T extends { id: string }>(elements: T[]): string {
	let id: string;
	do {
		id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
	} while (elements.some((element) => element.id === id));

	return id;
}
// FONCTION POUR CHARGER LES DONNER 
export async function chargerObjectifs(): Promise<Objective[]> {
	try {
		const donnees = await AsyncStorage.getItem(OBJECTIVES_KEY);
		if (!donnees) return [];

		const objectifs: Objective[] = JSON.parse(donnees);
		return objectifs.map((objectif) => ({
			...objectif,
			dueDate: new Date(objectif.dueDate),
		}));
	} catch (error) {
		console.error('Impossible de charger les objectifs', error);
		return [];
	}
}
// FONCTION POUR AJOUTER DES OBJECTIFS 
export async function sauvegarder(objectifs: Objective[]): Promise<boolean> {
	try {
 		const donnees = JSON.stringify(objectifs);
		await AsyncStorage.setItem(OBJECTIVES_KEY, donnees);
		return true;
	} catch (error) {
		console.error('Impossible de sauvegarder les objectifs', error);
		return false;
	}
}

// FONCTION POUR AJOUTER DES SOUS OBJECTIFS
import { initialCategories, initialObjectives } from '../data/initialData';
import { Pressable, StyleSheet } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { getProgress } from '@/utils/progress';
import { ProgressBar } from '@/components/ProgressBar';

type ObjectiveCardProps = {
  onObjectivePress?: (objectiveId: string) => void;
};

export default function ObjectiveCard({ onObjectivePress }: ObjectiveCardProps) {
  return (
    <>
      {initialObjectives.map((objective) => (
        <Pressable
          key={objective.id}
          onPress={() => onObjectivePress?.(objective.id)}
          accessibilityRole="button"
        >
          <ThemedView style={styles.card}>
           
            {/* CATEGORIE */}
            <ThemedText style={styles.themeText}>
              {initialCategories.find(
                (category) => category.id === objective.categoryId
              )?.name ?? 'Catégorie inconnue'}
            </ThemedText>

              {/* NOM DE L'OBJECTIF */}
            <ThemedText style={[styles.themeText, styles.title]}>
              {objective.name}
            </ThemedText>

            {/* DATE  */}
            <ThemedText style={styles.themeText}>
              {objective.dueDate.toLocaleDateString('fr-FR')}
            </ThemedText>
            <ProgressBar progress={getProgress(objective.subObjectives)} />
          </ThemedView>
          
        </Pressable>
      ))}
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    borderStyle: 'solid',
    borderWidth: 1,
    borderColor: '#2A2F3A',
    padding: 16,
    marginBottom: 12,
  },
  themeText: {
    marginBottom: 16,
    fontSize: 18,
  },
  title: {
    fontSize: 23,
    fontWeight: 'bold',
  },
});

import { useState } from 'react';
import { useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ProgressBar } from '@/components/ProgressBar';
import { AppButton } from '@/components/AppButton';
import { initialObjectives } from '@/data/initialData';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function ObjectiveDetailScreen() {
  const { objectiveId } = useLocalSearchParams<{ objectiveId: string }>();
  const objective = initialObjectives.find((item) => item.id === objectiveId);
  const [subObjectives, setSubObjectives] = useState(
    () => objective?.subObjectives ?? []
  );
  const [newSubObjectiveName, setNewSubObjectiveName] = useState('');
  const theme = useTheme();

  if (!objective) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText>Objectif introuvable</ThemedText>
      </ThemedView>
    );
  }

  function toggleSubObjective(subObjectiveId: string) {
    setSubObjectives((currentSubObjectives) =>
      currentSubObjectives.map((subObjective) =>
        subObjective.id === subObjectiveId
          ? { ...subObjective, completed: !subObjective.completed }
          : subObjective
      )
    );
  }

  function addSubObjective() {
    const name = newSubObjectiveName.trim();
    if (!name) {
      return;
    }

    setSubObjectives((currentSubObjectives) => [
      ...currentSubObjectives,
      {
        id: Date.now().toString(),
        name,
        completed: false,
      },
    ]);
    setNewSubObjectiveName('');
  }

  const completedCount = subObjectives.filter(
    (subObjective) => subObjective.completed
  ).length;
  const totalCount = subObjectives.length;
  const progress =
    totalCount === 0 ? 0 : Math.round((completedCount / totalCount) * 100);

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <ThemedText style={styles.title}>{objective.name}</ThemedText>

          <ThemedText style={[styles.dueDate, { color: theme.textSecondary }]}>
            Échéance : {objective.dueDate.toLocaleDateString('fr-FR')}
          </ThemedText>

          <ThemedView style={styles.progress}>
            <ProgressBar
              progress={progress}
              label={`${completedCount}/${totalCount} étapes terminées`}
            />
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Sous-objectifs
            </ThemedText>

            {subObjectives.length === 0 ? (
              <ThemedText themeColor="textSecondary">
                Aucun sous-objectif pour le moment.
              </ThemedText>
            ) : (
              subObjectives.map((subObjective) => (
                  <Pressable
                    key={subObjective.id}
                    onPress={() => toggleSubObjective(subObjective.id)}
                    style={[
                      styles.subObjectiveRow,
                      { borderBottomColor: theme.backgroundElement },
                    ]}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: subObjective.completed }}
                  >
                    <ThemedView
                      style={[
                        styles.checkbox,
                        subObjective.completed && styles.checkboxCompleted,
                      ]}
                    >
                      {subObjective.completed && (
                        <ThemedText style={styles.checkmark}>✓</ThemedText>
                      )}
                    </ThemedView>
                    <ThemedText
                      style={[
                        styles.subObjectiveName,
                        subObjective.completed && styles.completedText,
                      ]}
                    >
                      {subObjective.name}
                    </ThemedText>
                  </Pressable>
                ))
            )}

            <ThemedView style={styles.addSubObjectiveRow}>
              <TextInput
                value={newSubObjectiveName}
                onChangeText={setNewSubObjectiveName}
                placeholder="Nom du sous-objectif"
                placeholderTextColor={theme.textSecondary}
                returnKeyType="done"
                onSubmitEditing={addSubObjective}
                accessibilityLabel="Nom du nouveau sous-objectif"
                style={[
                  styles.input,
                  {
                    color: theme.text,
                    borderColor: theme.backgroundElement,
                  },
                ]}
              />
              <AppButton
                title="+"
                accessibilityLabel="Ajouter le sous-objectif"
                onPress={addSubObjective}
                style={styles.addButton}
              />
            </ThemedView>
          </ThemedView>

          <ThemedView style={styles.objectiveActions}>
            <AppButton
              title="Modifier l'objectif"
              variant="secondary"
              onPress={() => {}}
              style={styles.actionButton}
            />
            <AppButton
              title="Supprimer l'objectif"
              variant="danger"
              onPress={() => {}}
              style={styles.actionButton}
            />
          </ThemedView>
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.six,
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
  title: {
    fontSize: 34,
    lineHeight: 42,
    fontWeight: '700',
    textAlign: 'center',
  },
  dueDate: {
    marginTop: Spacing.two,
    fontSize: 16,
    textAlign: 'center',
  },
  progress: {
    marginTop: Spacing.four,
  },
  section: {
    marginTop: Spacing.five,
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: 24,
    lineHeight: 32,
    marginBottom: Spacing.one,
  },
  addSubObjectiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginTop: Spacing.two,
  },
  input: {
    flex: 1,
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
  },
  addButton: {
    width: 48,
    height: 48,
    padding: 0,
    justifyContent: 'center',
  },
  objectiveActions: {
    marginTop: Spacing.five,
    gap: Spacing.three,
  },
  actionButton: {
    minHeight: 48,
    justifyContent: 'center',
  },
  subObjectiveRow: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderBottomWidth: 1,
    paddingVertical: Spacing.two,
  },
  checkbox: {
    width: 26,
    height: 26,
    borderWidth: 2,
    borderColor: '#75609C',
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#75609C',
  },
  checkmark: {
    color: '#FFFFFF',
    fontSize: 18,
    lineHeight: 21,
    fontWeight: '700',
  },
  subObjectiveName: {
    flex: 1,
    fontSize: 16,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.65,
  },
});

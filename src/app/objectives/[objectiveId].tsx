import { useLocalSearchParams } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { ProgressBar } from '@/components/ProgressBar';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { initialObjectives } from '@/data/initialData';
import { useTheme } from '@/hooks/use-theme';

export default function ObjectiveDetailScreen() {
  const { objectiveId } = useLocalSearchParams<{ objectiveId: string }>();
  const objective = initialObjectives.find((item) => item.id === objectiveId);
  const [subObjectives, setSubObjectives] = useState(
    () => objective?.subObjectives ?? []
  );
  const [newSubObjectiveName, setNewSubObjectiveName] = useState('');
  const [editingSubObjectiveId, setEditingSubObjectiveId] = useState<string | null>(null);
  const [editedSubObjectiveName, setEditedSubObjectiveName] = useState('');
  const [deletingSubObjectiveId, setDeletingSubObjectiveId] = useState<string | null>(null);
  const theme = useTheme();

  if (!objective) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText>Objectif introuvable</ThemedText>
      </ThemedView>
    );
  }
  // fonction pour inverser l'etat de terminer a non terminer 
  function toggleSubObjective(subObjectiveId: string) {
    setSubObjectives((currentSubObjectives) =>
      currentSubObjectives.map((subObjective) =>
        subObjective.id === subObjectiveId
          ? { ...subObjective, completed: !subObjective.completed }
          : subObjective
      )
    );
  }
  // fonction pour ajouter un sous objectifs 
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
  // Pour modifier un sous objectifs
  function startEditingSubObjective(subObjectiveId: string, name: string) {
    setEditingSubObjectiveId(subObjectiveId);
    setEditedSubObjectiveName(name);
    setDeletingSubObjectiveId(null);
  }
  // Enregistre le nouveau nom du sous objectifs pour la modification 
  function saveSubObjective() {
    const name = editedSubObjectiveName.trim();
    if (!name || !editingSubObjectiveId) {
      return;
    }

    setSubObjectives((currentSubObjectives) =>
      currentSubObjectives.map((subObjective) =>
        subObjective.id === editingSubObjectiveId
          ? { ...subObjective, name }
          : subObjective
      )
    );
    setEditingSubObjectiveId(null);
    setEditedSubObjectiveName('');
  }
  // pour supprimer 
  function deleteSubObjective(subObjectiveId: string) {
    setSubObjectives((currentSubObjectives) =>
      currentSubObjectives.filter((subObjective) => subObjective.id !== subObjectiveId)
    );
    setDeletingSubObjectiveId(null);
  }
  // pour calculer la barre de progression 
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
          {/* Nom de l'objectifs  */}
          <ThemedText style={styles.title}>{objective.name}</ThemedText>
          {/* Date de l'objectifs  */}
          <ThemedText style={[styles.dueDate, { color: theme.textSecondary }]}>
            Échéance : {objective.dueDate.toLocaleDateString('fr-FR')}
          </ThemedText>
          {/* PROGRESS BAR */}
          <ThemedView style={styles.progress}>
            <ProgressBar
              progress={progress}
              label={`${completedCount}/${totalCount} étapes terminées`}
            />
          </ThemedView>
          {/* SOUS OBJECTIFS */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Sous-objectifs
            </ThemedText>

            {subObjectives.length === 0 ? (
              <ThemedText themeColor="textSecondary">
                Aucun sous-objectif pour le moment.
              </ThemedText>
            ) : (
              subObjectives.map((subObjective) => {
                const isEditing = editingSubObjectiveId === subObjective.id;
                const isDeleting = deletingSubObjectiveId === subObjective.id;

                return (
                  <View
                    key={subObjective.id}
                    style={[
                      styles.subObjectiveItem,
                      { borderBottomColor: theme.backgroundElement },
                    ]}
                  >
                    {isEditing ? (
                      <TextInput
                        value={editedSubObjectiveName}
                        onChangeText={setEditedSubObjectiveName}
                        onSubmitEditing={saveSubObjective}
                        returnKeyType="done"
                        accessibilityLabel="Modifier le nom du sous-objectif"
                        style={[
                          styles.editInput,
                          {
                            color: theme.text,
                            borderColor: theme.backgroundElement,
                          },
                        ]}
                      />
                    ) : (
                      <Pressable
                        onPress={() => toggleSubObjective(subObjective.id)}
                        style={styles.subObjectiveToggle}
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
                    )}

                    <View style={styles.subObjectiveActions}>
                      {isEditing ? (
                        <>
                          <AppButton
                            title="Enregistrer"
                            onPress={saveSubObjective}
                            style={styles.smallActionButton}
                          />
                          <AppButton
                            title="Annuler"
                            variant="secondary"
                            onPress={() => {
                              setEditingSubObjectiveId(null);
                              setEditedSubObjectiveName('');
                            }}
                            style={styles.smallActionButton}
                          />
                        </>
                      ) : isDeleting ? (
                        <>
                          <ThemedText
                            style={[styles.deleteConfirmation, { color: theme.textSecondary }]}
                          >
                            Supprimer ce sous-objectif ?
                          </ThemedText>
                          <AppButton
                            title="Confirmer"
                            variant="danger"
                            onPress={() => deleteSubObjective(subObjective.id)}
                            style={styles.smallActionButton}
                          />
                          <AppButton
                            title="Annuler"
                            variant="secondary"
                            onPress={() => setDeletingSubObjectiveId(null)}
                            style={styles.smallActionButton}
                          />
                        </>
                      ) : (
                        <>
                          <Pressable
                            onPress={() =>
                              startEditingSubObjective(subObjective.id, subObjective.name)
                            }
                            style={[styles.iconActionButton, styles.editIconButton]}
                            accessibilityRole="button"
                            accessibilityLabel="Modifier le sous-objectif"
                          >
                            <SymbolView
                              name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                              tintColor="#FFFFFF"
                              size={20}
                            />
                          </Pressable>
                          <Pressable
                            onPress={() => {
                              setDeletingSubObjectiveId(subObjective.id);
                              setEditingSubObjectiveId(null);
                            }}
                            style={[styles.iconActionButton, styles.deleteIconButton]}
                            accessibilityRole="button"
                            accessibilityLabel="Supprimer le sous-objectif"
                          >
                            <SymbolView
                              name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                              tintColor="#FFFFFF"
                              size={20}
                            />
                          </Pressable>
                        </>
                      )}
                    </View>
                  </View>
                );
              })
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
  subObjectiveItem: {
    gap: Spacing.two,
    borderBottomWidth: 1,
    paddingVertical: Spacing.two,
  },
  subObjectiveToggle: {
    minHeight: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
  },
  subObjectiveActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: Spacing.two,
  },
  smallActionButton: {
    minHeight: 40,
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    justifyContent: 'center',
  },
  iconActionButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editIconButton: {
    backgroundColor: '#64748B',
  },
  deleteIconButton: {
    backgroundColor: '#DC2626',
  },
  deleteConfirmation: {
    flexShrink: 1,
  },
  editInput: {
    minHeight: 48,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
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

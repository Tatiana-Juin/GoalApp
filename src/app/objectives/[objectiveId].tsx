import { useLocalSearchParams,useRouter } from 'expo-router';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, TextInput, View, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useObjectives } from '@/hooks/use-objectives';
import { useTheme } from '@/hooks/use-theme';
import { useState } from 'react';
import { ProgressBar } from '@/components/ProgressBar';
import { getProgress } from '@/utils/progress';
import { SymbolView } from 'expo-symbols';

export default function ObjectiveDetailScreen() {
  const { objectiveId } = useLocalSearchParams<{ objectiveId: string }>();
  const { objectives, loading,deleteObjective,addSubObjective,subObjectiveValide } = useObjectives();
  const objective = objectives.find((item) => item.id === objectiveId);
  const theme = useTheme();
   const router = useRouter();

  //  Pour le nom
  const [name,setName]= useState<string>('');
  const [nameError,setNameError]= useState<string>("");
  const [saveError, setSaveError] = useState('');
  const [saving, setSaving] = useState(false);

  const [editingSubObjectiveId, setEditingSubObjectiveId] = useState<string | null>(null);
  const [editedSubObjectiveName, setEditedSubObjectiveName] = useState('');

  if (loading) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText>Chargement de l’objectif...</ThemedText>
      </ThemedView>
    );
  }

  if (!objective) {
    return (
      <ThemedView style={styles.notFound}>
        <ThemedText>Objectif introuvable</ThemedText>
      </ThemedView>
    );
  }

async function supprimerEtRetourner(objectiveId: string) {
  const deleted = await deleteObjective(objectiveId);
  if (deleted) {
    router.back();
  }
}
  function confirmationDelete(index:string){
    const message = "Voulez vous vraiment supprimer cette objective ?";

    // SI C EST SUR PC 
     if (Platform.OS === 'web') {
      if (globalThis.confirm(message)) {
        // recupere pas le resultat
        void supprimerEtRetourner(objectiveId);
      }
      return;
    }
     Alert.alert('Supprimer la note ?', message, [
      { text: 'Annuler', style: 'cancel' },
      {
        text: 'Supprimer',
        style: 'destructive',
        // void => on veux pas que ca retourne quelque chose 
        onPress: () => 
          void supprimerEtRetourner(objectiveId)
        ,
      },
      
    ]);
  }

  async function handleCreateSubObjective(){
    if (!objective) return;
    const nameSubObjective = name.trim();
    setNameError('');
    setSaveError('');
    // Si le nom du sous objectifs est vide
    if(!nameSubObjective){
      setNameError("Saisis le nom d'un sous objectifs.");
      return;
    }
    if (loading || saving) return;
    setSaving(true);

    try{
      const saved = await addSubObjective(objective.id,nameSubObjective);
        if (!saved) {
            setSaveError('La sauvegarde a échoué. Réessaie.');
            return;
        }
        setName('');
    } catch(error){
      console.error('Erreur lors de la création du sous objectifs', error);
      setSaveError('Une erreur est survenue. Réessaie.');
    } finally{
       setSaving(false);
    }
  }
  

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.content}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
          {/* Nom de l'objectifs  */}
          <ThemedText style={styles.title}>{objective.name}</ThemedText>
          {/* Date de l'objectifs  */}
          <ThemedText style={[styles.dueDate, { color: theme.textSecondary }]}>
            Échéance : {objective.dueDate.toLocaleDateString('fr-FR')}
          </ThemedText>
          {/* Pour la barre de progression d'un objectifs */}
          <ProgressBar progress={getProgress(objective.subObjectives ?? [])} />

          {/* SOUS OBJECTIFS */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Sous-objectifs
            </ThemedText>

            {!objective.subObjectives?.length ? (
              <ThemedText themeColor="textSecondary">
                Aucun sous-objectif pour le moment.
              </ThemedText>
            ) : (
              objective.subObjectives.map((subObjective) => (
                <View
                  key={subObjective.id}
                  style={[
                    styles.subObjectiveRow,
                    { borderBottomColor: theme.backgroundElement },
                  ]}
                >
                  {/* Condition pour afficher le input du sous objectifs */}
                  {editingSubObjectiveId === subObjective.id ? (
                    <>
                      <TextInput
                        value={editedSubObjectiveName}
                        onChangeText={setEditedSubObjectiveName}
                        accessibilityLabel="Modifier le nom du sous-objectif"
                        style={[
                          styles.input,
                          {
                            color: theme.text,
                            borderColor: theme.backgroundElement,
                          },
                        ]}
                      />
                    {/* Pour le bouton +  */}
                      <AppButton
                        title="modifier"
                        variant="danger"
                        onPress={() => {}}
                        style={styles.actionButton}
                      />
                      <AppButton
                        title="annuler"
                        variant="secondary"
                        onPress={() => setEditingSubObjectiveId(null)}
                        style={styles.actionButton}
                      />
                    </>
                    
                  ) : (
                    <>
                  {/* Pour la case a cocher */}
                  <Pressable
                    style={[
                      styles.checkbox,
                      subObjective.completed && styles.checkboxCompleted,
                    ]}
                    onPress={()=>subObjectiveValide(objective.id,subObjective.id)}
                    accessibilityRole="checkbox"
                    accessibilityState={{ checked: subObjective.completed }}
                  >
                    {subObjective.completed && (
                      <ThemedText style={styles.checkmark}>✓</ThemedText>
                    )}
                  </Pressable>
                  {/* Nom du sous objectifs */}
                  <ThemedText
                    style={[
                      styles.subObjectiveName,
                      subObjective.completed && styles.completedText,
                    ]}
                  >
                    {subObjective.name}
                  </ThemedText>
                   {/* Bouton modifier sous objectifs  */}
                  <Pressable
                    onPress={() => {
                      setEditingSubObjectiveId(subObjective.id);
                      setEditedSubObjectiveName(subObjective.name);
                    }}
                    style={[styles.subObjectiveIconButton, styles.editSubObjectiveButton]}
                    accessibilityRole="button"
                    accessibilityLabel="Modifier le sous-objectif"
                  >
                    <SymbolView
                      name={{ ios: 'pencil', android: 'edit', web: 'edit' }}
                      size={20}
                      tintColor="#FFFFFF"
                    />
                  </Pressable>
                  {/* Bouton supprimer sous objectifs  */}
                  <Pressable
                    onPress={() => {}}
                    style={[styles.subObjectiveIconButton, styles.deleteSubObjectiveButton]}
                    accessibilityRole="button"
                    accessibilityLabel="Supprimer le sous-objectif"
                  >
                    <SymbolView
                      name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                      size={20}
                      tintColor="#FFFFFF"
                    />
                  </Pressable>
                  </>
                  )}
                </View>
              ))
            )}

            <View style={styles.addSubObjectiveRow}>
              <TextInput
                placeholder="Nom du sous-objectif"
                placeholderTextColor={theme.textSecondary}
                value={name}
                onChangeText={(value) => {
                  setName(value);
                  if (value.trim()) setNameError('');
                }}
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
                accessibilityLabel="Ajouter un sous-objectif"
                onPress={handleCreateSubObjective}
                style={styles.addButton}
              />
            </View>
            {nameError !== '' && (
              <ThemedText style={styles.errorText}>{nameError}</ThemedText>
            )}
            {saveError !== '' && (
              <ThemedText style={styles.errorText}>{saveError}</ThemedText>
            )}
          </ThemedView>

          <ThemedView style={styles.objectiveActions}>
            {/* MODIFIER OBJETIVE */}
            <AppButton
              title="Modifier l'objectif"
              variant="secondary"
              onPress={() =>
                router.push({
                  pathname:'/objectives/edit-objective',
                  params:{objectiveId:objective.id}
                })
              }
              style={styles.actionButton}
            />
            {/* SUPPRIMER OBJECTIVE */}
            <AppButton
              title="Supprimer l'objectif"
              variant="danger"
              onPress={() => confirmationDelete(objective.id)}
              style={styles.actionButton}
            />
          </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
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
  keyboardAvoidingView: {
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
  subObjectiveIconButton: {
    width: 44,
    height: 44,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editSubObjectiveButton: {
    backgroundColor: '#64748B',
  },
  deleteSubObjectiveButton: {
    backgroundColor: '#DC2626',
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
  errorText: {
        color: '#DC2626',
        marginBottom: 16,
    },
});

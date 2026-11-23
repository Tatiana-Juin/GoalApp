import { useLocalSearchParams,useRouter } from 'expo-router';
import { KeyboardAvoidingView, Pressable, ScrollView, StyleSheet, TextInput, View, Alert, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ActionColors, FontSizes, FontWeights, Radii, Spacing } from '@/constants/theme';
import { formStyles } from '@/constants/form-styles';
import { layoutStyles } from '@/constants/layout-styles';
import { useObjectives } from '@/hooks/use-objectives';
import { useTheme } from '@/hooks/use-theme';
import { useState } from 'react';
import { ProgressBar } from '@/components/ProgressBar';
import { getProgress } from '@/utils/progress';
import { SymbolView } from 'expo-symbols';

export default function ObjectiveDetailScreen() {
  const { objectiveId } = useLocalSearchParams<{ objectiveId: string }>();
  const { objectives, loading,deleteObjective,addSubObjective,subObjectiveValide,updatedSubObjective,deleteSubObjective } = useObjectives();
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
      <ThemedView style={formStyles.notFound}>
        <ThemedText>Chargement de l’objectif...</ThemedText>
      </ThemedView>
    );
  }

  if (!objective) {
    return (
      <ThemedView style={formStyles.notFound}>
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
// POUR SUPPRIMER UN OBJECTIVES NOTIFICATION
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

  // POUR L'AJOUT D'UN SOUS OBJECTIVE 
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

  // POUR LA MODIFICATION 
  async function handleUpdateSubObjective(){
    // si objective existe pas ou que id est egale a null 
    if (!objective || editingSubObjectiveId === null) return;
    const nameSubObjective = editedSubObjectiveName .trim();
    if(!nameSubObjective){
      setNameError("Saisis le nom d'un sous objectifs.");
      return;
    }
    if (loading || saving) return;
    setSaving(true);

    try{
      const saved = await updatedSubObjective(objective.id,editingSubObjectiveId,nameSubObjective);
       if (!saved) {
            setSaveError('La sauvegarde a échoué. Réessaie.');
            return;
        }
        setEditedSubObjectiveName('');
        setEditingSubObjectiveId(null);
    } catch(error){
      console.error("Erreur lors de la modification d'un sous objectifs", error);
      setSaveError('Une erreur est survenue. Réessaie.');
    }finally{
      setSaving(false);
    }

  }
  // VERIFICATION POUR SUPPRIMER UN SOUS OBJECTIVES
async function handleDeleteSubObjective(subObjectiveId: string) {
    if (!objective || loading || saving) return;
    setSaveError('');
    setSaving(true);

    try {
      const deleted = await deleteSubObjective(objective.id, subObjectiveId);
      if (!deleted) {
        setSaveError('La suppression du sous-objectif a échoué. Réessaie.');
      }
    } catch (error) {
      console.error('Erreur lors de la suppression du sous-objectif', error);
      setSaveError('Une erreur est survenue pendant la suppression. Réessaie.');
    } finally {
      setSaving(false);
    }
  }

// NOTIFICATION POUR SUPPRIMER UN SOUS OBJECTIVE
function confirmDeleteSubObjective(subObjectiveId: string, subObjectiveName: string) {
    const message = `Voulez-vous vraiment supprimer le sous-objectif « ${subObjectiveName} » ?`;
    const confirmDeletion = () => {
      void handleDeleteSubObjective(subObjectiveId);
    };

    if (Platform.OS === 'web') {
      if (globalThis.confirm(message)) confirmDeletion();
      return;
    }

    Alert.alert('Supprimer le sous-objectif ?', message, [
      { text: 'Annuler', style: 'cancel' },
      { text: 'Supprimer', style: 'destructive', onPress: confirmDeletion },
    ]);
  }

  // FUNCTION POUR AFFICHER UN MESSAGE DE FELICITATIONS SI TU VIENS DE COCHER LA DERNIERE CASE A COCHER
  async function handleSubObjectiveToggle(subObjectiveId: string) {
    if (!objective || loading || saving) return;
    const subObjectives = objective.subObjectives ?? [];
    const subObjective = subObjectives.find((item) => item.id === subObjectiveId);
    if (!subObjective) return;

    const completesObjective =
      !subObjective.completed &&
      subObjectives.every(
        (item) => item.id === subObjectiveId || item.completed
      );

    setSaveError('');
    setSaving(true);
    try {
      const saved = await subObjectiveValide(objective.id, subObjectiveId);
      if (!saved) {
        setSaveError('La sauvegarde a échoué. Réessaie.');
        return;
      }

      if (completesObjective) {
        const message = 'Félicitations, tu as atteint ton objectif !';
        if (Platform.OS === 'web') {
          globalThis.alert(message);
          router.replace('/');
        } else {
          Alert.alert('Félicitations !', message, [
            { text: 'OK', onPress: () => router.replace('/') },
          ]);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du sous-objectif', error);
      setSaveError('Une erreur est survenue. Réessaie.');
    } finally {
      setSaving(false);
    }
  }
  
  return (
    <ThemedView style={layoutStyles.flexFill}>
    <SafeAreaView style={layoutStyles.flexFill} edges={['bottom']}>
        <KeyboardAvoidingView
        style={layoutStyles.flexFill}
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
                          layoutStyles.flexFill,
                          formStyles.inputBase,
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
                        onPress={() => void handleUpdateSubObjective()}
                        style={formStyles.actionButton}
                      />
                      <AppButton
                        title="annuler"
                        variant="secondary"
                        onPress={() => setEditingSubObjectiveId(null)}
                        style={formStyles.actionButton}
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
                    onPress={() => void handleSubObjectiveToggle(subObjective.id)}
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
                      layoutStyles.flexFill,
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
                      tintColor={ActionColors.onAction}
                    />
                  </Pressable>
                  {/* Bouton supprimer sous objectifs  */}
                  <Pressable
                    onPress={() => confirmDeleteSubObjective(subObjective.id, subObjective.name)}
                    style={[styles.subObjectiveIconButton, styles.deleteSubObjectiveButton]}
                    accessibilityRole="button"
                    accessibilityLabel="Supprimer le sous-objectif"
                  >
                    <SymbolView
                      name={{ ios: 'trash', android: 'delete', web: 'delete' }}
                      size={20}
                      tintColor={ActionColors.onAction}
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
                  formStyles.inputBase,
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
              <ThemedText style={formStyles.errorText}>{nameError}</ThemedText>
            )}
            {saveError !== '' && (
              <ThemedText style={formStyles.errorText}>{saveError}</ThemedText>
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
              style={formStyles.actionButton}
            />
            {/* SUPPRIMER OBJECTIVE */}
            <AppButton
              title="Supprimer l'objectif"
              variant="danger"
              onPress={() => confirmationDelete(objective.id)}
              style={formStyles.actionButton}
            />
          </ThemedView>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.six,
  },
  title: {
    fontSize: FontSizes.detailTitle,
    lineHeight: 42,
    fontWeight: FontWeights.bold,
    textAlign: 'center',
  },
  dueDate: {
    marginTop: Spacing.two,
    fontSize: FontSizes.body,
    textAlign: 'center',
  },
  section: {
    marginTop: Spacing.five,
    gap: Spacing.two,
  },
  sectionTitle: {
    fontSize: FontSizes.sectionTitle,
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
    minHeight: 48,
    paddingHorizontal: Spacing.three,
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
  subObjectiveIconButton: {
    width: 44,
    height: 44,
    borderRadius: Radii.control,
    alignItems: 'center',
    justifyContent: 'center',
  },
  editSubObjectiveButton: {
    backgroundColor: ActionColors.secondary,
  },
  deleteSubObjectiveButton: {
    backgroundColor: ActionColors.danger,
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
    borderColor: ActionColors.primary,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: ActionColors.primary,
  },
  checkmark: {
    color: ActionColors.onAction,
    fontSize: FontSizes.largeBody,
    lineHeight: 21,
    fontWeight: FontWeights.bold,
  },
  subObjectiveName: {
    fontSize: FontSizes.body,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.65,
  },
});

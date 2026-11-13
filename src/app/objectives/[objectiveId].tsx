import { useLocalSearchParams,useRouter } from 'expo-router';
import { ScrollView, StyleSheet, TextInput, View,Alert,Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useObjectives } from '@/hooks/use-objectives';
import { useTheme } from '@/hooks/use-theme';



export default function ObjectiveDetailScreen() {
  const { objectiveId } = useLocalSearchParams<{ objectiveId: string }>();
  const { objectives, loading,deleteObjective } = useObjectives();
  const objective = objectives.find((item) => item.id === objectiveId);
  const theme = useTheme();
   const router = useRouter();

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
          {/* SOUS OBJECTIFS */}
          <ThemedView style={styles.section}>
            <ThemedText type="subtitle" style={styles.sectionTitle}>
              Sous-objectifs
            </ThemedText>

            <View style={styles.addSubObjectiveRow}>
              <TextInput
                placeholder="Nom du sous-objectif"
                placeholderTextColor={theme.textSecondary}
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
                onPress={() => {}}
                style={styles.addButton}
              />
            </View>
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

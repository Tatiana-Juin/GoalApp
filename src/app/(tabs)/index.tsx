import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import ObjectiveCard from '@/components/ObjectiveCard';
import { ObjectiveStorageError } from '@/components/ObjectiveStorageError';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { layoutStyles } from '@/constants/layout-styles';
import { useObjectives } from '@/hooks/use-objectives';
import { isObjectiveCompleted } from '@/utils/progress';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  // ROUTEUR 
  const router = useRouter();
  // lit les objectifs 
  const { objectives, loading, loadError, retryLoading } = useObjectives();
  const activeObjectives = objectives.filter(
    (objective) => !isObjectiveCompleted(objective)
  );
  return (
    <ThemedView style={[layoutStyles.flexFill, styles.container]}>
      {/* garde le contenu dans la zone visible */}
      <SafeAreaView
        style={[layoutStyles.flexFill, layoutStyles.centeredItems, styles.safeArea]}
      >
        {/* choisi automatiquement le style en fonction de la couleur de fond  */}
        <ThemedView style={styles.heroSection}>
          {/* texte s'adapte a la couleur de fond */}
          <ThemedText type="title" style={layoutStyles.centeredText}>
            Objectifs en cours
          </ThemedText>
        </ThemedView>
        
        {/* POUR TOUT LES OBJECTIFS */}
        <ScrollView
          style={[layoutStyles.flexFill, styles.objectivesScroll]}
          // regle le contenu qu'il defile dans le scrollview
          contentContainerStyle={[layoutStyles.listContentBase, styles.stepContainer]}
          showsVerticalScrollIndicator
        >
          {loading ? (
            // au moment du chargement 
            <ThemedText>Chargement des objectifs...</ThemedText>
          ) : loadError ? (
            <ObjectiveStorageError onRetry={retryLoading} />
          ) : objectives.length === 0 ? (
            <ThemedText themeColor="textSecondary">
              Aucun objectif pour le moment.
            </ThemedText>
          ) : activeObjectives.length === 0 ? (
            <ThemedText themeColor="textSecondary">
              Tous tes objectifs sont terminés !
            </ThemedText>
          ) : (
            <ObjectiveCard
              objectives={activeObjectives}
              onObjectivePress={(objectiveId) =>
                router.push({
                  pathname: '/objectives/[objectiveId]',
                  params: { objectiveId },
                })
              }
            />
          )}
        </ScrollView>
        {!loading && !loadError && (
          <AppButton
            title="+"
            variant="primary"
            accessibilityLabel="Ajouter un objectif"
            style={styles.floatingButton}
            onPress={() => router.push('/objectives/new-objective')}
          />
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
  },
  objectivesScroll: {
    alignSelf: 'stretch',
  },
  floatingButton: {
    position: 'absolute',
    right: Spacing.four,
    bottom: Spacing.three,
    width: 56,
    height: 56,
    padding: 0,
    borderRadius: 28,
    justifyContent: 'center',
    zIndex: 1,
    elevation: 6,
  },
 heroSection: {
  alignSelf: 'stretch',
  alignItems: 'center',
  justifyContent: 'flex-start',
  paddingTop: Spacing.three,
  paddingHorizontal: Spacing.four,
},
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },

});

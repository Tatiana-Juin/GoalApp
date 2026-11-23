import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import ObjectiveCard from '@/components/ObjectiveCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { layoutStyles } from '@/constants/layout-styles';
import { useObjectives } from '@/hooks/use-objectives';
import { isObjectiveCompleted } from '@/utils/progress';

export default function CompletedObjectivesScreen() {
  const router = useRouter();
  const { objectives, loading } = useObjectives();
  const completedObjectives = objectives.filter(isObjectiveCompleted);

  return (
    <ThemedView style={layoutStyles.flexFill}>
      <SafeAreaView
        style={[layoutStyles.flexFill, layoutStyles.centeredItems, styles.safeArea]}
      >
        <ScrollView
          style={[layoutStyles.flexFill, styles.scroll]}
          contentContainerStyle={[layoutStyles.listContentBase, styles.content]}
          showsVerticalScrollIndicator
        >
          <ThemedText type="subtitle" style={layoutStyles.centeredText}>
            Objectifs terminés
          </ThemedText>
          {loading ? (
            <ThemedText>Chargement des objectifs...</ThemedText>
          ) : completedObjectives.length === 0 ? (
            <ThemedText themeColor="textSecondary">
              Aucun objectif terminé pour le moment.
            </ThemedText>
          ) : (
            <ObjectiveCard
              objectives={completedObjectives}
              onObjectivePress={(objectiveId) =>
                router.push({
                  pathname: '/objectives/[objectiveId]',
                  params: { objectiveId },
                })
              }
            />
          )}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    width: '100%',
  },
  scroll: {
    alignSelf: 'stretch',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
  },
});

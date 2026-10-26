import * as Device from 'expo-device';
import { Platform, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import ObjectiveCard from '@/components/ObjectiveCard';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing } from '@/constants/theme';
import { useRouter } from 'expo-router';

function getDevMenuHint() {
  if (Platform.OS === 'web') {
    return <ThemedText type="small">use browser devtools</ThemedText>;
  }
  if (Device.isDevice) {
    return (
      <ThemedText type="small">
        shake device or press <ThemedText type="code">m</ThemedText> in terminal
      </ThemedText>
    );
  }
  const shortcut = Platform.OS === 'android' ? 'cmd+m (or ctrl+m)' : 'cmd+d';
  return (
    <ThemedText type="small">
      press <ThemedText type="code">{shortcut}</ThemedText>
    </ThemedText>
  );
}

export default function HomeScreen() {
  const router = useRouter();
  return (
    <ThemedView style={styles.container}>
      {/* garde le contenu dans la zone visible */}
      <SafeAreaView style={styles.safeArea}>
        {/* choisi automatiquement le style en fonction de la couleur de fond  */}
        <ThemedView style={styles.heroSection}>
          {/* texte s'adapte a la couleur de fond */}
          <ThemedText type="title" style={styles.title}>
            Tous les objectifs
          </ThemedText>
        </ThemedView>
        
        {/* POUR TOUT LES OBJECTIFS */}
        <ScrollView
          style={styles.objectivesScroll}
          // regle le contenu qu'il defile dans le scrollview
          contentContainerStyle={styles.stepContainer}
          showsVerticalScrollIndicator
        >
          <ObjectiveCard 
            onObjectivePress={(objectiveId)=>
              router.push({
                pathname:'/objectives/[objectiveId]',
                params:{objectiveId}
              })
            }
          />
        </ScrollView>
        <AppButton
          title="+"
          variant="primary"
          accessibilityLabel="Ajouter un objectif"
          style={styles.floatingButton}
          onPress={() => router.push('/objectives/new-objective')}
        />
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    gap: Spacing.three,
    maxWidth: MaxContentWidth,
  },
  objectivesScroll: {
    flex: 1,
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
  title: {
    textAlign: 'center',
  },
  code: {
    textTransform: 'uppercase',
  },
  stepContainer: {
    gap: Spacing.three,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.four,
    paddingBottom: BottomTabInset + Spacing.three,
    alignItems: 'stretch',
  },

});

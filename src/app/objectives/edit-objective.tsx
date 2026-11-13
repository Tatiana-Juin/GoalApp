import { ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export default function EditObjectiveScreen() {
  const theme = useTheme();
  const fieldStyle = {
    backgroundColor: theme.backgroundElement,
    borderColor: theme.textSecondary,
  };

  return (
    <ThemedView style={styles.screen}>
      <SafeAreaView style={styles.safeArea} edges={['bottom']}>
        <ScrollView
          contentContainerStyle={styles.content}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <ThemedText style={styles.title}>Modifier l’objectif</ThemedText>
          <ThemedText style={[styles.subtitle, { color: theme.textSecondary }]}>
            Mets à jour les informations de ton objectif.
          </ThemedText>

          <ThemedText style={styles.label}>Nom de l’objectif</ThemedText>
          <TextInput
            style={[styles.input, fieldStyle, { color: theme.text }]}
            placeholder="Ex. : apprendre React"
            placeholderTextColor={theme.textSecondary}
            accessibilityLabel="Nom de l’objectif"
          />

          <ThemedText style={styles.label}>Date d’échéance</ThemedText>
          <View
            style={[
              styles.dateField,
              fieldStyle,
            ]}
            accessibilityLabel="Date d’échéance"
          >
            <ThemedText style={{ color: theme.textSecondary }}>
              Choisir une date
            </ThemedText>
            <ThemedText style={styles.dateAction}>Calendrier</ThemedText>
          </View>

          <View style={styles.actions}>
            <AppButton
              title="Enregistrer les modifications"
              onPress={() => {}}
              style={styles.actionButton}
            />
            <AppButton
              title="Annuler"
              variant="secondary"
              onPress={() => {}}
              style={styles.actionButton}
            />
          </View>
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
    flexGrow: 1,
    padding: Spacing.four,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: Spacing.two,
  },
  subtitle: {
    fontSize: 16,
    marginBottom: Spacing.five,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: Spacing.two,
  },
  input: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    fontSize: 16,
    marginBottom: Spacing.four,
  },
  dateField: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: Spacing.three,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.two,
    marginBottom: Spacing.five,
  },
  dateAction: {
    color: '#75609C',
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    gap: Spacing.three,
    marginTop: Spacing.two,
  },
  actionButton: {
    minHeight: 48,
    justifyContent: 'center',
  },
});

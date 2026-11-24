import { AppButton } from '@/components/AppButton';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { formStyles } from '@/constants/form-styles';

type ObjectiveStorageErrorProps = {
  onRetry: () => void;
};

export function ObjectiveStorageError({ onRetry }: ObjectiveStorageErrorProps) {
  return (
    <ThemedView style={formStyles.notFound}>
      <ThemedText style={formStyles.errorText}>
        Impossible de charger tes objectifs. Aucune modification ne sera enregistrée tant que les
        données ne sont pas accessibles.
      </ThemedText>
      <AppButton title="Réessayer" onPress={onRetry} accessibilityLabel="Réessayer le chargement" />
    </ThemedView>
  );
}

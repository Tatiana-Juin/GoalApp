import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { ActionColors, Colors, Radii } from '@/constants/theme';
type ProgressBarProps = {
  progress: number;
  label?: string;
};

export function ProgressBar({ progress, label }: ProgressBarProps) {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <ThemedView>
      <ThemedText style={styles.label}>
        {label ?? `${clampedProgress}% terminé`}
      </ThemedText>
      <ThemedView
        style={styles.track}
        accessible
        accessibilityRole="progressbar"
        accessibilityValue={{ min: 0, max: 100, now: clampedProgress }}
      >
        <ThemedView style={[styles.fill, { width: `${clampedProgress}%` }]} />
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  label: {
    marginBottom: 6,
  },
  track: {
    height: 10,
    backgroundColor: Colors.light.backgroundSelected,
    borderRadius: Radii.progress,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: ActionColors.primary,
    borderRadius: Radii.progress,
  },
});

import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
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
    backgroundColor: '#E0E1E6',
    borderRadius: 5,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    backgroundColor: '#75609C',
    borderRadius: 5,
  },
});

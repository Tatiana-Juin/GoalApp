import {
  Pressable,
  StyleSheet,
  Text,
  type StyleProp,
  type ViewStyle,
} from 'react-native';
import { ActionColors } from '@/constants/theme';

type AppButtonProps = {
  title: string;
  variant?: 'primary' | 'secondary' | 'danger';
  onPress: () => void;
  style?: StyleProp<ViewStyle>;
  accessibilityLabel?: string;
};

export function AppButton({
  title,
  variant = 'primary',
  onPress,
  style,
  accessibilityLabel,
}: AppButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={[styles.button, styles[variant], style]}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title}
    >
      <Text style={styles.text}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  primary: {
    backgroundColor: ActionColors.primary,
  },
  secondary: {
    backgroundColor: ActionColors.secondary,
  },
  danger: {
    backgroundColor: ActionColors.danger,
  },
  text: {
    color: ActionColors.onAction,
    fontWeight: 'bold',
  },
});
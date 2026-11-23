import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, FontSizes, FontWeights, ThemeColor } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && styles.linkPrimary,
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: {
    fontSize: FontSizes.caption,
    lineHeight: 20,
    fontWeight: FontWeights.regular,
  },
  smallBold: {
    fontSize: FontSizes.caption,
    lineHeight: 20,
    fontWeight: FontWeights.bold,
  },
  default: {
    fontSize: FontSizes.body,
    lineHeight: 24,
    fontWeight: FontWeights.regular,
  },
  title: {
    fontSize: 48,
    fontWeight: FontWeights.semibold,
    lineHeight: 52,
  },
  subtitle: {
    fontSize: 32,
    lineHeight: 44,
    fontWeight: FontWeights.semibold,
  },
  link: {
    lineHeight: 30,
    fontSize: FontSizes.caption,
  },
  linkPrimary: {
    lineHeight: 30,
    fontSize: FontSizes.caption,
    color: '#3c87f7',
  },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});

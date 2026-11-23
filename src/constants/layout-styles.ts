import { StyleSheet } from 'react-native';

import { Spacing } from '@/constants/theme';

export const layoutStyles = StyleSheet.create({
  flexFill: {
    flex: 1,
  },
  listContentBase: {
    gap: Spacing.three,
    alignItems: 'stretch',
  },
  centeredItems: {
    alignItems: 'center',
  },
  centeredText: {
    textAlign: 'center',
  },
});

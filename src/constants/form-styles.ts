import { StyleSheet } from 'react-native';

import { ActionColors, Spacing } from '@/constants/theme';

export const formStyles = StyleSheet.create({
  inputBase: {
    borderWidth: 1,
    borderRadius: 8,
    fontSize: 16,
  },
  dateFieldBase: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateAction: {
    fontSize: 14,
    fontWeight: '600',
  },
  errorText: {
    color: ActionColors.danger,
    marginBottom: Spacing.three,
  },
  actionButton: {
    minHeight: 48,
    justifyContent: 'center',
  },
  notFound: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.four,
  },
});

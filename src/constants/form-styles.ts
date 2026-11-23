import { StyleSheet } from 'react-native';

import {
  ActionColors,
  FontSizes,
  FontWeights,
  Radii,
  Spacing,
} from '@/constants/theme';

export const formStyles = StyleSheet.create({
  formTitle: {
    fontSize: FontSizes.formTitle,
    fontWeight: FontWeights.bold,
  },
  formLabel: {
    fontSize: FontSizes.body,
    fontWeight: FontWeights.semibold,
    marginBottom: Spacing.two,
  },
  inputBase: {
    borderWidth: 1,
    borderRadius: Radii.control,
    fontSize: FontSizes.body,
  },
  objectiveInput: {
    minHeight: 52,
    marginBottom: Spacing.four,
  },
  dateFieldBase: {
    minHeight: 52,
    borderWidth: 1,
    borderRadius: Radii.control,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dateAction: {
    fontSize: FontSizes.caption,
    fontWeight: FontWeights.semibold,
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

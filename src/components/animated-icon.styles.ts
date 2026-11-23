import { StyleSheet } from 'react-native';

const ICON_SIZE = 128;
const GLOW_SIZE = 201;

export const animatedIconStyles = StyleSheet.create({
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  glow: {
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    position: 'absolute',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: ICON_SIZE,
    height: ICON_SIZE,
  },
  image: {
    width: 76,
    height: 71,
  },
  background: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 40,
    position: 'absolute',
  },
});

import { useSyncExternalStore } from 'react';
import { Appearance } from 'react-native';

function subscribe(onStoreChange: () => void) {
  const subscription = Appearance.addChangeListener(onStoreChange);
  return () => subscription.remove();
}

function getSnapshot() {
  return Appearance.getColorScheme() ?? 'light';
}

function getServerSnapshot() {
  return 'light';
}

export function useColorScheme() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

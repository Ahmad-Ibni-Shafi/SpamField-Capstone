import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'spamshield-app-state';

export async function loadAppState() {
  const storedState = await AsyncStorage.getItem(STORAGE_KEY);
  return storedState ? JSON.parse(storedState) : null;
}

export async function saveAppState(state) {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

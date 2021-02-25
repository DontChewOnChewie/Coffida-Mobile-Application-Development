import AsyncStorage from '@react-native-async-storage/async-storage';

const credentialsKey = '@user_credentials';

// Get users current credentials using defined key.
const getCredentials = async () => {
  try {
    const credentials = await AsyncStorage.getItem(credentialsKey);
    if (credentials !== null) return credentials;
    return null;
  } catch (error) { return null; }
};

// Store users credentials using defined key.
const storeCredentials = async (creds) => {
  if (creds === undefined) return; // If falied to sign in.
  try {
    await AsyncStorage.setItem(credentialsKey, JSON.stringify(creds));
  } catch (error) { /* Something went wrong with saving details. */ }
};

// Remove current users credentials using defined key.
const removeCredentials = async () => {
  try {
    await AsyncStorage.removeItem(credentialsKey);
  } catch (error) { /* Error */ }
};

export default { getCredentials, storeCredentials, removeCredentials };

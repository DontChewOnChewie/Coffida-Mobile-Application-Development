import AsyncStorage from '@react-native-async-storage/async-storage';

const credentialsKey = "@user_credentials"; 

const get_credentials = async () => {
    try {
        const credentials = await AsyncStorage.getItem(credentialsKey);
        if (credentials !== null) return credentials;
        else return null;
    } catch (error) { /* Error Occured */ }
};   

const store_credentials = async (creds) => {
    if (creds == undefined) return; // If falied to sign in.
    try { await AsyncStorage.setItem(credentialsKey, JSON.stringify(creds)); }
    catch (error) { /* Something went wrong with saving details. */ }
};

const remove_credentials = async () => {
    try { await AsyncStorage.removeItem(credentialsKey); }
    catch (error) { console.log(error) }
}

export default { get_credentials, store_credentials, remove_credentials };
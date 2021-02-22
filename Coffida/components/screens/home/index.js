import React, {useState, useEffect } from 'react';
import {View, FlatList, StatusBar} from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import styles from './styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import LocationObject from '../../LocationObject';

const Home = ({navigation}) => {
    const [hasNotch, setHasNotch] = useState(0);
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);

    useEffect( () => {
        const get_shop_data = async () => {
            try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
            catch (error) { console.log("error"); return; /* Catch for if no token stored. */ }

            setLoading(true);
    
            fetch(`http://10.0.2.2:3333/api/1.0.0/find`, {
                method : "get",
                headers: {
                    'Content-Type': "application/json",
                    "X-Authorization": token
                },
            })
            .then( (res) => {
            if (res.status == 200) {
                return res.json();
            }
            else console.log("Something went wrong with the status.");
            })
            .then( (data) => {
                setLocations(data);
                setLoading(false);
            })
            .catch( (message) => { console.log("ERROR " + message); });
        }

        get_shop_data();
        setHasNotch(StatusBar.currentHeight);
        const unsubscribe = navigation.addListener('focus', () => {
            get_shop_data();
        });
    }, []);

    if (loading) {
        return (
            <View
            accessible={true}
            accessibilityLabel="Page loading." 
            style={styles.container}>
                <ActivityIndicator animating={true}/>
            </View>
        ); 
    } else {
        return (
            <View style={[styles.container, hasNotch > 24 ? {paddingTop: hasNotch} : null]}>
                <FlatList
                accessible={true}
                accessibilityRole="scrollbar"
                accessibilityLabel="Scrollable list of locations."
                style={styles.list}
                data={locations}
                keyExtractor={ item => item.location_id.toString() }
                renderItem={({ item }) => ( 
                <LocationObject location={item} navButton={true} navigation={navigation} backToNavigation={["Home", {}]}/>
                 )}/>
            </View>
        ); 
    }

}

export default Home;
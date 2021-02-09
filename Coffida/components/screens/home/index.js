import React, {useState, useEffect } from 'react';
import {View, FlatList } from 'react-native';
import { TextInput, Text } from 'react-native-paper';
import NavBar from '../../navbar'
import styles from './styles'
import AsyncStoreHelper from '../../AsyncStoreHelper';
import LocationObject from '../../LocationObject';

const Home = (props) => {
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');

    const get_shop_data = async () => {
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { console.log("error"); return; /* Catch for if no token stored. */ }

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

    useEffect( () => {
        get_shop_data();
    }, []);

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading</Text>
                <NavBar></NavBar>
            </View>
        ); 
    } else {
        return (
            <View style={styles.container}>
                <TextInput
                mode="outlined"
                style={styles.searchBar}
                placeholder="Search Query..."
                onChangeText={text => setSearchQuery(text)}
                />
                <FlatList
                style={styles.list}
                data={locations}
                keyExtractor={ item => item.location_id.toString() }
                renderItem={({ item }) => ( 
                <LocationObject location={item} navButton={true}/>
                 )}/>
                <NavBar></NavBar>
            </View>
        ); 
    }

}

export default Home;
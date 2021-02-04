import AsyncStorage from '@react-native-async-storage/async-storage';
import React, {useState, useEffect } from 'react';
import {View, Text, FlatList} from 'react-native';
import NavBar from '../../navbar'
import styles from './styles'

const Home = (props) => {
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);

    useEffect( () => {
        const get_shops = async () => {
            for (let i = 1; i < 6; i++) {
                let item = await get_shop_data(i);
                console.log(item);
            }
            setLoading(false); 
        }

        get_shops();

    });

    const get_shop_data = (id) => {
        return fetch(`http://10.0.2.2:3333/api/1.0.0/location/${id}`, {
            method : "get",
            headers: {
                'Content-Type': "application/json" 
            },
        })
        .then( (res) => {
        if (res.status == 200) {
            return res.json();
        }
        else console.log("Something went wrong with the status.");
        })
        .then( (data) => {
            locations.push(data);
            setLocations(locations);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

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
                <FlatList
                data={locations}
                renderItem={({ item, index }) =>
                <Text>{item.location_id}</Text>
                }/>
                <NavBar></NavBar>
            </View>
        ); 
    }

}

export default Home;
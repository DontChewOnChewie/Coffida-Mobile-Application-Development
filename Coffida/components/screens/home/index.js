import React, {useState, useEffect } from 'react';
import {View, Text, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import NavBar from '../../navbar'
import styles from './styles'

const Home = (props) => {
    const [loading, setLoading] = useState(true);
    const [locations, setLocations] = useState([]);

    useEffect( () => {
        get_shop_data();
    }, []);

    const get_shop_data = () => {
        let ret_val = []
        for (let i = 1; i < 6; i++) {
            fetch(`http://10.0.2.2:3333/api/1.0.0/location/${i}`, {
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
                ret_val.push(data);
            })
            .catch( (message) => { console.log("ERROR " + message); });
        }

        setLoading(false);
        setLocations(ret_val);
    }

    const render_item = (name) => {
        return (
            <Text>{name}</Text>
        );
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
                <Button onPress={() => console.log(JSON.stringify(locations, null, 4))}>Get Locations Data</Button>
                <FlatList
                style={styles.list}
                data={locations}
                keyExtractor={ item => item.location_id.toString() }
                renderItem={ item => render_item(item.location_name) }/>
                <NavBar></NavBar>
            </View>
        ); 
    }

}

export default Home;
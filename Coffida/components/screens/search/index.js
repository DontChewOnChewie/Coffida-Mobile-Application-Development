import React, {useState, useEffect} from 'react';
import {View, StatusBar} from 'react-native';
import { Searchbar, ActivityIndicator } from 'react-native-paper';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from './styles'
import AsyncStoreHelper from '../../AsyncStoreHelper';
import { FlatList } from 'react-native-gesture-handler';
import LocationObject from '../../LocationObject';
import SearchOptions from '../../SearchOptions';
import FilterModal from '../../FilterModal';

const Search = ({navigation}) => {
    const [hasNotch, setHasNotch] = useState(0);
    const [queriedLocations, setQueriedLocations] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');  
    const [overallRatingSearch, setOverallRatingSearch] = useState(null);
    const [overallPriceRatingSearch, setOverallPriceRatingSearch] = useState(null);
    const [overallQualityRatingSearch, setOverallQualityRatingSearch] = useState(null);
    const [overallClenlinessRatingSearch, setOverallClenlinessRatingSearch] = useState(null);

    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    const do_search = async () => {
        setLoading(true);
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { console.log("error"); return; /* Catch for if no token stored. */ }
    
        fetch(`http://10.0.2.2:3333/api/1.0.0/find?q=${searchQuery}`, {
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
            setQueriedLocations(data);
            setLoading(false);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    useEffect(() => {
        setHasNotch(StatusBar.currentHeight);
    }, []);

    return (
    <View style={[styles.container, hasNotch > 24 ? {paddingTop: hasNotch} : null]}>

        <View style={styles.searchBarWrapper}>
            <Searchbar
                style={styles.searchBar}
                placeholder="Search"
                onChangeText={text => setSearchQuery(text)}
                value={searchQuery}
                onIconPress={() => do_search()}
            />
        </View>

        {loading ? <ActivityIndicator animating={true}/> : 
            <FlatList
            style={styles.list}
            data={queriedLocations}
            keyExtractor={ item => item.location_id.toString() }
            renderItem={({ item }) => ( 
            <LocationObject location={item} navButton={true} navigation={navigation}/>
            )}/>
        }

        <SearchOptions setShowFilter={setShowFilter}/>
        <FilterModal showFilter={[showFilter, setShowFilter]}/>

      </View>
    );

};

export default Search;
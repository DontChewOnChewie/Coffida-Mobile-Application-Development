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
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';

const Search = ({navigation}) => {
    const [hasNotch, setHasNotch] = useState(0);
    const [queriedLocations, setQueriedLocations] = useState([]);

    const [searchQuery, setSearchQuery] = useState('');  
    const [overallRatingSearch, setOverallRatingSearch] = useState('');
    const [overallPriceRatingSearch, setOverallPriceRatingSearch] = useState('');
    const [overallQualityRatingSearch, setOverallQualityRatingSearch] = useState('');
    const [overallClenlinessRatingSearch, setOverallClenlinessRatingSearch] = useState('');
    const [searchIn, setSearchIn] = useState(null);

    const [loading, setLoading] = useState(false);
    const [showFilter, setShowFilter] = useState(false);

    const [userLocation, setUserLocation] = useState(null);

    const create_search_address = () => {
        let search_address = `http://10.0.2.2:3333/api/1.0.0/find?q=${searchQuery}`
        if (overallRatingSearch != '') search_address = search_address + `&overall_rating=${overallRatingSearch}`;
        if (overallPriceRatingSearch != '') search_address = search_address + `&price_rating=${overallPriceRatingSearch}`;
        if (overallQualityRatingSearch != '') search_address = search_address + `&quality_rating=${overallQualityRatingSearch}`;
        if (overallClenlinessRatingSearch != '') search_address = search_address + `&clenliness_rating=${overallClenlinessRatingSearch}`;
        if (searchIn != null) search_address = search_address + `&search_in=${searchIn}`;
        return search_address;
    }

    const do_search = async () => {
        setLoading(true);
        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { console.log("error"); return; /* Catch for if no token stored. */ }

        const address = create_search_address();
        console.log(address);
    
        fetch(address, {
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

    const sort_locations_for_nearest = (locations) => {
        const sorted_array = locations.map(location => ({
            ...location,
            distanceValue: (Math.abs(userLocation.coords.latitude - location.latitude)) + (Math.abs(userLocation.coords.longitude - location.longitude))
        }));

        sorted_array.sort((a,b) => { return a.distanceValue - b.distanceValue; });
        setQueriedLocations(sorted_array);
    }

    const get_nearby_locations_fetch = async () => {
        if (userLocation == null) return;

        try { var token =  JSON.parse(await AsyncStoreHelper.get_credentials()).token; }
        catch (error) { console.log("error"); return; /* Catch for if no token stored. */ }

        setLoading(true);

        fetch("http://10.0.2.2:3333/api/1.0.0/find", {
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
            sort_locations_for_nearest(data);
            setLoading(false);
        })
        .catch( (message) => { console.log("ERROR " + message); });
    }

    const get_nearby_locations = async () => {
        const {status} = await Permissions.askAsync(Permissions.LOCATION);
        if (status == 'granted') {
            let location = await Location.getCurrentPositionAsync({accuracy: 5});
            // console.log(JSON.stringify(location, null, 4));
            setUserLocation(location);
            get_nearby_locations_fetch();
        }
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

        <SearchOptions setShowFilter={setShowFilter} sortByLocationFunction={get_nearby_locations}/>
        <FilterModal 
        showFilter={[showFilter, setShowFilter]} 
        overallRating={[overallRatingSearch, setOverallRatingSearch]}
        overallPriceRating={[overallPriceRatingSearch, setOverallPriceRatingSearch]}
        overallQualityRating = {[overallQualityRatingSearch, setOverallQualityRatingSearch]}
        overallClenlinessRating={[overallClenlinessRatingSearch, setOverallClenlinessRatingSearch]}
        searchIn={[searchIn, setSearchIn]}
        />

      </View>
    );

};

export default Search;
import React, { useState, useEffect } from 'react';
import { View, StatusBar, FlatList } from 'react-native';
import { Searchbar, ActivityIndicator } from 'react-native-paper';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import LocationObject from '../../LocationObject';
import SearchOptions from '../../SearchOptions';
import FilterModal from '../../FilterModal';

const Search = ({ navigation }) => {
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

  const createSearchAddress = () => {
    let searchAdrress = `http://10.0.2.2:3333/api/1.0.0/find?q=${searchQuery}`;
    if (overallRatingSearch !== '') searchAdrress += `&overall_rating=${overallRatingSearch}`;
    if (overallPriceRatingSearch !== '') searchAdrress += `&price_rating=${overallPriceRatingSearch}`;
    if (overallQualityRatingSearch !== '') searchAdrress += `&quality_rating=${overallQualityRatingSearch}`;
    if (overallClenlinessRatingSearch !== '') searchAdrress += `&clenliness_rating=${overallClenlinessRatingSearch}`;
    if (searchIn != null) searchAdrress += `&search_in=${searchIn}`;
    return searchAdrress;
  };

  const doSearch = async () => {
    setLoading(true);
    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (error) { return; /* Catch for if no token stored. */ }

    const address = createSearchAddress();

    fetch(address, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        return 'Error';
      })
      .then((data) => {
        if (data !== 'Error') {
          setQueriedLocations(data);
          setLoading(false);
        }
      })
      .catch(() => {});
  };

  const sortLocationsByNearest = (locations) => {
    const sortedArray = locations.map((location) => ({
      ...location,
      distanceValue:
        (Math.abs(userLocation.coords.latitude - location.latitude))
        + (Math.abs(userLocation.coords.longitude - location.longitude)),
    }));

    sortedArray.sort((a, b) => (a.distanceValue - b.distanceValue));
    setQueriedLocations(sortedArray);
  };

  const getNearbyLocationsFetch = async () => {
    if (userLocation == null) return;

    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (error) { return; /* Catch for if no token stored. */ }

    setLoading(true);

    fetch('http://10.0.2.2:3333/api/1.0.0/find', {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        return 'Error';
      })
      .then((data) => {
        if (data !== 'Error') {
          sortLocationsByNearest(data);
          setLoading(false);
        }
      })
      .catch(() => {});
  };

  const getNearbyLocations = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status === 'granted') {
      const location = await Location.getCurrentPositionAsync({ accuracy: 5 });
      setUserLocation(location);
      getNearbyLocationsFetch();
    }
  };

  useEffect(() => {
    setHasNotch(StatusBar.currentHeight);
  }, []);

  return (
    <View style={[
      styles.size100,
      styles.whiteBackgrounde,
      hasNotch > 24 ? { paddingTop: hasNotch } : null]}
    >

      <Searchbar
        accessibilityLabel="Form input for search query."
        placeholder="Search"
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
        onIconPress={() => doSearch()}
      />

      {loading ? <ActivityIndicator animating /> : (
        <FlatList
          accessible
          accessibilityRole="scrollbar"
          accessibilityLabel="Scrollable list of filtered locations."
          data={queriedLocations}
          keyExtractor={(item) => item.location_id.toString()}
          renderItem={({ item }) => (
            <LocationObject location={item} navButton navigation={navigation} image="" />
          )}
        />
      )}

      <SearchOptions setShowFilter={setShowFilter} sortByLocationFunction={getNearbyLocations} />
      <FilterModal
        showFilter={[showFilter, setShowFilter]}
        overallRating={[overallRatingSearch, setOverallRatingSearch]}
        overallPriceRating={[overallPriceRatingSearch, setOverallPriceRatingSearch]}
        overallQualityRating={[overallQualityRatingSearch, setOverallQualityRatingSearch]}
        overallClenlinessRating={[overallClenlinessRatingSearch, setOverallClenlinessRatingSearch]}
        searchIn={[searchIn, setSearchIn]}
      />

    </View>
  );
};

Search.propTypes = {
  navigation: PropTypes.shape({}).isRequired,
};

export default Search;

import React, { useState, useEffect } from 'react';
import { View, FlatList, ToastAndroid } from 'react-native';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import LocationObject from '../../LocationObject';
import LocationObjectSmall from './LocationObjectSmall';
import ReviewObject from '../../ReviewObject';
import styles from '../../../styles';
import AsyncStoreHelper from '../../../helpers/AsyncStoreHelper';

// UserActivity Screen
// Params:
// navigation = Navigation object.

const UserActivity = ({ navigation }) => {
  const [favouriteLocations, setFavouriteLocations] = useState([]);
  const [reviewedLocations, setReviewedLocations] = useState([]);
  const [currentView, setCurrentView] = useState('Favourites');

  // Get currently signed in user details.
  const getUserDetails = async () => {
    let token;
    let id;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
      id = JSON.parse(await AsyncStoreHelper.getCredentials()).id;
    } catch (anError) { return; /* Catch for if no token stored. */ }

    fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        ToastAndroid.show('Error getting your details', ToastAndroid.SHORT);
        return 'Error';
      })
      .then((data) => {
        if (data !== 'Error') {
          setFavouriteLocations(data.favourite_locations);
          setReviewedLocations(data.reviews);
        }
      })
      .catch(() => { ToastAndroid.show('Error getting your details', ToastAndroid.SHORT); });
  };

  useEffect(() => {
    navigation.addListener('focus', () => { getUserDetails(); });
    getUserDetails();
  }, []);

  return (
    <View style={[styles.flex1, styles.cameraContainer, styles.whiteBackground]}>

      {currentView === 'Favourites' ? (
        <View style={[styles.width100, styles.flex1]}>
          <FlatList
            accessible
            accessibilityRole="scrollbar"
            accessibilityLabel="Scrollable list of your location activity."
            data={favouriteLocations}
            keyExtractor={(item) => item.location_id.toString()}
            renderItem={({ item }) => (
              <LocationObject location={item} navButton navigation={navigation} image="" />
            )}
          />
        </View>
      ) : (
        <FlatList
          accessible
          accessibilityRole="scrollbar"
          accessibilityLabel="Scrollable list of your posted review activity."
          data={reviewedLocations}
          keyExtractor={(item) => item.review.review_id.toString()}
          renderItem={({ item }) => (
            <View>
              <LocationObjectSmall
                navigation={navigation}
                locationId={item.location.location_id}
                locationName={item.location.location_name}
                locationTown={item.location.location_town}
              />
              <ReviewObject
                review={item.review}
                locationId={item.location.location_id}
                reviewListState={[reviewedLocations, setReviewedLocations]}
                navigation={navigation}
                setGlobalImageURI={() => {}}
                showUserEditButtons={false}
              />
            </View>
          )}
        />
      )}

      <View style={[styles.width100, styles.flexDirectionRow]}>
        <Button
          style={styles.button50}
          mode="outlined"
          icon="store"
          onPress={() => setCurrentView('Favourites')}
        >
          Locations
        </Button>

        <Button
          style={styles.button50}
          mode="outlined"
          icon="calendar-check"
          onPress={() => setCurrentView('Reviews')}
        >
          Reviews
        </Button>
      </View>
    </View>
  );
};

UserActivity.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default UserActivity;

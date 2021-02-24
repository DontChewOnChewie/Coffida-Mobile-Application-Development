import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import { Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import LocationObject from '../../LocationObject';
import LocationObjectSmall from '../../LocationObjectSmall';
import ReviewObject from '../../ReviewObject';
import styles from '../../../styles';

const UserActivity = ({ navigation, route }) => {
  const [favouriteLocations, setFavouriteLocations] = useState([]);
  const [reviewedLocations, setReviewedLocations] = useState([]);
  const [currentView, setCurrentView] = useState('Favourites');

  useEffect(() => {
    setFavouriteLocations(route.params.favourite_locations);
    setReviewedLocations(route.params.reviewed_locations);
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
  navigation: PropTypes.shape({}).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      favourite_locations: PropTypes.arrayOf(PropTypes.any),
      reviewed_locations: PropTypes.arrayOf(PropTypes.any),
    }),
  }).isRequired,
};

export default UserActivity;

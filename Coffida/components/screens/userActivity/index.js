import React, { useState, useEffect } from 'react';
import { View, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import LocationObject from '../../LocationObject';
import ReviewObject from '../../ReviewObject';

const UserActivity = ({ navigation, route }) => {
  const [favouriteLocations, setFavouriteLocations] = useState([]);
  const [reviewedLocations, setReviewedLocations] = useState([]);

  useEffect(() => {
    setFavouriteLocations(route.params.favourite_locations);
    setReviewedLocations(route.params.reviewed_locations);
  }, []);

  return (
    <View>
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
      <FlatList
        accessible
        accessibilityRole="scrollbar"
        accessibilityLabel="Scrollable list of your posted review activity."
        data={reviewedLocations}
        keyExtractor={(item) => item.review.review_id.toString()}
        renderItem={({ item }) => (
          <ReviewObject
            review={item.review}
            locationId={item.location.location_id}
            reviewListState={[reviewedLocations, setReviewedLocations]}
            navigation={navigation}
            setGlobalImageURI={() => {}}
          />
        )}
      />
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

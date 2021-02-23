import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';
import {
  Button,
  Subheading,
  ActivityIndicator,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import LocationObject from '../../LocationObject';
import ReviewObject from '../../ReviewObject';

const Location = ({ navigation, route }) => {
  const [location, setLocation] = useState('');
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [imageURI, setImageURI] = useState('');
  const locationId = route.params.id;

  const getLocationDetails = async () => {
    await fetch(`http://10.0.2.2:3333/api/1.0.0/location/${locationId}`, {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((res) => {
        if (res.status === 200) return res.json();
        return 'Error';
      })
      .then((data) => {
        if (data !== 'Error') {
          setLocation(data);
          setReviews(data.location_reviews);
          setLoading(false);
        }
      })
      .catch(() => {});
  };

  useEffect(() => {
    navigation.addListener('focus', () => { getLocationDetails(); });
    getLocationDetails();
  }, []);

  if (loading) {
    return (
      <View
        accessbile
        accessibilityLabel="Loading page."
        style={[styles.size100, styles.whiteBackground]}
      >
        <ActivityIndicator />
      </View>
    );
  }
  return (
    <View style={[
      styles.flex1,
      styles.containerNoFlex,
      styles.whiteBackground]}
    >

      <LocationObject
        location={location}
        navButton={false}
        image={imageURI}
        navigation={navigation}
      />

      <View
        accessible
        accessibilityRole="header"
        accessibilityLabel="Header for reviews."
        style={styles.reiviewHeadingWrapper}
      >
        <Subheading>
          Reviews :
          {reviews.length}
        </Subheading>
        <Button
          accessibilityHint="Navigate to create new review page."
          onPress={() => navigation.navigate('Review', { location_id: locationId, previous_review: {}, has_image: '' })}
          style={styles.button40}
          mode="contained"
          icon="arrow-right"
        >
          Leave Review
        </Button>
      </View>

      <FlatList
        accesible
        accessibilityRole="scrollbar"
        accessibilityLabel={`Scrollable list of reviews for ${location.location_name} in ${location.location_town}.`}
        data={reviews}
        keyExtractor={(item) => item.review_id.toString()}
        renderItem={({ item }) => (
          <ReviewObject
            review={item}
            locationId={location.location_id}
            reviewListState={[reviews, setReviews]}
            navigation={navigation}
            setGlobalImageURI={setImageURI}
          />
        )}
      />

    </View>
  );
};

Location.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number,
    }).isRequired,
  }).isRequired,
};

export default Location;

import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../../../styles';

// Used in Userctivity to show what location a review is from.
// Params:
// navigation = Navigation object passed from parent screen.
// locationId = Location ID of location review is for.
// locationName = Location name of location review is for.
// locationTown = Location town of location review is for.

const LocationObjectSmall = ({
  navigation,
  locationId,
  locationName,
  locationTown,
}) => (
  <View style={[styles.reiviewHeadingWrapper, styles.locationObjectSmallBorder]}>
    <Text style={styles.ratingTitle}>{`${locationName} in ${locationTown}`}</Text>
    <Button
      style={styles.button40}
      mode="contained"
      icon="arrow-right"
      onPress={() => navigation.navigate('Location', { id: locationId })}
    >
      Check Out
    </Button>
  </View>
);

LocationObjectSmall.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  locationId: PropTypes.number.isRequired,
  locationName: PropTypes.string.isRequired,
  locationTown: PropTypes.string.isRequired,
};

export default LocationObjectSmall;

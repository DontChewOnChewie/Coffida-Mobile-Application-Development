import React from 'react';
import { View } from 'react-native';
import { Text, Button } from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../styles';

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

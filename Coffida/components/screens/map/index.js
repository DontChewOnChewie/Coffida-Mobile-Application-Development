import React from 'react';
import { View, Text } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import PropTypes from 'prop-types';
import styles from '../../../styles';

const Map = ({ route }) => {
  const { locations } = route.params;
  return (
    <View style={[
      styles.flex1,
      styles.whiteBackground,
      locations.length > 0 ? null : styles.container]}
    >
      {locations.length > 0 ? (
        <MapView
          style={styles.flex1}
          initialRegion={{
            latitude: locations[0].latitude,
            longitude: locations[0].longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
        >
          {locations.map((location) => (
            <Marker
              key={location.location_id}
              coordinate={{ latitude: location.latitude, longitude: location.longitude }}
              title={location.location_name}
              description={location.location_town}
            />
          ))}
        </MapView>
      ) : <Text>No locations to show from search.</Text> }
    </View>
  );
};

Map.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      locations: PropTypes.arrayOf(PropTypes.shape({
        length: PropTypes.number,
        map: PropTypes.func,
        latitude: PropTypes.number,
        longitude: PropTypes.number,
      })),
    }).isRequired,
  }).isRequired,
};

export default Map;

import React, { useState, useEffect } from 'react';
import { View, FlatList, StatusBar } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import LocationObject from '../../LocationObject';

const Home = ({ navigation }) => {
  const [hasNotch, setHasNotch] = useState(0);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    const getShopData = async () => {
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
          return 'Erorr';
        })
        .then((data) => {
          if (data !== 'Error') {
            setLocations(data);
            setLoading(false);
          }
        })
        .catch(() => {});
    };

    getShopData();
    setHasNotch(StatusBar.currentHeight);
    navigation.addListener('focus', () => {
      getShopData();
    });
  }, []);

  if (loading) {
    return (
      <View
        accessible
        accessibilityLabel="Page loading."
        style={[styles.container, styles.whiteBackground]}
      >
        <ActivityIndicator animating />
      </View>
    );
  }
  return (
    <View
      style={[styles.container,
        styles.whiteBackground,
        hasNotch > 24 ? { paddingTop: hasNotch } : null]}
    >
      <FlatList
        accessible
        accessibilityRole="scrollbar"
        accessibilityLabel="Scrollable list of locations."
        style={styles.size100}
        data={locations}
        keyExtractor={(item) => item.location_id.toString()}
        renderItem={({ item }) => (
          <LocationObject location={item} navButton navigation={navigation} image="" />
        )}
      />
    </View>
  );
};

Home.propTypes = {
  navigation: PropTypes.shape({
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default Home;

import React, { useEffect, useState } from 'react';
import { View, ToastAndroid, TouchableOpacity } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles';
import AsyncStoreHelper from '../AsyncStoreHelper';
import RatingsBar from '../RatingsBar';

const DUMMY_IMG_PATH = 'http://cdn.dummyphoto.com';
const DEFAULT_IMG_PATH = 'http://innovate.bunzlcatering.co.uk/wp-content/uploads/2015/06/coffee-shop-1.jpg';
const FAVOURITE_ICON = 'star';
const UNFAVOURITE_ICON = 'star-o';
const FAVOURITE_COLOUR = '#6200ee';

const LocationObject = ({
  location,
  navButton,
  navigation,
  image,
}) => {
  const [favourite, setFavourite] = useState(false);
  const [favouriteIcon, setFavouriteIcon] = useState(UNFAVOURITE_ICON);
  const [locationImage, setLocationImage] = useState('');

  const setUserHasFavourite = async () => {
    let token;
    let id;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
      id = JSON.parse(await AsyncStoreHelper.getCredentials()).id;
    } catch (error) { return null; /* Catch for if no token stored. */ }

    return fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`, {
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
          const faves = data.favourite_locations;
          const isFavourite = (
            faves.filter((fave) => fave.location_id === location.location_id)
              .length) > 0;
          if (isFavourite) setFavouriteIcon(FAVOURITE_ICON);
          else setFavouriteIcon(UNFAVOURITE_ICON);
          setFavourite(isFavourite);
        }
      })
      .catch(() => {});
  };

  const handleFavouriteButtonClick = async () => {
    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (error) { return; /* Catch for if no token stored. */ }

    fetch(`http://10.0.2.2:3333/api/1.0.0/location/${location.location_id}/favourite`, {
      method: favourite ? 'delete' : 'post',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          if (favourite) setFavouriteIcon(UNFAVOURITE_ICON);
          else setFavouriteIcon(FAVOURITE_ICON);
          setFavourite((prevFavourite) => !prevFavourite);
          ToastAndroid.showWithGravity(favourite ? 'Removed from Favourite' : 'Added to Favourites', ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
      })
      .catch(() => {});
  };

  const setCurrentLocationImage = () => {
    if (location.photo_path === DUMMY_IMG_PATH
            || location.photo_path === ''
            || location.photo_path == null
            || location.photo_path === undefined) setLocationImage(DEFAULT_IMG_PATH);
    else setLocationImage(location.photo_path);
  };

  useEffect(() => {
    setUserHasFavourite();
    setCurrentLocationImage();
  }, []);

  return (
    <Card
      accessible
      accessibilityLabel={`Card for coffee named ${location.location_name} in ${location.location_town}.`}
    >
      <Card.Title
        accessible
        accessibilityRole="header"
        title={location.location_name}
        subtitle={location.location_town}
        left={() => (
          <TouchableOpacity
            accessible
            accessibilityRole="button"
            accessibilityHint={`${favourite ? 'Unfavourite' : 'Favourite'} this location.`}
            onPress={handleFavouriteButtonClick}
          >
            <Icon
              accessible
              accessibilityLabel={`Icon of star showing favourite status. Current status if ${favourite ? 'Favourite' : 'Not favourite.'}`}
              name={favouriteIcon}
              size={25}
              color={FAVOURITE_COLOUR}
            />
          </TouchableOpacity>
        )}
      />
      <Card.Cover
        accessible
        accessibilityRole="image"
        accessibilityLabel={`Image of ${location.location_name} in ${location.location_town}.`}
        source={{ uri: image !== '' ? image : locationImage }}
      />
      <Card.Actions style={styles.locationObjectActionsWrapper}>
        { navButton ? (
          <Button
            accessibilityHint={`Navigate to ${location.location_name} in ${location.location_town} page.`}
            onPress={() => navigation.navigate('Location', { id: location.location_id })}
            mode="contained"
            icon="arrow-right"
          >
            Check Out
          </Button>
        ) : (
          <View
            accessible
            accessibilityLabel={`Ratings container for ${location.location_name} in ${location.location_town}.`}
            style={styles.width100}
          >
            <RatingsBar title="Price Rating" icon="attach-money" rating={location.avg_price_rating} />
            <RatingsBar title="Quality Rating" icon="star-rate" rating={location.avg_quality_rating} />
            <RatingsBar title="Clenliness Rating" icon="cleaning-services" rating={location.avg_clenliness_rating} />
          </View>
        )}
      </Card.Actions>
      <Divider style={styles.divider} />
    </Card>
  );
};

LocationObject.propTypes = {
  location: PropTypes.shape({
    location_id: PropTypes.number,
    location_name: PropTypes.string,
    location_town: PropTypes.string,
    avg_price_rating: PropTypes.number,
    avg_quality_rating: PropTypes.number,
    avg_clenliness_rating: PropTypes.number,
    photo_path: PropTypes.string,
  }).isRequired,

  navButton: PropTypes.bool.isRequired,
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  image: PropTypes.string.isRequired,
};

export default LocationObject;

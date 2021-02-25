import React, { useEffect, useState } from 'react';
import { View, ToastAndroid, TouchableOpacity } from 'react-native';
import { Card, Button, Divider } from 'react-native-paper';
import PropTypes from 'prop-types';
// eslint-disable-next-line import/no-unresolved
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from '../../styles';
import AsyncStoreHelper from '../../helpers/AsyncStoreHelper';
import RatingsBar from './RatingsBar';

const DUMMY_IMG_PATH = 'http://cdn.dummyphoto.com';
const DEFAULT_IMG_PATH = 'http://innovate.bunzlcatering.co.uk/wp-content/uploads/2015/06/coffee-shop-1.jpg';
const FAVOURITE_ICON = 'star';
const UNFAVOURITE_ICON = 'star-o';
const FAVOURITE_COLOUR = '#6200ee';

// Used on Location, UserAcitvity, Search and Home screen.
// Displays and retrieves information for location and users activity on the location.
// Params:
// location = Location object retrieved from database.
// navButton = Whether or not a navButton should be rendered.
// navigation = Navigation object from parent screen.
// image = Whether or not a user uploaded image should be rendered.

const LocationObject = ({
  location,
  navButton,
  navigation,
  image,
}) => {
  const [favourite, setFavourite] = useState(false);
  const [favouriteIcon, setFavouriteIcon] = useState(UNFAVOURITE_ICON);
  const [locationImage, setLocationImage] = useState('');
  const [loading, setLoading] = useState(true);

  // Determines whether user has this location as a favourite.
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
        ToastAndroid.show('Error getting your favourites.', ToastAndroid.SHORT);
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
      .catch(() => { ToastAndroid.show('Error getting your favourites.', ToastAndroid.SHORT); });
  };

  // Deletes or adds favourite dependant on current status.
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
          ToastAndroid.show(favourite ? 'Removed from Favourite' : 'Added to Favourites', ToastAndroid.SHORT);
        } else ToastAndroid.show(favourite ? 'Removed from Favourite' : 'Added to Favourites', ToastAndroid.SHORT);
      })
      .catch(() => { ToastAndroid.show('Error setting favourite.', ToastAndroid.SHORT); });
  };

  // Sets the currrent image to Default placholder image if database url is not valid.
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
    setLoading(false);
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
      { !loading ? (
        <Card.Cover
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Image of ${location.location_name} in ${location.location_town}.`}
          source={{ uri: image !== '' ? image : locationImage }}
        />
      ) : null }
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
            <RatingsBar
              title="Price Rating"
              icon="attach-money"
              rating={location.avg_price_rating != null ? location.avg_price_rating : 0}
            />
            <RatingsBar
              title="Quality Rating"
              icon="star-rate"
              rating={location.avg_quality_rating != null ? location.avg_quality_rating : 0}
            />
            <RatingsBar
              title="Clenliness Rating"
              icon="cleaning-services"
              rating={location.avg_clenliness_rating != null ? location.avg_clenliness_rating : 0}
            />
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

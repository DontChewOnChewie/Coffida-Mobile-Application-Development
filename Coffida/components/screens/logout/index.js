import React from 'react';
import { ImageBackground, ToastAndroid } from 'react-native';
import { Button, Subheading } from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import AsyncStoreHelper from '../../../helpers/AsyncStoreHelper';

const backgroundImage = require('../../../images/loginBG.jpg');

// Logout Screen
// Params:
// navigation : Navigation object.

const Logout = ({ navigation }) => {
  // Try to log the current user out.
  const tryLogout = async () => {
    let token;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
    } catch (error) { return; /* Catch for if no token stored. */ }

    fetch('http://10.0.2.2:3333/api/1.0.0/user/logout', {
      method: 'post',
      headers: {
        'X-Authorization': token,
      },
    })
      .then((res) => {
        if (res.status === 200) {
          AsyncStoreHelper.removeCredentials();
          navigation.navigate('Login');
        } else ToastAndroid.show('Error logging out.', ToastAndroid.SHORT);
      })
      .catch(() => { ToastAndroid.show('Error logging out.', ToastAndroid.SHORT); });
  };

  return (
    <ImageBackground
      accessible
      accessibilityLabel="Background image of coffee on table."
      source={backgroundImage}
      style={styles.container}
    >
      <Subheading style={styles.logoutMessage}>
        If you log out you will not be able to leave reviews for any coffee shop.
      </Subheading>

      <Button
        accessibilityHint="Logout of your account and return to sign in page."
        style={styles.button60}
        mode="contained"
        icon="door-open"
        onPress={() => tryLogout()}
      >
        Logout
      </Button>
    </ImageBackground>
  );
};

Logout.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default Logout;

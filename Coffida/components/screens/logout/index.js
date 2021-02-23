import React from 'react';
import { View } from 'react-native';
import { Button, Subheading } from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';

const Logout = ({ navigation }) => {
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
        }
      })
      .catch(() => {});
  };

  return (
    <View style={styles.container}>
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
    </View>
  );
};

Logout.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default Logout;

import React, { useState } from 'react';
import { ImageBackground } from 'react-native';
import { Button, TextInput, Text } from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import AsyncStoreHelper from '../../../helpers/AsyncStoreHelper';
import ErrorPopUp from '../../ErrorPopUp';

const backgroundImage = require('../../../images/loginBG.jpg');

// Login Screen
// Params:
// navigation = Navigation object.

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  // Login in with inputted details.
  const tryLogin = async () => {
    fetch('http://192.168.1.135:3333/api/1.0.0/user/login', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((res) => {
        if (res.status === 200) {
          // Reset form fields so values aren't populated on return
          setEmail('');
          setPassword('');
          return res.json();
        }
        setError('Account credentials are not valid.');
        return 'Error';
      })
      .then((data) => {
        if (data !== 'Error') {
          AsyncStoreHelper.storeCredentials(data);
          navigation.navigate('Home', { screen: 'Home' });
        }
      })
      .catch(() => { setError('Something went wrong.'); });
  };

  return (
    <ImageBackground
      accessible
      accessibilityLabel="Background image of coffee on table."
      source={backgroundImage}
      style={styles.container}
    >

      { error !== null
        ? <ErrorPopUp errorMessage={error} errorStateFunction={setError} />
        : null}

      <Text style={styles.formTitle}>Sign In</Text>

      <TextInput
        accessibilityLabel="Account email."
        label="Account Email"
        style={styles.input60}
        onChangeText={(text) => setEmail(text)}
        value={email}
      />

      <TextInput
        accessibilityLabel="Account password."
        label="Account Password"
        style={styles.input60}
        onChangeText={(text) => setPassword(text)}
        value={password}
        secureTextEntry
      />

      <Button
        accessibilityHint="Try signing into account with given credentials."
        mode="contained"
        icon="arrow-right"
        style={styles.button60}
        onPress={() => tryLogin()}
      >
        Log In
      </Button>

      <Button
        accessibilityLabel="Button to navigate to sign up page."
        accessibilityHint="Only use this if you do not have an account already."
        mode="text"
        icon="arrow-right"
        color="white"
        onPress={() => navigation.navigate('SignUp')}
      >
        Dont have an account?
      </Button>

    </ImageBackground>
  );
};

Login.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

export default Login;

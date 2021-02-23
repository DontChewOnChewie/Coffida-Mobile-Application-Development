import React, { useState, useEffect } from 'react';
import { ImageBackground, View } from 'react-native';
import {
  TextInput, Text, Button, ActivityIndicator,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import { UserValidation } from '../../InputHandler';
import ErrorPopUp from '../../ErrorPopUp';

const backgroundImage = require('../../../images/loginBG.jpg');

const SignUp = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);

  const [loading, setLoading] = useState(true);

  const validateSignUp = () => {
    const isValid = UserValidation(firstName, secondName, email, password, confirmPassword);
    if (typeof (isValid) !== 'boolean') {
      setError(isValid);
      return false;
    }
    setError(null);
    return true;
  };

  const attemptSignUp = async () => {
    if (!validateSignUp()) return;

    fetch('http://192.168.1.135:3333/api/1.0.0/user', {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: firstName,
        last_name: secondName,
        email,
        password,
      }),
    })
      .then((res) => {
        if (res.status === 201) {
          return res.json();
        } return 'Error';
      })
      .then((data) => {
        if (data !== 'Error') navigation.navigate('Login');
      })
      .catch(() => { });
  };

  const getCredentials = async () => {
    const creds = await AsyncStoreHelper.getCredentials();
    if (creds != null) navigation.navigate('Home');
    else setLoading(false);
  };

  useEffect(() => {
    navigation.addListener('focus', () => { getCredentials(); });
    getCredentials();
  }, []);

  if (loading) {
    return (
      <View
        accessbile
        accessibilityLabel="Loading page."
        style={styles.container}
      >
        <ActivityIndicator />
      </View>
    );
  }
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
      <Text style={styles.formTitle}>Sign Up</Text>

      <TextInput
        accessibilityLabel="Form input for first name."
        label="First Name"
        style={styles.input60}
        onChangeText={(text) => setFirstName(text)}
      />

      <TextInput
        accessibilityLabel="Form input for second name."
        label="Second Name"
        style={styles.input60}
        onChangeText={(text) => setSecondName(text)}
      />

      <TextInput
        accessibilityLabel="Form input for email address."
        label="Email"
        style={styles.input60}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        accessibilityLabel="Form input for password."
        label="Password"
        style={styles.input60}
        onChangeText={(text) => setPassword(text)}
        secureTextEntry
      />

      <TextInput
        accessibilityLabel="Form input for confirming password."
        accessibilityHint="Must match previous input."
        label="Confirm Password"
        style={styles.input60}
        onChangeText={(text) => setConfirmPassword(text)}
        secureTextEntry
      />

      <Button
        accessibilityHint="Try signing up with inputted credentials."
        style={styles.button60}
        mode="contained"
        icon="arrow-right"
        onPress={() => attemptSignUp()}
      >
        Sign Up
      </Button>

      <Button
        accessibilityLabel="Button to navigate to sign in page."
        accessibilityHint="Only use this if you already have an account."
        mode="text"
        icon="arrow-right"
        color="white"
        onPress={() => navigation.navigate('Login')}
      >
        Already have an account?
      </Button>
    </ImageBackground>
  );
};

SignUp.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default SignUp;

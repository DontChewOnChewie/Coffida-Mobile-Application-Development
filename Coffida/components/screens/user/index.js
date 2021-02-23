import React, { useEffect, useState } from 'react';
import { ToastAndroid, ImageBackground } from 'react-native';
import {
  Button,
  TextInput,
  Text,
  FAB,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import AsyncStoreHelper from '../../AsyncStoreHelper';
import ErrorPopUp from '../../ErrorPopUp';
import { UserValidation } from '../../InputHandler';

const backgroundImage = require('../../../images/loginBG.jpg');

const User = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPasswrd] = useState('');

  const [favouriteLocations, setFavouriteLocations] = useState([]);
  const [reviewedLocations, setReviewedLocations] = useState([]);

  const [error, setError] = useState(null);

  const getUserDetails = async () => {
    let token;
    let id;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
      id = JSON.parse(await AsyncStoreHelper.getCredentials()).id;
    } catch (anError) { return; /* Catch for if no token stored. */ }

    fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`, {
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
          setFirstName(data.first_name);
          setSecondName(data.last_name);
          setEmail(data.email);
          setFavouriteLocations(data.favourite_locations);
          setReviewedLocations(data.reviews);
        }
      })
      .catch(() => {});
  };

  const validateChanges = () => {
    const isValid = UserValidation(firstName, secondName, email, password, confirmPassword);
    if (typeof (isValid) !== 'boolean') {
      setError(isValid);
      return false;
    }
    setError(null);
    return true;
  };

  const getUserDetailChangesObject = () => {
    const returnObject = {};
    if (firstName !== '') returnObject.first_name = firstName;
    if (secondName !== '') returnObject.last_name = secondName;
    if (email !== '') returnObject.email = email;
    if (password !== '') returnObject.password = password;
    return returnObject;
  };

  const changeUserDetails = async () => {
    if (!validateChanges()) return;

    const userChanges = getUserDetailChangesObject();
    let token;
    let id;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
      id = JSON.parse(await AsyncStoreHelper.getCredentials()).id;
    } catch (anError) { return; /* Catch for if no token stored. */ }

    fetch(`http://10.0.2.2:3333/api/1.0.0/user/${id}`, {
      method: 'patch',
      headers: {
        'Content-Type': 'application/json',
        'X-Authorization': token,
      },
      body: JSON.stringify(userChanges),
    })
      .then((res) => {
        if (res.status === 200) {
          ToastAndroid.showWithGravity('Successfully Updated your Account!', ToastAndroid.SHORT, ToastAndroid.CENTER);
        }
      }).catch(() => {});
  };

  useEffect(() => {
    navigation.addListener('focus', () => { getUserDetails(); });
    getUserDetails();
  }, []);

  return (
    <ImageBackground
      accessible
      accessibilityLabel="Background image of coffee on table."
      source={backgroundImage}
      style={styles.container}
    >

      { error !== null ? <ErrorPopUp errorMessage={error} errorStateFunction={setError} /> : null}

      <Text style={styles.formTitle}>{`${firstName} ${secondName}'s Page`}</Text>

      <TextInput
        accessibilityLabel="Form input for first name edit."
        style={styles.input60}
        onChangeText={(text) => setFirstName(text)}
        value={firstName}
        label="First Name"
      />

      <TextInput
        accessibilityLabel="Form input for second name edit."
        style={styles.input60}
        onChangeText={(text) => setSecondName(text)}
        value={secondName}
        label="Second Name"
      />

      <TextInput
        accessibilityLabel="Form input for email edit."
        style={styles.input60}
        onChangeText={(text) => setEmail(text)}
        value={email}
        label="Email"
      />

      <TextInput
        accessibilityLabel="Form input for password edit."
        style={styles.input60}
        onChangeText={(text) => setPassword(text)}
        value={password}
        label="Password"
        secureTextEntry
      />

      <TextInput
        accessibilityLabel="Form input for confirming password edit."
        style={styles.input60}
        onChangeText={(text) => setConfirmPasswrd(text)}
        value={confirmPassword}
        label="Confirm Password"
        secureTextEntry
      />

      <Button
        accessibilityHint="Attempt to change your details to the form inputs above."
        style={styles.button60}
        mode="contained"
        icon="arrow-right"
        onPress={() => changeUserDetails()}
      >
        Update Details
      </Button>

      <FAB
        accessible
        accessibilityRole="button"
        accessibilityHint="Navigate to your activity page."
        style={styles.fabBottomRight}
        icon="plus"
        onPress={() => navigation.navigate('UserActivity', { favourite_locations: favouriteLocations, reviewed_locations: reviewedLocations })}
      />
    </ImageBackground>
  );
};

User.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
    addListener: PropTypes.func.isRequired,
  }).isRequired,
};

export default User;

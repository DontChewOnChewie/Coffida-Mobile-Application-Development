import React, { useEffect, useState } from 'react';
import { View, ToastAndroid, ImageBackground } from 'react-native';
import {
  Button,
  TextInput,
  Text,
  FAB,
  ActivityIndicator,
} from 'react-native-paper';
import PropTypes from 'prop-types';
import styles from '../../../styles';
import AsyncStoreHelper from '../../../helpers/AsyncStoreHelper';
import ErrorPopUp from '../../ErrorPopUp';
import { NameValidation, EmailValidation, PasswordValidation } from '../../../helpers/InputHandler';

const backgroundImage = require('../../../images/loginBG.jpg');

// User Screen
// Params:
// navigation = Navigation object.

const User = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [currentFirstName, setCurrentFirstname] = useState('');
  const [secondName, setSecondName] = useState('');
  const [currentSecondName, setCurrentSecondName] = useState('');
  const [email, setEmail] = useState('');
  const [currentEmail, setCurrentEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPasswrd] = useState('');

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Get signed in users details and populate inputs.
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
        ToastAndroid.show('Error getting your details.', ToastAndroid.SHORT);
        return 'Error';
      })
      .then((data) => {
        if (data !== 'Error') {
          setFirstName(data.first_name);
          setCurrentFirstname(data.first_name);
          setSecondName(data.last_name);
          setCurrentSecondName(data.last_name);
          setEmail(data.email);
          setCurrentEmail(data.email);
          setLoading(false);
        }
      })
      .catch(() => { ToastAndroid.show('Error getting your details.', ToastAndroid.SHORT); });
  };

  // Get users valid account changes and return what hasn't been changed and why.
  const getUserDetailChangesObject = () => {
    const returnObject = {};
    let errors = '';
    if (firstName !== ''
        && secondName !== ''
        && (firstName !== currentFirstName || secondName !== currentSecondName)
        && NameValidation(firstName, secondName)) {
      returnObject.first_name = firstName;
      returnObject.last_name = secondName;
    } else errors += 'Name was not changed. If you wanted to change it make sure input is longer then 2\n';

    if (email !== ''
        && email !== currentEmail
        && EmailValidation(email)) returnObject.email = email;
    else errors += 'Email was not changed. If you wanted to change it make sure email is valid or different.\n';

    if (password !== ''
        && PasswordValidation(password, confirmPassword)) returnObject.password = password;
    else errors += 'Password was not changed. If you wanted to change it make sure they match, have a symbol and a number in.\n';

    errors += errors !== '' ? 'All other fields were changed.' : 'All details updated successfully.';
    returnObject.errors = errors;
    return returnObject;
  };

  // Change the user current details with whats been inputted.
  const changeUserDetails = async () => {
    let token;
    let id;
    try {
      token = JSON.parse(await AsyncStoreHelper.getCredentials()).token;
      id = JSON.parse(await AsyncStoreHelper.getCredentials()).id;
    } catch (anError) { return; /* Catch for if no token stored. */ }

    const userChanges = getUserDetailChangesObject();
    setError(userChanges.errors);
    // Remove unneeded key for the patch request.
    delete userChanges.errors;
    // Check any changes were done.
    if (Object.keys(userChanges).length === 0) return;

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
          ToastAndroid.show('Successfully Updated your Account!', ToastAndroid.SHORT);
        }
      }).catch(() => { ToastAndroid.show('Error updating your details.', ToastAndroid.SHORT); });
  };

  useEffect(() => {
    navigation.addListener('focus', () => { getUserDetails(); });
    getUserDetails();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.whiteBackground]}>
        <ActivityIndicator animating />
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
        onPress={() => navigation.navigate('UserActivity')}
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

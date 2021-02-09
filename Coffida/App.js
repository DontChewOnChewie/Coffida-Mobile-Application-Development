import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import SignUp from './components/screens/signup';
import Login from './components/screens/login';
import Logout from './components/screens/logout';
import Home from './components/screens/home';
import User from './components/screens/user';
import Location from './components/screens/location';

const App = () => {

  return (
    <View style={styles.container}>
      <Location id="4"/>
    </View>
  );

};

const styles = StyleSheet.create({

  container : {
    flex: 1,
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  }

});

export default App;
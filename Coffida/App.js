import 'react-native-gesture-handler';
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Login from './components/screens/login';
import Home from './components/screens/home';
import Location from './components/screens/location';
import User from './components/screens/user';
import Search from './components/screens/search';
import { NavigationContainer } from '@react-navigation/native';


const App = () => {

  return (
      <View>
        <NavigationContainer></NavigationContainer>
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
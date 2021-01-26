import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import Login from './components/screens/login';

const App = () => {

  return (
    <View style={styles.container}>
      <Login></Login>
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
import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import SignUp from './components/screens/signup';
import Login from './components/screens/login';
import Logout from './components/screens/logout';
import Home from './components/screens/home';
import User from './components/screens/user';
import Location from './components/screens/location';
import Review from './components/screens/review';

const App = () => {

  return (
    <View style={styles.container}>
      {/* <Location id="4"/> */}
      <Review 
            location_id="4"
          //   rev={{
          //   "review_id": 11,
          //   "overall_rating": 3,
          //   "price_rating": 5,
          //   "quality_rating": 3,
          //   "clenliness_rating": 3,
          //   "review_body": "Total Good",
          //   "likes": 0
          // }}
        />
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
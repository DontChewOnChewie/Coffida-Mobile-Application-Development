import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Home from '../screens/home';
import Location from '../screens/location';
import Review from '../screens/review';
import CameraView from '../screens/camera';

const HomeStack = createStackNavigator();

const HomeScreenStack = () => (
  <HomeStack.Navigator initialRouteName="Home">
    <HomeStack.Screen name="Home" component={Home} options={{ headerShown: false }} />
    <HomeStack.Screen name="Location" component={Location} />
    <HomeStack.Screen name="Review" component={Review} />
    <HomeStack.Screen name="Camera" component={CameraView} />
  </HomeStack.Navigator>
);

export default HomeScreenStack;

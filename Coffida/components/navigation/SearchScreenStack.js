import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import Search from '../screens/search';
import Location from '../screens/location';
import Review from '../screens/review';
import CameraView from '../screens/camera';
import Map from '../screens/map';

const SearchStack = createStackNavigator();

const SearchScreenStack = () => (
  <SearchStack.Navigator initialRouteName="Search">
    <SearchStack.Screen name="Search" component={Search} options={{ headerShown: false }} />
    <SearchStack.Screen name="Location" component={Location} />
    <SearchStack.Screen name="Review" component={Review} />
    <SearchStack.Screen name="Camera" component={CameraView} />
    <SearchStack.Screen name="Map" component={Map} />
  </SearchStack.Navigator>
);

export default SearchScreenStack;

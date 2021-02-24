import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import User from '../screens/user';
import UserActivity from '../screens/userActivity';
import Location from '../screens/location';
import Review from '../screens/review';
import CameraView from '../screens/camera';

const UserStack = createStackNavigator();

const UserScreenStack = () => (
  <UserStack.Navigator initialRouteName="User">
    <UserStack.Screen name="User" component={User} options={{ headerShown: false }} />
    <UserStack.Screen name="UserActivity" component={UserActivity} />
    <UserStack.Screen name="Location" component={Location} />
    <UserStack.Screen name="Review" component={Review} />
    <UserStack.Screen name="Camera" component={CameraView} />
  </UserStack.Navigator>
);

export default UserScreenStack;

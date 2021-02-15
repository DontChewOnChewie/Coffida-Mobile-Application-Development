import 'react-native-gesture-handler';
import * as React from 'react';
import {View, Text, LogBox} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import SignUp from './components/screens/signup';
import Login from './components/screens/login';
import Home from './components/screens/home';
import Location from './components/screens/location';
import Review from './components/screens/review';
import Logout from './components/screens/logout';
import User from './components/screens/user';
import CameraView from './components/screens/camera'; 

LogBox.ignoreAllLogs(true);
const IntialStack = createStackNavigator();
const HomeTab = createBottomTabNavigator();
const HomeStack = createStackNavigator();

const HomeScreenStack = () => {
  return (
    <HomeStack.Navigator initialRouteName="Home">
      <HomeStack.Screen name="Home" component={Home} options={{headerShown: false}}/>
      <HomeStack.Screen name="Location" component={Location}/>
      <HomeStack.Screen name="Review" component={Review}/>
      <HomeStack.Screen name="Camera" component={CameraView}/>
    </HomeStack.Navigator>
  );
}

const HomeScreenTabs = () => {
  return (
    <HomeTab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: () => {
            if (route.name === 'Home') {
              return <Ionicons name="home" size={25} color="white" />
            } else if (route.name === 'User') {
              return <Ionicons name="person" size={25} color="white" />
            } else if (route.name === "Logout") {
              return <Ionicons name="log-out" size={25} color="white" />
            }
          },
        }
        )}
        tabBarOptions={{
          activeBackgroundColor: '#6200ee',
          inactiveBackgroundColor: '#6200ee',
          activeTintColor: 'white',
          inactiveTintColor: 'white',
        }}
      >
        <HomeTab.Screen name="Home" component={HomeScreenStack} />
        <HomeTab.Screen name="User" component={User} />
        <HomeTab.Screen name="Logout" component={Logout} />
      </HomeTab.Navigator>
  );
}

const App = () => {
  return (
    <NavigationContainer>
      <IntialStack.Navigator initialRouteName="SignUp">
        <IntialStack.Screen name="SignUp" component={SignUp} options={{headerShown: false}} />
        <IntialStack.Screen name="Login" component={Login} options={{headerShown: false}} />
        <IntialStack.Screen name="Home" component={HomeScreenTabs} options={{headerShown: false}} />
      </IntialStack.Navigator>
    </NavigationContainer>
  );
}

export default App;
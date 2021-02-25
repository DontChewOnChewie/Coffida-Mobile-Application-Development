/* eslint-disable linebreak-style */
import 'react-native-gesture-handler';
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreenTabs from './components/navigation/HomeScreenTabs';
import SignUp from './components/screens/signup';
import Login from './components/screens/login';

const IntialStack = createStackNavigator();

const App = () => (
  <NavigationContainer>
    <IntialStack.Navigator initialRouteName="SignUp">
      <IntialStack.Screen name="SignUp" component={SignUp} options={{ headerShown: false }} />
      <IntialStack.Screen name="Login" component={Login} options={{ headerShown: false }} />
      <IntialStack.Screen name="Home" component={HomeScreenTabs} options={{ headerShown: false }} />
    </IntialStack.Navigator>
  </NavigationContainer>
);

export default App;

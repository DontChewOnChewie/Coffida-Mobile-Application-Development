import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreenStack from './HomeScreenStack';
import SearchScreenStack from './SearchScreenStack';
import UserScreenStack from './UserScreenStack';
import Logout from '../screens/logout';

const HomeTab = createBottomTabNavigator();

const HomeScreenTabs = () => (
  <HomeTab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: () => {
        switch (route.name) {
          case 'Home':
            return <Ionicons name="home" size={25} color="white" />;
          case 'User':
            return <Ionicons name="person" size={25} color="white" />;
          case 'Logout':
            return <Ionicons name="log-out" size={25} color="white" />;
          case 'Search':
            return <Ionicons name="search" size={25} color="white" />;
          default:
            return <Ionicons name="search" size={25} color="white" />;
        }
      },
    })}
    tabBarOptions={{
      activeBackgroundColor: '#6200ee',
      inactiveBackgroundColor: '#6200ee',
      activeTintColor: 'white',
      inactiveTintColor: 'white',
    }}
  >
    <HomeTab.Screen name="Home" component={HomeScreenStack} />
    <HomeTab.Screen name="Search" component={SearchScreenStack} />
    <HomeTab.Screen name="User" component={UserScreenStack} />
    <HomeTab.Screen name="Logout" component={Logout} />
  </HomeTab.Navigator>
);

export default HomeScreenTabs;

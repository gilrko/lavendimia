import React from 'react';
import { createSwitchNavigator, createStackNavigator, createDrawerNavigator, StackNavigator } from 'react-navigation';

import MainTabNavigator from './MainTabNavigator';
// import DrawerNavigation from './DrawerNavigation';

export default createStackNavigator({
  Main: MainTabNavigator,
}, {
    initialRouteName: 'Main',
    navigationOptions: {
      header: null
    }
  });
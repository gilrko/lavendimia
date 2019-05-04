import React from 'react';
import { Platform, Image } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import HomeScreen from '../screens/HomeScreen';
import UsersScreen from '../screens/UsersScreen';
import SalesScreen from '../screens/SalesScreen';
import ConfigScreen from '../screens/ConfigScreen';
import UserInfoScreen from '../screens/Views/UserInfoScreen';
import ArticlesScreen from '../screens/ArticlesScreen';
import ArticleInfoScreen from '../screens/Views/ArticleInfoScreen';
import SalesInfoScreen from '../screens/Views/SalesInfoScreen';

const HomeStack = createStackNavigator({
  Home: HomeScreen,
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Inicio',
  tabBarIcon: ({ focused }) =>
    focused ?
      <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icons/shop1.png')} /> :
      <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icons/shop.png')} />
};

const SalesStack = createStackNavigator({
  Sales: SalesScreen,
  SalesInfo: SalesInfoScreen
});

SalesStack.navigationOptions = {
  tabBarLabel: 'Ventas',
  tabBarIcon: ({ focused }) =>
    focused ?
      <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icons/sales1.png')} /> :
      <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icons/sales.png')} />
};

const UsersStack = createStackNavigator({
  Users: UsersScreen,
  UserInfo: UserInfoScreen,
});

UsersStack.navigationOptions = {
  tabBarLabel: 'Clientes',
  tabBarIcon: ({ focused }) =>
    focused ?
      <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icons/user1.png')} /> :
      <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icons/user.png')} />
};

const ArticlesStack = createStackNavigator({
  Articles: ArticlesScreen,
  ArticleInfo: ArticleInfoScreen,
});

ArticlesStack.navigationOptions = {
  tabBarLabel: 'Articulos',
  tabBarIcon: ({ focused }) =>
    focused ?
      <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icons/articles1.png')} /> :
      <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icons/articles.png')} />
};

const ConfigStack = createStackNavigator({
  Config: ConfigScreen,
});

ConfigStack.navigationOptions = {
  tabBarLabel: 'Configuración',
  tabBarIcon: ({ focused }) =>
    focused ?
      <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icons/config1.png')} /> :
      <Image style={{ width: 25, height: 25 }} source={require('../assets/images/icons/config.png')} />
};

export default createBottomTabNavigator({
  HomeStack,
  SalesStack,
  UsersStack,
  ArticlesStack,
  ConfigStack
});

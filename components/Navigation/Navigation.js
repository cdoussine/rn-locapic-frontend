import React from 'react';

import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';

import MapScreen from '../Screens/Map';
import HomeScreen from '../Screens/Home';
import ChatScreen from '../Screens/Chat';

var BottomNavigator = createBottomTabNavigator(
  {
    Map: MapScreen,
    Chat: ChatScreen
  },
  {
    // The lastest version of react navigation requires us to use defaultNavigationOptions instead of navigationOptions
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, horizontal, tintColor }) => {
        var iconName;
        var outline = focused
          ? ''
          : // : '-outline'; // this -outline is actually leading to a visual error. Another icon library could solve the problem.
            '';
        if (navigation.state.routeName == 'Map') {
          Platform.OS === 'ios'
            ? (iconName = 'ios-navigate')
            : (iconName = 'md-navigate');
        } else if (navigation.state.routeName == 'Chat') {
          Platform.OS === 'ios'
            ? (iconName = 'ios-chatboxes')
            : (iconName = 'md-chatboxes');
        }

        return (
          <Ionicons name={iconName + outline} size={20} color={tintColor} />
        );
      }
    }),
    tabBarOptions: {
      activeTintColor: '#cc1442',
      inactiveTintColor: '#ffffff',
      style: {
        backgroundColor: '#0273dd'
      }
    }
  }
);

StackNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: () => ({ header: null })
  },
  BottomNavigator: BottomNavigator
});

export default Navigation = createAppContainer(StackNavigator);

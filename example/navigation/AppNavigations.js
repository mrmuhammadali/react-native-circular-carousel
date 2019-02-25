import React from 'react';
import { createStackNavigator, createAppContainer } from 'react-navigation';
import CarsouselWithDropArea from '../screens/CarouselWithDropArea';
import HomeScreen from './../screens/HomeScreen';
import SimpleCarousel from '../screens/SimpleCarousel';

const AppNavigator = createStackNavigator(
  {
    Home: HomeScreen,
    SimpleCarousel: SimpleCarousel,
    CarouselWithDropArea: CarsouselWithDropArea,
  },
  {
    initialRouteName: 'Home',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: '#f4511e',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },
    },
    mode: 'modal',
  }
);

const AppContainer = createAppContainer(AppNavigator);

export default AppContainer;

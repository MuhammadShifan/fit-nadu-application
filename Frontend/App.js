import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Platform, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, CardStyleInterpolators } from '@react-navigation/stack';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import axios from 'axios';

import Login from './components/Login';
import Register from './components/Register';
import HomeScreen from './components/HomeScreen';
import ExploreGymScreen from './components/ExploreGymScreen';
import PersonalTrainerScreen from './components/PersonalTrainerScreen';
import BuySupplementScreen from './components/BuySupplementScreen';
import MyFitnessScreen from './components/MyFitnessScreen';
import GymDetailsScreen from './components/GymDetailsScreen';
import TrainerDetailsScreen from './components/TrainerDetailsScreen';
import PrivacyPolicyScreen from './components/PrivacyPolicyScreen.jsx'
import TermsOfServiceScreen from './components/TermsOfServiceScreen.jsx'

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true, 
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return;
    }
   token = (await Notifications.getExpoPushTokenAsync({
      projectId: '9bfccc00-4471-412a-8449-f01129c44563'
   })).data;

  } else {
    console.log('Must use physical device for Push Notifications');
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
  return token;
}

async function sendTokenToBackend(token) {
  try {
    const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://fit-nadu-backend.onrender.com/api';
    await axios.post(`${API_BASE_URL}/auth/save-token`, { pushToken: token });
  } catch (error) {
    console.error('Error saving push token:', error);
  }
}

const Stack = createStackNavigator();

export default function App() {
  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      if (token) {
        sendTokenToBackend(token);
      }
    });
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
          animationEnabled: false,
          gestureEnabled: false,
          cardStyleInterpolator: CardStyleInterpolators.forNoAnimation
        }}
      >
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ExploreGym" component={ExploreGymScreen} />
        <Stack.Screen name="Trainer" component={PersonalTrainerScreen} />
        <Stack.Screen name="Supplements" component={BuySupplementScreen} />
        <Stack.Screen name="Fitness" component={MyFitnessScreen} />
        <Stack.Screen name="GymDetails" component={GymDetailsScreen} />
        <Stack.Screen name="TrainerDetails" component={TrainerDetailsScreen} />
        <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} />
        <Stack.Screen name="TermsOfService" component={TermsOfServiceScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
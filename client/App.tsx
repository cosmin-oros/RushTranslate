import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home/HomeScreen';
import WelcomeScreen from './screens/welcome/WelcomeScreen';
import SettingsScreen from './screens/settings/SettingsScreen';
import PackageDetailsScreen from './screens/package_details/PackageDetailsScreen';
import SavedScreen from './screens/saved/SavedScreen';
import { Routes } from './routes/routes';
import * as SplashScreen from 'expo-splash-screen';
import i18n from './i18n';
import 'intl-pluralrules';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAppReady, setAppReady] = useState(false);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await i18n.init();
      } catch (e) {
        console.warn(e);
      } finally {
        setAppReady(true);
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (!isAppReady) {
    return null; 
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName={Routes.Welcome}>
          <Stack.Screen name={Routes.Home} component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name={Routes.Welcome} component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name={Routes.Settings} component={SettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name={Routes.PackageDetails} component={PackageDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name={Routes.Saved} component={SavedScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

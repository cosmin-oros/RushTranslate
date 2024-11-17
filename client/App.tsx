import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HomeScreen from './screens/home/HomeScreen';
import WelcomeScreen from './screens/welcome/WelcomeScreen';
import LanguageSelectionScreen from './screens/language_selection/LanguageSelectionScreen';
import SettingsScreen from './screens/settings/SettingsScreen';
import PackageDetailsScreen from './screens/package_details/PackageDetailsScreen';
import SavedScreen from './screens/saved/SavedScreen';
import { Routes } from './routes/routes';
import * as SplashScreen from 'expo-splash-screen';
import i18n from './i18n';
import 'intl-pluralrules';

const Stack = createNativeStackNavigator();

export default function App() {
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const prepareApp = async () => {
      try {
        await i18n.init();

        const appLanguage = await AsyncStorage.getItem('appLanguage');
        const targetLanguage = await AsyncStorage.getItem('targetLanguage');
        i18n.changeLanguage(appLanguage || 'en');

        // if (appLanguage && targetLanguage) {
        //   setInitialRoute(Routes.Home); // Skip onboarding if languages are set
        // } else {
        //   setInitialRoute(Routes.Welcome);
        // }
        setInitialRoute(Routes.Welcome);
      } catch (e) {
        console.warn(e);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    prepareApp();
  }, []);

  if (!initialRoute) {
    return null; // Wait for initial route determination
  }

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <NavigationContainer>
        <StatusBar style="auto" />
        <Stack.Navigator initialRouteName={initialRoute}>
          <Stack.Screen name={Routes.Home} component={HomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name={Routes.Welcome} component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name={Routes.LanguageSelection} component={LanguageSelectionScreen} options={{ headerShown: false }} />
          <Stack.Screen name={Routes.Settings} component={SettingsScreen} options={{ headerShown: false }} />
          <Stack.Screen name={Routes.PackageDetails} component={PackageDetailsScreen} options={{ headerShown: false }} />
          <Stack.Screen name={Routes.Saved} component={SavedScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}

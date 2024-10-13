import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { TamaguiProvider } from 'tamagui';
import tamaguiConfig from './tamagui.config';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home/HomeScreen';
import { Routes } from './routes/routes';

const Stack = createNativeStackNavigator();

export default function App() {

  return (
    <TamaguiProvider config={tamaguiConfig}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName={Routes.Home}>
          <Stack.Screen name={Routes.Home} component={HomeScreen} options={{ headerShown: false }} />
                  
        </Stack.Navigator>
      </NavigationContainer>
    </TamaguiProvider>
  );
}


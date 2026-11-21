import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { ActivityScreen } from './src/screens/ActivityScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { NumberCheckerScreen } from './src/screens/NumberCheckerScreen';
import { RulesScreen } from './src/screens/RulesScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563EB',
    background: '#F5F7FB',
    card: '#FFFFFF',
  },
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <NavigationContainer theme={theme}>
          <StatusBar style="dark" />
          <AppNavigator
            DashboardScreen={DashboardScreen}
            ActivityScreen={ActivityScreen}
            RulesScreen={RulesScreen}
            CheckerScreen={NumberCheckerScreen}
            SettingsScreen={SettingsScreen}
          />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

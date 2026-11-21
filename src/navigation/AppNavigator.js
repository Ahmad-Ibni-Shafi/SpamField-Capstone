import { Ionicons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export function AppNavigator({
  DashboardScreen,
  ActivityScreen,
  RulesScreen,
  CheckerScreen,
  SettingsScreen,
}) {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarHideOnKeyboard: true,
        tabBarActiveTintColor: '#2563EB',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ color, size }) => {
          const icons = {
            Dashboard: 'grid',
            Activity: 'add-circle',
            Rules: 'options',
            Checker: 'search',
            Settings: 'settings',
          };
          return <Ionicons name={icons[route.name]} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} />
      <Tab.Screen name="Activity" component={ActivityScreen} />
      <Tab.Screen name="Rules" component={RulesScreen} />
      <Tab.Screen name="Checker" component={CheckerScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBar: { height: 68, paddingTop: 6, paddingBottom: 8 },
});

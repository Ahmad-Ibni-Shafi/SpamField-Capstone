import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Alert, ScrollView, Switch, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { ScreenTitle } from '../components/ScreenTitle';
import { useAppState } from '../context/AppContext';
import { styles } from '../theme/styles';

export function SettingsScreen() {
  const { state, updateState } = useAppState();
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="Settings" subtitle="Protection preferences" />
        <Card style={styles.settingRow}>
          <View style={styles.settingText}><Text style={styles.settingTitle}>Meeting mode</Text><Text style={styles.smallText}>Adds a warning during meetings</Text></View>
          <Switch value={state.meetingMode} onValueChange={(meetingMode) => updateState({ meetingMode })} />
        </Card>
        <Card style={styles.settingRow}>
          <View style={styles.settingText}><Text style={styles.settingTitle}>Off-time protection</Text><Text style={styles.smallText}>Adds a warning outside active hours</Text></View>
          <Switch value={state.offTimeMode} onValueChange={(offTimeMode) => updateState({ offTimeMode })} />
        </Card>
        <Card style={styles.infoCard}>
          <Ionicons name="information-circle" size={22} color="#2563EB" />
          <Text style={styles.infoText}>This application uses simulated events and local rule-based classification. It cannot intercept real calls or SMS messages.</Text>
        </Card>
        <TouchableOpacity style={styles.dangerButton} onPress={() => {
          Alert.alert('Clear history?', 'This removes all analyzed activity.', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Clear', style: 'destructive', onPress: () => updateState({ history: [] }) },
          ]);
        }}>
          <Ionicons name="trash-outline" size={18} color="#DC2626" />
          <Text style={styles.dangerButtonText}>Clear Activity History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { ScreenTitle } from '../components/ScreenTitle';
import { useAppState } from '../context/AppContext';
import { analyzeActivity, normalizeNumber } from '../services/detectionService';
import { styles } from '../theme/styles';
import { badgeStyle } from '../utils/displayUtils';

export function NumberCheckerScreen() {
  const { state } = useAppState();
  const [number, setNumber] = useState('');
  const [result, setResult] = useState(null);

  function checkNumber() {
    if (!normalizeNumber(number)) {
      Alert.alert('Phone number required', 'Enter a number to check.');
      return;
    }
    setResult(analyzeActivity({
      phoneNumber: number,
      type: 'Call',
      whitelist: state.whitelist,
      blocklist: state.blocklist,
      prefixes: state.prefixes,
      regexRules: state.regexRules,
      history: state.history,
      meetingMode: state.meetingMode,
      offTimeMode: state.offTimeMode,
    }));
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="Number Checker" subtitle="Check reputation using local rules" />
        <Card>
          <Text style={styles.label}>Phone number</Text>
          <TextInput value={number} onChangeText={setNumber} placeholder="+91 98765 43210" keyboardType="phone-pad" style={styles.input} />
          <TouchableOpacity style={styles.primaryButton} onPress={checkNumber}>
            <Ionicons name="search" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Check Number</Text>
          </TouchableOpacity>
        </Card>
        {result ? (
          <Card style={styles.resultCard}>
            <Text style={styles.sectionTitle}>Reputation analysis</Text>
            <Text style={styles.scoreText}>{result.score}</Text>
            <Text style={styles.scoreLabel}>risk score out of 100</Text>
            <Text style={[styles.badge, badgeStyle(result.classification)]}>{result.classification}</Text>
            {result.reasons.map((reason) => <Text key={reason} style={styles.reasonText}>• {reason}</Text>)}
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

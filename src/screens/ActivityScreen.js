import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { ScreenTitle } from '../components/ScreenTitle';
import { useAppState } from '../context/AppContext';
import { normalizeNumber } from '../services/detectionService';
import { styles } from '../theme/styles';
import { badgeStyle } from '../utils/displayUtils';

export function ActivityScreen() {
  const { history, addActivity } = useAppState();
  const [type, setType] = useState('Call');
  const [number, setNumber] = useState('');
  const [message, setMessage] = useState('');
  const [result, setResult] = useState(null);

  function simulate() {
    if (!normalizeNumber(number)) {
      Alert.alert('Phone number required', 'Enter a phone number first.');
      return;
    }
    addActivity(type, number, message, setResult);
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="Simulate Activity" subtitle="Test the rule-based detection system" />
        <Card>
          <Text style={styles.label}>Activity type</Text>
          <View style={styles.segment}>
            {['Call', 'SMS'].map((option) => (
              <TouchableOpacity key={option} style={[styles.segmentButton, type === option && styles.segmentActive]} onPress={() => setType(option)}>
                <Text style={[styles.segmentText, type === option && styles.segmentTextActive]}>{option}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.label}>Phone number</Text>
          <TextInput value={number} onChangeText={setNumber} placeholder="+91 98765 43210" keyboardType="phone-pad" style={styles.input} />
          {type === 'SMS' ? (
            <>
              <Text style={styles.label}>SMS message</Text>
              <TextInput value={message} onChangeText={setMessage} placeholder="Enter an example message" multiline style={[styles.input, styles.messageInput]} />
            </>
          ) : null}
          <TouchableOpacity style={styles.primaryButton} onPress={simulate}>
            <Ionicons name="play" size={18} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Analyze Activity</Text>
          </TouchableOpacity>
        </Card>
        {result ? (
          <Card style={styles.resultCard}>
            <Text style={styles.sectionTitle}>Detection result</Text>
            <View style={styles.resultRow}><Text style={styles.resultLabel}>Classification</Text><Text style={[styles.badge, badgeStyle(result.classification)]}>{result.classification}</Text></View>
            <View style={styles.resultRow}><Text style={styles.resultLabel}>Risk level</Text><Text style={styles.valueText}>{result.risk}</Text></View>
            <View style={styles.resultRow}><Text style={styles.resultLabel}>Risk score</Text><Text style={styles.valueText}>{result.score}/100</Text></View>
            {result.reasons.map((reason) => <Text key={reason} style={styles.reasonText}>• {reason}</Text>)}
          </Card>
        ) : null}
        <View style={styles.sectionHeader}><Text style={styles.sectionTitle}>Test history</Text></View>
        {history.slice(0, 5).map((item) => (
          <Card key={item.id} style={styles.historyRow}>
            <View><Text style={styles.phoneText}>{item.number}</Text><Text style={styles.smallText}>{item.type}  •  {item.classification}</Text></View>
            <Text style={[styles.badge, badgeStyle(item.classification)]}>{item.risk}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

import { Ionicons } from '@expo/vector-icons';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { AppProvider, useAppState } from './src/context/AppContext';
import { AppNavigator } from './src/navigation/AppNavigator';
import { analyzeActivity, normalizeNumber } from './src/services/detectionService';
import { Card } from './src/components/Card';
import { ScreenTitle } from './src/components/ScreenTitle';

const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#2563EB',
    background: '#F5F7FB',
    card: '#FFFFFF',
  },
};


function DashboardScreen() {
  const { history } = useAppState();
  const spamCount = history.filter((item) => item.classification === 'Spam').length;
  const suspiciousCount = history.filter((item) => item.classification === 'Suspicious').length;
  const trustedCount = history.filter((item) => item.classification === 'Trusted').length;

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="SpamShield" subtitle="Call and SMS protection dashboard" />

        <View style={styles.statsGrid}>
          <StatCard icon="shield-checkmark" label="Protected" value={history.length} color="#2563EB" />
          <StatCard icon="alert-circle" label="Spam" value={spamCount} color="#DC2626" />
          <StatCard icon="warning" label="Suspicious" value={suspiciousCount} color="#EA580C" />
          <StatCard icon="checkmark-circle" label="Trusted" value={trustedCount} color="#16A34A" />
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent activity</Text>
          <Text style={styles.countText}>{history.length} records</Text>
        </View>

        {history.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No activity yet. Simulate a call or SMS to begin.</Text>
          </Card>
        ) : (
          history.slice(0, 10).map((item) => (
            <Card key={item.id} style={styles.activityCard}>
              <View style={[styles.iconCircle, { backgroundColor: classificationColor(item.classification) }]}>
                <Ionicons
                  name={item.type === 'Call' ? 'call' : 'chatbubble'}
                  size={18}
                  color="#FFFFFF"
                />
              </View>
              <View style={styles.activityText}>
                <Text style={styles.phoneText}>{item.number}</Text>
                <Text style={styles.smallText}>{item.type}  •  {item.timeLabel}</Text>
              </View>
              <Text style={[styles.badge, badgeStyle(item.classification)]}>{item.classification}</Text>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

function ActivityScreen() {
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

    addActivity(type, number, message, (newResult) => setResult(newResult));
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="Simulate Activity" subtitle="Test the rule-based detection system" />

        <Card>
          <Text style={styles.label}>Activity type</Text>
          <View style={styles.segment}>
            {['Call', 'SMS'].map((option) => (
              <TouchableOpacity
                key={option}
                style={[styles.segmentButton, type === option && styles.segmentActive]}
                onPress={() => setType(option)}
              >
                <Text style={[styles.segmentText, type === option && styles.segmentTextActive]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Text style={styles.label}>Phone number</Text>
          <TextInput
            value={number}
            onChangeText={setNumber}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            style={styles.input}
          />

          {type === 'SMS' ? (
            <>
              <Text style={styles.label}>SMS message</Text>
              <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Enter an example message"
                multiline
                style={[styles.input, styles.messageInput]}
              />
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
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Classification</Text>
              <Text style={[styles.badge, badgeStyle(result.classification)]}>{result.classification}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Risk level</Text>
              <Text style={styles.valueText}>{result.risk}</Text>
            </View>
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Risk score</Text>
              <Text style={styles.valueText}>{result.score}/100</Text>
            </View>
            {result.reasons.map((reason) => (
              <Text key={reason} style={styles.reasonText}>• {reason}</Text>
            ))}
          </Card>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Test history</Text>
        </View>
        {history.slice(0, 5).map((item) => (
          <Card key={item.id} style={styles.historyRow}>
            <View>
              <Text style={styles.phoneText}>{item.number}</Text>
              <Text style={styles.smallText}>{item.type}  •  {item.classification}</Text>
            </View>
            <Text style={[styles.badge, badgeStyle(item.classification)]}>{item.risk}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

function RulesScreen() {
  const { state, updateState } = useAppState();
  const { whitelist, blocklist, prefixes, regexRules } = state;
  const onUpdate = updateState;
  const [value, setValue] = useState('');
  const [activeList, setActiveList] = useState('Whitelist');

  function addValue() {
    if (!value.trim()) return;
    const text = value.trim();

    if (activeList === 'Whitelist') {
      if (!whitelist.includes(text)) onUpdate({ whitelist: [...whitelist, text] });
    } else if (activeList === 'Blocklist') {
      if (!blocklist.includes(text)) onUpdate({ blocklist: [...blocklist, text] });
    } else if (activeList === 'Prefixes') {
      if (!prefixes.includes(text)) onUpdate({ prefixes: [...prefixes, text] });
    } else if (!regexRules.includes(text)) {
      onUpdate({ regexRules: [...regexRules, text] });
    }
    setValue('');
  }

  const listMap = {
    Whitelist: whitelist,
    Blocklist: blocklist,
    Prefixes: prefixes,
    Regex: regexRules,
  };
  const selectedList = listMap[activeList];

  function removeValue(item) {
    if (activeList === 'Whitelist') onUpdate({ whitelist: whitelist.filter((valueItem) => valueItem !== item) });
    if (activeList === 'Blocklist') onUpdate({ blocklist: blocklist.filter((valueItem) => valueItem !== item) });
    if (activeList === 'Prefixes') onUpdate({ prefixes: prefixes.filter((valueItem) => valueItem !== item) });
    if (activeList === 'Regex') onUpdate({ regexRules: regexRules.filter((valueItem) => valueItem !== item) });
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="Detection Rules" subtitle="Customize trusted and blocked numbers" />

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {Object.keys(listMap).map((option) => (
            <TouchableOpacity
              key={option}
              style={[styles.ruleTab, activeList === option && styles.ruleTabActive]}
              onPress={() => setActiveList(option)}
            >
              <Text style={[styles.ruleTabText, activeList === option && styles.ruleTabTextActive]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Card>
          <Text style={styles.label}>Add {activeList === 'Regex' ? 'regular expression' : activeList.toLowerCase()} rule</Text>
          <View style={styles.addRow}>
            <TextInput
              value={value}
              onChangeText={setValue}
              placeholder={
                activeList === 'Regex'
                  ? '^1800'
                  : activeList === 'Prefixes'
                    ? '+1'
                    : '+91 98765 43210'
              }
              style={[styles.input, styles.addInput]}
            />
            <TouchableOpacity style={styles.addButton} onPress={addValue}>
              <Ionicons name="add" size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </Card>

        <Text style={styles.sectionTitle}>{activeList} ({selectedList.length})</Text>
        {selectedList.length === 0 ? (
          <Card>
            <Text style={styles.emptyText}>No rules in this list.</Text>
          </Card>
        ) : (
          selectedList.map((item) => (
            <Card key={item} style={styles.ruleRow}>
              <Text style={styles.ruleText}>{item}</Text>
              <TouchableOpacity onPress={() => removeValue(item)}>
                <Ionicons name="trash-outline" size={20} color="#DC2626" />
              </TouchableOpacity>
            </Card>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

function CheckerScreen() {
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
          <TextInput
            value={number}
            onChangeText={setNumber}
            placeholder="+91 98765 43210"
            keyboardType="phone-pad"
            style={styles.input}
          />
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
            <View style={styles.resultRow}>
              <Text style={styles.resultLabel}>Status</Text>
              <Text style={[styles.badge, badgeStyle(result.classification)]}>{result.classification}</Text>
            </View>
            {result.reasons.map((reason) => (
              <Text key={reason} style={styles.reasonText}>• {reason}</Text>
            ))}
          </Card>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function SettingsScreen() {
  const { state, updateState } = useAppState();
  const onUpdate = updateState;
  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="Settings" subtitle="Protection preferences" />

        <Card style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Meeting mode</Text>
            <Text style={styles.smallText}>Adds a warning during meetings</Text>
          </View>
          <Switch
            value={state.meetingMode}
            onValueChange={(meetingMode) => onUpdate({ meetingMode })}
          />
        </Card>

        <Card style={styles.settingRow}>
          <View style={styles.settingText}>
            <Text style={styles.settingTitle}>Off-time protection</Text>
            <Text style={styles.smallText}>Adds a warning outside active hours</Text>
          </View>
          <Switch
            value={state.offTimeMode}
            onValueChange={(offTimeMode) => onUpdate({ offTimeMode })}
          />
        </Card>

        <Card style={styles.infoCard}>
          <Ionicons name="information-circle" size={22} color="#2563EB" />
          <Text style={styles.infoText}>
            This application uses simulated events and local rule-based classification.
            It cannot intercept real calls or SMS messages.
          </Text>
        </Card>

        <TouchableOpacity
          style={styles.dangerButton}
          onPress={() => {
            Alert.alert('Clear history?', 'This removes all analyzed activity.', [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Clear', style: 'destructive', onPress: () => updateState({ history: [] }) },
            ]);
          }}
        >
          <Ionicons name="trash-outline" size={18} color="#DC2626" />
          <Text style={styles.dangerButtonText}>Clear Activity History</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

function classificationColor(classification) {
  if (classification === 'Spam') return '#DC2626';
  if (classification === 'Suspicious') return '#EA580C';
  if (classification === 'Trusted') return '#16A34A';
  return '#64748B';
}

function badgeStyle(classification) {
  return {
    color: classificationColor(classification),
    backgroundColor: `${classificationColor(classification)}18`,
  };
}

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
            CheckerScreen={CheckerScreen}
            SettingsScreen={SettingsScreen}
          />
        </NavigationContainer>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: '#F5F7FB' },
  content: { padding: 16, paddingBottom: 30 },
  titleBlock: { marginBottom: 18 },
  title: { color: '#172033', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#64748B', fontSize: 14, marginTop: 4 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statCard: { width: '48%', minHeight: 112, marginBottom: 12 },
  statValue: { color: '#172033', fontSize: 26, fontWeight: '800', marginTop: 8 },
  statLabel: { color: '#64748B', fontSize: 13, marginTop: 2 },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, marginBottom: 8 },
  sectionTitle: { color: '#172033', fontSize: 17, fontWeight: '800', marginBottom: 8 },
  countText: { color: '#64748B', fontSize: 13 },
  emptyText: { color: '#64748B', textAlign: 'center', paddingVertical: 8 },
  activityCard: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: { width: 38, height: 38, borderRadius: 19, alignItems: 'center', justifyContent: 'center' },
  activityText: { flex: 1, marginLeft: 12 },
  phoneText: { color: '#172033', fontSize: 15, fontWeight: '700' },
  smallText: { color: '#64748B', fontSize: 12, marginTop: 3 },
  badge: { fontSize: 12, fontWeight: '700', borderRadius: 12, paddingHorizontal: 9, paddingVertical: 5, overflow: 'hidden' },
  label: { color: '#475569', fontSize: 13, fontWeight: '700', marginBottom: 8 },
  segment: { flexDirection: 'row', backgroundColor: '#EEF2F7', borderRadius: 12, padding: 4, marginBottom: 14 },
  segmentButton: { flex: 1, alignItems: 'center', borderRadius: 9, paddingVertical: 10 },
  segmentActive: { backgroundColor: '#2563EB' },
  segmentText: { color: '#64748B', fontWeight: '700' },
  segmentTextActive: { color: '#FFFFFF' },
  input: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#DCE3EC', backgroundColor: '#FAFBFD', paddingHorizontal: 14, color: '#172033', marginBottom: 14 },
  messageInput: { height: 90, textAlignVertical: 'top', paddingTop: 12 },
  primaryButton: { height: 48, borderRadius: 12, backgroundColor: '#2563EB', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  primaryButtonText: { color: '#FFFFFF', fontWeight: '800', fontSize: 15 },
  resultCard: { marginTop: 4 },
  resultRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 8 },
  resultLabel: { color: '#64748B', fontWeight: '600' },
  valueText: { color: '#172033', fontWeight: '800' },
  reasonText: { color: '#475569', lineHeight: 21, marginTop: 4 },
  historyRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  tabScroll: { marginBottom: 12 },
  ruleTab: { borderRadius: 20, backgroundColor: '#E8EDF5', marginRight: 8, paddingHorizontal: 14, paddingVertical: 9 },
  ruleTabActive: { backgroundColor: '#2563EB' },
  ruleTabText: { color: '#64748B', fontWeight: '700' },
  ruleTabTextActive: { color: '#FFFFFF' },
  addRow: { flexDirection: 'row', alignItems: 'flex-start' },
  addInput: { flex: 1, marginBottom: 0, marginRight: 8 },
  addButton: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#2563EB', alignItems: 'center', justifyContent: 'center' },
  ruleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  ruleText: { color: '#172033', flex: 1, marginRight: 12 },
  scoreText: { color: '#2563EB', fontSize: 44, fontWeight: '900', textAlign: 'center' },
  scoreLabel: { color: '#64748B', textAlign: 'center', marginBottom: 12 },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingText: { flex: 1, paddingRight: 16 },
  settingTitle: { color: '#172033', fontSize: 16, fontWeight: '800' },
  infoCard: { flexDirection: 'row', alignItems: 'flex-start', marginTop: 4 },
  infoText: { color: '#475569', flex: 1, lineHeight: 20, marginLeft: 10 },
  dangerButton: { height: 48, borderRadius: 12, borderWidth: 1, borderColor: '#FCA5A5', backgroundColor: '#FEF2F2', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8 },
  dangerButtonText: { color: '#DC2626', fontWeight: '800' },
  tabBar: { height: 68, paddingTop: 6, paddingBottom: 8 },
});

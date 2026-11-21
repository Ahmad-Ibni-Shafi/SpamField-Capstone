import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { ScreenTitle } from '../components/ScreenTitle';
import { useAppState } from '../context/AppContext';
import { styles } from '../theme/styles';
import { badgeStyle, classificationColor } from '../utils/displayUtils';

function StatCard({ icon, label, value, color }) {
  return (
    <Card style={styles.statCard}>
      <Ionicons name={icon} size={22} color={color} />
      <Text style={styles.statValue}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Card>
  );
}

export function DashboardScreen() {
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
        ) : history.slice(0, 10).map((item) => (
          <Card key={item.id} style={styles.activityCard}>
            <View style={[styles.iconCircle, { backgroundColor: classificationColor(item.classification) }]}>
              <Ionicons name={item.type === 'Call' ? 'call' : 'chatbubble'} size={18} color="#FFFFFF" />
            </View>
            <View style={styles.activityText}>
              <Text style={styles.phoneText}>{item.number}</Text>
              <Text style={styles.smallText}>{item.type}  •  {item.timeLabel}</Text>
            </View>
            <Text style={[styles.badge, badgeStyle(item.classification)]}>{item.classification}</Text>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

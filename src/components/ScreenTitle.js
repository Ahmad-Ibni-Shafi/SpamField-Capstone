import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export function ScreenTitle({ title, subtitle }) {
  return (
    <View style={styles.titleBlock}>
      <Text style={styles.title}>{title}</Text>
      {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  titleBlock: { marginBottom: 18 },
  title: { color: '#172033', fontSize: 28, fontWeight: '800' },
  subtitle: { color: '#64748B', fontSize: 14, marginTop: 4 },
});

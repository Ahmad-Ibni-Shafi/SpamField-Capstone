import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../components/Card';
import { ScreenTitle } from '../components/ScreenTitle';
import { useAppState } from '../context/AppContext';
import { styles } from '../theme/styles';

export function RulesScreen() {
  const { state, updateState } = useAppState();
  const { whitelist, blocklist, prefixes, regexRules } = state;
  const [value, setValue] = useState('');
  const [activeList, setActiveList] = useState('Whitelist');
  const listMap = { Whitelist: whitelist, Blocklist: blocklist, Prefixes: prefixes, Regex: regexRules };
  const selectedList = listMap[activeList];

  function addValue() {
    if (!value.trim()) return;
    const text = value.trim();
    if (activeList === 'Whitelist' && !whitelist.includes(text)) updateState({ whitelist: [...whitelist, text] });
    if (activeList === 'Blocklist' && !blocklist.includes(text)) updateState({ blocklist: [...blocklist, text] });
    if (activeList === 'Prefixes' && !prefixes.includes(text)) updateState({ prefixes: [...prefixes, text] });
    if (activeList === 'Regex' && !regexRules.includes(text)) updateState({ regexRules: [...regexRules, text] });
    setValue('');
  }

  function removeValue(item) {
    if (activeList === 'Whitelist') updateState({ whitelist: whitelist.filter((valueItem) => valueItem !== item) });
    if (activeList === 'Blocklist') updateState({ blocklist: blocklist.filter((valueItem) => valueItem !== item) });
    if (activeList === 'Prefixes') updateState({ prefixes: prefixes.filter((valueItem) => valueItem !== item) });
    if (activeList === 'Regex') updateState({ regexRules: regexRules.filter((valueItem) => valueItem !== item) });
  }

  return (
    <SafeAreaView style={styles.screen} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <ScreenTitle title="Detection Rules" subtitle="Customize trusted and blocked numbers" />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {Object.keys(listMap).map((option) => (
            <TouchableOpacity key={option} style={[styles.ruleTab, activeList === option && styles.ruleTabActive]} onPress={() => setActiveList(option)}>
              <Text style={[styles.ruleTabText, activeList === option && styles.ruleTabTextActive]}>{option}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <Card>
          <Text style={styles.label}>Add {activeList === 'Regex' ? 'regular expression' : activeList.toLowerCase()} rule</Text>
          <View style={styles.addRow}>
            <TextInput value={value} onChangeText={setValue} placeholder={activeList === 'Regex' ? '^1800' : activeList === 'Prefixes' ? '+1' : '+91 98765 43210'} style={[styles.input, styles.addInput]} />
            <TouchableOpacity style={styles.addButton} onPress={addValue}><Ionicons name="add" size={24} color="#FFFFFF" /></TouchableOpacity>
          </View>
        </Card>
        <Text style={styles.sectionTitle}>{activeList} ({selectedList.length})</Text>
        {selectedList.length === 0 ? (
          <Card><Text style={styles.emptyText}>No rules in this list.</Text></Card>
        ) : selectedList.map((item) => (
          <Card key={item} style={styles.ruleRow}>
            <Text style={styles.ruleText}>{item}</Text>
            <TouchableOpacity onPress={() => removeValue(item)}><Ionicons name="trash-outline" size={20} color="#DC2626" /></TouchableOpacity>
          </Card>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

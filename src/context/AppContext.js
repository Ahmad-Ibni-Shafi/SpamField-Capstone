import React, { createContext, useContext, useEffect, useState } from 'react';
import { analyzeActivity, normalizeNumber } from '../services/detectionService';
import { loadAppState, saveAppState } from '../database/storageService';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState({
    whitelist: ['+919876543210'],
    blocklist: ['+18005550199'],
    prefixes: ['+91'],
    regexRules: ['^1800'],
    history: [],
    meetingMode: false,
    offTimeMode: false,
  });
  const [storageReady, setStorageReady] = useState(false);

  useEffect(() => {
    loadAppState().then((storedState) => {
      if (storedState) setState(storedState);
      setStorageReady(true);
    }).catch(() => setStorageReady(true));
  }, []);

  useEffect(() => {
    if (storageReady) saveAppState(state).catch(() => {});
  }, [state, storageReady]);

  function updateState(patch) {
    setState((current) => ({ ...current, ...patch }));
  }

  function addActivity(type, number, message, onResult) {
    const result = analyzeActivity({
      phoneNumber: number,
      message,
      type,
      whitelist: state.whitelist,
      blocklist: state.blocklist,
      prefixes: state.prefixes,
      regexRules: state.regexRules,
      history: state.history,
      meetingMode: state.meetingMode,
      offTimeMode: state.offTimeMode,
    });

    const now = new Date();
    const activity = {
      id: `${now.getTime()}-${state.history.length}`,
      number,
      type,
      message,
      time: now.toISOString(),
      timeLabel: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      classification: result.classification,
      risk: result.risk,
      score: result.score,
      reasons: result.reasons,
    };

    setState((current) => ({ ...current, history: [activity, ...current.history] }));
    onResult(result);
  }

  return (
    <AppContext.Provider
      value={{ state, history: state.history, updateState, addActivity, normalizeNumber }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useAppState() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppState must be used inside AppProvider');
  return context;
}

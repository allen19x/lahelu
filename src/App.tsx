import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootNavigation from './navigation';

const queryClient = new QueryClient();

const App = () => {
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(true);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const checkForUpdates = async () => {
    try {
      const update = await Updates.checkForUpdateAsync();
      if (update.isAvailable) {
        setIsUpdateAvailable(true);
      } else {
        setIsCheckingForUpdate(false);
      }
    } catch (e) {
      console.error('Error checking for updates:', e);
      setIsCheckingForUpdate(false);
    }
  };

  const applyUpdate = async () => {
    try {
      setIsUpdating(true);
      await Updates.fetchUpdateAsync();
      Updates.reloadAsync();
    } catch (e) {
      console.error('Error applying update:', e);
      setIsUpdating(false);
      setIsCheckingForUpdate(false);
    }
  };

  useEffect(() => {
    checkForUpdates();
  }, []);

  if (isCheckingForUpdate) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text style={styles.checkForUpdateText}>Checking for updates...</Text>
      </View>
    );
  }

  if (isUpdateAvailable) {
    return (
      <View style={styles.centered}>
        <Text style={styles.updateAvailText}>An update is available!</Text>
        {isUpdating ? (
          <ActivityIndicator size="small" color="#0000ff" />
        ) : (
          <Button color="#0000ff" title="Restart to Update" onPress={applyUpdate} />
        )}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  updateBanner: {
    position: 'absolute',
    top: 20,
    left: 0,
    right: 0,
    backgroundColor: '#f0ad4e',
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkForUpdateText: {
    marginTop: 20,
    color: '#0000ff',
  },
  updateAvailText: {
    marginBottom: 20,
    color: '#0000ff',
  },
});

export default App;

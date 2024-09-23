import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet } from 'react-native';
import * as Updates from 'expo-updates';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootNavigation from './navigation';

const queryClient = new QueryClient();

const App = () => {
  const [isCheckingForUpdate, setIsCheckingForUpdate] = useState(false);
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const checkForUpdates = async () => {
    try {
      setIsCheckingForUpdate(true);
      const update = await Updates.checkForUpdateAsync();
      setIsCheckingForUpdate(false);

      if (update.isAvailable) {
        setIsUpdateAvailable(true);  // Mark that an update is available
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
      // Apply the update and restart the app
      Updates.reloadAsync();
    } catch (e) {
      console.error('Error applying update:', e);
      setIsUpdating(false);
    }
  };

  useEffect(() => {
    checkForUpdates();  // Check for updates when the app starts
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <QueryClientProvider client={queryClient}>
        {/* If update is available, show notification */}
        {isCheckingForUpdate ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#0000ff" />
            <Text>Checking for updates...</Text>
          </View>
        ) : isUpdateAvailable ? (
          <View style={styles.updateBanner}>
            <Text>An update is available!</Text>
            {isUpdating ? (
              <ActivityIndicator size="small" color="#00ff00" />
            ) : (
              <Button title="Restart to Update" onPress={applyUpdate} />
            )}
          </View>
        ) : null}

        <RootNavigation />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  centered: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
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
});

export default App;
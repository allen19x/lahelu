import React, { useEffect, useState } from 'react';
import { View, Text, Button, ActivityIndicator, StyleSheet, StatusBar } from 'react-native';
import * as Updates from 'expo-updates';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

import RootNavigation from './navigation';
import colorScheme from '@/assets/themes/colorScheme';

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
        setIsCheckingForUpdate(false)
      } else {
        setIsCheckingForUpdate(false);
      }
    } catch (e) {
      console.error('Error checking for updates:', e);
    } finally {
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
    } finally {
      setIsCheckingForUpdate(false);
    }
  };

  useEffect(() => {
    checkForUpdates();
  }, []);

  if (isCheckingForUpdate) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colorScheme.$primaryBlueColor} />
        <Text style={styles.checkForUpdateText}>Checking for updates...</Text>
      </View>
    );
  }

  if (isUpdateAvailable) {
    return (
      <View style={styles.centered}>
        <Text style={styles.updateAvailText}>An update is available!</Text>
        {isUpdating ? (
          <ActivityIndicator size="small" color={colorScheme.$primaryBlueColor} />
        ) : (
          <Button color={colorScheme.$primaryBlueColor} title="Restart to Update" onPress={applyUpdate} />
        )}
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={colorScheme.$blackBg}
        translucent={false}
      />
      <QueryClientProvider client={queryClient}>
        <RootNavigation />
      </QueryClientProvider>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  centered: {
    backgroundColor: 'black',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkForUpdateText: {
    marginTop: 20,
    color: colorScheme.$primaryBlueColor,
  },
  updateAvailText: {
    marginBottom: 20,
    color: colorScheme.$primaryBlueColor,
  },
});

export default App;

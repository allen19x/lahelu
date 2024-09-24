import React, { Suspense, lazy } from 'react';
import { ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import colorScheme from '@/assets/themes/colorScheme';
import { navigationRef } from './Stacks/Navigator';
const DrawerNavigatorLazy = lazy(() => import('./DrawerNavigator/DrawerNavigator')); // Lazy load the drawer navigator

const RootNavigation = () => {
  return (
    <Suspense>
      <NavigationContainer ref={navigationRef}>
        <DrawerNavigatorLazy />
      </NavigationContainer>
    </Suspense>
  );
};

export default RootNavigation;

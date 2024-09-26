import React, { Suspense, lazy } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './Stacks/Navigator';
const DrawerNavigatorLazy = lazy(() => import('./DrawerNavigator/DrawerNavigator'));

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

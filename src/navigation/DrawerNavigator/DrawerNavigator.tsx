import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';

import BottomTabNavigator from '../BottomTabBar/BottomTabBar';
import { BOTTOM_TAB } from '@/src/constants/RootKey';
import colorScheme from '@/assets/themes/colorScheme';

const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colorScheme.$blackBg,
          width: 240,
        },
      }}>
      <Drawer.Screen name={BOTTOM_TAB} component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
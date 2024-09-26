import React from 'react';
import { createDrawerNavigator, DrawerContentComponentProps, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

import { fetchActiveTab, updateActiveTab } from '@/src/react-query/states/Drawer';
import BottomTabNavigator from '../BottomTabBar/BottomTabBar';
import { BOTTOM_TAB, TOPICS_SCREEN, HOME_SCREEN } from '@/src/constants/RootKey';
import colorScheme from '@/assets/themes/colorScheme';

const Drawer = createDrawerNavigator();

const CustomDrawerContent = (props: DrawerContentComponentProps) => {
  const { data: activeTab } = useQuery({
    queryKey: ['activeTab'],
    queryFn: fetchActiveTab,
  });
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateActiveTab,
    onSuccess: (newTab) => {
      queryClient.setQueryData(['activeTab'], newTab);
    },
  });

  const handleNavUpdateDrawer = (newTab: string, currDrawer: string) => {
    props.navigation.navigate(newTab)
    mutation.mutate(currDrawer);
  };

  return (
    <DrawerContentScrollView {...props}>
      <DrawerItem
        label="Home"
        labelStyle={{ color: colorScheme.$whiteCream }}
        icon={() => <Ionicons name="home" size={24} color={colorScheme.$whiteCream} />}
        onPress={() => handleNavUpdateDrawer(HOME_SCREEN, 'Home')}
        style={{
          backgroundColor: activeTab === 'Home' ? colorScheme.$primaryBlueColor : 'transparent',
        }}
      />
      <DrawerItem
        label="Fresh"
        labelStyle={{ color: colorScheme.$whiteCream }}
        icon={() => <Ionicons name="time" size={24} color={colorScheme.$whiteCream} />}
        onPress={() => handleNavUpdateDrawer(HOME_SCREEN, 'Fresh')}
        style={{
          backgroundColor: activeTab === 'Fresh' ? colorScheme.$primaryBlueColor : 'transparent',
        }}
      />
      <DrawerItem
        label="Trending"
        labelStyle={{ color: colorScheme.$whiteCream }}
        icon={() => <MaterialIcons name="trending-up" size={24} color={colorScheme.$whiteCream} />}
        onPress={() => handleNavUpdateDrawer(HOME_SCREEN, 'Trending')}
        style={{
          backgroundColor: activeTab === 'Trending' ? colorScheme.$primaryBlueColor : 'transparent',
        }}
      />
      <DrawerItem
        label="Topik"
        labelStyle={{ color: colorScheme.$whiteCream }}
        icon={() => <Ionicons name="person" size={24} color={colorScheme.$whiteCream} />}
        onPress={() => handleNavUpdateDrawer(TOPICS_SCREEN, TOPICS_SCREEN)}
        style={{
          backgroundColor: activeTab === TOPICS_SCREEN ? colorScheme.$primaryBlueColor : 'transparent',
        }}
      />
    </DrawerContentScrollView>
  );
};

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: colorScheme.$blackBg,
          width: 200,
        },
      }}>
      <Drawer.Screen name={BOTTOM_TAB} component={BottomTabNavigator} />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
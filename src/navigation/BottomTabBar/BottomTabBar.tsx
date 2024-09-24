import React from 'react';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import { COMMUNITY_SCREEN, HOME_SCREEN } from '@/src/constants/RootKey';
import colorScheme from '@/assets/themes/colorScheme';
import HomeScreen from '@/src/screens/HomeScreen/HomeScreen';
import CommunityScreen from '@/src/screens/CommunityScreen/CommunityScreen';

const viewportWidth = (percent: number) => (Dimensions.get('window').width * percent) / 100;

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName = 'home'
                    if (route.name === HOME_SCREEN) {
                        iconName = 'home';
                    } else if (route.name === COMMUNITY_SCREEN) {
                        iconName = 'person';
                    }
                    return <Ionicons name={iconName as keyof typeof Ionicons.glyphMap} size={size} color={color} />;
                },
                tabBarStyle: {
                    borderTopWidth: 0,
                    position: 'absolute',
                    backgroundColor: colorScheme.$blackBg,
                    paddingHorizontal: viewportWidth(4),
                    paddingBottom: 5,
                },
                tabBarShowLabel: false,
                tabBarActiveTintColor: colorScheme.$primaryBlueColor,
                tabBarInactiveTintColor: colorScheme.$whiteCream,
            })}>
            <Tab.Screen
                name={HOME_SCREEN}
                component={HomeScreen} />
            <Tab.Screen
                name={COMMUNITY_SCREEN}
                component={CommunityScreen} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
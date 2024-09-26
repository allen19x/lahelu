import React from 'react';
import { Dimensions } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Ionicons } from '@expo/vector-icons';

import { updateActiveTab } from '@/src/react-query/states/Drawer';
import { TOPICS_SCREEN, HOME_SCREEN } from '@/src/constants/RootKey';
import colorScheme from '@/assets/themes/colorScheme';
import HomeScreen from '@/src/screens/HomeScreen';
import TopicsScreen from '@/src/screens/TopicsScreen';

const viewportWidth = (percent: number) => (Dimensions.get('window').width * percent) / 100;

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
    const queryClient = useQueryClient();
    const mutation = useMutation({
        mutationFn: updateActiveTab,
        onSuccess: (newTab) => {
            queryClient.setQueryData(['activeTab'], newTab);
        },
    });

    const handleTabPress = (tabName: string) => {
        mutation.mutate(tabName);
    };

    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarIcon: ({ color, size }) => {
                    let iconName = 'home';
                    if (route.name === HOME_SCREEN) {
                        iconName = 'home';
                    } else if (route.name === TOPICS_SCREEN) {
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
                component={HomeScreen}
                listeners={{
                    tabPress: () => handleTabPress('Home'),
                }} />
            <Tab.Screen
                name={TOPICS_SCREEN}
                component={TopicsScreen}
                listeners={{
                    tabPress: () => handleTabPress(TOPICS_SCREEN),
                }} />
        </Tab.Navigator>
    );
};

export default BottomTabNavigator;
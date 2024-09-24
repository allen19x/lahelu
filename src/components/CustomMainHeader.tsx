import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, } from 'react-native';
import { DrawerActions, useNavigation } from '@react-navigation/native';
import { HeaderProps } from '../Models/HomeModel';
import { Ionicons } from '@expo/vector-icons';
import colorScheme from '@/assets/themes/colorScheme';

const CustomMainHeader: React.FC<HeaderProps> = ({ activeTab, setActiveTab, setIsTabClicked, tabList, }) => {
    const navigation = useNavigation();

    const openDrawer = () => {
        navigation.dispatch(DrawerActions.openDrawer())
    };

    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <View style={styles.topheaderLeft}>
                    <TouchableOpacity
                        onPress={openDrawer}
                        style={styles.menuIcon}>
                        <Ionicons name="menu" size={24} color={colorScheme.$whiteCream} />
                    </TouchableOpacity>
                    <Text style={styles.title}>LAHELU</Text>
                </View>
                <TouchableOpacity style={styles.searchIcon}>
                    <Ionicons name="search" size={24} color={colorScheme.$whiteCream} />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                {tabList.map((item) => {
                    return (
                        <TouchableOpacity
                            key={item.id}
                            style={[styles.buttonContainer, activeTab === item.tabName && styles.activeButtonContainer]}
                            onPress={() => {
                                setIsTabClicked(true)
                                setActiveTab(item.tabName)
                            }}>
                            <Text style={[styles.tabText, activeTab === item.tabName && styles.activeTabText]}>{item.tabName}</Text>
                        </TouchableOpacity>
                    )
                })}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: colorScheme.$blackBg,
    },
    topHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 4,
    },
    topheaderLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    menuIcon: {
        paddingVertical: 10,
        paddingRight: 20
    },
    searchIcon: {
        padding: 10,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: colorScheme.$primaryBlueColor,
        textShadowColor: colorScheme.$blackBg,
        textShadowOffset: { width: 2, height: 2 },
        textShadowRadius: 5,
    },
    tabContainer: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        borderTopWidth: 1,
        borderBottomWidth: 1,
        borderColor: 'black'
    },
    buttonContainer: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    activeButtonContainer: {
        flex: 1,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
        borderBottomWidth: 1,
        borderBottomColor: colorScheme.$primaryBlueColor,
    },
    tabText: {
        color: colorScheme.$whiteCream,
        fontSize: 14,
        paddingHorizontal: 20,
    },
    activeTabText: {
        color: colorScheme.$primaryBlueColor,
        fontWeight: 'bold',
    },
});

export default CustomMainHeader;

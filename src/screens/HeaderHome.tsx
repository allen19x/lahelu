import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { HeaderProps } from "@/src/HomeScreenModel/HomeModel";

const HeaderHome: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
    return (
        <View style={styles.container}>
            <View style={styles.topHeader}>
                <View style={styles.topheaderLeft}>
                    <TouchableOpacity style={styles.menuIcon}>
                        <Ionicons name="menu" size={24} color="white" />
                    </TouchableOpacity>
                    <Text style={styles.title}>LAHELU</Text>
                </View>
                <TouchableOpacity style={styles.searchIcon}>
                    <Ionicons name="search" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.buttonContainer, activeTab === 'Home' && styles.activeButtonContainer]}
                    onPress={() => setActiveTab('Home')}>
                    <Text style={[styles.tabText, activeTab === 'Home' && styles.activeTabText]}>Home</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttonContainer, activeTab === 'Fresh' && styles.activeButtonContainer]}
                    onPress={() => setActiveTab('Fresh')}>
                    <Text style={[styles.tabText, activeTab === 'Fresh' && styles.activeTabText]}>Fresh</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={[styles.buttonContainer, activeTab === 'Trending' && styles.activeButtonContainer]}
                    onPress={() => setActiveTab('Trending')}>
                    <Text style={[styles.tabText, activeTab === 'Trending' && styles.activeTabText]}>Trending</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#181818',
        paddingTop: 20,
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
        color: '#3EA8FF',
        textShadowColor: '#181818',
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
        borderBottomColor: '#3EA8FF',
    },
    tabText: {
        color: '#BBBBBB',
        fontSize: 16,
        paddingHorizontal: 20,
    },
    activeTabText: {
        color: '#3EA8FF',
        fontWeight: 'bold',
    },
});

export default HeaderHome;

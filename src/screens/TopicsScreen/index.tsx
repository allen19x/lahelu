import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RefreshControl, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import moment from 'moment';

import CustomMainHeader from '../../components/CustomMainHeader';
import { ModelTopicsContent } from '@/src/Models/TopicsModel';
import { BottomTabParamList } from '@/src/Models/CustomModel';

import { fetchTopicsContentData } from '../../react-query/states/Topics/apiServices';
import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import colorScheme from '@/assets/themes/colorScheme';
import styles from './styles';

type BottomTabProp = BottomTabNavigationProp<BottomTabParamList, 'TopicsScreen'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const verticalHeight = screenHeight * 0.75;
const horizontalHeight = screenWidth * (16 / 9 / 2.5);
const estimatedItemSize = (verticalHeight + horizontalHeight) / 2;

const TopicsScreen = () => {
  const navigation = useNavigation<BottomTabProp>();
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Topik');
  const [isTabClicked, setIsTabClicked] = useState(false);
  const tabList = [
    { id: 1, tabName: 'Topik' },
    { id: 2, tabName: 'Sudah Gabung' },
  ];

  const topicsRef = useRef<FlashList<ModelTopicsContent>>(null);

  const scrollY = useSharedValue(0);
  const headerVisible = useSharedValue(1);
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerVisible.value,
    transform: [{ translateY: headerVisible.value === 1 ? 0 : -100 }],
  }));

  const { data: topicsData, loading: isLoadingTopicsData, error, fetch, reFetch } = useCustomLoader<
    ModelTopicsContent[],
    { page: number; date: number; activeTab: string }
  >({
    fetchFunction: fetchTopicsContentData,
    params: { page, date: moment.now(), activeTab },
    options: { fetchOnLoad: true },
  });

  const [listTopics, setListTopics] = useState<ModelTopicsContent[]>([]);

  useEffect(() => {
    const unsubscribeTabPress = navigation.addListener('tabPress', () => {
      topicsRef.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return () => {
      unsubscribeTabPress();
    };
  }, [navigation]);

  useEffect(() => {
    if (topicsData && topicsData.length > 0) {
      if (isRefreshing) {
        setListTopics(topicsData);
        setIsRefreshing(false);
      } else {
        setListTopics((prevList) => [...prevList, ...topicsData]);
      }
    }
  }, [topicsData]);

  useEffect(() => {
    if (isTabClicked) {
      topicsRef.current?.scrollToOffset({ animated: true, offset: 0 });
      setPage(1);
      setIsRefreshing(true);
      reFetch({ page: 1, date: moment.now(), activeTab });
      setIsTabClicked(false)
    }
  }, [activeTab, isTabClicked]);

  const fetchMoreTopicsData = async () => {
    if (!isLoadingTopicsData && listTopics?.length > 5) {
      setPage((prevPage) => prevPage + 1);
      fetch({ page: page + 1, date: moment.now(), activeTab });
    }
  };

  const handlePullToRefresh = () => {
    topicsRef.current?.scrollToOffset({ animated: true, offset: 0 });
    setIsRefreshing(true);
    setPage(1);
    reFetch({ page: 1, date: moment.now(), activeTab });
  };

  if (isLoadingTopicsData && listTopics?.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={colorScheme.$primaryBlueColor} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error loading content: {String(error)}</Text>
      </View>
    );
  }

  const renderItem = ({ item }: { item: ModelTopicsContent }) => (
    <View style={styles.containerItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: 'https://static.wikia.nocookie.net/mlg-parody/images/4/42/DXi49hJX0AErLI2.jpg/revision/latest?cb=20190813011827' }} style={styles.image} />
        </View>
        <View style={styles.contentContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.member}>{item.member}+ member</Text>
        </View>
        <TouchableOpacity
          style={[styles.button, item.isJoined ? styles.joinedButton : styles.joinButton]}
          onPress={() => { }}
        >
          <Text style={item.isJoined ? styles.buttonJoinedText : styles.buttonText}>
            {item.isJoined ? 'Lihat' : 'Gabung'}
          </Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.desc}>{item.desc}</Text>
    </View>
  );

  const renderFooterLoader = () => {
    if (topicsData && topicsData.length < 9) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Topic sudah habis</Text>
          <TouchableOpacity onPress={handlePullToRefresh} style={styles.reloadButton}>
            <Text style={styles.reloadButtonText}>Cek ulang</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!isLoadingTopicsData || listTopics?.length === 0 || isRefreshing) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" color={colorScheme.$primaryBlueColor} />
      </View>
    );
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;

    if (currentScrollY <= 0 && headerVisible.value === 0) {
      headerVisible.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.exp) });
    }

    if (currentScrollY > scrollY.value + 20 && headerVisible.value === 1) {
      headerVisible.value = withTiming(0, { duration: 300, easing: Easing.out(Easing.exp) });
    }
    else if (currentScrollY < scrollY.value - 20 && headerVisible.value === 0) {
      headerVisible.value = withTiming(1, { duration: 300, easing: Easing.out(Easing.exp) });
    }

    scrollY.value = currentScrollY;
  };

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerScreenAnimatedWrapper, animatedHeaderStyle]}>
        <CustomMainHeader activeTab={activeTab} setActiveTab={setActiveTab} setIsTabClicked={setIsTabClicked} tabList={tabList} />
      </Animated.View>
      <FlashList
        contentContainerStyle={styles.flashlistContainer}
        ref={topicsRef}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handlePullToRefresh}
            colors={[colorScheme.$primaryBlueColor]}
            progressViewOffset={80}
          />
        }
        data={listTopics}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={estimatedItemSize}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreTopicsData}
        ListFooterComponent={renderFooterLoader}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default TopicsScreen;
import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { RefreshControl, TouchableOpacity } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { Image } from 'expo-image';
import { FlashList } from '@shopify/flash-list';
import moment from 'moment';

import CustomMainHeader from '../../components/CustomMainHeader';
import { ModelCommunityContent } from '../../Models/CommunityModel';

import { fetchCommunityContentData } from '../../react-query/states/Community/apiServices';
import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import colorScheme from '@/assets/themes/colorScheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const verticalHeight = screenHeight * 0.75;
const horizontalHeight = screenWidth * (16 / 9 / 2.5);
const estimatedItemSize = (verticalHeight + horizontalHeight) / 2;

const CommunityScreen = () => {
  const [page, setPage] = useState(1);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('Topik');
  const [isTabClicked, setIsTabClicked] = useState(false);
  const tabList = [
    { id: 1, tabName: 'Topik' },
    { id: 2, tabName: 'Sudah Gabung' },
  ];

  const communityRef = useRef<FlashList<ModelCommunityContent>>(null);

  const scrollY = useSharedValue(0);
  const headerVisible = useSharedValue(1);
  const animatedHeaderStyle = useAnimatedStyle(() => ({
    opacity: headerVisible.value,
    transform: [{ translateY: headerVisible.value === 1 ? 0 : -100 }],
  }));

  const { data: communityData, loading: isLoadingCommunityData, error, fetch, reFetch } = useCustomLoader<
    ModelCommunityContent[],
    { page: number; date: number; activeTab: string }
  >({
    fetchFunction: fetchCommunityContentData,
    params: { page, date: moment.now(), activeTab },
    options: { fetchOnLoad: true },
  });

  const [listCommunity, setListCommunity] = useState<ModelCommunityContent[]>([]);

  useEffect(() => {
    if (communityData && communityData.length > 0) {
      if (isRefreshing) {
        setListCommunity(communityData);
        setIsRefreshing(false);
      } else {
        setListCommunity((prevList) => [...prevList, ...communityData]);
      }
    }
  }, [communityData]);

  useEffect(() => {
    if (isTabClicked) {
      communityRef.current?.scrollToOffset({ animated: true, offset: 0 });
      setPage(1);
      setIsRefreshing(true);
      reFetch({ page: 1, date: moment.now(), activeTab });
      setIsTabClicked(false)
    }
  }, [activeTab, isTabClicked]);

  const fetchMoreCommunityData = async () => {
    if (!isLoadingCommunityData && listCommunity?.length > 5) {
      setPage((prevPage) => prevPage + 1);
      fetch({ page: page + 1, date: moment.now(), activeTab });
    }
  };

  const handlePullToRefresh = () => {
    communityRef.current?.scrollToOffset({ animated: true, offset: 0 });
    setIsRefreshing(true);
    setPage(1);
    reFetch({ page: 1, date: moment.now(), activeTab });
  };

  if (isLoadingCommunityData && listCommunity?.length === 0) {
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

  const renderItem = ({ item }: { item: ModelCommunityContent }) => (
    <View style={styles.containerItem}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: 'https://newronanima.com/wp-content/uploads/2023/04/patrik.jpg' }} style={styles.image} />
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
    if (communityData && communityData.length < 9) {
      return (
        <View style={styles.emptyState}>
          <Text style={styles.emptyText}>Topic sudah habis</Text>
          <TouchableOpacity onPress={handlePullToRefresh} style={styles.reloadButton}>
            <Text style={styles.reloadButtonText}>Cek ulang</Text>
          </TouchableOpacity>
        </View>
      );
    }
    if (!isLoadingCommunityData || listCommunity?.length === 0 || isRefreshing) return null;

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
        ref={communityRef}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handlePullToRefresh}
            colors={[colorScheme.$primaryBlueColor]}
            progressViewOffset={80}
          />
        }
        data={listCommunity}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={estimatedItemSize}
        ItemSeparatorComponent={() => <View style={styles.itemSeparator} />}
        onEndReachedThreshold={0.2}
        onEndReached={fetchMoreCommunityData}
        ListFooterComponent={renderFooterLoader}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colorScheme.$blackBg,
    paddingVertical: 10,
  },
  centered: {
    backgroundColor: colorScheme.$blackBg,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerScreenAnimatedWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999,
  },
  flashlistContainer: {
    paddingTop: 80,
  },
  errorText: {
    color: colorScheme.$whiteCream,
  },
  itemSeparator: {
    height: 4,
    backgroundColor: colorScheme.$darkBlackBg,
  },
  footerLoader: {
    paddingTop: 20,
    paddingBottom: 60,
  },
  containerItem: {
    padding: 10,
    paddingTop: 16,
    backgroundColor: colorScheme.$blackBg,
    marginBottom: 6,
    borderRadius: 10,
    justifyContent: 'center',
  },
  imageContainer: {
    marginRight: 10,
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  contentContainer: {
    flex: 1,
  },
  name: {
    color: colorScheme.$white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  member: {
    color: colorScheme.$whiteCream,
    fontSize: 14,
    marginBottom: 5,
  },
  desc: {
    marginTop: 8,
    color: colorScheme.$whiteCream,
    fontSize: 12,
  },
  button: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  joinedButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colorScheme.$primaryBlueColor,
  },
  joinButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: colorScheme.$primaryBlueColor,
  },
  buttonText: {
    color: colorScheme.$white,
    fontWeight: 'bold',
  },
  buttonJoinedText: {
    color: colorScheme.$primaryBlueColor,
    fontWeight: 'bold',
  },
  emptyState: {
    borderTopWidth: 4,
    borderColor: colorScheme.$darkBlackBg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 100,
  },
  emptyText: {
    color: colorScheme.$whiteCream,
    fontSize: 12,
    marginBottom: 10,
  },
  reloadButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: colorScheme.$primaryBlueColor,
  },
  reloadButtonText: {
    color: colorScheme.$primaryBlueColor,
    fontWeight: 'bold',
  },
});

export default CommunityScreen;
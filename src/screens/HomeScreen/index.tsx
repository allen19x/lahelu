import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useIsFocused, useNavigation } from '@react-navigation/native';
import { RefreshControl } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { FlashList, ViewToken } from '@shopify/flash-list';
import { Video, AVPlaybackStatusSuccess, AVPlaybackStatus } from 'expo-av';
import moment from 'moment';
import _ from 'lodash';

import { ModelHomeContent, ModelVideoRef } from '@/src/Models/HomeModel';
import { BottomTabParamList } from '@/src/Models/CustomModel';
import MemeContentItem from './Component/MemeContentItem';
import CustomMainHeader from '../../components/CustomMainHeader';

import { fetchHomeContentData } from '../../react-query/states/Home/apiServices';
import { fetchActiveTab, updateActiveTab } from '@/src/react-query/states/Drawer';
import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import colorScheme from '@/assets/themes/colorScheme';
import styles from './styles';

type BottomTabProp = BottomTabNavigationProp<BottomTabParamList, 'HomeScreen'>;

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const verticalHeight = screenHeight * 0.75;
const horizontalHeight = screenWidth * (16 / 9 / 2.5);
const estimatedItemSize = (verticalHeight + horizontalHeight) / 2;

const HomeScreen = () => {
  // React Query
  const { data: activeTab } = useQuery<string>({
    queryKey: ['activeTab'],
    queryFn: fetchActiveTab,
  });
  const currentActiveTab: string = activeTab || 'Home';
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationFn: updateActiveTab,
    onSuccess: (newTab) => {
      queryClient.setQueryData(['activeTab'], newTab);
    },
  });
  const handleTabChange = (newTab: string) => {
    mutation.mutate(newTab);
  };
  // End React Query
  const isFocused = useIsFocused()
  const navigation = useNavigation<BottomTabProp>()
  const [page, setPage] = useState(1)
  const [isMuted, setIsMuted] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleVideoId, setVisibleVideoId] = useState<string | null>(null);

  const [listMeme, setListMeme] = useState<ModelHomeContent[]>([]);

  const tabList = [
    {
      id: 1,
      tabName: 'Home'
    },
    {
      id: 2,
      tabName: 'Fresh'
    },
    {
      id: 3,
      tabName: 'Trending'
    },
  ]

  const videoRefs = useRef<Record<string, ModelVideoRef>>({});
  const memeRef = useRef<FlashList<ModelHomeContent>>(null);

  const scrollY = useSharedValue(0);
  const headerVisible = useSharedValue(1);
  const animatedHeaderStyle = useAnimatedStyle(() => {
    return {
      opacity: headerVisible.value,
      transform: [{ translateY: headerVisible.value === 1 ? 0 : -100 }]
    };
  });

  const { data: memeData, loading: isLoadingMemeData, error, fetch, reFetch } = useCustomLoader<ModelHomeContent[], { page: number, date: number, activeTab: string }>({
    fetchFunction: fetchHomeContentData,
    params: { page, date: moment.now(), activeTab: currentActiveTab },
    options: { fetchOnLoad: true },
  });

  useEffect(() => {
    const unsubscribeTabPress = navigation.addListener('tabPress', () => {
      memeRef.current?.scrollToOffset({ animated: true, offset: 0 });
    });

    return () => {
      unsubscribeTabPress();
    };
  }, [navigation]);

  useEffect(() => {
    if (memeData && memeData.length > 0) {
      if (isRefreshing) {
        setListMeme(memeData)
        setIsRefreshing(false)
        setVisibleVideoId(memeData[0].id)
      }
      else {
        setListMeme((prevList) => [...prevList, ...memeData]);
      }
    }
  }, [memeData]);

  useEffect(() => {
    if (isFocused) {
      memeRef.current?.scrollToOffset({ animated: true, offset: 0 });
      setPage(1)
      setIsRefreshing(true)
      reFetch({ page: 1, date: moment.now(), activeTab: currentActiveTab });
    }
    else if (!isFocused) {
      setVisibleVideoId(null)
    }
  }, [currentActiveTab, isFocused]);

  const fetchMoreMemeData = async () => {
    if (!isLoadingMemeData) {
      setPage((prevPage) => prevPage + 1);
      fetch({ page: page + 1, date: moment.now(), activeTab: currentActiveTab });
    }
  };

  const handlePullToRefreshMeme = () => {
    setIsRefreshing(true)
    setPage(1)
    reFetch({ page: 1, date: moment.now(), activeTab: currentActiveTab });
  };

  const throttledSetVisibleVideoId = useCallback(
    _.throttle((newVisibleVideoId: string) => {
      if (newVisibleVideoId !== visibleVideoId) {
        setVisibleVideoId(newVisibleVideoId);
      }
    }, 500), [visibleVideoId]);

  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const visibleItemIds = viewableItems.map(item => item.item.id);
      const firstVisibleItem = visibleItemIds[0];
      throttledSetVisibleVideoId(firstVisibleItem);
    }
  }).current;

  const handleVideoLoad = useCallback((videoId: string, ref: Video | null) => {
    if (ref) {
      videoRefs.current[videoId] = { ref, isLoaded: true, isMuted, status: null };
    } else {
      delete videoRefs.current[videoId];
    }
  }, [isMuted]);

  const handlePlaybackStatusUpdate = useCallback((videoId: string, status: AVPlaybackStatus) => {
    if (videoRefs.current[videoId]) {
      if (status.isLoaded) {
        videoRefs.current[videoId].status = status as AVPlaybackStatusSuccess;
      }
    }
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => !prev);
  }, []);

  const togglePlayPause = useCallback((videoId: string) => {
    const videoRef = videoRefs.current[videoId];
    if (videoRef && videoRef.ref && videoRef.isLoaded) {
      const shouldPlay = !(videoRef.status?.isPlaying ?? false);
      if (shouldPlay) {
        videoRef.ref.playAsync();
      } else {
        videoRef.ref.pauseAsync();
      }
    }
  }, []);

  const renderItem = useCallback(({ item }: { item: ModelHomeContent }) => {
    return (
      <MemeContentItem
        item={item}
        isMuted={isMuted}
        visibleVideoId={visibleVideoId}
        togglePlayPause={togglePlayPause}
        toggleMute={toggleMute}
        handleVideoLoad={handleVideoLoad}
        handlePlaybackStatusUpdate={handlePlaybackStatusUpdate}
      />
    );
  }, [isMuted, visibleVideoId, togglePlayPause, toggleMute, handleVideoLoad, handlePlaybackStatusUpdate]);

  const renderFooterLoader = () => {
    if (!isLoadingMemeData && listMeme?.length === 0) return null;

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

  if (isLoadingMemeData && listMeme?.length === 0) {
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

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.headerScreenAnimatedWrapper, animatedHeaderStyle]}>
        <CustomMainHeader activeTab={currentActiveTab} setActiveTab={handleTabChange} setIsTabClicked={() => { }} tabList={tabList} />
      </Animated.View>
      <FlashList
        removeClippedSubviews
        contentContainerStyle={styles.flashlistContainer}
        ref={memeRef}
        refreshControl={(
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handlePullToRefreshMeme}
            colors={[colorScheme.$primaryBlueColor]}
            progressViewOffset={80}
          />
        )}
        data={listMeme}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={estimatedItemSize}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 80 }}
        ItemSeparatorComponent={() => { return (<View style={styles.itemSeparator} />) }}
        extraData={{ visibleVideoId }}
        onEndReachedThreshold={0.2}
        onEndReached={() => fetchMoreMemeData()}
        ListFooterComponent={renderFooterLoader}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      />
    </View>
  );
};

export default HomeScreen;
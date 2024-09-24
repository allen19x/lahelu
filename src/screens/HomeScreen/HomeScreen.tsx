import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import Animated, { useSharedValue, useAnimatedStyle, withTiming, Easing } from 'react-native-reanimated';
import { FlashList, ViewToken } from '@shopify/flash-list';
import { Video, AVPlaybackStatusSuccess, AVPlaybackStatus } from 'expo-av';
import moment from 'moment';
import _ from 'lodash';

import { ModelHomeContent, ModelVideoRef } from '../../Models/HomeModel';
import MemeContentItem from './MemeContentItem';
import CustomMainHeader from '../../components/CustomMainHeader';

import { fetchHomeContentData } from '../../react-query/states/Home/apiServices';
import useCustomLoader from '../../react-query/hooks/useCustomLoader';
import colorScheme from '@/assets/themes/colorScheme';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const verticalHeight = screenHeight * 0.75;
const horizontalHeight = screenWidth * (16 / 9 / 2.5);
const estimatedItemSize = (verticalHeight + horizontalHeight) / 2;

const HomeScreen = () => {
  const [page, setPage] = useState(1)
  const [isMuted, setIsMuted] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [visibleVideoId, setVisibleVideoId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('Home');
  const [isTabClicked, setIsTabClicked] = useState(false);
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
    params: { page, date: moment.now(), activeTab },
    options: { fetchOnLoad: true },
  });

  const [listMeme, setListMeme] = useState<ModelHomeContent[]>([]);

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
    if (isTabClicked) {
      memeRef.current?.scrollToOffset({ animated: true, offset: 0 });
      setPage(1)
      setIsRefreshing(true)
      reFetch({ page: 1, date: moment.now(), activeTab });
      setIsTabClicked(false)
    }
  }, [activeTab, isTabClicked]);

  const fetchMoreMemeData = async () => {
    if (!isLoadingMemeData) {
      setPage((prevPage) => prevPage + 1);
      fetch({ page: page + 1, date: moment.now(), activeTab });
    }
  };

  const handlePullToRefreshMeme = () => {
    setIsRefreshing(true)
    setPage(1)
    reFetch({ page: 1, date: moment.now(), activeTab });
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
        <CustomMainHeader activeTab={activeTab} setActiveTab={setActiveTab} setIsTabClicked={setIsTabClicked} tabList={tabList} />
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
  containerItem: {
    marginVertical: 12,
    paddingTop: 10,
    paddingHorizontal: 10,
    alignSelf: 'center',
  },
  headerScreenAnimatedWrapper: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 999
  },
  flashlistContainer: {
    paddingTop: 80
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  headerUsernameTextContainer: {
    flex: 1,
  },
  headerTitleTextContainer: {
    flex: 1,
    paddingBottom: 10,
  },
  title: {
    color: colorScheme.$whiteCream,
    fontSize: 16,
    fontWeight: 'bold',
  },
  hashtagsContainer: {
    paddingVertical: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtagSawerContainer: {
    flexDirection: 'row',
    backgroundColor: colorScheme.$orangeShade,
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  hashtagSawerIcon: {
    padding: 2,
    borderRadius: 8,
    backgroundColor: colorScheme.$whiteCream,
    marginRight: 8,
  },
  hashtagNormalContainer: {
    textAlign: 'center',
    paddingVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colorScheme.$whiteCream,
    marginRight: 5,
  },
  hashtag: {
    fontWeight: '500',
    marginBottom: 1,
    color: colorScheme.$whiteCream,
  },
  containerContent: {
    backgroundColor: colorScheme.$lightBlackBg,
    marginHorizontal: -10,
  },
  media: {
    width: '100%',
    aspectRatio: 1,
  },
  videoContainer: {
    position: 'relative',
  },
  muteButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    opacity: 0.8,
    backgroundColor: colorScheme.$blackBg,
    padding: 4,
    borderRadius: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  footerLeftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteContainer: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colorScheme.$mediumBlackBg,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colorScheme.$blackBg,
  },
  voteSeparator: {
    height: 40,
    margin: -10,
    width: 1,
    backgroundColor: colorScheme.$mediumBlackBg,
    marginHorizontal: 10,
  },
  voteCount: {
    color: colorScheme.$whiteCream,
    fontSize: 14,
    marginHorizontal: 5,
  },
  commentButton: {
    marginLeft: 12,
    height: 44,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colorScheme.$blackBg,
    borderColor: colorScheme.$mediumBlackBg,
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    color: colorScheme.$whiteCream,
    fontSize: 14,
    marginLeft: 5,
  },
  shareButton: {
    height: 40,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: colorScheme.$blackBg,
    borderColor: colorScheme.$mediumBlackBg,
    flexDirection: 'row',
    alignItems: 'center',
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
    paddingBottom: 60
  },
});

export default HomeScreen;
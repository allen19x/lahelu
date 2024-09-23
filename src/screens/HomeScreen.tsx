import React, { useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  Dimensions,
  ActivityIndicator,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import { FlashList, ViewToken } from '@shopify/flash-list';
import moment from 'moment';
import { Video, AVPlaybackStatusSuccess, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { Image } from 'expo-image';
import { Ionicons } from '@expo/vector-icons';

import HeaderHome from './HeaderHome';
import { ModelHomeContent, ModelVideoRef } from "@/src/HomeScreenModel/HomeModel";

import { fetchHomeContentData } from '../react-query/states/Home/apiServices';
import useCustomLoader from '../react-query/hooks/useCustomLoader';

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

  const videoRefs = useRef<Record<string, ModelVideoRef>>({});

  const { data: memeData, loading: isLoadingMemeData, error, fetch, reFetch } = useCustomLoader<ModelHomeContent[], { page: number, date: number }>({
    fetchFunction: fetchHomeContentData,
    params: { page, date: moment.now() },
    options: { fetchOnLoad: true },
  });

  const [listMeme, setListMeme] = useState<ModelHomeContent[]>([]);

  useEffect(() => {
    if (memeData && memeData.length > 0) {
      if (isRefreshing) {
        setListMeme(memeData)
        setIsRefreshing(false)
      }
      else {
        setListMeme((prevList) => [...prevList, ...memeData]);
      }
    }
  }, [memeData]);

  const fetchMoreMemeData = async () => {
    if (!isLoadingMemeData) {
      setPage((prevPage) => prevPage + 1);
      fetch({ page: page + 1, date: moment.now() });
    }
  };

  const handlePullToRefreshMeme = () => {
    setIsRefreshing(true)
    setPage(1)
    reFetch({ page: 1, date: moment.now() });
  };


  const onViewableItemsChanged = useRef(({ viewableItems }: { viewableItems: ViewToken[] }) => {
    if (viewableItems.length > 0) {
      const visibleItem = viewableItems[0].item as ModelHomeContent;
      setVisibleVideoId(visibleItem.id);
    }
  }).current;

  const handleVideoLoad = (videoId: string, ref: Video | null) => {
    if (ref) {
      videoRefs.current[videoId] = { ref, isLoaded: true, isMuted, status: null };
    }
  };

  const handlePlaybackStatusUpdate = (videoId: string, status: AVPlaybackStatus) => {
    if (videoRefs.current[videoId]) {
      if (status.isLoaded) {
        videoRefs.current[videoId].status = status as AVPlaybackStatusSuccess;
      }
    }
  };

  const toggleMute = () => {
    setIsMuted((prev) => !prev);
  };

  const togglePlayPause = (videoId: string) => {
    const videoRef = videoRefs.current[videoId];
    if (videoRef && videoRef.ref && videoRef.isLoaded) {
      const shouldPlay = !(videoRef.status?.isPlaying ?? false);
      if (shouldPlay) {
        videoRef.ref.playAsync();
      } else {
        videoRef.ref.pauseAsync();
      }
    }
  };

  if (isLoadingMemeData && listMeme?.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
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

  const renderItem = ({ item }: { item: ModelHomeContent }) => {
    const isVerticalVideo = item.aspectRatio === 9 / 16;
    const dynamicHeight = isVerticalVideo
      ? screenHeight * 0.75
      : screenWidth * (item.aspectRatio / 2.5);
    return (
      <View style={styles.containerItem}>
        <View style={styles.header}>
          <Image source={{ uri: item.avatarProfile }} style={styles.avatar} />
          <View style={styles.headerUsernameTextContainer}>
            <Text style={styles.title}>{item.username}</Text>
          </View>
        </View>
        <View style={styles.headerTitleTextContainer}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
        <View style={[styles.containerContent, { height: dynamicHeight }]}>
          {item.type === 'image' ? (
            <Image source={{ uri: item.url }} style={{ width: screenWidth, height: dynamicHeight }} contentFit="fill" />
          ) : (
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => togglePlayPause(item.id)}
              style={styles.videoContainer}
            >
              <Video
                ref={(ref) => handleVideoLoad(item.id, ref)}
                source={{ uri: item.url }}
                style={{ width: screenWidth, height: dynamicHeight }}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={item.id === visibleVideoId}
                isMuted={isMuted}
                isLooping
                onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(item.id, status)}
              />
              <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
                <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color="white" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.hashtagsContainer}>
          {item.hashtags.map((tag) => (
            <Text key={tag} style={styles.hashtag}>
              #  {tag}
            </Text>
          ))}
        </View>

        <View style={styles.footer}>
          <View style={styles.footerLeftContainer}>
            <View style={styles.voteContainer}>
              <TouchableOpacity style={{ flexDirection: 'row' }}>
                <Ionicons name="arrow-up-outline" size={24} color="white" />
                <Text style={styles.voteCount}>10</Text>
              </TouchableOpacity>
              <View style={styles.voteSeparator} />
              <TouchableOpacity>
                <Ionicons name="arrow-down-outline" size={24} color="white" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity style={styles.commentButton}>
              <Ionicons name="chatbubble-outline" size={24} color="white" />
              <Text style={styles.commentCount}>30</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.shareButton}>
            <Ionicons name="share-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderFooterLoader = () => {
    if (!isLoadingMemeData && listMeme?.length === 0) return null;

    return (
      <View style={styles.footerLoader}>
        <ActivityIndicator size="large" />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* <HeaderHome activeTab={activeTab} setActiveTab={setActiveTab} /> */}
      <FlashList
        refreshControl={(
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={handlePullToRefreshMeme}
            tintColor="#00ff00"
          />
        )}
        data={listMeme}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        estimatedItemSize={estimatedItemSize}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ itemVisiblePercentThreshold: 50 }}
        ItemSeparatorComponent={() => { return (<View style={styles.itemSeparator} />) }}
        extraData={{ visibleVideoId, isMuted, videoRefs }}
        onEndReachedThreshold={0.2}
        onEndReached={() => fetchMoreMemeData()}
        ListFooterComponent={renderFooterLoader}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#181818',
    paddingVertical: 10,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerItem: {
    marginVertical: 12,
    padding: 10,
    alignSelf: 'center',
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
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  hashtagsContainer: {
    paddingTop: 10,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  hashtag: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'white',
    color: '#BBBBBB',
    marginRight: 5,
  },
  containerContent: {
    backgroundColor: '#383737',
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
    backgroundColor: '#181818',
    padding: 4,
    borderRadius: 20,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  footerLeftContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  voteContainer: {
    height: 44,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#222',
  },
  voteSeparator: {
    height: 44,
    margin: -10,
    width: 1,
    backgroundColor: 'white',
    marginHorizontal: 10,
  },
  voteCount: {
    color: 'white',
    fontSize: 18,
    marginHorizontal: 5,
  },
  commentButton: {
    marginLeft: 12,
    height: 44,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentCount: {
    color: 'white',
    marginLeft: 5,
  },
  shareButton: {
    paddingHorizontal: 10,
  },
  errorText: {
    color: 'white',
  },
  itemSeparator: {
    height: 1,
    backgroundColor: '#414141',
  },
  footerLoader: {
    paddingVertical: 20,
  },
});

export default HomeScreen;
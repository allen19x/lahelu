import React, { memo, useMemo } from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'expo-image';
import { Ionicons, FontAwesome6, Feather } from '@expo/vector-icons';

import { MemeItemProps } from '../../../Models/HomeModel';
import colorScheme from '@/assets/themes/colorScheme';
import { getRelativeTime } from '@/src/utils/GlobalFunction';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const MemeItem: React.FC<MemeItemProps> = ({
    item,
    isMuted,
    visibleVideoId,
    togglePlayPause,
    toggleMute,
    handleVideoLoad,
    handlePlaybackStatusUpdate
}) => {
    const isVerticalVideo = item.aspectRatio === 9 / 16;
    const dynamicHeight = useMemo(() => {
        return isVerticalVideo ? screenHeight * 0.65 : screenWidth * (item.aspectRatio / 2.5);
    }, [item.aspectRatio, isVerticalVideo]);

    const containerContentStyle = useMemo(() => {
        return [styles.containerContent, { height: dynamicHeight }];
    }, [dynamicHeight]);

    const contentStyle = useMemo(() => {
        return { width: screenWidth, height: dynamicHeight };
    }, [dynamicHeight]);

    return (
        <View style={styles.containerItem}>
            <View style={styles.header}>
                <Image source={{ uri: item.avatarProfile }} style={styles.avatar} />
                <View style={styles.headerUsernameTextContainer}>
                    <Text style={styles.title}>{item.username}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.timestamp}>{getRelativeTime(item.postTime)}</Text>
                </View>
                <TouchableOpacity>
                    <Ionicons name="ellipsis-horizontal" size={20} color="white" />
                </TouchableOpacity>
            </View>
            <View style={styles.headerTitleTextContainer}>
                <Text style={styles.title}>{item.title}</Text>
            </View>
            <View style={containerContentStyle}>
                {item.type === 'image' && (
                    <Image source={{ uri: item.url }} style={contentStyle} contentFit="fill" />
                )}
                {item.type === 'video' && item.id === visibleVideoId ? (
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={() => togglePlayPause(item.id)}
                        style={styles.videoContainer}
                    >
                        <Video
                            // useNativeControls
                            ref={(ref) => handleVideoLoad(item.id, ref)}
                            source={{ uri: item.url }}
                            style={contentStyle}
                            resizeMode={ResizeMode.CONTAIN}
                            shouldPlay={item.id === visibleVideoId}
                            isMuted={isMuted}
                            isLooping
                            onPlaybackStatusUpdate={(status) => handlePlaybackStatusUpdate(item.id, status)}
                        />
                        <TouchableOpacity style={styles.muteButton} onPress={toggleMute}>
                            <Ionicons name={isMuted ? 'volume-mute' : 'volume-high'} size={20} color={colorScheme.$whiteCream} />
                        </TouchableOpacity>
                    </TouchableOpacity>
                )
                    :
                    (
                        <Image source={{ uri: item.thumbnail }} style={contentStyle} contentFit="fill" />
                    )
                }
            </View>
            <ScrollView
                showsHorizontalScrollIndicator={false}
                horizontal
                nestedScrollEnabled
                style={styles.hashtagsContainer}>
                <TouchableOpacity style={styles.hashtagSawerContainer}>
                    <View style={styles.hashtagSawerIcon}>
                        <Ionicons name="logo-usd" size={8} color={colorScheme.$orangeShade} />
                    </View>
                    <Text style={styles.hashtag}>
                        Sawer
                    </Text>
                </TouchableOpacity>
                {item.hashtags.map((tag, index) => (
                    <TouchableOpacity key={`${tag}${index}`} style={styles.hashtagNormalContainer}>
                        <Text style={styles.hashtag}>
                            #  {tag}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            <View style={styles.footer}>
                <View style={styles.footerLeftContainer}>
                    <View style={styles.voteContainer}>
                        <TouchableOpacity style={{ flexDirection: 'row' }}>
                            <Ionicons name="arrow-up-outline" size={18} color={colorScheme.$whiteCream} />
                            <Text style={styles.voteCount}>{item.upvote}</Text>
                        </TouchableOpacity>
                        <View style={styles.voteSeparator} />
                        <TouchableOpacity>
                            <Ionicons name="arrow-down-outline" size={18} color={colorScheme.$whiteCream} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity style={styles.commentButton}>
                        <Feather name="message-square" size={18} color={colorScheme.$whiteCream} />
                        <Text style={styles.commentCount}>30</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.shareButton}>
                    <FontAwesome6 name="share" size={18} color={colorScheme.$whiteCream} />
                </TouchableOpacity>
            </View>
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
        flexDirection: 'row',
        alignItems: 'center'
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
    dot: {
        color: colorScheme.$gray,
        fontSize: 8,
        marginHorizontal: 4
    },
    timestamp: {
        color: colorScheme.$gray,
        fontSize: 10,
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
        height: 40,
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

export default memo(MemeItem, (prevProps, nextProps) => {
    return (
        prevProps.item.id === nextProps.item.id &&
        prevProps.isMuted === nextProps.isMuted &&
        prevProps.visibleVideoId === nextProps.visibleVideoId
    );
});
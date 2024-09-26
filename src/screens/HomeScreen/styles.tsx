import colorScheme from "@/assets/themes/colorScheme";
import { StyleSheet } from "react-native";

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
})

export default styles
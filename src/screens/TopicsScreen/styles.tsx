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
})

export default styles
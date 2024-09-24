import { createNavigationContainerRef, DarkTheme, NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { HOME_SCREEN } from '@/src/constants/RootKey';
import HomeScreen from '@/src/screens/HomeScreen/HomeScreen';

export const navigationRef = createNavigationContainerRef()

const Stack = createNativeStackNavigator();
const Navigator = () => {
    return (
        <>
            <NavigationContainer
                ref={navigationRef}
                theme={DarkTheme}>
                <Stack.Navigator
                    screenOptions={{
                        headerShown: false,
                        animation: 'none'
                    }}
                >
                    <Stack.Screen name={HOME_SCREEN} component={HomeScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </>
    )
};

export default Navigator;
import { AppRegistry } from 'react-native';
import { registerRootComponent } from 'expo';
import App from './src/App';
import appConfig from './app.json';

AppRegistry.registerComponent(appConfig.expo.name, () => App);
registerRootComponent(App);

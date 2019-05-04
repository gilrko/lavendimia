import React from 'react';
import { Platform, StatusBar, StyleSheet, View, AsyncStorage,  } from 'react-native';
import { AppLoading, Asset, Font, Icon, Constants, Notifications, Permissions } from 'expo';
import AppNavigator from './navigation/AppNavigator';
import FlashMessage from "react-native-flash-message";
import SERVICES from './services/Services';

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <View style={styles.container}>
          <AppNavigator />
          <FlashMessage position="bottom" floating={true} />
        </View>
      );
    }
  }
  
  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
        require('./assets/images/icons/shop1.png'),
        require('./assets/images/icons/shop.png'),
        require('./assets/images/icons/sales1.png'),
        require('./assets/images/icons/sales.png'),
        require('./assets/images/icons/user1.png'),
        require('./assets/images/icons/user.png'),
        require('./assets/images/icons/articles1.png'),
        require('./assets/images/icons/articles.png'),
        require('./assets/images/icons/config1.png'),
        require('./assets/images/icons/config.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Icon.Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
        'openSans-bold': require('./assets/fonts/OpenSans-Bold.ttf')
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBar: {
    backgroundColor: '#00AB68',
    height: Constants.statusBarHeight,
  }
});

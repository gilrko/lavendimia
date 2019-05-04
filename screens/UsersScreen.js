import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, ImageBackground, TouchableHighlight, AsyncStorage, Alert, ActivityIndicator, FlatList } from 'react-native';
import TopBar from '../components/TopBar';
import SERVICES from '../services/Services';
import ActionButton from 'react-native-action-button';
import { NavigationEvents, NavigationActions } from 'react-navigation';
import { ListItem, Button, Divider } from 'react-native-elements';

export default class UsersScreen extends React.Component {
  static navigationOptions = {
    header: null,
  };

  constructor(props) {
    super(props);
    this.state = {
      dataSource: null,
      isLoading: true,
    }
  }

  async componentDidMount() {
		let date = await SERVICES.getDate()
    let users =  await SERVICES.users()

		this.setState({
			users: users,
      isLoading: false,
      date:date
		})
  }

  render() {
    if (this.state.isLoading) {
      return(
      <View style={{ flex: 1 }}>
        <TopBar componentLeft="" componentRight="search" navigation={this.props.navigation} />
        <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
          <ActivityIndicator size="large" color="#00AB68" />
        </View>
      </View>
      )
    } else {
      return (
        <View style={{ flex: 1 }}>
          <TopBar componentLeft="" componentRight="date" date={this.state.date} navigation={this.props.navigation} />
          <NavigationEvents
            onWillFocus={payload => { this.props.navigation.navigate('Main'), this.componentDidMount() }}
            onDidFocus={payload => { this.componentDidMount() }}
            onWillBlur={payload => console.log('will blur', payload)}
            onDidBlur={payload => console.log('did blur', payload)} />
          {this.state.users.length === 0 ?
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", alignContent: "center", backgroundColor: "white" }}>
            <Text>No existen clientes</Text>
            </View>
            :
            <FlatList
              data={this.state.users}
              refreshing={this.state.refreshing}
              style={{ marginTop: 10 }}
              renderItem={({ item, index }) =>
                <View style={{ flex: 1 }} >
                  <TouchableHighlight style={{ flex: .8, borderColor: "#dadada", borderWidth: .3, borderRadius: 10, marginBottom: 10, marginHorizontal: 25, paddingVertical: 10, paddingHorizontal: 10, backgroundColor: "white" }} underlayColor="white" onPress={() => this.props.navigation.navigate('UserInfo', { user: item })}>
                    <View style={{ flexDirection: "row", padding: 5 }}>
                      <View style={{ flex: .5, justifyContent: "center" }}>
                        <Image style={{ width: 50, height: 50 }} resizeMode={"cover"} source={require('../assets/images/icons/user1.png')} /></View>
                      <View style={{ flex: 2, flexDirection: "column", marginHorizontal: 20 }}>
                        <Text style={{ marginVertical: 2, fontSize: 16, }}>{item.id}</Text>
                        <Text style={{ color: "gray", marginVertical: 2 }}>{item.name} {item.lastname} {item.motherlastname}</Text>
                        <Text style={{ color: "gray", marginVertical: 2, justifyContent: "flex-end", alignItems: "flex-end" }}>{item.rfc}</Text>
                      </View>
                      <View style={{ flex: .5, justifyContent: "center" }}>
                        <Text style={{ marginVertical: 2 }}><Text style={{ color: "#00AB68" }}>Editar</Text></Text>
                      </View>
                    </View>
                  </TouchableHighlight>
                </View>
              }
              keyExtractor={(item, index) => index.toString()}
            />
          }
          <ActionButton
						buttonColor="#00AB68"
						onPress={() => this.props.navigation.navigate('UserInfo')}
					/>
        </View>
      )
    }
  }

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pageStyle: {
    alignItems: 'center',
    flex: 1,
    // paddingTop: 15
  }
});

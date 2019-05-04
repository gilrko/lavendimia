import React, { Component } from 'react'
import { Text, View, ScrollView, Image, AsyncStorage, KeyboardAvoidingView, FlatList, ActivityIndicator, TouchableHighlight } from 'react-native'
import TopBar from '../components/TopBar';
import { Button, Header, Input } from 'react-native-elements';
import SERVICES from '../services/Services';
import URIS from '../services/Uris'
import { showMessage, FlashMessage } from "react-native-flash-message";
import ActionButton from 'react-native-action-button';
import { createStackNavigator, StackActions, NavigationActions, NavigationEvents } from 'react-navigation';

export default class FavoritesScreen extends Component {

  static navigationOptions = {
    header: null
  };

  constructor(props) {
    super(props)
    this.state = {
      sales: [],
      isLoading: true,
    }
  }

  async componentDidMount() {
    let date = await SERVICES.getDate()
    console.log("date", date)
    let sales = await SERVICES.sales()
    console.log("ventas", sales)
      this.setState({
        sales: sales,
        isLoading: false,
        date: date
      })
    
  }


  render() {
    if (this.state.isLoading) {
      return (
        <View style={{ flex: 1 }}>
          <TopBar date={this.state.date} navigation={this.props.navigation} />
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
            <ActivityIndicator size="large" color="#00AB68" />
          </View>
        </View>
      )
    } else {
      return (
        <View style={{ flex: 1, backgroundColor: "white" }}>
          <NavigationEvents
            onWillFocus={payload => this.componentDidMount()}
            onDidFocus={payload => console.log('did focus', payload)}
            onWillBlur={payload => console.log('will blur', payload)}
            onDidBlur={payload => console.log('did blur', payload)}
          />
          <TopBar date={this.state.date} navigation={this.props.navigation} />
          {this.state.sales === null || this.state.sales.length === 0 ?
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", alignContent: "center", backgroundColor: "white" }}>
              <Text style={{fontSize: 20}}>No existen ventas</Text>
            </View>
            :
            <View style={{ flex: 1 }}>
            <View style={{width: "100%", flexDirection: "row"}}>
            <Text>Folio venta</Text>
            <Text>Clave cliente</Text>
            <Text>Nombre</Text>
            <Text>Total</Text>
            <Text>Fecha</Text>
            <Text>Status</Text>
            </View>
              <FlatList
                data={this.state.sales}
                refreshing={this.state.refreshing}
                renderItem={({ item, index }) =>
                  <View style={{ flex: 1 }} >
                    <TouchableHighlight style={{ flex: .8, borderColor: "#dadada", borderWidth: .3, borderRadius: 10, marginBottom: 10, marginTop: 10, marginHorizontal: 25, paddingVertical: 10, paddingHorizontal: 10 }} underlayColor="white" onPress={() => this.props.navigation.navigate('ShowProduct', { productId: item.id })}>
                      <View style={{ flexDirection: "row", padding: 5 }}>
                        <View style={{ flex: .5, justifyContent: "center" }}>
                          <Image style={{ width: 50, height: 50 }} resizeMode={"cover"} source={{ uri: `${URIS.ENDPOINT_IMAGE}${item.image1}` }} />
                        </View>
                        <View style={{ flex: 1.5, flexDirection: "column", marginHorizontal: 20 }}>
                          <Text style={{ marginVertical: 2, fontSize: 16, }}>{item.short_desc}  </Text>
                          <Text style={{ color: "gray", marginVertical: 2, justifyContent: "flex-end", alignItems: "flex-end", color: "#00AB68" }}>$ {item.price.toFixed(2)}</Text>
                        </View>
                      </View>
                    </TouchableHighlight>
                  </View>
                }
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          }
          <ActionButton
						buttonColor="#00AB68"
						onPress={() => this.props.navigation.navigate('SalesInfo')}
					/>
        </View>
      )
    }
  }
}

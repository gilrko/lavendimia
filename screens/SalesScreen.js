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
            <View style={{ flex: 1, flexDirection: "column" }}>
                                <View style={{ flexDirection: "row", borderTopColor: "black", borderTopWidth: 1, borderBottomColor: "black", borderBottomWidth: 1 }}>
                                    <Text style={{ flex: 1, textAlign: "center" }}>Folio venta</Text>
                                    <Text style={{ flex: 1, textAlign: "center" }}>Clave cliente</Text>
                                    <Text style={{ flex: 1, textAlign: "center" }}>Nombre</Text>
                                    <Text style={{ flex: 1, textAlign: "center" }}>Total</Text>
                                    <Text style={{ flex: 1, textAlign: "center" }}>Estatus</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        data={this.state.sales}
                                        refreshing={this.state.refreshing}
                                        style={{ marginTop: 10 }}
                                        renderItem={({ item, index }) =>
                                            <View style={{ flex: 1, flexDirection: "row", borderBottomColor: "black", borderBottomWidth: 1 }} >
                                                <Text style={{ flex: 1, textAlign: "center" }}>{item.sale.id}</Text>
                                                <Text style={{ flex: 1, textAlign: "center" }}>{item.sale.clientid}</Text>
                                                <Text style={{ flex: 1, textAlign: "center" }}>{item.user.name} {item.user.lastname}</Text>
                                                <Text style={{ flex: 1, textAlign: "center" }}>${item.sale.total}</Text>
                                                <Text style={{ flex: 1, textAlign: "center" }}>{item.sale.status === 1 ? "Activo": "No activo"}</Text>
                                                
                                            </View>
                                        }
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
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

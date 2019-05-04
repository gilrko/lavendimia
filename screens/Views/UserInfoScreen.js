import React, { Component } from 'react'
import { Text, View, ScrollView, ActivityIndicator, AsyncStorage, FlatList, Image, KeyboardAvoidingView } from 'react-native'
import SERVICES from '../../services/Services';
import { Button, Header, Input } from 'react-native-elements';
import Uri from '../../services/Uris'
import { NavigationEvents } from 'react-navigation';
import { showMessage, FlashMessage } from "react-native-flash-message";
import TopBar from '../../components/TopBar';

export default class DetailsOrderScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
		super(props)
		const { navigation } = this.props;
		let user = navigation.getParam('user', false)
		console.log("USER -->",user)
		if (user) {
			this.state = {
				name: user.name,
				lastname: user.lastname,
				motherlastname: user.motherlastname,
                rfc: user.rfc,
                user: user
			}
		}else{
			this.state = {user: null}
		}
		
	}
    async componentDidMount() {
        var dateDay = new Date().getDate();
		var dateMonth = new Date().getMonth() + 1;
		var dateYear = new Date().getFullYear()
		let date = dateDay+"/"+dateMonth+"/"+dateYear;
        this.setState({  isLoading: false, date: date })
    }

    async createClient(){
        let name = this.state.name
        let lastname = this.state.lastname
        let motherlastname = this.state.motherlastname
        let rfc = this.state.rfc
        let client =  await SERVICES.create_client(name,lastname,motherlastname,rfc)
        if (client.result) {
			console.log("Respuesta final", client)

			showMessage({
				message: "Respuesta exitosa",
				description: client.message,
				type: "success",
			});
			this.props.navigation.goBack()
		} else {
			console.log("No, ES BUENO")
			console.log("Respuesta final", user.message)
			showMessage({
				message: "Error",
				description: client.message,
				type: "danger",
			});
		}
    }

    async updateClient(){
        let name = this.state.name
        let lastname = this.state.lastname
        let motherlastname = this.state.motherlastname
        let rfc = this.state.rfc
        let id = this.state.user.id
        let client =  await SERVICES.update_client(id,name,lastname,motherlastname,rfc)
        if (client.result) {
			console.log("Respuesta final", client)

			showMessage({
				message: "Respuesta exitosa",
				description: client.message,
				type: "success",
			});
			this.props.navigation.goBack()
		} else {
			console.log("Respuesta final", client.message)
			showMessage({
				message: "Error",
				description: client.message,
				type: "danger",
			});
		}
    }
    render() {
        if (this.state.isLoading) {
            return (
                <View style={{ flex: 1 }}>
					<TopBar componentLeft="back" navigation={this.props.navigation} date={this.state.date} />
					<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
						<ActivityIndicator size="large" color="#00AB68" />
					</View>
				</View>
            )
        } else {
            return (
                <View style={{ flex: 1 }}>
                    <NavigationEvents
                        onWillFocus={payload => console.log('will focus', payload)}
                        onDidFocus={payload => this.componentDidMount()}
                        onWillBlur={payload => console.log('will blur', payload)}
                        onDidBlur={payload => console.log('did blur', payload)} />
                    <TopBar componentLeft="back" navigation={this.props.navigation} date={this.state.date} />
                    <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
					<ScrollView style={{ flex: 1, flexDirection: "column" }} keyboardShouldPersistTaps='handled'>
						<View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, marginHorizontal: 25 }}>
							<Input
								label="Nombre"
								placeholder='Juan'
								labelStyle={{ color: "#00AB68" }}
								inputContainerStyle={{ marginBottom: 10 }}
								keyboardType="default"
								value={this.state.name}
								onChangeText={(value) => this.setState({ name: value })} />
							<Input
								label="Apellido Paterno"
								placeholder='Lopéz'
								labelStyle={{ color: "#00AB68" }}
								inputContainerStyle={{ marginBottom: 10 }}
								keyboardType="default"
								value={this.state.lastname}
								onChangeText={(value) => this.setState({ lastname: value })} />
							<Input
								label="Apellido Materno"
								placeholder='Lopéz'
								labelStyle={{ color: "#00AB68" }}
								inputContainerStyle={{ marginBottom: 10 }}
								keyboardType="default"
								value={this.state.motherlastname}
								onChangeText={(value) => this.setState({ motherlastname: value })} />
							<Input
								label="RFC"
								placeholder='rfc'
								labelStyle={{ color: "#00AB68" }}
								inputContainerStyle={{ marginBottom: 10 }}
								keyboardType="default"
								value={this.state.rfc}
								onChangeText={(value) => this.setState({ rfc: value })} />
						</View>

						<View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, width: "100%" }}>
							{this.state.user !=  null ? <Button
								title="Actualizar cliente"
								buttonStyle={{ backgroundColor: "#00AB68", paddingVertical: 15,marginBottom: 15 }}
								titleStyle={{ textAlign: "center", marginHorizontal: 100, color: "white" }}
								onPress={() => this.updateClient()}
							/>:
							<Button
								title="Agregar cliente"
								buttonStyle={{ backgroundColor: "#00AB68", paddingVertical: 15,marginBottom: 15 }}
								titleStyle={{ textAlign: "center", marginHorizontal: 100, color: "white" }}
								onPress={() => this.createClient()}
							/>}
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
                </View>
            )
        }

    }
}

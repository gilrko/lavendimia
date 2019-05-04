import React from 'react';
import { ScrollView, StyleSheet, TouchableHighlight, View, Text, FlatList, ActivityIndicator, AsyncStorage, KeyboardAvoidingView, Alert } from 'react-native';
import TopBar from '../components/TopBar';
import { ListItem, Button, Image, Icon, Input  } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import SERVICES from '../services/Services';
import { showMessage, FlashMessage } from "react-native-flash-message";

export default class ConfigScreen extends React.Component {
	static navigationOptions = {
		title: 'Links',
		header: null,
	};

	constructor() {
		super()
		this.state = { isLoading: true, tasa: "", plazo: "", enganche: "", date: "" }

	}

	async componentDidMount() {
		let date = await SERVICES.getDate()
		let configuration = await AsyncStorage.getItem('CONFIGURATION')
		if (configuration === null) {
			this.setState({
				isLoading: false,
				date: date
			})
		} else {
			let config = JSON.parse(configuration)
			console.log("Configuration", config)
			this.setState({
				isLoading: false,
				tasa: config.tasa,
				plazo: config.plazo,
				enganche: config.enganche,
				date: date
			})
		}
	}

	 async saveConfiguration(){
		 let config = {tasa: this.state.tasa,plazo: this.state.plazo,enganche: this.state.enganche}
		await AsyncStorage.setItem('CONFIGURATION', JSON.stringify(config));
		showMessage({
			message: "Éxito al guardar",
			description: "La configuración se ha guardado correctamente",
			type: "success",
			duration: 3000,
		});

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
				<View style={styles.container}>
					<KeyboardAvoidingView style={{ flex: 1 }} behavior="padding" enabled>
						<NavigationEvents
							onWillFocus={payload => this.componentDidMount()}
							onDidFocus={payload => console.log('did focus', payload)}
							onWillBlur={payload => console.log('will blur', payload)}
							onDidBlur={payload => console.log('did blur', payload)}
						/>
						<TopBar date={this.state.date} navigation={this.props.navigation} />
						<ScrollView style={{ flex: 1, flexDirection: "column" }} keyboardShouldPersistTaps='handled'>
							<View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, marginHorizontal: 25 }}>
								<Input
									label="Tasa Financiamiento"
									placeholder=''
									labelStyle={{ color: "#00AB68" }}
									inputContainerStyle={{ marginBottom: 10 }}
									keyboardType="numeric"
									value={this.state.tasa}
									onChangeText={(value) => this.setState({ tasa: value })} />
								<Input
									label="% Enganche"
									placeholder=''
									labelStyle={{ color: "#00AB68" }}
									inputContainerStyle={{ marginBottom: 10 }}
									keyboardType="numeric"
									value={this.state.enganche}
									onChangeText={(value) => this.setState({ enganche: value })} />
								<Input
									label="Plazo Máximo"
									placeholder=''
									labelStyle={{ color: "#00AB68" }}
									inputContainerStyle={{ marginBottom: 10 }}
									keyboardType="numeric"
									value={this.state.plazo}
									onChangeText={(value) => this.setState({ plazo: value })} />

								<View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, width: "100%" }}>
										<Button
											title="Guardar configuración"
											buttonStyle={{ backgroundColor: "#00AB68", paddingVertical: 15, marginBottom: 15 }}
											titleStyle={{ textAlign: "center", marginHorizontal: 100, color: "white" }}
											onPress={() => this.saveConfiguration()}
										/>
								</View>
							</View>
						</ScrollView>
					</KeyboardAvoidingView>
				</View>
			);
		}
	}
}
const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: '#fff',
	},
});

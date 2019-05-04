import React, { Component } from 'react';
import { NavigationActions, NavigationEvents } from 'react-navigation';
import { Text, View, StyleSheet, ActivityIndicator, ImageBackground, ScrollView, TouchableHighlight, AsyncStorage } from 'react-native'
import { white } from 'ansi-colors';
import URIS from '../services/Uris';
import SERVICES from '../services/Services';
import { Image } from 'react-native-elements';
import Accordion from 'react-native-collapsible/Accordion';

const SECTIONS = [
	{
		title: 'Inicio',
	},
	{
		title: 'Ventas',
	},
	{
		title: 'Clientes',
	},
	{
		title: 'Articulos',
	},
	{
		title: 'Configuración',
	},
];

export default class drawerContentComponents extends Component {

	constructor() {
		super()
		this.state = { isLoading: true, activeSections: [], categories: [] }
	}

	capitalize = (s) => {
		// console.log("STRING -->",s)
		if (typeof s !== 'string') return ''
		return s.charAt(0).toUpperCase() + s.slice(1)
	}

	_renderSectionTitle = section => {
		return (
			<View style={styles.content}>
				<Text style={{ color: "red" }}>{section.content}</Text>
			</View>
		);
	};

	_renderHeader = section => {
		if (section.sub_categories <= 0) {
			return (
				<TouchableHighlight style={styles.header} onPress={() => this.props.navigation.navigate('ShowCategory', { categoryId: section.id })}>
					<Text style={styles.headerText}>{this.capitalize(String(section.name).toLowerCase())}</Text>
				</TouchableHighlight>
			);
		} else {
			return (
				<View style={styles.header}>
					<Text style={styles.headerText}>{this.capitalize(String(section.name).toLowerCase())}</Text>
				</View>
			)
		}

	};

	_renderContent = section => {

		return (
			<View style={{ backgroundColor: "white" }}>
				{
					section.sub_categories.map((item, key) =>
						<TouchableHighlight onPress={() => this.props.navigation.navigate('ShowSubCategory', { subCategoryId: item.id })} key={key} style={styles.content} >
							<Text style={{ color: "#323232" }}>{this.capitalize(String(item.name).toLowerCase())}</Text>
						</TouchableHighlight>
					)
				}
			</View>
		);
	};

	_updateSections = activeSections => {
		this.setState({ activeSections });
	};

	async componentDidMount() {
		console.log(SECTIONS)
		this.setState({
			sections: SECTIONS ,
		})
	}

	navigateToScreen = (route) => (
		() => {
			const navigateAction = NavigationActions.navigate({
				routeName: route
			});
			this.props.navigation.dispatch(navigateAction);
		})

	render() {
		if (this.state.isLoading) {
			return (
				<View><Text>Prueba1</Text></View>
			)
		} else {
			return (
				<View style={styles.container}>
					<NavigationEvents
						onWillFocus={payload => { this.props.navigation.navigate('Main'), this.componentDidMount() }}
						onDidFocus={payload => { this.componentDidMount() }}
						onWillBlur={payload => console.log('will blur', payload)}
						onDidBlur={payload => console.log('did blur', payload)} />
					<View style={styles.headerContainer}>
						
					</View>
					{/* <View><Text>Prueba2</Text></View> */}
					<ScrollView style={{ width: "100%", height: "100%", backgroundColor: "#323232" }}>
					{/*	<Accordion
							sections={this.state.sections}
							activeSections={this.state.activeSections}
							renderHeader={this._renderHeader}
							renderContent={this._renderContent}
							onChange={this._updateSections}
							underlayColor="#00AB68"
					/>*/}
					</ScrollView>
				</View>
			)
		}
	}
}

const styles = StyleSheet.create({
	container: {
		alignItems: 'center',
		flex: 1,
		flexDirection: "column",
		backgroundColor: "#00AB68"
	},
	headerContainer: {
		height: 150,
		alignItems: "center"
	},
	headerText: {
		color: 'white',
		fontSize: 16
	},
	screenContainer: {
		paddingTop: 20
	},
	screenStyle: {
		height: 30,
		marginTop: 2,
		flexDirection: 'row',
		alignItems: 'center'
	},
	content: {
		padding: 15,
		paddingLeft: 40,
		backgroundColor: '#fff',
		borderColor: "white"
	},
	header: {
		backgroundColor: '#323232',
		padding: 10,
		paddingVertical: 25,
		borderWidth: .3,
		borderColor: "#404040"
	},
	screenTextStyle: {
		fontSize: 20,
		marginLeft: 20
	},
});
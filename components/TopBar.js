import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View, StatusBar } from 'react-native';
import { Header, Icon } from 'react-native-elements';

export default class TopBar extends React.Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props)		
	}
	renderComponentLeft = () => {
		let component
		switch (this.props.componentLeft) {
			case "back":
				component = <GoBack navigation={this.props.navigation} />
				break;
			case "menu":
				component = <Menu navigation={this.props.navigation} status={this.props.status} sidebarRef={this.props.sidebarRef} />
				break;
			default:
				break;
		}
		return component
	}

	renderComponentRight = () => {
		let component
		component = <Date navigation={this.props.navigation} date={this.props.date} />
				
		return component
	}

	render() {
		return (
			<View style={styles.container}>
				<Header
					backgroundColor="#00AB68"
					leftComponent={this.renderComponentLeft()}
					centerComponent={<Image style={styles.imgTop} source={require('../assets/images/concre-white.png')}></Image>}
					rightComponent={this.renderComponentRight()}
				/>
			</View>
		);
	}
}

class GoBack extends React.Component {
	render() {
		// console.log("navegacion 2 componente -->",this.props.navigation)
		return (
			<View style={{ alignItems: 'center' }}>
				<Icon
					name='chevron-left'
					type='font-awesome'
					color='white'
					underlayColor="#00AB68"
					onPress={() => this.props.navigation.goBack()} />
			</View>
		);
	}
}
class Menu extends React.Component {
	render() {
		return (
			<View style={{ alignItems: 'center' }}>
				<Icon
					name={this.props.status ? 'times' : 'bars'}
					type='font-awesome'
					color='white'
					underlayColor="#00AB68"
					onPress={() => this.props.status ? this.props.navigation.closeDrawer() : this.props.navigation.openDrawer()} />
			</View>
		);
	}
}

class Date extends React.Component {

	render() {
		return (
			<View style={{ flexDirection: "row", alignItems: 'center' }}>
				<Text style={{color: "white"}}>Fecha: {this.props.date}</Text>
			</View>
		);
	}
}



const styles = StyleSheet.create({
	container: {
		// flex: 1,
		backgroundColor: '#fff',
	},
	imgTop: {
		width: 100,
		height: 22
	}
});

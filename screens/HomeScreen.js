import React from 'react';
import { ScrollView, StyleSheet, Text, View, Picker, ActionSheetIOS, TouchableHighlight, ActivityIndicator, FlatList } from 'react-native';
import TopBar from '../components/TopBar'
import SERVICES from '../services/Services';

var BUTTONS = [
	'Option 0',
	'Option 1',
	'Option 2',
	'Destruct',
	'Cancel',
];
var DESTRUCTIVE_INDEX = 3;
var CANCEL_INDEX = 4;

export default class StoreScreen extends React.Component {
	static navigationOptions = {
		header: null,
	};

	constructor(props) {
		super(props);
		this.state = {
			isLoading: true, clicked: "", banners: [], pageSelected: null, pageChange: 1, categoriesFiltered: [], products: [], newproducts: [], isConnected: false, data: null
		}
	}

	onPageScroll = (e) => {
		console.log("onPageScroll -->", e.nativeEvent)
		this.setState({
			pageSelected: e.nativeEvent.position,
			offset: e.nativeEvent.offset
		})
		console.log("POCISION -->", this.state.pageSelected)
	}

	onPageSelected = (e) => {
		console.log("onPageSelected -->", e.nativeEvent)
	}

	changePage() {
		this.pageChange == 0 ? this.pageChange = 1 : this.pageChange = 0

		this.viewPager.setPage(this.pageChange)
		console.log("Cambio de pagina -->", this.pageChange)
	}

	_keyExtractor = (item, index) => item.id;

	async componentDidMount() {
		let date = await SERVICES.getDate()
		console.log("date", date)
		let users = await SERVICES.users()
		console.log("USUARIOS", users)

		this.setState({
			users: users,
			isLoading: false,
			date: date
		})

	}

	showActionSheet = () => {
		ActionSheetIOS.showActionSheetWithOptions({
			options: BUTTONS,
			cancelButtonIndex: CANCEL_INDEX,
			destructiveButtonIndex: DESTRUCTIVE_INDEX,
		},
			(buttonIndex) => {
				console.log("Index -->", buttonIndex, BUTTONS[buttonIndex])
				this.setState({
					clicked: BUTTONS[buttonIndex]
				});
			});
	}

	render() {
		if (this.state.isLoading) {
			return (
				<View style={{ flex: 1 }}>
					<TopBar componentLeft="" date={this.state.date} navigation={this.props.navigation} />
					<View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
						<ActivityIndicator size="large" color="#00AB68" />
					</View>
				</View>
			)
		} else {
			return (
				<View style={styles.container}>
					<TopBar componentLeft="" date={this.state.date} navigation={this.props.navigation} />

					<View style={{ flex: 1 }}>
						<View style={{ flex: 1, alignItems: "center", justifyContent: "center", alignContent: "center", backgroundColor: "white" }}>
						<Text style={{ color: "#00AB68", fontSize: 50 }}>Bienvenido</Text>
						</View>
						
					</View>
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
	swiper: {
		flex: .5,
		flexDirection: "row"
	},
	select: {
		flex: .1
	},
	imageBanner: {
		flex: 1,
		width: "100%",
	},
	wrapper: {
		flex: 1
	},
	relatedProduct: {
		height: 270
	},
	viewPager: {
		flex: .9
	},
	pageStyle: {
		alignItems: 'center',
		flex: 1,
		// paddingTop: 15
	}
});

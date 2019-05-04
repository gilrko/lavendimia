import React, { Component } from 'react'
import { Text, View, ScrollView, ActivityIndicator, AsyncStorage, FlatList, Image, KeyboardAvoidingView } from 'react-native'
import SERVICES from '../../services/Services';
import { Button, Header, Input } from 'react-native-elements';
import Uri from '../../services/Uris'
import { NavigationEvents } from 'react-navigation';
import { showMessage, FlashMessage } from "react-native-flash-message";
import TopBar from '../../components/TopBar';

export default class ArticleInfoScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
		super(props)
		const { navigation } = this.props;
		let article = navigation.getParam('article', false)
		console.log("ARTICLE -->",article)
		if (article) {
			this.state = {
				description: article.description,
				model: article.model,
				stock: article.stock.toString(),
                price: article.price.toString(),
                article: article
			}
		}else{
			this.state = {article: null}
		}
		
	}
    async componentDidMount() {
        var dateDay = new Date().getDate();
		var dateMonth = new Date().getMonth() + 1;
		var dateYear = new Date().getFullYear()
		let date = dateDay+"/"+dateMonth+"/"+dateYear;
        this.setState({  isLoading: false, date: date })
    }

    async createArticle(){
        let description = this.state.description
        let model = this.state.model
        let stock = this.state.stock
        let price = this.state.price
        let article =  await SERVICES.create_article(description,model,stock,price)
        if (article.result) {
			console.log("Respuesta final", article)

			showMessage({
				message: "Respuesta exitosa",
				description: article.message,
				type: "success",
			});
			this.props.navigation.goBack()
		} else {
			console.log("Respuesta final", article.message)
			showMessage({
				message: "Error",
				description: article.message,
				type: "danger",
			});
		}
    }

    async updateArticle(){
        let description = this.state.description
        let model = this.state.model
        let stock = this.state.stock
        let price = this.state.price
        let id = this.state.article.id
        let article =  await SERVICES.update_article(id,description,model,stock,price)
        if (article.result) {
			console.log("Respuesta final", article)

			showMessage({
				message: "Respuesta exitosa",
				description: article.message,
				type: "success",
			});
			this.props.navigation.goBack()
		} else {
			console.log("Respuesta final", article.message)
			showMessage({
				message: "Error",
				description: article.message,
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
								label="Descripción"
								placeholder='Mueble'
								labelStyle={{ color: "#00AB68" }}
								inputContainerStyle={{ marginBottom: 10 }}
								keyboardType="default"
								value={this.state.description}
								onChangeText={(value) => this.setState({ description: value })} />
							<Input
								label="Modelo"
								placeholder=''
								labelStyle={{ color: "#00AB68" }}
								inputContainerStyle={{ marginBottom: 10 }}
								keyboardType="default"
								value={this.state.model}
								onChangeText={(value) => this.setState({ model: value })} />
							<Input
								label="Existencia"
								placeholder='Lopéz'
								labelStyle={{ color: "#00AB68" }}
								inputContainerStyle={{ marginBottom: 10 }}
								keyboardType="numeric"
								value={this.state.stock}
								onChangeText={(value) => this.setState({ stock: value })} />
							<Input
								label="price"
								placeholder='$1000'
								labelStyle={{ color: "#00AB68" }}
								inputContainerStyle={{ marginBottom: 10 }}
								keyboardType="default"
								value={this.state.price}
								onChangeText={(value) => this.setState({ price: value })} />
						</View>

						<View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, width: "100%" }}>
							{this.state.article !=  null ? <Button
								title="Actualizar articulo"
								buttonStyle={{ backgroundColor: "#00AB68", paddingVertical: 15,marginBottom: 15 }}
								titleStyle={{ textAlign: "center", marginHorizontal: 100, color: "white" }}
								onPress={() => this.updateArticle()}
							/>:
							<Button
								title="Agregar articulo"
								buttonStyle={{ backgroundColor: "#00AB68", paddingVertical: 15,marginBottom: 15 }}
								titleStyle={{ textAlign: "center", marginHorizontal: 100, color: "white" }}
								onPress={() => this.createArticle()}
							/>}
						</View>
					</ScrollView>
				</KeyboardAvoidingView>
                </View>
            )
        }

    }
}

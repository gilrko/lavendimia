import React, { Component } from 'react'
import { Text, View, ScrollView, ActivityIndicator, AsyncStorage, FlatList, Image, KeyboardAvoidingView, TouchableOpacity, StyleSheet } from 'react-native'
import SERVICES from '../../services/Services';
import { Button, Header, Input, Icon } from 'react-native-elements';
import { NavigationEvents } from 'react-navigation';
import { showMessage, FlashMessage } from "react-native-flash-message";
import Autocomplete from "react-native-autocomplete-input"
import TopBar from '../../components/TopBar';

export default class SalesInfoScreen extends Component {
    static navigationOptions = {
        header: null
    };

    constructor(props) {
        super(props)
        this.state = {
            isLoading: true,
            clientSelected: null,
            articleSelected: null,
            query: "",
            queryArticles: "",
            clients: [],
            articles: [],
            articlesAdded: [],
            quantityArticles: [],
        }

    }
    async componentDidMount() {
        let clients = await SERVICES.users()
        let articles = await SERVICES.articles()
        let date = await SERVICES.getDate()
        let configuration = await AsyncStorage.getItem('CONFIGURATION')
        if (configuration === null) {
            this.props.navigation.goBack()
            showMessage({
                message: "Se requiere la configuración",
                description: "Para poder avanzar se necesita tener la configuración general",
                type: "success",
            });
        } else {
            let config = JSON.parse(configuration)
            console.log("Configuration", config)
            if (config.tasa === "" || config.plazo === "" || config.enganche === "") {
                this.props.navigation.goBack()
                showMessage({
                    message: "Se requiere la configuración",
                    description: "Para poder avanzar se necesita tener la configuración general completa",
                    type: "success",
                });
            } else {
                let date = await SERVICES.getDate()
                this.setState({
                    isLoading: false, date: date, tasa: config.
                        tasa, plazo: config.plazo, enganche: config.enganche,
                    clients: clients, articles: articles, date: date
                })
            }
        }

    }

    async selectClient(data) {
        this.setState({ clientSelected: data, query: "" })
        console.log(data)
    }
    async selectArticle(data) {
        this.setState({ articleSelected: data, queryArticles: "" })
        console.log("el arti", data)
    }
    async addArticle() {
        let articlesAdded = this.state.articlesAdded
        let quantityArticles = this.state.quantityArticles
        let exists = false
        for (let i = 0; i<articlesAdded.length; i++) {
            console.log("articulo id",articlesAdded[i].id)
            if (this.state.articleSelected.id === articlesAdded[i].id) {
                exists = true
            }
        }
        if (exists) {
            showMessage({
                message: "No se puede agregar",
                description: "Este articulo ya esta agregado a la lista",
                type: "danger",
            });
        } else {
            if (this.state.articleSelected.stock >= 1) {
                articlesAdded.push(this.state.articleSelected)
                quantityArticles.push(1)
            } else {
                showMessage({
                    message: "No se puede agregar",
                    description: "El articulo seleccionado no cuenta con existencia, favor de verificar",
                    type: "danger",
                    duration: 3500
                });
            }
        }
        this.setState({ articleSelected: null, queryArticles: "", articlesAdded: articlesAdded, quantityArticles: quantityArticles })

    }

    getPrice(price) {
        let newPrice = price * (1 + (this.state.tasa * this.state.plazo) / 100)
        return newPrice
    }

    changeQuantity(index, value) {
        let quantityArticles = this.state.quantityArticles
        quantityArticles[index] = value
        this.setState({ quantityArticles: quantityArticles })
    }

    getImporte() {
        let quantityArticles = this.state.quantityArticles
        let articlesAdded = this.state.articlesAdded
        importTotal = 0

        for(let i = 0;i<articlesAdded.length;i++){
            let newPrice = this.getPrice(articlesAdded[i].price)
            importTotal = importTotal + (newPrice * quantityArticles[i])
        }
        return importTotal
    }

    getEnganche() {
        let importTotal = this.getImporte()
        let enganche = (this.state.enganche/100)* importTotal
        return enganche
    }
    getBoniEnganche() {
        let enganche = this.getEnganche()
        let boniEnganche = enganche * ((this.state.tasa * this.state.plazo)/100)
        return boniEnganche
    }

    getTotal() {
        let enganche = this.getEnganche()
        let boniEnganche = this.getBoniEnganche()
        let importe = this.getImporte()
        let total = importe - enganche - boniEnganche
        return total
    }

    async saveSale(){
        let date = this.state.date
        let total = this.getTotal()
        let client = this.state.clientSelected
        let sale = await SERVICES.create_sale(total.toFixed(2),client.id)
        if (sale.result) {
			console.log("Respuesta final", sale)

			showMessage({
				message: "Respuesta exitosa",
				description: sale.message,
				type: "success",
			});
			this.props.navigation.goBack()
		} else {
			console.log("Respuesta final", sale.message)
			showMessage({
				message: "Error",
				description: sale.message,
				type: "danger",
			});
		}
    }


    findName(query) {
        if (query === '') {
            return [];
        }

        const { clients } = this.state;
        return clients.filter(client => client.name.search(query) >= 0);
    }
    findNameArticle(queryArticles) {
        if (queryArticles === '') {
            return [];
        }

        const { articles } = this.state;
        return articles.filter(article => article.description.search(queryArticles) >= 0);
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
            // alert(JSON.stringify(this.state.clients))
            const clients = this.findName(this.state.query)
            const articles = this.findNameArticle(this.state.queryArticles)
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
                            <View style={{ marginTop: 30, marginHorizontal: 25, flexDirection: "column", width: "100%", height: 150 }}>

                                {this.state.clientSelected === null ?
                                    <Autocomplete
                                        data={clients}
                                        defaultValue={this.state.query}
                                        containerStyle={styles.autocompleteContainer}
                                        onChangeText={text => text.length >= 3 ? this.setState({ query: text }) : console.log("GG")}
                                        placeholder="Buscar cliente..."
                                        keyExtractor={() => { }}
                                        renderItem={({ item, i }) => (
                                            <TouchableOpacity style={{ height: 40 }} key={i} onPress={() => this.selectClient(item)}>
                                                <Text>{item.name} {item.lastname} {item.motherlastname}</Text>
                                            </TouchableOpacity>
                                        )}
                                    /> :
                                    <View style={{ justifyContent: "center", alignItems: "center", width: "100%" }}>
                                        <Text style={{ backgroundColor: "white", color: "blue", fontSize: 20, borderWidth: 1, borderColor: "#dadada" }}>Cliente: {this.state.clientSelected.id} -- {this.state.clientSelected.name} {this.state.clientSelected.lastname} {this.state.clientSelected.motherlastname}</Text>
                                    </View>
                                }
                                {this.state.articleSelected === null ?
                                    <Autocomplete
                                        data={articles}
                                        defaultValue={this.state.queryArticles}
                                        containerStyle={styles.autocompleteContainerArticle}
                                        onChangeText={text => text.length >= 3 ? this.setState({ queryArticles: text }) : console.log("GG")}
                                        placeholder="Buscar articulo..."
                                        keyExtractor={() => { }}
                                        renderItem={({ item, i }) => (
                                            <TouchableOpacity style={{ height: 40 }} key={i} onPress={() => this.selectArticle(item)}>
                                                <Text>{item.description} {item.stock}</Text>
                                            </TouchableOpacity>
                                        )}
                                    /> :
                                    <View style={{ justifyContent: "center", alignItems: "center", width: "100%", flexDirection: "row", marginTop: 20 }}>
                                        <Text style={{ backgroundColor: "white", color: "blue", fontSize: 20, borderWidth: 1, borderColor: "#dadada" }}>Articulo: {this.state.articleSelected.description}</Text>
                                        <Button
                                            title="Agregar articulo"
                                            buttonStyle={{ backgroundColor: "#4a4a4a", marginLeft: 15 }}
                                            titleStyle={{ textAlign: "center", color: "white" }}
                                            onPress={() => this.addArticle()}
                                        />
                                    </View>
                                }
                            </View>
                            <View style={{ flex: 1, flexDirection: "column" }}>
                                <View style={{ flexDirection: "row", borderTopColor: "black", borderTopWidth: 1, borderBottomColor: "black", borderBottomWidth: 1 }}>
                                    <Text style={{ flex: 1, textAlign: "center" }}>Descripcion art.</Text>
                                    <Text style={{ flex: 1, textAlign: "center" }}>Modelo</Text>
                                    <Text style={{ flex: 1, textAlign: "center" }}>Cantidad</Text>
                                    <Text style={{ flex: 1, textAlign: "center" }}>Precio</Text>
                                    <Text style={{ flex: 1, textAlign: "center" }}>Importe</Text>
                                </View>
                                <View style={{ flex: 1 }}>
                                    <FlatList
                                        data={this.state.articlesAdded}
                                        refreshing={this.state.refreshing}
                                        style={{ marginTop: 10 }}
                                        renderItem={({ item, index }) =>
                                            <View style={{ flex: 1, flexDirection: "row", borderBottomColor: "black", borderBottomWidth: 1 }} >
                                                <Text style={{ flex: 1, textAlign: "center" }}>{item.description}</Text>
                                                <Text style={{ flex: 1, textAlign: "center" }}>{item.model}</Text>
                                                <View style={{ flex: 1 }}>
                                                    <Input
                                                        placeholder=''
                                                        keyboardType="numeric"
                                                        inputStyle={{ textAlign: "center" }}
                                                        value={this.state.quantityArticles[index].toString()}
                                                        onChangeText={(value) => value <= item.stock ? this.changeQuantity(index, value) : console.log("GG")} />
                                                </View>
                                                <Text style={{ flex: 1, textAlign: "center" }}>${this.getPrice(item.price).toFixed(2)}</Text>
                                                <Text style={{ flex: 1, textAlign: "center" }}>${(this.getPrice(item.price) * this.state.quantityArticles[index]).toFixed(2)}</Text>
                                                <View><Icon
                                                    name='close'
                                                    color='red'
                                                    onPress={() => console.log('hello')} /></View>
                                                
                                            </View>
                                        }
                                        keyExtractor={(item, index) => index.toString()}
                                    />
                                </View>
                            </View>
                            {this.state.articlesAdded.length > 0 ?
                                <View style={{ borderTopWidth: .5, borderTopColor: "#00AB68", paddingHorizontal: 20, flexDirection: "column", bottom: 0 }}>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 5 }}>
                                        <Text style={{ flex: 1, fontSize: 14 }}>Enganche:</Text>
                                        <Text style={{ flex: 1, fontSize: 14, color: "#00AB68", textAlign: "right" }}>$ {this.getEnganche().toFixed(2)}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                                        <Text style={{ flex: 1, fontSize: 14 }}>Bonificación de enganche:</Text>
                                        <Text style={{ flex: 1, fontSize: 14, color: "#00AB68", textAlign: "right" }}>$ {this.getBoniEnganche().toFixed(2)}</Text>
                                    </View>
                                    <View style={{ flexDirection: "row", alignItems: "center", marginVertical: 10 }}>
                                        <Text style={{ flex: 1, fontSize: 14 }}>Total:</Text>
                                        <Text style={{ flex: 1, fontSize: 14, color: "#00AB68", textAlign: "right" }}>$ {this.getTotal().toFixed(2)}</Text>
                                    </View>
                                    <Button
                                        title="Guardar"
                                        buttonStyle={{ backgroundColor: "#00AB68", width: "100%", paddingVertical: 15, marginVertical: 5 }}
                                        onPress={() => this.saveSale()}
                                    />
                                </View> : null}
                        </ScrollView>

                    </KeyboardAvoidingView>
                </View>
            )
        }

    }
}
const styles = StyleSheet.create({
    autocompleteContainer: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 20,
        top: 0,
        zIndex: 1,
        marginRight: 20
    },
    autocompleteContainerArticle: {
        flex: 1,
        left: 0,
        position: 'absolute',
        right: 20,
        top: 80,
        zIndex: 1,
        marginRight: 20
    }
});
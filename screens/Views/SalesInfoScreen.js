import React, { Component } from 'react'
import { Text, View, ScrollView, ActivityIndicator, AsyncStorage, FlatList, Image, KeyboardAvoidingView, TouchableOpacity, StyleSheet } from 'react-native'
import SERVICES from '../../services/Services';
import { Button, Header, Input } from 'react-native-elements';
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
            query: "",
        }

    }
    async componentDidMount() {
        let clients = await SERVICES.users()
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
                    clients: clients
                })
            }
        }

    }

    async selectClient(data) {
        console.log(data)
        if (data === null) {

        } else {
            for (let i = 0; i < this.state.clients.length; i++) {
                if (data.id === this.state.clients[i].id) {
                    this.setState({ clientSelected: this.state.clients[i] })
                }
            }
            console.log(this.state.clientSelected)
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
                            <View style={{ marginTop: 40, marginHorizontal: 25, flexDirection: "row", width: "100%" }}>
                                <Text style={{ backgroundColor: "blue" }}>Cliente: </Text>
                                    <Autocomplete
                                        data={this.state.clients}
                                        defaultValue={this.state.query}
                                        onChangeText={text => this.setState({ query: text })}

                                        renderItem={({ item, i }) => (
                                            <TouchableOpacity onPress={() => this.setState({ query: item.name })}>
                                                <Text>{item}</Text>
                                            </TouchableOpacity>
                                        )}
                                    />
                                }
                            </View>

                            <View style={{ alignItems: "center", justifyContent: "center", marginTop: 40, width: "100%" }}>
                                {this.state.article != null ? <Button
                                    title="Actualizar articulo"
                                    buttonStyle={{ backgroundColor: "#00AB68", paddingVertical: 15, marginBottom: 15 }}
                                    titleStyle={{ textAlign: "center", marginHorizontal: 100, color: "white" }}
                                    onPress={() => this.updateArticle()}
                                /> :
                                    <Button
                                        title="Agregar articulo"
                                        buttonStyle={{ backgroundColor: "#00AB68", paddingVertical: 15, marginBottom: 15 }}
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
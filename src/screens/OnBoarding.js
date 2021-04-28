import React, { Component } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'

export class OnBoarding extends Component {

    constructor(props) {
        super(props)
    
        this.state = {
             name: "",
             error: ""
        }
    }

    navToChat = () => {
        if(this.state.name !== ""){
            this.props.navigation.navigate("Chat", {name: this.state.name})
        } else {
            this.setState({
                error: "Please fill your name first"
            })
        }
    }
    
    render() {

        const {
            name,
            error
        } = this.state;
        return (
            <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
                <TextInput 
                    value={name}
                    onChangeText={(text) => this.setState({name: text, error: ''})}
                    placeholder="Fill your name"
                    style={{
                        height: 38,
                        width: 200,
                        paddingHorizontal: 10,
                        borderWidth: 1,
                        borderColor: 'grey',
                        borderRadius: 8,
                        marginVertical: 7,
                        alignItems: 'center'
                    }}
                    />
                    {
                        error ? (
                            <Text style={{color: 'red', fontSize: 10}}>{error}</Text>
                        ) : null
                    }
                <TouchableOpacity 
                    style={{marginVertical: 8, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, backgroundColor: 'blue'}}
                    onPress={this.navToChat}
                    >
                    <Text style={{color: 'white'}}>Chatting {"->"}</Text>
                </TouchableOpacity>
            </View>
        )
    }
}

export default OnBoarding

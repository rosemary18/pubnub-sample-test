import { usePubNub } from 'pubnub-react';
import React, {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native'


export default function Chat(props) {
    const pubnub = usePubNub();
    const [channels] = useState(['awesome-channel']);
    const [messages, addMessages] = useState([]);
    const [message, setMessage] = useState('');
    let scroll = "";

    const sendMessage = message => {
        if (message) {
          pubnub
            .publish({ channel: channels[0], message })
            .then(() => setMessage(''));
        }
      };

    const handleMessage = event => {
        const message = event.message;
        const time = new Date(event.timetoken / 10000)
        if (typeof message === 'string' || message.hasOwnProperty('text')) {
            const text = message.text || message;
            const obj = {
                text,
                time: time.getHours().toString().slice(-2) + ":" + time.getMinutes().toString().slice(-2)
            }
            addMessages(messages => [...messages, obj]);
            scroll.scrollToEnd();
        }
    };

    useEffect(() => {
        pubnub.addListener({ message: handleMessage});
        pubnub.subscribe({ channels });
    }, [pubnub, channels]);

    
    return (
        <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: '#ECD6D1'}}>
            <ScrollView style={{flex: 1, padding: 8}} ref={ref => scroll = ref} showsVerticalScrollIndicator={false}>
                {
                    messages.map((msg, index) => (
                        <View key={`keyIndex-${index}`} style={{marginTop: 4, marginBottom: index === messages.length - 1 ? 8 : 4, paddingHorizontal: 6, paddingTop: 4, backgroundColor: 'white', borderRadius: 8, alignSelf: 'flex-start'}}>
                            <Text style={{fontSize: 12}}>{msg.text}</Text>
                            <Text style={{fontSize: 7, textAlign: 'right', color: "grey", marginTop: 4, marginBottom: 4}}>{msg.time}</Text>
                        </View>
                    ))
                }
            </ScrollView>
            <View style={{height: 56, flexDirection: 'row'}}>
                <TextInput 
                    style={{
                        flex: 1, 
                        padding: 0,
                        paddingHorizontal: 16,
                        margin: 8,
                        backgroundColor: 'white',
                        borderRadius: 28
                    }}
                    value={message}
                    onChangeText={(text) => setMessage(text)}
                    onSubmitEditing={() => sendMessage(message)}
                    />
                <TouchableOpacity 
                    style={{height: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, margin: 8, marginLeft: 0, backgroundColor: 'blue', paddingHorizontal: 16}}
                    onPress={() => sendMessage(message)}
                    >
                    <Text style={{color: 'white'}}>SEND</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}


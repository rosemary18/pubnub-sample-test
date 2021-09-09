import { usePubNub } from 'pubnub-react';
import React, {useState, useEffect} from 'react'
import { View, Text, TextInput, TouchableOpacity, ScrollView, Image } from 'react-native'
import PushNotification from 'react-native-push-notification';


export default function Chat({route, props}) {
    const pubnub = usePubNub();
    const [channels] = useState(['awesome-channel']);
    const [messages, addMessages] = useState([]);
    const [message, setMessage] = useState('');
    let scroll = "";

    const sendMessage = (message, info) => {
        if (message) {
          let obj = {
              text: message,
              sender: route?.params?.name,
              in: info
          }
          pubnub
            .publish({ channel: channels[0], message: obj })
            .then(() => setMessage(''));
        }
      };

    useEffect(() => {

        console.log("Functional component mounted")
        const listener = {
            message: function (event) {
                const {message} = event;
                if(route?.params?.name !== message.sender && message.in === null){
                    PushNotification.localNotification({
                        channelId: "CID01",
                        smallIcon: 'https://icons-for-free.com/iconfiles/png/512/send+icon-1320185654900887696.png',
                        title: message.sender,
                        message: message.text,
                        playSound: false,
                        vibrate: false,
                        ignoreInForeground: false,
                        });
                }
                const time = new Date(event.timetoken / 10000)
                // console.log(message)
                const obj = {
                    in: message.in,
                    text: message.text,
                    time: ("0" + time.getHours().toString()).slice(-2) + ":" + ("0" + time.getMinutes().toString()).slice(-2),
                    sender: message.sender
                }
                addMessages(messages => [...messages, obj]);
                scroll.scrollToEnd();
            }
        }
        
        pubnub.addListener(listener);
        pubnub.subscribe({ channels });

        // Send Message Enterence
        const sendEntranceMessage = (info) => {
            let obj = {
                text: "",
                sender: route?.params?.name,
                in: info
            }
            console.log("sendEntranceMessage : ", obj)
            pubnub.publish({ channel: channels[0], message: obj }).catch(err => console.log(err))
        }

        sendEntranceMessage(true);
        return () => {
            console.log("Functional component unmounted")
            sendEntranceMessage(false);
            pubnub.unsubscribe({ channels });
            pubnub.removeListener(listener);
        }
    }, [pubnub, channels]);

    
    return (
        <View style={{flex: 1, justifyContent: 'flex-end', backgroundColor: '#ECD6D1'}}>
            <ScrollView style={{flex: 1, padding: 8}} ref={ref => scroll = ref} showsVerticalScrollIndicator={false}>
                {
                    messages.map((msg, index) => {
                        if(msg.in && route.params.name !== msg.sender ) {
                            return (
                                <View key={`keyIndex-${index}`} style={{marginTop: 4, marginBottom: index === messages.length - 1 ? 8 : 4, paddingHorizontal: 6, backgroundColor: 'grey', borderRadius: 8, alignSelf: 'center'}}>
                                    <Text style={{fontSize: 7, textAlign: 'center', color: "#F5F5F5", marginTop: 4, marginBottom: 4}}>{msg.sender} in</Text>
                                </View>
                            )
                        } else if(msg.in === false && route.params.name !== msg.sender) {
                            return (
                                <View key={`keyIndex-${index}`} style={{marginTop: 4, marginBottom: index === messages.length - 1 ? 8 : 4, paddingHorizontal: 6, backgroundColor: 'grey', borderRadius: 8, alignSelf: 'center'}}>
                                    <Text style={{fontSize: 7, textAlign: 'center', color: "#F5F5F5", marginTop: 4, marginBottom: 4}}>{msg.sender} left</Text>
                                </View>
                            )
                        } else if (msg.in === null){
                            return (
                                <View key={`keyIndex-${index}`} style={{marginTop: 4, marginBottom: index === messages.length - 1 ? 8 : 4, paddingHorizontal: 6, paddingTop: 4, backgroundColor: 'white', borderRadius: 8, alignSelf: route.params.name === msg.sender ? 'flex-end' : 'flex-start'}}>
                                    <Text style={{fontSize: 12, textAlign: route.params.name === msg.sender ? 'right' : 'left'}}>{msg.text}</Text>
                                    <Text style={{fontSize: 7, textAlign: route.params.name === msg.sender ? 'right' : 'left', color: "grey", marginTop: 4, marginBottom: 4}}>{msg.time}, by {msg.sender}</Text>
                                </View>
                            )
                        } else {
                            return null;
                        }
                    })
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
                    style={{height: 40, width: 40, justifyContent: 'center', alignItems: 'center', borderRadius: 20, margin: 8, marginLeft: 0}}
                    onPress={() => sendMessage(message, null)}
                    >
                    <Image 
                        source={{uri: 'https://icons-for-free.com/iconfiles/png/512/send+icon-1320185654900887696.png'}}
                        style={{
                            height: 40, 
                            width: 40
                        }}
                        />
                </TouchableOpacity>
            </View>
        </View>
    )
}


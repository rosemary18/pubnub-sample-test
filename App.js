import 'react-native-gesture-handler';
import React from 'react'
import { useEffect } from 'react';
import { PubNubProvider } from 'pubnub-react'
import PubNub from 'pubnub'
import { AppState, Linking, LogBox, SafeAreaView } from 'react-native'
import RootNavigator from './src/navigations/RootNavigator';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
// import PushNotificationIOS from '@react-native-community/push-notification-ios';

const client = new PubNub({
  subscribeKey: 'sub-c-95cde252-a723-11eb-b1ae-be4e92e38e16',
  publishKey: 'pub-c-e49b48a6-2394-4078-ba78-21ffff931199',
})

LogBox.ignoreLogs(['Setting a timer '])

function App (){

  const requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  
    if (enabled) {
      console.log('Authorization status:', authStatus);
      getToken();
    }
  }

  const getToken = () => {
    messaging().getToken().then(token => {
      if(token){
        console.log("Device token : ", token);
      } else {
        console.log("Get token reject ...")
      }
    })
  }

  const getInitialLink = async () => {
    const url = await Linking.getInitialURL();

    console.log("Initial URL : ", url)
  }
  
  useEffect(async () => {
    // PushNotificationIOS.addNotificationRequest({
    //   id: "123",
    //   title: "Title",
    //   body: "Body"
    // })
    AppState.addEventListener('change', (x) => console.log(x))
    getInitialLink();
    Linking.addEventListener('url', (url) => {
      console.log("(Listener) Incoming URL : ", url.url)
    })
    await requestUserPermission();
    PushNotification.createChannel(
      {
        channelId: "CID01", // (required)
        channelName: "My channel", // (required)
      },
      (created) => console.log(`createChannel returned '${created}'`) // (optional) callback returns whether the channel was created, false means it already existed.
    );
    messaging().onMessage(remoteMessage => {
      console.log('(Foreground/Bakground State) New message arrived : ', JSON.stringify(remoteMessage));
      PushNotification.localNotification({
        channelId: "CID01",
        title: remoteMessage.notification.title,
        message: remoteMessage.notification.body,
        playSound: false,
        vibrate: false,
        ignoreInForeground: false,
      });
    });
    
    messaging().setBackgroundMessageHandler((payload) => {
      console.log("(Killed State) New message arrived : ", payload)
      // PushNotification.localNotification({
      //   title: payload.notification.title,
      //   message: payload.notification.body,
      //   playSound: false,
      //   vibrate: false,
      //   ignoreInForeground: false
      // });
    })
    
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log(
        '(Foreground/ Background State) Notification caused app to open from background state:',
        remoteMessage,
      );
    });

    
  }, [])

  return (
      <PubNubProvider client={client}>
        <SafeAreaView style={{flex: 1}}>
          <RootNavigator />
        </SafeAreaView>
      </PubNubProvider>
  )
}

export default App;

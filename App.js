import 'react-native-gesture-handler';
import React from 'react'
import { PubNubProvider } from 'pubnub-react'
import PubNub from 'pubnub'
import { Linking, LogBox, SafeAreaView } from 'react-native'
import RootNavigator from './src/navigations/RootNavigator';
import { useEffect } from 'react';

const client = new PubNub({
  subscribeKey: 'sub-c-95cde252-a723-11eb-b1ae-be4e92e38e16',
  publishKey: 'pub-c-e49b48a6-2394-4078-ba78-21ffff931199',
})

LogBox.ignoreLogs(['Setting a timer '])

function App (){

  useEffect(() => {
    const getInitialLink = async () => {
      const url = await Linking.getInitialURL();

      console.log(url)
    }

    getInitialLink();
    Linking.addEventListener('url', (url) => {
      console.log(url.url)
    })
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

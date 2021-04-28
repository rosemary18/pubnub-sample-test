import React from 'react'
import { PubNubProvider } from 'pubnub-react'
import Chat from './Chat'
import PubNub from 'pubnub'
import { LogBox } from 'react-native'

const client = new PubNub({
  subscribeKey: 'sub-c-95cde252-a723-11eb-b1ae-be4e92e38e16',
  publishKey: 'pub-c-e49b48a6-2394-4078-ba78-21ffff931199',
})

LogBox.ignoreLogs(['Setting a timer '])

function App (){
    return (
        <PubNubProvider client={client}>
          <Chat />
        </PubNubProvider>
    )
}

export default App;

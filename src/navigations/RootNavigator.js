import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging'
import {
    Chat,
    OnBoarding
} from '../screens';
import { Linking } from 'react-native';

const Stack = createStackNavigator()

const linking = {
    prefixes: ['pubnub://'],
    config: {
        screens: {
            OnBoarding: 'onboarding',
            Chat: {
                path: 'chat/:name',
                parse: {
                    name: (name) => `${name}`,
                }
            }
        }
    },
    async getInitialURL() {

        // Check if app was opened from a deep link
        const url = await Linking.getInitialURL();
    
        if (url != null) {
          return url;
        }
    
        // Check if there is an initial firebase notification
        const message = await messaging().getInitialNotification();
        
        // Get deep link from data
        // if this is undefined, the app will open the default/home page
        if (message && message.data.link){
            return message.data.link 
        } else {
            return "pubnub://"
        }
      }
}

export default function RootNavigator (){
    return (
        <NavigationContainer linking={linking}>
            <Stack.Navigator>
                
                <Stack.Screen 
                    name="OnBoarding"
                    component={OnBoarding}
                    options={{
                        header: () => null
                    }}
                    />

                <Stack.Screen 
                    name="Chat"
                    component={Chat}
                    options={{
                        header: () => null
                    }}
                    />

            </Stack.Navigator>
        </NavigationContainer>
    )
}


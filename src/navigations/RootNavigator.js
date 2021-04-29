import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import {
    Chat,
    OnBoarding
} from '../screens';

const Stack = createStackNavigator()

export default function RootNavigator (){
    return (
        <NavigationContainer linking={{
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
            }
        }}>
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


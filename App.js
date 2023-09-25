import React, {useState, useMemo} from 'react'
import { NavigationContainer, DefaultTheme } from '@react-navigation/native'
import {createNativeStackNavigator} from '@react-navigation/native-stack'
import Tabs from './Components/Tabs'
import { HapticsProvider } from 'react-native-custom-haptics';

import { useEffect } from 'react'

import { AuthProvider } from './Context/AuthContext'
import Paywall2 from './Screens/Paywall2' 

import { 
  onAuthStateChanged, 
  getAuth,
} from 'firebase/auth'
import app from './firebaseConfig'
import Fleur from './Screens/AI/ChatBot/Fleur'
import PromoCode from './Screens/PromoCode'
import { StatusBar, View } from 'react-native'
import { Platform, useWindowDimensions } from 'react-native'

import useRevHook from './Components/useRevHook'
import { FleurProvider } from './Context/FleurContext'
import CustomizeFaith from './Screens/CustomizeFaith'

export const AppContext = React.createContext()
export default function App({navigation}) {
  const Stack = createNativeStackNavigator()
  const auth = getAuth(app)
  const [user, setUser] = useState()
  const {isProMember} = useRevHook()
  const {width, height} = useWindowDimensions()

useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)  
      
  })
  
  return () =>{
      unsubscribe()
      
  }
}, [auth.currentUser])
  
  const theme = {
    ...DefaultTheme,
    colors: {
      ...DefaultTheme.colors,
      background: 'transparent'
    }
  }
 return (
  
  <>
    <AuthProvider>
    <FleurProvider>
    <HapticsProvider>
    <StatusBar barStyle={'light-content'}    backgroundColor='black' />
    <NavigationContainer>
      <Stack.Navigator 
         screenOptions={{
          headerShown:false,
          backgroundColor:'transparent',
          borderTopWidth: 0,
          }}
          initialRouteName="home"
      >
        
           
            
        
              <>
            
            <Stack.Screen name="home" component={Tabs} />            
            <Stack.Screen name="CustomizeFaith" component={CustomizeFaith} />
            
            
            
            
            
            
            
            
            
            
            
            
            <Stack.Screen name="Fleur" component={Fleur} />
            
            
            <Stack.Group screenOptions={{presentation:"modal"}}>
            
            
            
               
            </Stack.Group>
            <Stack.Group screenOptions={{presentation:'fullScreenModal'}}>
                <Stack.Screen name="PromoCode" component={PromoCode} />
                <Stack.Screen name="Paywall" component={Paywall2} />  
            
            {/*<Stack.Screen name="Reminder" component={ReminderScreen} />*/}
            </Stack.Group>
              </>       
           
           

        </Stack.Navigator>
    </NavigationContainer>
    </HapticsProvider>
    </FleurProvider>
    </AuthProvider>
    
    
    </>
    
    
  );
}


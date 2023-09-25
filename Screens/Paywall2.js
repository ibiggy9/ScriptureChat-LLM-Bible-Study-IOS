import { View, Text, useWindowDimensions, TouchableOpacity,Image, Animated, ActivityIndicator, ScrollView, Modal, Alert, Platform, Linking, AppState, SafeAreaView } from 'react-native'
import React, {useState, useEffect, useRef} from 'react'
import { MotiView, useDynamicAnimation, MotiText } from 'moti'
import tw from 'twrnc'

import Purchases from 'react-native-purchases'
import useRevHook from '../Components/useRevHook'
import Spinner from 'react-native-loading-spinner-overlay'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../Context/AuthContext'
import { MaterialIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';


export default function Paywall2({navigation}) {
const [modalVisible, setModalVisible] = useState(false)
const {firstLogin, setFirstLogin, logout} = useAuth()
const {height, width} = useWindowDimensions()
const [spinner, setSpinner] = useState(false) 
const {currentOffering, isProMember, customerInfo} = useRevHook()
const appState = useRef(AppState.currentState)
const [offerCodeClicked ,setOfferCodeClicked] = useState()


useEffect(()=> {
  if(isProMember){
    navigation.navigate('home')
  }
}, [])


async function restorePurchases(){
    setSpinner(true)
    const purchaserInfo = await Purchases.restorePurchases().catch((error)=> {
      setSpinner(false)
    })

    if(purchaserInfo.activeSubscriptions.length > 0){
      Alert.alert("Success", "Your purchase has been restored")
      setSpinner(false)
      navigation.navigate('home')
    } else {
      Alert.alert("Error", "No purchases to restore")
      setSpinner(false)
    }

    if(!currentOffering){
      return(
        <View>
          <ActivityIndicator size="large" color='white' />
        </View>
      )
    }
  }

async function handleMonthlyPurchase(){
    setSpinner(true)
    if(!currentOffering?.monthly) return
    console.log(currentOffering.monthly)    
    const purchaserInfo = await Purchases.purchasePackage(currentOffering.monthly).catch((error)=> {
      console.log(error)
      setSpinner(false)
    })

    console.log("Monthly sub purchased", purchaserInfo.customerInfo.entitlements.active)
    if(purchaserInfo.customerInfo.entitlements.active){
      navigation.navigate("home")
    }
    /*
    const purchaserInfo = await Purchases.purchasePackage(currentOffering.monthly).catch((error)=> {
      console.log(error)
      setSpinner(false)
    })
    console.log(purchaserInfo)
    
    if(purchaserInfo.entitlements.active.pro){
      setSpinner(false)
      
    } else {
      setSpinner(false)
    }
    */
  }

  async function handleAnnualPurchase(){
    setSpinner(true)
    if(!currentOffering?.annual) return console.log('false')

    const purchaserInfo = await Purchases.purchasePackage(currentOffering.annual).catch((error)=> {
      console.log(error)
      setSpinner(false)
    })

    //console.log("Annual sub purchased", purchaserInfo.customerInfo.entitlements.active)
    if(purchaserInfo.entitlements.active.pro){
      setSpinner(false)
      
    } else{
      setSpinner(false)
    }
    
    
  }



  return (
    
    <ScrollView contentContainerStyle={tw`pb-40`} style={[{width:width, height:height+20,}, tw`bg-slate-900 ${Platform.OS == "android" && `mt-10` }`]}>
      <SafeAreaView style={[tw`flex-1 bg-slate-900` , {width:width, height:height}]}>

      <Spinner
        visible={spinner}
        
        textStyle={{color:'white'}}
        />
      <View style={[tw`flex-1 justify-start mt-12`,{height:height, width:width, opacity:1, position:'absolute'}]}>
     
      <MotiView style={tw`mb-5 `}>
      <Text style={tw`text-white text-2xl text-center font-bold`}>Welcome to ScriptureChat</Text>
      <Text style={tw`text-slate-200 text-center font-light`}>Pick a plan to get unlimited access to all features</Text>
      <View style={tw`items-center mt-5`}>
      
      <FontAwesome5 name="cross" size={120} color="#E5962D"  />
      </View>
      </MotiView>

      {/*Content Block */}
      <View style={tw` px-5`}>
      <MotiView from={{translateY:700}} animate={{translateY:0}} transition={{type:'timing', duration:1000, }} style={tw`flex-row items-center`}>
        <Ionicons style={tw`mr-5`} name="key" size={32} color="#E5962D" />
        <View style={tw`flex-1`}>
        <Text style={tw`text-white font-bold`}>Get Unlimited Access to All Features</Text>
        <Text style={tw`text-slate-300 font-light`}>This includes unlimited conversations and the latest updates to our AI Chat feature</Text>
        </View>
        
      </MotiView>
  
      <MotiView from={{translateY:700}} animate={{translateY:0}} transition={{type:'timing', duration:1400}} style={tw`flex-row items-center pt-5`}>
        <Ionicons style={tw`mr-5`} name="ios-person-add" size={32} color="#E5962D" />
        <View style={tw`flex-1 `}>
        <Text style={tw`text-white font-bold`}>Customize The Chat Experience To Your Faith Journey</Text>
        <Text style={tw`text-slate-300 font-light`}>Set your denomination, geographics, knowledge level and more to tune the chat to where you are. </Text>
        </View>
      </MotiView>


      <MotiView from={{translateY:700}} animate={{translateY:0}} transition={{type:'timing', duration:1600}} style={tw`flex-row items-center pt-5`}>
        
        <Ionicons style={tw`mr-5`} name="md-star" size={32} color="#E5962D" />
        <View style={tw`flex-1`}>
        <Text style={tw`text-white font-bold`}>Early access to new tools, content and exercises</Text>
        <Text style={tw`text-slate-300 font-light`}>We are always testing and rolling out new features. Be the first to get our newest features to see how AI can help deepen your knowledge and understanding of scripture</Text>
        </View>

      </MotiView>
      </View>
      {currentOffering ?
      <View style={tw` items-center`}>
     
                
     
                <MotiView style={tw`items-center flex-row mt-5`} from={{scale:0.0}} animate={{scale:1}} transition={{type:'spring', stiffness:250, delay:1000}}>
                {currentOffering && currentOffering.monthly &&
                <View style={tw`flex-col`}>
                
                <TouchableOpacity onPress={() => handleMonthlyPurchase()} style={[tw`flex-col px-5 py-3 mb-2 border-2 border-black bg-blue-900  rounded-3xl justify-center `, { backgroundColor:'#E5962D'}]}>
                  <View style={tw``}>
                <Text style={tw`text-center text-black text-lg font-bold`}>Subscribe for {currentOffering.monthly?.product.priceString}/Month</Text>
                <Text style={tw`text-center text-black  `}>Cancel Anytime.</Text>  
                </View>
                </TouchableOpacity>
                </View>
                }
             
                
                
  
                </MotiView>

                <MotiView style={tw`flex-col`} from={{scale:0.0}} animate={{scale:1}} transition={{type:'spring', stiffness:250, delay:1500}} >
                <TouchableOpacity onPress={() => restorePurchases()} style={tw`flex-col mb-5 mt-3  rounded-2xl  `}>
                  <Text style={tw`ml-2 text-white font-light text-center`}>Restore Purchases</Text>
                  
                </TouchableOpacity>

                {Platform.OS == "ios" &&
                <TouchableOpacity onPress={() => {
                    setOfferCodeClicked(true)
                    navigation.navigate('PromoCode') 
                  }} style={[tw`flex-col mb-5  rounded-2xl  `]}>
                  <MotiText style={tw`ml-2 text-white font-light text-center`}>Enter Offer Code</MotiText>
                </TouchableOpacity>
    
                }

                <TouchableOpacity onPress={() => {
                    setOfferCodeClicked(true)
                    navigation.navigate('home')
                    logout()
                  }} style={[tw`flex-col mb-5  rounded-2xl  `]}>
                  <MotiText style={tw`ml-2 text-white font-bold text-lg text-center`}>Return to Free Version</MotiText>
                </TouchableOpacity>

                {Platform.OS == 'android' &&
                <View>
                <TouchableOpacity onPress={() => {
                  setOfferCodeClicked(true)
                  navigation.navigate('HowToRedeem')
                }} style={[tw`flex-col mb-5  rounded-2xl  `]}>
                <MotiText style={tw`ml-2 text-white font-light text-center`}>How to Redeem an Offer Code</MotiText>
              </TouchableOpacity >
                
              <TouchableOpacity onPress={()=> navigation.navigate('PromoCode') } style={[tw`flex-col mb-5  rounded-2xl  `]}>
              <MotiText style={tw`ml-2 text-white font-light text-center`}>Enter Organization Code</MotiText>
              </TouchableOpacity>
              </View>
                
                
                }
                </MotiView>
                </View>
                :
                <View>
                  <Spinner
                  visible={spinner}
                  
                  textStyle={{color:'white'}}
                  />
                </View>
 
                }
        
        
        
      
        
                
    </View>
    </SafeAreaView>
    </ScrollView>
    
    
  )
}
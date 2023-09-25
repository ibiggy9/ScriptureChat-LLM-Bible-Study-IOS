import React, { useState, useEffect, useContext } from 'react'
import {View, Text, useWindowDimensions,SafeAreaView, TextInput, ScrollView, KeyboardAvoidingView, Keyboard, Image, Platform} from 'react-native'
import { TouchableOpacity, TouchableWithoutFeedback } from 'react-native'
import { Entypo } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { MotiView } from 'moti';
import * as AppleAuthentication from 'expo-apple-authentication';
import tw from 'twrnc'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../Context/AuthContext';
import { AppContext } from '../App';
import { getAuth, signInWithCredential, signInWithCustomToken, signInWithRedirect, getRedirectResult, signInWithPopup, createUserWithEmailAndPassword, signInWithEmailAndPassword} from 'firebase/auth';
import { getDatabase, ref, set, onValue, forEach, push } from "firebase/database";
import app from '../firebaseConfig'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import jwt_decode from "jwt-decode";
import analytics from '@react-native-firebase/analytics';
import  {GoogleSignin, statusCodes}  from '@react-native-google-signin/google-signin';
import auth from '@react-native-firebase/auth'



    export default function Login({navigation}) {
    const [accessToken, setAccessToken] = useState()
    const db = getDatabase()
    const [user, setUser] = useState()
    
    const {width, height} = useWindowDimensions()
    const [signUp, setSignUp]  = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showCheck, setShowCheck] = useState(false)
    const {login, loginError, setLoginError, } = useAuth()
    
    const authent = getAuth(app)
    
    useEffect(()=>{
        if(authent.currentUser){
            navigation.navigate('Paywall')
        }
    }, [authent.currentUser])

    //IOS: 340004188318-cmvqrd4pqgn5ggbk2ft3stf6lb81jp5l.apps.googleusercontent.com
    //WEB: 340004188318-qpr2s5494cub5l17c3ocbh3s9j1msfgu.apps.googleusercontent.com
    
    const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
        //webClientId:'340004188318-qpr2s5494cub5l17c3ocbh3s9j1msfgu.apps.googleusercontent.com',
        iosClientId:"340004188318-cmvqrd4pqgn5ggbk2ft3stf6lb81jp5l.apps.googleusercontent.com",
        androidClientId:"340004188318-r13acpb0kgo4du78daqvl8noq1sqjfc9.apps.googleusercontent.com", 
        useProxy:true
        
    })

    GoogleSignin.configure({
        webClientId:"340004188318-qpr2s5494cub5l17c3ocbh3s9j1msfgu.apps.googleusercontent.com"
    })

    async function onGooglePress(){
        console.log("Google Press Running")
        // Check if your device supports Google Play
  await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
  // Get the users ID token
  const { idToken } = await GoogleSignin.signIn();

  // Create a Google credential with the token
  const googleCredential = auth.GoogleAuthProvider.credential(idToken);
  
    let cUser = await GoogleSignin.getCurrentUser();
    console.log(cUser)
    
  // Sign-in the user with the credential
  //const user_sign_in = auth().signInWithCredential(googleCredential);

  
    
    createUserWithEmailAndPassword(authent, cUser.user.email, cUser.user.id).then(()=>{
        console.log("Account Created")
    })
    .catch((error) => {
        console.log(error.code)
        console.log(error.message)
        if(error.code == "auth/email-already-in-use"){
            signInWithEmailAndPassword(authent, cUser.user.email, cUser.user.id).catch((error)=>{console.log("This failed + " + error.message)})
        } else{
            setLoginError(error.message)
        }
    })
    
    }
  

    
    
    /* LEGACY Functions
    async function runLogin(){     
            await promptAsync()
            console.log("This ran")
            await analytics().logLogin({
                method:'Google'
             })
    }

      useEffect(()=> {
        
        if(response?.type === "success"){
            setAccessToken(response.authentication.accessToken)
            console.log(response.authentication.accessToken)
            //accessToken && fetchUserInfo()  
            console.log("hi")
        } 
        
        console.log(response)
        
      }, [response, accessToken]
      )

      useEffect(()=> {setLoginError()}, [])

          //This is used for Google Login
    async function fetchUserInfo(){
        console.log("Fetching...")
        let response = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers:{
                Authorization: `Bearer ${accessToken}`
            }

             
        })
        const userInfo = await response.json()
        setUser(userInfo)
        console.log(userInfo)
        console.log(userInfo.id)
        createUserWithEmailAndPassword(authent, userInfo.email, userInfo.id).then(()=>{
            console.log("Account Created")
        })
        .catch((error) => {
            console.log(error.code)
            console.log(error.message)
            if(error.code == "authent/email-already-in-use"){
                signInWithEmailAndPassword(authent, userInfo.email, userInfo.id)
            }
        })
      }
      
    function dismissCheck(){
        setShowCheck(false)
        Keyboard.dismiss()
    }
    */

  return (
    <View style={[{width: width, height:height+20, backgroundColor:'#030B27'}, tw`${Platform.OS == `android` && `mt-11`}`]}>
    <SafeAreaView style={[tw`flex-1 `, {height:height, backgroundColor:`#030B27`}]}> 
        
        <View style={tw`flex-1`}>
        <View style={[tw`flex-1 justify-center items-center mx-10 ${Platform.OS == "android" && ``}`]}>
    
        <>
            <View style={tw` mb-1 items-center flex-row`}>
                <MotiView from={{scale:0, opacity:0}} animate={{scale:1 ,opacity:1}} transition={{type:'timing', duration:1000}}  style={tw`flex-row`}>
                
                <Text style={tw` ml-3 text-white text-4xl text-center`}>Login To Continue</Text>
                </MotiView>
              
            </View> 
            
            {loginError && 
                <View style={tw`flex-row items-baseline mb-3 font-light text-sm`}>
                    <AntDesign style={tw`mr-2`} name="exclamationcircle" size={24} color="white" />
                    <Text style={tw`text-white`}>{loginError}</Text>
                </View>
                }
            <View style={tw``}>
            {/* 
                <TextInput 
                onChangeText={text => setEmail(text)}
                keyboardAppearance='dark'
                onFocus={()=> setShowCheck(false)}
                placeholder='Email'
                 placeholderTextColor={'white'}
                value={email} 
                numberOfLines={2}
                style={[tw`text-white bg-gray-700 font-light rounded-2xl p-5 h-18 text-xl`, {width: width-100}]} 
                /> 
                <TextInput
                 value={password}
                 
                 keyboardAppearance='dark'
                 secureTextEntry
                 onFocus={()=> setShowCheck(false)}
                 placeholder='Password'
                 placeholderTextColor={'white'} 
                 onChangeText={text => setPassword(text)}
                 style={[tw`mt-5 text-white bg-gray-700  font-light rounded-2xl h-18 p-5 text-xl`,{width: width-100}]} 
                 /> 
                
                <View style={tw}>
                    <TouchableOpacity onPress={()=> login(email, password)} style={tw`bg-orange-700 rounded-2xl mt-10 py-5 mx-10 `}>
                        <Text style={tw`text-white text-center text-lg`}>Login</Text>
                    </TouchableOpacity>
                </View>
                */}
            
                <MotiView from={{scale:0, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'timing', duration:1000}} style={tw`mt-4 flex-col items-center `}>
                  {!showCheck &&
                    <MotiView from={{opacity:0}} animate={{opacity:1}} transition={{type:'timing', duration:800}} style={tw` mt-5  justify-evenly items-center`}>
                    
                    {request &&
                    <TouchableOpacity onPress={() => onGooglePress() } style={[tw`flex-row justify-center items-center bg-black p-3 px-7 rounded-2xl border border-slate-400`,{height:70, width:300}]}>
                <Image style={{width:25, height:25}} source={require('../assets/Google.png')}/>
                <Text style={tw`text-white ml-4 text-xl font-bold`}>Sign In With Google</Text>
                </TouchableOpacity>
                    }
                {Platform.OS !=="android" && 
                    <View style={[{width:300, height:70}, tw`mt-5 border border-slate-400 rounded-2xl bg-black items-center justify-center`]}>
                        <AppleAuthentication.AppleAuthenticationButton
                    buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
                    buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
                    cornerRadius={5}
                    style={[{width:250, height:65},tw``]}
                    onPress={async () => {
                    await analytics().logLogin({method:'Apple'})
                    try {
                        const credential = await AppleAuthentication.signInAsync({
                        requestedScopes: [
                            AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
                            AppleAuthentication.AppleAuthenticationScope.EMAIL,
                        ],
                        }).then((userToken)=> {
                            if(!userToken.email){
                                var decoded = jwt_decode(userToken.identityToken)
                            
                                signInWithEmailAndPassword(authent, decoded.email, userToken.user).catch((error)=>{
                                    console.log(error)
                                    if(error.code == "auth/user-not-found"){
                                        createUserWithEmailAndPassword(authent, decoded.email, userToken.user)
                                    }
                                })
                            } else {
                                createUserWithEmailAndPassword(authent, userToken.email, userToken.user).then(()=>{
                                   return
                                })
                            }
                   
                            
                        }).catch((error) => {
                            console.log(error.message)
                            setLoginError(error.message)
                            if(error.message == "auth/missing-email"){
                                
                            }
                        })
                        
                    } catch (e) {
                        console.log(e)
                        setLoginError(e)
                        if (e.code === 'ERR_REQUEST_CANCELED') {
                        console.log("cancelled")
                        } else {
                        // handle other errors
                        }
                    }
                    }}
                />
                </View>
                }
                 </MotiView>
                }
                  <TouchableOpacity onPress={()=> navigation.goBack()} style={tw`mt-10`}>
                <Text style={tw`text-center text-white text-lg font-bold`}>Go Back</Text>
                </TouchableOpacity>
                </MotiView>
            </View>
            </>
        </View>  
        </View>   
    </SafeAreaView>
    </View>
)
}

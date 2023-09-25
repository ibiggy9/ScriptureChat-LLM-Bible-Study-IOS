import { View, Text, useWindowDimensions, Easing, TouchableOpacity, ScrollView, TextInput, StatusBar, ActivityIndicator, Platform, KeyboardAvoidingView, Keyboard, AppState, Pressable} from 'react-native'
import React, {useState, useRef} from 'react'
import { LinearGradient } from 'expo-linear-gradient'
import tw from 'twrnc'

import { AnimatePresence, Motion } from '@legendapp/motion'
import { MotiView, useDynamicAnimation, MotiText } from 'moti';
import * as Haptics from 'expo-haptics';
import { AntDesign } from '@expo/vector-icons';
import { useEffect } from 'react'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { TypingAnimation } from 'react-native-typing-animation'
import useRevHook from '../../../Components/useRevHook'
import analytics from '@react-native-firebase/analytics';
import { FlatList } from 'react-native-gesture-handler'
import { getDatabase, ref, onValue, set } from 'firebase/database'
import { getAuth } from 'firebase/auth'
import app from '../../../firebaseConfig'
//import { StatusBar } from 'expo-status-bar'
import { useAuth } from '../../../Context/AuthContext'
import MarginWrapper from '../../MarginWrapper'





export default function Fleur({navigation}) {
    const {isProMember} = useRevHook()
    const textInputRef = useRef(null)
    const abortControllerRef = useRef(null)
    const auth = getAuth(app)
    const {width, height} = useWindowDimensions()
    const [text, setText] = useState("")
    const [loading, setLoading] = useState(false)
    const [clicked, setClicked] = useState(false)
    const [userLeft, setUserLeft] = useState(false)
    const scrollRef = useRef()
    const {membershipLevel} = useRevHook() 
    const transcriptRef = useRef([
      {role: "system", content:"You are a world class therapist named Fleur. Your job is to provide highly personalized support to your clients by understanding their issues and helping them. Whether that be anxiety, loss, depression, addition, lonliness and/or anything else mental health related. Sometimes you may need to ask for more information before providing advice.",},
      {role: "assistant", content:"Hi I'm Fleur, your AI Therapist. Please ask me a question or for advice on something you're interesting in working on."},
     ])
    const [error, setError] = useState(false)
    const [fleurResponse, setFleurResponse] = useState("")
    const [conversationString, setConversationString] = useState("")
    const [helper, setHelper] = useState(false)
    const [usageCount, setUsageCount] = useState()
    const {setIsFleur, isFleur, chatMenuShow, setChatMenuShow} = useAuth()
    const [fleurHelperRun, setFleurHelperRun] = useState(false)
    
    //State with message component in it
    const [messageList, setMessageList] = useState([
        <Message type={'fleur'} content="Hi I'm Fleur, your AI Therapist. You can ask me a question, for advice, tell me about a difficult situation, and much more." />
    ])

    const copyToClipboard = async () => {
      console.log(transcriptRef.current[transcriptRef.current.length-1].content)
      await Clipboard.setStringAsync(transcriptRef.current[transcriptRef.current.length-1].content);
      setCopiedClicked(true)
    }

   
  useEffect(()=> {
    console.log("isfleur"+isFleur)
    
    getUsageCount()
  }, [])

   useEffect(()=> {
    
    scrollToBottom()
  }, [text])

  function getUsageCount(){
    console.log("Getting Database")
    const db = getDatabase()
    const userRef = ref(db, `users/${auth.currentUser.uid}/userdata/usage/fleurUsage`)

    onValue(userRef, (snapshot) => {
        var temp = snapshot.val()
        setUsageCount(temp)   

    });

  
  }

  function saveUsageCount(){
  
    const db = getDatabase()  
  if(auth.currentUser.uid){
  set(ref(db, `users/${auth.currentUser.uid}/userdata/usage/fleurUsage`), 
      usageCount+1
  )
} else {
  console.log("no user id")
}
  }

   //Appstate, state.
   const appState = useRef(AppState.currentState)
   const [appStateVisible, setAppStateVisible] = useState(appState.current)
   
  

   
   
  useEffect(()=> {
    if(clicked && Platform.OS != 'ios'){
      setTimeout(() => {
        textInputRef.current && textInputRef.current.focus();
        console.log('focus');
      }, 10);
    }
  }, [clicked])
   
   //Background or foreground app state listener
   useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (
        appState.current.match(/inactive|background/) && 
        nextAppState === 'active'
        
      ) {
        console.log('App has come to the foreground!');
      } else{
        console.log("App has gone to the background.")
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      //console.log(appState.current)
      
    });

    return () => {
      subscription.remove();
    };
  }, []);

  useEffect(()=> {
    console.log(AppState.currentState)
    if(AppState.currentState != 'active' && loading == true){
      
      
      cancelRun()

    }
  },[AppState.currentState])
   
  //Function that clears conversation
   function clear(){
    setHelper(false)
    setError()
    setUserLeft(false)
    console.log("Cleared!")
    setMessageList([
        <Message type={'fleur'} content="Hi I'm Fleur, your AI Therapist. You can ask me a question, for advice, tell me about a difficult situation, and much more." />
    ])
   
    setConversationString("")
    transcriptRef.current = [
      {role: "system", content:"You are a world class therapist named Fleur. Your job is to provide highly personalized support to your clients by understanding their issues and helping them. Whether that be anxiety, loss, depression, addition, lonliness and/or anything else mental health related. Sometimes you may need to ask for more information before providing advice.",},
      {role: "assistant", content:"Hi I'm Fleur, your AI Therapist. Please ask me a question or for advice on something you're interesting in working on."},
     ]
   }
   
  //This function calls the API
  //Determines whether this is advice or not:
  async function classifier(latestResponse){
    
    
      abortControllerRef.current = new AbortController()
  
        //transcriptRef.current.push({role:"user", content:latestInput})
        //console.log(transcriptRef.current)
        
          setFleurResponse(false)
          var myHeaders = new Headers();
    
          myHeaders.append("Authorization", "Bearer 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");
          myHeaders.append("Content-Type", "application/json");
  
          var raw = JSON.stringify({
          "model": "gpt-3.5-turbo-0301",
          
          "messages": [
            {role:'system', content:"Your job is to classify the users input as either giving advice or asking questions, conversing etc."},
            {role:'user', content:"It sounds like you're interested in getting into great physical shape. Can you tell me a bit more about why this is important to you? Are there any specific goals or events that are motivating you to get shredded?"},
            {role:"assistant", content:'Asking Questions'},
            {role:'user', content:"It sounds like you're interested in building muscle and getting into shape. That's great! Before we get started, can you tell me a bit more about why you want to get ripped? Is it for health reasons or aesthetic reasons? Are there any underlying issues that may be contributing to this desire, such as low self-esteem or body dysmorphia? Understanding your motivations and goals will help us create a plan that is tailored specifically to your needs."},
            {role:"assistant", content:'Asking Questions'},

            {role:"user", content:latestResponse}
  
          ],
  
          "presence_penalty": 1,
          "frequency_penalty": 1,
          "temperature": 0.2,
          "max_tokens": 300
          });
  
          
          var requestOptions = {
          method: 'POST',
          headers: myHeaders,
          body: raw,
          redirect: 'follow',
          signal: abortControllerRef.current.signal,
          };
  
          const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
          const respJson = await response.json()
          setTimeout(()=> !respJson ? cancelFleurRequest('timeout'): null, 7000)
          
          console.log(respJson)
          if(respJson && respJson.choices[0].message.content.includes('advice') || respJson.choices[0].message.content.includes("Advice")){
            fleurHelper(latestResponse)
          }
          return respJson
  
    
  }

   //This generates suggestions to personalize further
   async function fleurHelper(latestResponse){
    setFleurHelperRun(true)
    abortControllerRef.current = new AbortController()

      //transcriptRef.current.push({role:"user", content:latestInput})
      //console.log(transcriptRef.current)
      
        setFleurResponse(false)
        var myHeaders = new Headers();
  
        myHeaders.append("Authorization", "Bearer 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");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "model": "gpt-3.5-turbo-0301",
        
        "messages": [
          {role:'system', content:"The user is a therapist and you are a client. Generate a 2-5 questions about the therapists advice to get more insight into their advice."},
          {role:'user', content:"Certainly! Achieving a specific body fat percentage can be challenging, but it is definitiley possible with the right approach. Here are some tips that may help you reach your goal: 1. Focus on nutrition: Eating a healthy and balanced diet is key to reducing body fat. Aim for whole foods like fruits, vegetables, lean proteins, and healthy fats while avoiding processed foods and sugary drinks. 2.Incorporate strength training: Building muscle through strength training can help increase your metabolism and burn more calories even at rest."},
          {role:"assistant", content:'1. Create a personalized nutrition plan for me., 2.Create a personalized workout plan for me.'},
          {role:"user", content:latestResponse}

        ],

        "presence_penalty": 1,
        "frequency_penalty": 1,
        "temperature": 0.2,
        "max_tokens": 300
        });

        
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        signal: abortControllerRef.current.signal,
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        const respJson = await response.json()
        setTimeout(()=> !respJson ? cancelFleurRequest('timeout'): null, 7000)
        
        console.log(respJson)
        const str = respJson.choices[0].message.content

        

        const sentences = str.split(/\d+\./).filter(Boolean);


        
        const questions = sentences.map((sentence) => {
          return { q: sentence.trim() };
        });

          console.log(questions);
          setFleurHelperRun(false)
        setHelper(questions)

   }

   async function fleurResponseFunc(latestInput){
      console.log("Request to Fleur sent.")
      abortControllerRef.current = new AbortController()

      transcriptRef.current.push({role:"user", content:latestInput})
      //console.log(transcriptRef.current)
      
        setFleurResponse(false)
        var myHeaders = new Headers();
  
        myHeaders.append("Authorization", "Bearer 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");
        myHeaders.append("Content-Type", "application/json");

        var raw = JSON.stringify({
        "model": "gpt-3.5-turbo-0301",
        
        "messages": transcriptRef.current,

        "presence_penalty": 1,
        "frequency_penalty": 1,
        "temperature": 0.2,
        "max_tokens": 500
        });

        
        var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow',
        signal: abortControllerRef.current.signal,
        };

        const response = await fetch("https://api.openai.com/v1/chat/completions", requestOptions)
        const respJson = await response.json()
        setTimeout(()=> !respJson ? cancelFleurRequest('timeout'): null, 7000)
        
        return respJson
        /*
        fetch("https://api.openai.com/v1/chat/completions", requestOptions)
            .then(response => response.json())
            .then(result => appStateVisible == 'active' && fleurError != true ? processFleurResponse(result, latest) : null)
            .catch(error => setFleurError(true) && console.log(error))  
          */
      
    }

    async function processFleurResponse(response){
      console.log("Processing Fleur Response")
      setError(false)
      if(response){
      //console.log(response)
        await analytics().logEvent('fleurResponse', {id:response})
        const tokenUsage = response.usage.total_tokens
        //console.log(tokenUsage)
       
        if(tokenUsage > 3400){
          transcriptRef.current = transcriptRef.current.slice(1,3)
          
        }

        var resString = response.choices[0].message.content
        console.log(resString)
        classifier(resString)
        

        var resStringNoSpace = resString.replace(/\r?\n|\r/, "")
        setLoading(false)
        var messageObj = {role:'assistant', content: resStringNoSpace}
        var messageComponent = <Message type='fleur' content={resStringNoSpace} />
        setMessageList((prev)=>[...prev, messageComponent])
        transcriptRef.current.push(messageObj)
        
      } else {
        console.log("Hi")
      }
        return 
    }

    //This runs  when the user enters a message
     async function addMessage(type, input){
        getUsageCount()
        if(usageCount == 15 && !isProMember) {
          navigation.navigate('Paywall')
  
        } else {
        
        if(!isProMember){
        saveUsageCount()
        }
        
        setHelper(false)
        let tempText = text
        await analytics().logEvent("fleurMessageSent", {
          id:tempText
        })
        setText("")
        setUserLeft(false)
        //This switches on the typing animation
        setLoading(true)
        
        //This builds the message object for the model
        var messageObj = {role:'user', content:input}
        //create the message component
        var newMessage = <Message type="user" content={tempText} />
        

        //add the message component to the list of messages to be displayed to the users. 
        setMessageList((prev)=> [...prev, newMessage]) 
        

        //This calls the api
        try{
         let fleurResp = await fleurResponseFunc(tempText)
          
         let processed = await processFleurResponse(fleurResp)
        } catch (error){
          console.log(error.message)
        }
        
        //This contains the conversation history. Important to note that ref is required to avoid rerender. 
        //transcriptRef.current.push(messageObj)
        //Clear the text box once a message is sent to Fleur. 
        }
      }


      function Message({type, content}){
        if(type=="fleur"){
            return(
              <View style={tw`flex-row`}>
                <MotiView from={{translateY:500, opacity:0, scale:0.6}} animate={{translateY:0, opacity:1, scale:1}} transition={{type:'timing', duration:300}} id="text-Fleur" style={[tw`${Platform.OS == 'android' ? `bg-slate-600` : `bg-slate-800` } ml-2 justify-center mt-3 items-start rounded-2xl bg-opacity-60 p-2`, {maxWidth:width/1.5}]}>
                  
                  
                  
                  
                <Text style={[tw`p-1 text-white `, {fontSize:17}]}>{content}
                </Text>
                
                </MotiView>
                
                </View>

                )

        } else {
            return(
                <MotiView from={{translateY:500}} animate={{translateY:0}} transition={{type:'timing', duration:200}} id="row" style={[{width:width}, tw`items-end`]}>
                <View id="text-Fleur" style={[tw`${Platform.OS == 'android' ? `bg-blue-500` : `bg-blue-700` }  mr-2 mt-1 justify-end items-start mt-3 rounded-2xl bg-opacity-60 p-2`, {maxWidth:width/1.5}]}>
                    <Text style={[tw`p-1 text-white `, {fontSize:17}]}>{content}
                </Text>
                </View>
                </MotiView>

            )
        }
        
      }

      const scrollToBottom = () => {
        scrollRef.current.scrollToEnd({ animated: true });
      };


      

      //This reruns the message
      function reTry(){
        setError("Sorry, there was an error, retrying...")
        fleurResponseFunc()

      }

      //This function cancels the run if a user leaves the app
      function cancelRun(){
        cancelFleurRequest()
        const lastMessage = transcriptRef.current[transcriptRef.current.length -1]
        setMessageList(messageList.slice(0, -1))
        setText(lastMessage.content)
        transcriptRef.current.pop()
        setUserLeft(true)
        setLoading(false)
        setHelper(false)

      }

      //This function cancells the fetch request. 
      function cancelFleurRequest(reasonCode){
        setLoading(false)
        reasonCode == "timeout" && setError("Either the network timed out or there was a server error. Retry sending")
        abortControllerRef.current && abortControllerRef.current.abort()
        console.log("Request to Fleur cancelled.")
      }      

  return (
    <View style={[tw` ${Platform.OS=="android" && `bg-black`}`,{width:width, height:height}]}>
    
      
      {Platform.OS != 'android' &&
    <LinearGradient 
    
    colors={['#182E77','#EA1D3F']}
    start={{x:0.05, y:0.6}}
    end={{x:0.9, y:0.3}}
    locations={[0.1,0.99]}
    
    
    style={{width:width, height:height, opacity:0.65}}
    />
    }
    
    <KeyboardAwareScrollView style={[tw``, {height:height, width:width}]}>
    
    <View style={tw` `}>
    <View style={tw`justify-center items-center`}>
    {Platform.OS == 'android' ? <Text style={tw`text-white text-2xl text-center`}>Chat with Fleur m--10 MarginWrapper</Text> : <Text style={tw`text-white text-2xl text-center mt-12`}>Chat with Fleur</Text>}
    </View>
    {!isProMember && usageCount &&
    <View style={tw`ml-1`}>
      <Text style={tw`text-white ml-5 mb-1`}>{15-usageCount} Messages Remaining on Free Tier</Text>
    </View>
    }
    </View>
    <ScrollView 
    contentContainerStyle={tw`pb-70`}
    scrollToEnd={{animated:true}}
    onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
    onLayout={() => scrollRef.current.scrollToEnd({ animated: true })}
    
    ref={scrollRef} 
    keyboardShouldPersistTaps='handled'
    
    
    >
    
    

    
    {messageList}
    {userLeft &&
    <View style={tw`mr-30 px-5 py-3`} onPress={()=> clear()}>
    <Text style={tw`text-white`}>Please don't leave the app while Fleur is responding. Send your message again.</Text>
    </View>
  
    }
    {loading &&
    <View style={tw`ml-10 mt-10 mb-20`}>
    
    <TypingAnimation 
        dotStyles={tw`mb-3`}
        dotColor="silver"
        dotMargin={15}
        dotSpeed={0.20}
        dotRadius={5}
        dotX={20}
        
      />
      
      </View>
    }
    {error &&
      <View style={tw`mr-30 px-5 py-3 mb-2 `} onPress={()=> clear()}>
      <Text style={tw`text-white`}>{error}</Text>
      </View>
    }
    {messageList.length > 1 && !loading && 
    <TouchableOpacity style={tw`mr-30 ml-4 py-1 mb-5`} onPress={()=> clear()}>
    <Text style={tw`text-white `}>Close this conversation</Text>
    </TouchableOpacity>
    }
    {helper ? 
    <>
    {helper.length > 1 ?
    <>
    {helper ? <Text style={[tw`ml-4 mb-1 text-white font-bold`,{fontSize:15}]}>Suggested Reponses (Tap to send)</Text> : <> <ActivityIndicator size='large' /> </>}
    <FlatList 
      data={helper ? helper : null}
      //contentContainerStyle={tw`pb-80`}
      showsHorizontalScrollIndicator={false}
      pagingEnabled 
      horizontal
      keyboardShouldPersistTaps='handled'
      snapToEnd
      snapToStart
      snapToInterval={width/1.25}
      
      decelerationRate='fast'
      
      renderItem={(itemData)=> {
          
          return(
            <>
           {itemData.item.q.includes('Thank you') || itemData.item.q.includes(':') || itemData.item.q == "." ?
           null 
           :
           <View style={[{width:width/1.25}, tw`mt-1`]}>
            <TouchableOpacity onPress={()=> {
              setText(itemData.item.q)
              setClicked(true)
              //addMessage("user", text)
              }} style={[tw`ml-2  rounded-2xl p-2 `, ]}>
            <Text style={[tw`text-white `,{fontSize:16}]}>{itemData.item.q}</Text>
            </TouchableOpacity>
          </View>
           
           }

            
            </>
          )
        
      }}
    
    />
    </>

    :
    <>
    {helper ? <Text style={[tw`ml-4 mb-1 text-white font-bold`,{fontSize:15}]}>Suggested Reponses (Tap to send)</Text> : <> <ActivityIndicator size='large' /> </>}
    <FlatList 
    data={helper ? helper : null}
    horizontal
    showsHorizontalScrollIndicator={false}
    pagingEnabled
    keyboardShouldPersistTaps='handled'
    snapToEnd
    //contentContainerStyle={tw`pb-80`}
    snapToStart
    snapToInterval={width}
    
    decelerationRate='fast'
    
    renderItem={(itemData)=> {
        
        return(
          <>
         
          <View style={[{width:width/1.25}, tw`mt-1`]}>
          <TouchableOpacity onPress={()=> {
            setText(itemData.item.q)
            setClicked(true)
            //addMessage("user", text)
            }} style={tw`ml-2  rounded-2xl  p-2`}>
          <Text style={[tw`text-white `,{fontSize:16}]}>{itemData.item.q}</Text>
          </TouchableOpacity>
        </View>

       
         
          
          </>
        )
      
    }}
  
  />
</>

    }
    </>
    :
    <View>
      {fleurHelperRun == true &&
    <ActivityIndicator size='large' color='white' />
      }
    </View>
    }
    </ScrollView>
    
    
    

         {/*
         
         {clicked && 
         <View style={tw`justify-start items-end mb-20 mr-5`}>
         <AntDesign name="questioncircle" size={40} color="black" /> 
         </View>
         }
        */}
    
 <View style={tw`bg-white`}>
   {chatMenuShow == false &&
  <View style={tw`flex-row`} onPress={()=> loading ? null : addMessage("user", text)}>
    <View  style={[{}, tw`bg-slate-700 flex-row  bg-opacity-90 mb-10 `]} >
        
        <View style={tw`flex-row justify-start items-center`}>
        <TouchableOpacity style={tw`mx-3`} onPress={()=> setChatMenuShow(true)}>
        <AntDesign name="minuscircleo" size={24} color="white" />
        </TouchableOpacity>

        <TextInput
        multiline
        autoFocus={Platform.OS == 'ios' ? true : false}
        numberOfLines={1}
        style={[tw`ml-3 text-white text-lg items-start justify-start `, { width:width/1.25, minHeight:40}]}
        placeholder={loading ? "Fleur is responding..." : "Enter Message..."}
        ref={textInputRef}
        placeholderTextColor={'gray'}
        value={text}
        maxLength={750}
        
        onChangeText={setText}
        onFocus={()=> scrollToBottom()}
        />
        </View>
        
        <TouchableOpacity style={tw`flex-col justify-end items-end`} onPress={()=> loading ? null : addMessage("user", text)}>
          <MotiText from={{scale:0}} animate={{scale:1}} transition={{type:'timing', duration:400}} style={tw`font-light  text-slate-200`}>{text.length > 650 && text.length -750}</MotiText>
        <Feather name="send" style={tw` mb-3 text-slate-200 `} size={30} color="white" />
        </TouchableOpacity>
    </View>     
    </View>
    }
 
    {chatMenuShow == true &&
    <TouchableOpacity  style={tw`items-center mb-40 `} onPress={()=> {
      
      //setClicked(true)
      setChatMenuShow(false)
      
      }}>
    <MotiView from={{scale:0.2}} animate={{scale:1}} transition={{type:'timing'}}>
    <Ionicons name="add-circle" size={45} color="white" />
    
    </MotiView>
    </TouchableOpacity>
    }
    
    </View>     
    
    </KeyboardAwareScrollView>
    
    
    </View>
    
  )
}
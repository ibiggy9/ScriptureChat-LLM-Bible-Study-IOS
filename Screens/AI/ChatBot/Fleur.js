import { View, Text, useWindowDimensions, Easing, TouchableOpacity, ScrollView, TextInput, FlatList, StatusBar, ActivityIndicator, Platform, KeyboardAvoidingView, Keyboard, AppState, Pressable, SafeAreaView} from 'react-native'
import React, {useState, useRef, useEffect} from 'react'
import tw from 'twrnc'
import { MotiView, useDynamicAnimation, MotiText } from 'moti';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { TypingAnimation } from 'react-native-typing-animation'
import useRevHook from '../../../Components/useRevHook'
import { getAuth } from 'firebase/auth'
import app from '../../../firebaseConfig'
import { useFleur } from '../../../Context/FleurContext'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Fleur({navigation}) {
    const {isProMember} = useRevHook()
    
    
    const auth = getAuth(app)
      
    const {
      isFleur, 
        setIsFleur, 
        scrollToTop,
        usageCount,
        exercises,
        chatMenuShow, 
        setChatMenuShow,
        fleurHelperRun, 
        setFleurHelperRun,
        textInputRef,
        abortControllerRef, 
        width,
        height,
        text,
        setText,
        loading, 
        setLoading,
        isFocused,
        setIsFocused,
        clicked, 
        setClicked,
        scrollRef, 
        transcriptRef, 
        error, 
        setError, 
        fleurResponse, 
        setFleurResponse,
        conversationString, 
        setConversationString, 
        helper, 
        setHelper,
        getChatData,
        setUsageCount,
        appStateVisible, 
        setAppStateVisible,
        appState,
        AndroidKey,
        initialSuggestions,
        runFocus,
        runBlur,
        storeChatData,
        clear, 
        classifier,
        fleurHelper,
        fleurResponseFunc,
        processFleurResponse,
        addMessage,
        scrollToBottom,
        reTry,
        cancelRun,
        cancelFleurRequest,
        userLeft, 
        setUserLeft,
        messageList,
        setMessageList,
        Message,
        setKeyboardHeight,
        keyboardHeight,
        startSelection, 
        setStartSelection,
        approaches,
        denomination, 
        primeFocus, 
        knowledge
        
    } = useFleur()

    useEffect(()=> {
      getChatData()
    }, [])
    
    useEffect(()=> {
      scrollToTop()
    }, [])

    useEffect(()=> {
      if(!isProMember){
        deleteProfile()
      }
    },[])

    async function deleteProfile(){
      await AsyncStorage.removeItem("userPreferences")
    }


  return (
    
    <>
    {Platform.OS == "ios" &&
    <View style={[tw` flex-1 ${Platform.OS=="android" ? `bg-black` : `bg-slate-900`}`, {height:height}]}>
      <SafeAreaView style={tw`h-full ${Platform.OS == "android" && ``} `}>
      
    <View style={tw`justify-start items-center `}>
    {Platform.OS == 'android' ? <Text style={tw`text-orange-300 text-2xl text-center ${Platform.OS == "android" && ``}`}>Chat with Fleur</Text> : <Text style={tw`text-orange-300 text-2xl text-center `}><FontAwesome5 name="cross" size={24} color="#E5962D" /> ScriptureChat {isProMember && "Premium"}</Text>}
    {!isProMember &&
    <Text style={[tw`text-white`, {}]}>{usageCount >= 0 ? usageCount : 0} Message{usageCount != 1 && "s"} Remaining On Free Tier</Text>
    
    }
    {isProMember && (denomination || knowledge || primeFocus) &&
    <Text style={tw`text-orange-300`}>Running with your custom profile</Text>
    
    }
    </View>
    {/*
    {!isProMember && usageCount &&
    <View style={tw`ml-1`}>
      <Text style={tw`text-white ml-5 mb-1`}>{15-usageCount} Messages Remaining on Free Tier</Text>
    </View>
    }
  */}
    
    <ScrollView
          contentContainerStyle={tw`pb-100`}
          extraScrollHeight={Platform.OS == 'ios' ? 50 :0} // use this prop for more fine tuning
          
    scrollToEnd={{animated:true}}
    style={tw` `}
    
    onContentSizeChange={() => messageList.length !== 1 ? scrollRef.current.scrollToEnd({ animated: true }) : null}
    //onLayout={() => scrollRef.current.scrollToEnd({ animated: true })}
    scrollEventThrottle={16}
    ref={scrollRef} 
    keyboardShouldPersistTaps='handled'
      
     >
    
    
   
    
    

    
    {messageList}
    
    {userLeft &&
    <View style={tw`mr-30 px-5 py-3`} onPress={()=> clear()}>
      
    <Text style={tw`text-white`}>Please don't leave the app while Fleur is responding. Please send your message again.</Text>
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


{messageList.length === 1 && !loading && chatMenuShow == false &&
      <>
      
      <Text style={[tw`ml-4 mb-1 text-white font-bold mt-3`,{fontSize:17}]}>Some things you can try: {startSelection != null && "(Tap to send)"}</Text> 
      {startSelection == null &&
      <MotiView from={{scale:0, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'timing', duration:300}}>
      <View style={tw`flex-col  ml-4`}>
      <TouchableOpacity onPress={()=> setStartSelection("exercises")} style={[tw`border border-white  rounded-2xl justify-center items-center my-2 px-2`, {width:width/1.3, height:height/15}]}>
        <Text style={tw`text-white text-lg text-center`}>Spiritual Growth & Nourishment</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> setStartSelection("scenarios")} style={[tw`border border-white rounded-2xl justify-center items-center my-2`, {width:width/1.3, height:height/15}]}>
        <Text style={tw`text-white text-lg text-center`}>Academic & Theological Study</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> setStartSelection("approaches")} style={[tw`border border-white rounded-2xl justify-center items-center my-2`, {width:width/1.3, height:height/15}]}>
        <Text style={tw`text-white text-lg`}>Comfort & Support</Text>
      </TouchableOpacity>
      </View>
      </MotiView>
      }
      
      {startSelection == "scenarios" &&
      <>
      <MotiView from={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'timing', duration:600}}>
      <FlatList 
        data={initialSuggestions}
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
             
             <View style={[{width:width/1.25}, tw`mt-1`]}>
              
              <TouchableOpacity onPress={()=> {
                setText(itemData.item.message)
                setClicked(true)
                setChatMenuShow(false)
                //addMessage("user", text)
                }} style={[tw`ml-2  rounded-2xl p-2 `, ]}>
              <Text style={tw`text-white  font-bold`}>{itemData.item.title}</Text>
              <Text style={[tw`text-white `,{fontSize:16}]}>{itemData.item.description}</Text>
              </TouchableOpacity>
            </View>
             
             
  
              
              </>
            )
          
        }}
      
      />
      
      <TouchableOpacity style={tw`ml-4 mt-3  mx-10 items-center`} onPress={()=> setStartSelection(null)}>
        <Text style={tw`text-white font-extrabold text-lg`}>Go Back</Text>
      </TouchableOpacity>
        </MotiView>
      </>
        }

      {startSelection == "exercises" &&
      <>
      <MotiView from={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'timing', duration:600}}>
      <FlatList 
        data={exercises}
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
             
             <View style={[{width:width/1.25}, tw`mt-1`]}>
              
              <TouchableOpacity onPress={()=> {
                setText(itemData.item.message)
                setClicked(true)
                setChatMenuShow(false)
                //addMessage("user", text)
                }} style={[tw`ml-2  rounded-2xl p-2 `, ]}>
              <Text style={tw`text-white  font-bold`}>{itemData.index+1}. {itemData.item.title}</Text>
              <Text style={[tw`text-white `,{fontSize:16}]}>{itemData.item.description}</Text>
              </TouchableOpacity>
            </View>
             
             
  
              
              </>
            )
          
        }}
      
      />
      
      <TouchableOpacity style={tw`ml-4 mt-3  mx-10 items-center`} onPress={()=> setStartSelection(null)}>
        <Text style={tw`text-white font-extrabold text-lg`}>Go Back</Text>
      </TouchableOpacity>
        </MotiView>
      </>
        }


    {startSelection == "approaches" &&
      <>
      <MotiView from={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'timing', duration:600}}>
      <FlatList 
        data={approaches}
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
             
             <View style={[{width:width/1.25}, tw`mt-1`]}>
              
              <TouchableOpacity onPress={()=> {
                setText(itemData.item.message)
                setClicked(true)
                setChatMenuShow(false)
                //addMessage("user", text)
                }} style={[tw`ml-2  rounded-2xl p-2 `, ]}>
              <Text style={tw`text-white  font-bold`}>{itemData.index+1}. {itemData.item.title}</Text>
              <Text style={[tw`text-white `,{fontSize:16}]}>{itemData.item.description}</Text>
              </TouchableOpacity>
            </View>
             
             
  
              
              </>
            )
          
        }}
      
      />
      
      <TouchableOpacity style={tw`ml-4 mt-3  mx-10 items-center`} onPress={()=> setStartSelection(null)}>
        <Text style={tw`text-white font-extrabold text-lg`}>Go Back</Text>
      </TouchableOpacity>
        </MotiView>
      </>
        }
      



      </>
      
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
         
         {clicked && r
         <View style={tw`justify-start items-end mb-20 mr-5`}>
         <AntDesign name="questioncircle" size={40} color="black" /> 
         </View>
         }
        */}
 

{Platform.OS == 'ios' &&
  <KeyboardAvoidingView behavior='padding' keyboardVerticalOffset={0} style={[tw`flex-row items-center absolute bottom-0`, {width:width}]}>
  {chatMenuShow == false &&
 
   <View id='outer-container' style={[{width:width, maxHeight:height/2}, tw`bg-slate-700 flex-row  bg-opacity-90   ${!isFocused ? `min-h-20`: `min-h-14`}`]} >
       
       <View id="inner-container" style={[tw`flex-row justify-start items-start rounded-2xl `, {width:width}]}>
        <View style={tw`flex-row items-center mt-2`}>
       <TouchableOpacity style={tw`ml-2`} onPress={()=> setChatMenuShow(true)}>
       <AntDesign name="minuscircleo" size={28} color="white" />
       </TouchableOpacity>

       <TextInput
       multiline
       autoFocus={Platform.OS == 'ios' ? true : false}
       numberOfLines={1}
       style={[tw`ml-2 mr-1 p-2 ${!isFocused && text.length > 20 && `mb-5`} text-white text-lg bg-black rounded-2xl`, { width:width/1.3, minHeight:40}]}
       placeholder={loading ? "Ezra is responding ~10 secs..." : "Enter Message..."}
       ref={textInputRef}
       placeholderTextColor={'gray'}
       value={text}
       maxLength={750}
       onBlur={()=> setIsFocused(false)}
       onChangeText={setText}
       onFocus={()=> scrollToBottom()}
       />
      
       
       <TouchableOpacity style={tw`flex-col `} onPress={()=> loading ? null : addMessage("user", text, navigation)}>
         {text.length > 650 ? <MotiText from={{scale:0}} animate={{scale:1}} transition={{type:'timing', duration:400}} style={tw`font-light  text-slate-200`}>{text.length > 650 && text.length -750}</MotiText> : null}
       <Feather name="send" style={tw` ml-2`} size={28} color="orange"  />
       </TouchableOpacity>
       </View>
       </View>
   </View>     
   
   }

   {chatMenuShow == true &&
   <TouchableOpacity  style={tw`flex-1 items-center justify-center mb-30 `} onPress={()=> {
     
     //setClicked(true)
     setChatMenuShow(false)
     
     }}>
   <MotiView from={{scale:0.2}} animate={{scale:1}} transition={{type:'timing'}}>
   <Ionicons name="add-circle" size={45} color="white" />
   
   </MotiView>
   </TouchableOpacity>
   }
   
     </KeyboardAvoidingView>
  }
       </SafeAreaView>
    </View>
    
  }




















    {Platform.OS == 'android' &&
        <View style={[tw` h-full bg-slate-900`]}>
        
        
      <View style={tw`justify-start items-center mt-11`}>
      {Platform.OS == 'android' ? <Text style={tw`text-orange-300 text-2xl text-center ${Platform.OS == "android" && ``}`}>Chat with Fleur</Text> : <Text style={tw`text-orange-300 text-2xl text-center `}>Chat with Fleur</Text>}
      </View>
      {/*
      {!isProMember && usageCount &&
      <View style={tw`ml-1`}>
        <Text style={tw`text-white ml-5 mb-1`}>{15-usageCount} Messages Remaining on Free Tier</Text>
      </View>
      }
    */}
      
      <ScrollView
            contentContainerStyle={tw`pb-100`}
            
            
      scrollToEnd={{animated:true}}
      style={tw` `}
      
      onContentSizeChange={() => scrollRef.current.scrollToEnd({ animated: true })}
      //onLayout={() => scrollRef.current.scrollToEnd({ animated: true })}
      scrollEventThrottle={16}
      ref={scrollRef} 
      //keyboardShouldPersistTaps='handled'
        
       >
      
      
     
      
      
  
      
      {messageList}
      
      {userLeft &&
      <View style={tw`mr-30 px-5 py-3`} onPress={()=> clear()}>
        
      <Text style={tw`text-white`}>Please don't leave the app while Fleur is responding. Please send your message again.</Text>
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

{messageList.length === 1 && !loading && chatMenuShow == false &&
      <>
      
      <Text style={[tw`ml-4 mb-1 text-white font-bold mt-3`,{fontSize:15}]}>Some things you can try {startSelection != null && "(Tap to send)"}</Text> 
      {startSelection == null &&
      <MotiView from={{scale:0, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'timing', duration:300}}>
      <View style={tw`flex-col  ml-4`}>
      <TouchableOpacity onPress={()=> setStartSelection("exercises")} style={[tw`border border-white rounded-2xl justify-center items-center my-2`, {width:width/1.75, height:height/15}]}>
        <Text style={tw`text-white text-lg`}>Therapy Exercises</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> setStartSelection("scenarios")} style={[tw`border border-white rounded-2xl justify-center items-center my-2`, {width:width/1.75, height:height/15}]}>
        <Text style={tw`text-white text-lg`}>Common Challenges</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={()=> setStartSelection("approaches")} style={[tw`border border-white rounded-2xl justify-center items-center my-2`, {width:width/1.75, height:height/15}]}>
        <Text style={tw`text-white text-lg`}>Therapeutic Approaches</Text>
      </TouchableOpacity>
      </View>
      </MotiView>
      }
      
      {startSelection == "scenarios" &&
      <>
      <MotiView from={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'timing', duration:600}}>
      <FlatList 
        data={initialSuggestions}
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
             
             <View style={[{width:width/1.25}, tw`mt-1`]}>
              
              <TouchableOpacity onPress={()=> {
                setText(itemData.item.suggestion)
                setClicked(true)
                setChatMenuShow(false)
                //addMessage("user", text)
                }} style={[tw`ml-2  rounded-2xl p-2 `, ]}>
              <Text style={tw`text-white  font-bold`}>{itemData.item.title}</Text>
              <Text style={[tw`text-white `,{fontSize:16}]}>{itemData.item.suggestion}</Text>
              </TouchableOpacity>
            </View>
             
             
  
              
              </>
            )
          
        }}
      
      />
      
      <TouchableOpacity style={tw`ml-4 mt-3  mx-10 items-center`} onPress={()=> setStartSelection(null)}>
        <Text style={tw`text-white font-extrabold text-lg`}>Go Back</Text>
      </TouchableOpacity>
        </MotiView>
      </>
        }

      {startSelection == "exercises" &&
      <>
      <MotiView from={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'timing', duration:600}}>
      <FlatList 
        data={exercises}
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
             
             <View style={[{width:width/1.25}, tw`mt-1`]}>
              
              <TouchableOpacity onPress={()=> {
                setText(itemData.item.message)
                setClicked(true)
                setChatMenuShow(false)
                //addMessage("user", text)
                }} style={[tw`ml-2  rounded-2xl p-2 `, ]}>
              <Text style={tw`text-white  font-bold`}>{itemData.index+1}. {itemData.item.title}</Text>
              <Text style={[tw`text-white `,{fontSize:16}]}>{itemData.item.description}</Text>
              </TouchableOpacity>
            </View>
             
             
  
              
              </>
            )
          
        }}
      
      />
      
      <TouchableOpacity style={tw`ml-4 mt-3  mx-10 items-center`} onPress={()=> setStartSelection(null)}>
        <Text style={tw`text-white font-extrabold text-lg`}>Go Back</Text>
      </TouchableOpacity>
        </MotiView>
      </>
        }


    {startSelection == "approaches" &&
      <>
      <MotiView from={{scale:0.5, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'timing', duration:600}}>
      <FlatList 
        data={approaches}
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
             
             <View style={[{width:width/1.25}, tw`mt-1`]}>
              
              <TouchableOpacity onPress={()=> {
                setText(itemData.item.message)
                setClicked(true)
                setChatMenuShow(false)
                //addMessage("user", text)
                }} style={[tw`ml-2  rounded-2xl p-2 `, ]}>
              <Text style={tw`text-white  font-bold`}>{itemData.index+1}. {itemData.item.title}</Text>
              <Text style={[tw`text-white `,{fontSize:16}]}>{itemData.item.description}</Text>
              </TouchableOpacity>
            </View>
             
             
  
              
              </>
            )
          
        }}
      
      />
      
      <TouchableOpacity style={tw`ml-4 mt-3  mx-10 items-center`} onPress={()=> setStartSelection(null)}>
        <Text style={tw`text-white font-extrabold text-lg`}>Go Back</Text>
      </TouchableOpacity>
        </MotiView>
      </>
        }
      



      </>
      
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
    {Platform.OS == 'android' && 
   <View  style={[tw` flex-row justify-center `, {width:width}]}>
    
     {chatMenuShow == false &&
     <MotiView
      state={AndroidKey}
      
    >
    <View style={tw`flex-row items-center bg-slate-700 bg-opacity-90 min-h-14`}>
    <View id="inner-container" style={[tw` flex-row justify-start items-start rounded-2xl `, {width:width}]}>
     <View style={tw`flex-row items-center mt-1`}>
    <TouchableOpacity style={tw`ml-2`} onPress={()=> setChatMenuShow(true)}>
    <AntDesign name="minuscircleo" size={28} color="white" />
    </TouchableOpacity>

    
    <TextInput
    multiline
    autoFocus={true}
    numberOfLines={1}
    style={[tw`ml-2 mr-1 p-2 ${!isFocused && text.length > 20 && `mb-5`} text-white text-lg bg-black rounded-2xl`, { width:width/1.3, minHeight:40}]}
    placeholder={loading ? "Fleur is responding..." : "Enter Message..."}
    ref={textInputRef}
    placeholderTextColor={'gray'}
    value={text}
    maxLength={750}
    
    onChangeText={setText}
    
    />
    
    
    <TouchableOpacity style={tw`flex-col `} onPress={()=> loading ? null : addMessage("user", text)}>
      {text.length > 650 ? <MotiText from={{scale:0}} animate={{scale:1}} transition={{type:'timing', duration:400}} style={tw`font-light  text-slate-200`}>{text.length > 650 && text.length -750}</MotiText> : null}
    <Feather name="send" style={tw` ml-2`} size={28} color="orange"  />
    </TouchableOpacity>
    </View>
    </View>
    </View>
  </MotiView>     
  
  }
  
  {chatMenuShow == true &&
  <TouchableOpacity  style={tw`   mb-30`} onPress={()=> {
  
  //setClicked(true)
  setChatMenuShow(false)
  
  }}>
  <MotiView from={{scale:0.2}} animate={{scale:1}} transition={{type:'timing'}}>
  <Ionicons name="add-circle" size={45} color="white" />
  
  </MotiView>
  </TouchableOpacity>
  }
      
      </View>
  }       
      </View>

    }
    </>
  )
}
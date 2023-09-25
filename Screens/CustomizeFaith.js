import React, {useState, useEffect} from 'react'
import {View, Text, useWindowDimensions, TextInput, TouchableOpacity, Linking, Alert, Platform, SafeAreaView} from 'react-native'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { KeyboardAvoidingScrollView } from 'react-native-keyboard-avoiding-scroll-view';
import { useFleur } from '../Context/FleurContext';
import Slider from '@react-native-community/slider';


export default function CustomizeFaith({navigation}) {
  const {width, height} = useWindowDimensions()
  const [knowledgeNumber, setKnowledgeNumber] = useState()
  const [knowledgeDescription, setKnowledgeDescription] = useState()

  useEffect(()=> {
    if(knowledge == "I'm new to this."){
        setKnowledgeNumber(0.1)
    } else if (knowledge == "Basic Understanding"){
        setKnowledgeNumber(0.3)
    } else if (knowledge == "Intermediate"){
        setKnowledgeNumber(0.5)
    } else if(knowledge == "Advanced"){
        setKnowledgeNumber(0.7)
    } else if(knowledge == "Scholarly/Expert"){
        setKnowledgeNumber(0.9)
    }
  }, [])

  useEffect(()=> {
    

    if(knowledgeNumber > 0.0 && knowledgeNumber < 0.2){
        setKnowledge("Beginner")
        setKnowledgeDescription("I'm just beginning my journey into exploring faith and scripture. I might have heard a few things here and there, but I'm really starting from scratch.")
    } else if(knowledgeNumber > 0.21 && knowledgeNumber < 0.40){
        setKnowledge("Basic Understanding")
        setKnowledgeDescription("I've learned some of the basics about my faith and its teachings. I recognize key stories and figures, but there's still so much more for me to understand. I'm starting to practice some rituals and observances.")
    } else if(knowledgeNumber > 0.41 && knowledgeNumber < 0.60){
        setKnowledge("Intermediate")
        setKnowledgeDescription("I've delved deeper into my faith and its scriptures. I often study and discuss religious topics with others, and I'm beginning to grasp the theological concepts. My religious practices are becoming a more regular part of my life.")
    } else if(knowledgeNumber > 0.61 && knowledgeNumber < 0.80){
        setKnowledge("Advanced")
        setKnowledgeDescription("I've dedicated significant time and effort into studying my faith and scripture. I might have formal education in theology or religious studies, and I often engage in in-depth theological or academic discussions. My understanding is comprehensive, spanning the historical, linguistic, cultural, and philosophical aspects of my faith.")
        
    } else if(knowledgeNumber > 0.81){
        setKnowledge("Scholarly/Expert")
        setKnowledgeDescription("I've dedicated significant time and effort into studying my faith and scripture. I might have formal education in theology or religious studies, and I often engage in in-depth theological or academic discussions. My understanding is comprehensive, spanning the historical, linguistic, cultural, and philosophical aspects of my faith.")
    }
  }, [knowledgeNumber])
  
  const {getProfile, denomination, knowledge, primeFocus, setPrimeFocus, setKnowledge, setDenomination} = useFleur()
  const [clicked, setClicked] = useState(false)
  useEffect(() => {
    let timer;
  
    if (clicked) {
      timer = setTimeout(() => {
        setClicked(false);
      }, 4000);
    }
  
    // Cleanup function to clear the timer when the component unmounts or before starting a new timer
    return () => {
      clearTimeout(timer);
    };
  }, [clicked]);

  useEffect(()=> {
    getProfile()
  }, [])

  async function saveProfile(){
        const obj = {
        Denomination: denomination,
        KnowledgeLevel: knowledge,
        Focus: primeFocus,
    }; 


     try {
        const jsonValue = JSON.stringify(obj);
        await AsyncStorage.setItem('userPreferences', jsonValue);
      } catch (error) {
        console.error("Error storing data", error);
      }
      setClicked(true)
      getProfile()
  }


  return (
    <View style={[tw`flex-1 ${Platform.OS=="android" && `bg-black`}`,{width:width, height:height}]}>
    
 
<View style={[tw`flex-1 justify-start bg-slate-900 ${Platform.OS == "android" && `mt-15`}`,{height:height, width:width, opacity:1, position:'absolute'}]}>
<KeyboardAvoidingScrollView contentContainerStyl={tw`pb-40`}>
    
        <View style={tw`flex-row justify-start items-center`}>
            
        <TouchableOpacity style={tw`mr-12 ml-3`} onPress={()=> navigation.goBack()}>
        <Ionicons name="arrow-back-circle-sharp" size={34} color="white" />
        </TouchableOpacity>
        
        <Text style={[tw`text-white text-center text-2xl font-bold `,{color:"#E5962D"}]}>Customize Your Chat</Text>

        </View>
        
        <View style={tw`px-3 `}>
        <Text style={[tw`text-white text-xl font-bold mt-3`, {color:"#E5962D"}]}>1. Denomination</Text>
        <Text style={tw`text-white my-1`}>Include your denomination so it can be reflected in your chat discussions.</Text>
        <TextInput
            style={[tw`border border-white text-white rounded-xl my-1 px-3`, { fontSize:17, width:width/1.1, aspectRatio:10/1}]}
            placeholder='Roman Catholic, Eastern Orthodox, Baptist etc'
            value={denomination}
            onChangeText={setDenomination}

         />
         </View>

         <View  style={tw`bg-white h-0.5 mx-4 mt-5`}></View>

        <View style={tw`px-3 mt-5`}>
            
        <Text style={[tw`text-white text-xl font-bold mt-3`, {color:"#E5962D"}]}>2. What is your knowledge of scripture?</Text>
        <Text style={tw`text-white my-1`}>This will help us tailor the responses to you.</Text>
        <Slider
            style={{width: width/1.1, height:100}}
            minimumValue={0}
            maximumValue={1}
            minimumTrackTintColor="#E5962D"
            maximumTrackTintColor="gray"
            value={knowledgeNumber}
            onValueChange={setKnowledgeNumber}
            />
        <Text style={[tw`text-white text-xl font-bold mt-3`, {color:"#FFFFFF"}]}>{knowledge}</Text>
        <Text style={tw`text-white italic font-light`}>{knowledgeDescription}</Text>
         </View>
         <View  style={tw`bg-white h-0.5 mx-4 mt-5`}></View>

        <View style={tw`px-3 mt-5`}>
        <Text style={[tw`text-white text-xl font-bold mt-3`, {color:"#E5962D"}]}>3. What is your primary focus right now in your faith journey?</Text>
        <Text style={tw`text-white my-1 font-bold`}>This will help us ensure the discussions are relevant to you.</Text>
        
        <TextInput
            style={[tw`border border-white text-white rounded-xl my-1 px-3`, { fontSize:17, width:width/1.1, aspectRatio:10/2}]}
            placeholder='E.g. Spiritual growth, grieving, prayer, scripture study, learning about the faith etc'
            numberOfLines={2}
            multiline
            value={primeFocus}
            onChangeText={setPrimeFocus}
         />
         <Text style={tw`text-white my-1 italic font-light`}>Examples: Spiritual growth, grieving, prayer, scripture study, learning about the faith etc.</Text>
         
         
</View>

        <View style={tw`justify-center items-center`}>
            <TouchableOpacity onPress={()=> {saveProfile()}} style={[tw`border m-3 p-4 rounded-2xl `,{borderColor:"#E5962D"}]}>
                <Text style={[tw`text-white text-lg`,{color:"#E5962D"}]}>Save To Your Profile</Text>
            </TouchableOpacity>
            {clicked && clicked == true && <Text style={tw`text-white text-green-300 text-lg`}>Saved!</Text>}
        </View>
        
        


        </KeyboardAvoidingScrollView>   
      </View>
      
      
    </View>
    

  )
}

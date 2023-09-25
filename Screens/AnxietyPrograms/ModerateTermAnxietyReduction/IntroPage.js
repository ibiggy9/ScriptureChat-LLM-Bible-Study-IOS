import React from 'react'
import {Text, View, TouchableOpacity, Easing, useWindowDimensions, Image} from 'react-native'
import { Motion } from '@legendapp/motion'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons'; 
import * as Haptics from 'expo-haptics';
import BackButton from '../../../Components/BackButton';
import { MaterialIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import InstructionSlider from '../../../Components/ExerciseComponents/InstructionSlider';


export default function IntroPage({navigation}) {
  const {width, height} = useWindowDimensions()
  const description = "Unlock your full potential and transform your life with the power of CBT. Cognitive-Behavioral Therapy (CBT) is a scientifically proven and highly effective method for managing negative thoughts, emotions, and behaviors. Our app provides a user-friendly, accessible, and personalized experience that guides you through the process of identifying and reframing negative automatic thoughts. You will learn how to challenge limiting beliefs and cultivate a more positive outlook, leading to improved mental health and overall well-being. Whether you're looking to manage anxiety, depression, or other mental health concerns, our CBT-based tool offers a convenient and effective solution."

  function next(){
    navigation.navigate('ModAnxOverview')
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)
  }

  const instructions = [
    {
      instructionTitle:"What It Does",
      image:<Image  style={[tw` rounded-xl `, {height:height/3, width:width/1.3}]} source={require('../../../assets/cbt/cb1.jpg')}/>,
      instructionShort:"Whether you're looking to manage anxiety, depression, or other mental health concerns, our CBT-based tool offers an effective solution."
    },
    {
      instructionTitle:"How it works",
      image:<Image  style={[tw` rounded-xl `, {height:height/3, width:width/1.3}]} source={require('../../../assets/cbt/cb2.jpg')}/>,
      instructionShort:"This exercise guides you through the process of identifying and reframing negative automatic thoughts."
    },
    {
      instructionTitle:"Benefits Of Using This Tool",
      image:<Image  style={[tw` rounded-xl `, {height:height/3, width:width/1.3}]} source={require('../../../assets/cbt/cb3.jpg')}/>,
      instructionShort:"You will learn how to challenge limiting beliefs and cultivate a more positive outlook, leading to improved mental health and overall well-being. "
    },
  ]

  return (
    <View style={{width:width, height:height}}>
    <LinearGradient 
    
    colors={['#27178C','#8C4917']}
    start={{x:0.05, y:0.6}}
    end={{x:0.9, y:0.3}}
    locations={[0.1,0.99]}
    
    
    style={{width:width, height:height, opacity:0.65}}
    >
    </LinearGradient>
    <View style={[tw`flex-1 justify-start`,{height:height, width:width, opacity:1, position:'absolute'}]}>
    <BackButton navigation={navigation} />
    <View style={tw`flex-1 justify-start `}>
      <Motion.Text 
      initial={{y:280, opacity:0}} animate={{y:0, opacity:1}} transition={{opacity: {type:"timing", duration:1000, easing: Easing.easing}, y:{type:"timing", duration:500, easing: Easing.easing, delay:1000}}}
      style={tw`text-center text-white font-bold text-2xl mx-5`}>Challenge & Change Negative Automatic Thoughts</Motion.Text>
       <Motion.View initial={{opacity:0}} animate={{opacity:1.2}} transition={{type:"timing", duration:600, easin: Easing.easing, delay:1700}}>
      
      <InstructionSlider instructions={instructions} />
      
      
     
      </Motion.View>
    </View>
   

      <Motion.View style={tw`justify-end items-center mb-10`} initial={{opacity:0}} animate={{opacity:1.2}} transition={{type:"timing", duration:600, easin: Easing.easing, delay:1700}}>
      <TouchableOpacity style={tw`flex-row p-3 mx-20 rounded-xl `} onPress={()=> next()} >
        <Text style={tw`text-2xl font-bold text-white mt-2 mr--2`}>Begin</Text>
        
      </TouchableOpacity>
      </Motion.View>
    </View>
    </View>
  )
}

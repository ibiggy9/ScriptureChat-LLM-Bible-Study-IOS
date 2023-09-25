
import React, { useEffect, useState, useRef } from 'react'
import {View, Text, Easing, TouchableOpacity, Alert, TouchableWithoutFeedback, Animated, useWindowDimensions} from 'react-native'
import tw from 'twrnc'
import { MotiView, MotiText, useDynamicAnimation, AnimatePresence } from 'moti'
import {Motion} from '@legendapp/motion'
import { MaterialIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useHaptics } from 'react-native-custom-haptics'
import BackButton from '../../../Components/BackButton'
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';


export default function Zone2({navigation}) {
  const [step, setStep] = useState(0)
  const {height, width} = useWindowDimensions()  
  const number = useRef(1)
  const [timer, setTimer] = useState(1)
  const [started, setStarted] = useState(false)
  const [score, setScore] = useState()
  


  function countDown(){
    setStarted(true)
    let interval = setInterval(() => {
        setTimer(lastTimerCount => {
            number.current==60 ? clearInterval() : number.current = number.current + 1
            
            return lastTimerCount - 1
        })
      }, 1250) //each count lasts for a second
      //cleanup the interval on complete
      return () => clearInterval()
    
    
    
  }



  function saveNumber(){

    setStep(step+1)
    console.log(number.current)
    clearInterval()
    if (number.current >= 8){
        setScore('below')
    } else if (number.current <= 4){
        setScore('above')
    } else {
        setScore('in')
    }


  }

  function restart(){
    setStep(3)
    number.current=1
  }


  return(
    <View style={{width:width, height:height}}>
<LinearGradient 

colors={['#182E77','#EA1D3F']}
start={{x:0.05, y:0.6}}
end={{x:0.9, y:0.3}}
locations={[0.1,0.99]}


style={{width:width, height:height, opacity:0.65}}
>
</LinearGradient>
<View style={[tw`flex-1 justify-start`,{height:height, width:width, opacity:1, position:'absolute'}]}></View>
        
        <BackButton navigation={navigation} />
        {step == 0 &&
            <View style={tw`flex-1 mt-10`}>
            <MotiView from={{scale:0.6, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'spring', damping:10, stiffness:100, delay:200}} style={tw`flex-1 justify-start items-center`}>
                <Text style={tw`text-white mx-10 text-center text-3xl`}>Welcome to the Zone 2 Intensity Assistance Tool</Text>    
            </MotiView>
            <MotiView from={{scale:0.6, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'spring', damping:10, stiffness:100, delay:200}} style={tw`flex-1 justify-start items-center mt--20`}>
            <Text style={tw` font-light text-white text-xl mx-8`}>Zone 2 is a type of cardiovascular exercise that reduces stress, improves mood, blood pressure, blood lipids and is relied upon by athletes everywhere to train for endurance events.</Text>
            </MotiView>
            <MotiView from={{scale:0.6, opacity:0}} animate={{scale:1, opacity:1}} transition={{type:'spring', damping:10, stiffness:100, delay:200}} style={tw`flex-1 justify-start items-center`}>
            <Text style={tw`font-bold text-white text-xl mx-8`}>NOTE: This exercise requires you to be performing some sort of exercise while using this tool.</Text>
            </MotiView>

            
    
            <View style={tw`flex-1 justify-end items-center`}>
        <View style={tw`flex-row justify-between`}>
        
        <TouchableOpacity style={[tw`mb-20`]} onPress={()=> setStep(step+1)}>
            <Text style={tw`text-white mx-30 text-2xl`}>Next</Text>
        </TouchableOpacity>
        
        </View>
        </View>
            </View>
        }
        {step == 1 &&
        <View style={tw`flex-1 mt-10`}>
            <MotiView style={tw`flex-1 justify-start`}>
            <MotiView from={{opacity:0, scale:0.7}} animate={{opacity:1, scale:1}} transition={{type:'timing', duration:500, delay:0}} style={tw`items-center`}>
            <Text style={tw`text-white mx-10 text-center text-3xl mb-4`}>Instructions</Text>  
            </MotiView>
            
            <MotiText from={{opacity:0, scale:0.7}} animate={{opacity:1, scale:1}} transition={{type:'timing', duration:500, delay:0}} style={tw` font-light text-white text-xl mx-2 mb-6`}>1. Choose your favourite exercise modality. This could be walking on a treadmill, riding a stationary bike, the eliptical etc. Indoor exercise modalities tends to work better as we need to maintain a steady pace for this.</MotiText>
            <MotiText from={{opacity:0, scale:0.7}} animate={{opacity:1, scale:1}} transition={{type:'timing', duration:500, delay:0}} style={tw` font-light text-white text-xl mx-2 mb-6`}>2. If you have a heart rate monitor, exercise up to 180 minus your age in heart rate. If you don't then skip this step. Let yourself ease up to this level over 5-10 minutes</MotiText>
            <MotiText from={{opacity:0, scale:0.7}} animate={{opacity:1, scale:1}} transition={{type:'timing', duration:500, delay:0}} style={tw` font-light text-white text-xl mb-6 `}>3. Without a heart rate monitor, start to exercise up until you notice that the exercise is requiring you to take full breaths. Let yourself ease up to this level over 5-10 minutes</MotiText>
            <MotiText from={{opacity:0, scale:0.7}} animate={{opacity:1, scale:1}} transition={{type:'timing', duration:500, delay:0}} style={tw` font-light text-white text-xl `}>4. When you get to this point, press next.</MotiText>
            
            </MotiView> 
            <View style={tw`flex-1 justify-end items-center`}>
        <View style={tw`flex-row justify-between`}>
        <TouchableOpacity style={[tw` mb-20`]} onPress={()=> setStep(step-1)}>
            <Text style={tw`text-white mx-30 text-2xl`}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[tw`mb-20`]} onPress={()=> setStep(step+1)}>
            <Text style={tw`text-white mx-30 text-2xl`}>Next</Text>
        </TouchableOpacity>
        </View>
        </View>
        </View>
        }

        {step == 2 && 
        <View style={tw`flex-1 mt-10`}>
        <View style={tw`flex-1 justify-start`}>
        <MotiView from={{opacity:0, scale:0.7}} animate={{opacity:1, scale:1}} transition={{type:'timing', duration:500, delay:0}} style={tw`items-center`}>
        <Text style={tw`text-white mx-10 text-center text-3xl mb-4`}>How To Use The Tool</Text>  
        </MotiView>
        
        <MotiText from={{opacity:0, scale:0.7}} animate={{opacity:1, scale:1}} transition={{type:'timing', duration:500, delay:0}} style={tw` font-light text-white text-xl mx-2 mb-6`}>When you proceed to the next section, you will be shown a sequence of numbers one at a time. Your task is to say those number out loud while you exercise, as they appear on the screen. When you have to take your first breath, tap the button to conclude the exercise.</MotiText>
        
        
        </View> 
        <View style={tw`flex-1 justify-end items-center`}>
        <View style={tw`flex-row justify-between`}>
        <TouchableOpacity style={[tw` mb-20`]} onPress={()=> setStep(step-1)}>
            <Text style={tw`text-white mx-20 text-2xl`}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[tw`mb-20`]} onPress={()=> setStep(step+1)}>
            <Text style={tw`text-white mx-20 text-2xl`}>Begin Exercise</Text>
        </TouchableOpacity>
        </View>
        </View>
         </View>
        
        
        }
        
        {step == 3 &&
        <View style={tw`flex-1`}>
        {!started ?
        <View style={tw`flex-1`}>
        <MotiView from={{opacity:0, scale:0.7}} animate={{opacity:1, scale:1}} transition={{type:'timing', duration:500, delay:0}} style={tw`flex-1 justify-center items-center mb--150`}>
            <Text style={[tw`text-white`, {fontSize:50}]}>Ready To Begin</Text>
        </MotiView>
        
        <TouchableOpacity style={tw`flex-1 justify-end items-center mb-20`} onPress={()=> countDown()}>
            <Text style={[tw`text-white`, {fontSize:30}]}>Start</Text>
        </TouchableOpacity>
        </View>
        :
        <View style={tw`flex-1`}>
        <View style={tw`flex-1 justify-center items-center mb--150`}>
            <Text style={[tw`text-white`, {fontSize:150}]}>{number.current}</Text>
        </View>
        <TouchableOpacity style={tw`flex-1 justify-end items-center mb-20`} onPress={()=> saveNumber()}>
            {number.current <=4 && number.current >=3 &&
            
            <MotiText key={"12424"} from={{opacity:0, scale:0.7}} animate={{opacity:1, scale:1}} exit={{opacity:0, scale:0.7}} transition={{type:'timing', duration:500, delay:0}}   style={[tw`text-white text-center mb-10`, {fontSize:30}]}>Don't Forget to Say The Number Out Loud!</MotiText>
            
            }
            
            <View style={tw` rounded-2xl p-3`}>
            <Text style={[tw`font-light text-white`, {fontSize:30}]}>I Breathed!</Text>
            </View>
            
        </TouchableOpacity>
        </View>
        }
        </View>
        }

        {step == 4 &&
        <MotiView from={{opacity:0}} animate={{opacity:1}} style={tw`flex-1 mt-10`}>
        <View style={tw`flex-1 justify-start`}>
        <View style={tw`items-center`}>
        <Text style={tw`text-white mx-10 text-center text-3xl mb-4`}>Results:</Text>  
        </View>
        <View style={tw`items-center`}>
        {score == 'above' &&
        <View>
        <View style={[tw`flex-row`, {width:width-30}]}>
        <MaterialCommunityIcons name="debug-step-over" size={50} color="red" />
        <Text style={tw`text-white mx-2  text-start text-2xl mb-4`}>Your Results Indicate that you are above your Zone 2.</Text>  
        </View>
        <Text style={tw`text-white mx-2  text-start text-2xl  mt-10 text-center`}>Before You Retry:</Text>
        <Text style={tw`text-white mx-2  text-start text-xl font-light mt-2 mb-4`}>Going over your zone 2 requires 20 minutes before you can retest to let your body calm down and let your adrenaline subside.</Text>
        </View>
        }
        {score == 'below' &&
        <View>
            <View style={[tw`flex-row mx-2`]}>
                 <AntDesign name="exclamationcircle" size={50} color="orange" />
                <Text style={tw`text-white mx-2  text-start text-2xl mb-4`}>Your Results Indicate that you are below your Zone 2. </Text>  
                
                
            </View>
            <Text style={tw`text-white mx-2  text-center text-2xl mb-4 mt-10`}>How to Re-Test:</Text>  
            <Text style={tw`text-white mx-2  text-start text-xl font-light mb-4`}>Increase your intensity a bit and stay at your new intensity for at least 5 minutes before restarting the test.</Text>  
        </View>
        }
        {score == 'in' &&
        <View>
        <View style={[tw`flex-row`, {width:width-50}]}>
        <AntDesign name="checkcircle" size={50} color="green" />
        <Text style={tw`text-white mx-2  text-start text-2xl mb-4`}>Your Results Indicate that you are in your Zone 2. </Text>  
        </View>

        <View>
        <Text style={tw`text-white mx-2  text-center text-xl mb-4 mx-10 font-bold mt-10`}>Use This To Improve Your Health:</Text>
        <Text style={tw`text-white mx-2  text-start text-lg mb-4`}>If you are not currently doing any zone 2, adding any amount to your routine will be beneficial to your health. </Text>
        <Text style={tw`text-white mx-2  text-center text-xl mb-4 mx-10 font-bold mt-10`}>Science-Backed Frequency & Duration Recommendations</Text>
        <Text style={tw`text-white mx-2 text-start text-lg mb-4`}> Working your way up to 3x 45 minute sessions per week has been shown<Text style={tw`font-bold`}>to meaningful improve mood, cardiovascular risk, sense of well-being and cognitive abilities.</Text></Text>
        </View>
        </View>
        }
        </View>
        
        </View> 
        <View style={tw`flex-1 justify-end items-center`}>
        <View style={tw`flex-row justify-between`}>
        <TouchableOpacity style={[tw` mb-20`]} onPress={()=> restart()}>
            <Text style={tw`text-white mx-20 text-2xl`}>Restart</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[tw`mb-20`]} onPress={()=> navigation.navigate('Exercises')}>
            <Text style={tw`text-white mx-20 text-2xl`}>Done</Text>
        </TouchableOpacity>
        </View>
        </View>
       
        </MotiView>
        
        
        }

    </View>
    
  )
}

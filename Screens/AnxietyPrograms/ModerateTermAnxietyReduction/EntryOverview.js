import React, {useState} from 'react'
import {View, Text, FlatList, TouchableOpacity, Easing, useWindowDimensions} from 'react-native'

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons'; 
import { Entypo } from '@expo/vector-icons';
import tw from 'twrnc'
import { AntDesign } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { SimpleLineIcons } from '@expo/vector-icons';
import { Motion } from '@legendapp/motion';
import { LinearGradient } from 'expo-linear-gradient';

export default function EntryOverview({navigation, completeCount, stepper, setStepper, noBack}) {
  const [step, setStep] = useState(0)
  const {height, width} = useWindowDimensions()
  const items=[
    {
        title:"Step 1: Identifying Patterns", 
        image: <MaterialCommunityIcons  style={tw`ml--6`} name="car-shift-pattern" size={50} color="white" />,   
        linkName:"Begin",
        component:"ModuleOne"

    },
    {
        title:"Step 2: Negative Automatic Thoughts", 
        image: <MaterialIcons style={tw`ml--6`} name="auto-fix-off" size={45} color="white" />,
        linkName:"Unlock",
        component:"ModuleTwo"
    },
    {
        title:"Step 3: Reframing", 
        image: <SimpleLineIcons  style={tw`ml--5 mr-3`} name="frame" size={45}  color="white" />,
        linkName:'Unlock',
        component:"ModuleThree"
    },
    
  ]

  return (
    
    <View >
      
      {step == 0 &&
        //Exercise Overview
        <>
          
         
          
        <Motion.Text 
      initial={{y:280, opacity:0}} animate={{y:0, opacity:1}} transition={{opacity: {type:"timing", duration:1000, easing: Easing.easing}, y:{type:"timing", duration:500, easing: Easing.easing, delay:1000}}}
      style={tw`text-center  text-white font-bold text-3xl mx-5`}>Daily Entry Overview</Motion.Text>
       <Motion.View initial={{opacity:0}}  animate={{opacity:1}}  transition={{default: {type:'timing', duration:1200, easing:'backInOut', delay:1200}}}>
        <FlatList
        scrollEnabled={false}
        contentContainerStyle={tw`justify-center items-center mt-10`}
        data={items}  
        renderItem={(itemData)=> {
        return(
          <View>
            {completeCount == itemData.index ? 
          <View style={[tw` border-4 border-orange-300 w-80 h-40 border rounded-2xl mb-6 justify-center items-center`]} key={itemData.index} >
            
          <View id="card" style={tw`  rounded-xl ml-3 pl-2 pr-10  items-center  `}>
              
          
          <View style={tw`flex flex-row items-center`}>
              <View style={tw`ml-5 mr-1`}>{itemData.item.image}</View>
              <Text style={tw`text-white text-lg py-12`}>{itemData.item.title}</Text>
            
            
            </View>
            
            </View>
            </View>
              :
              <View style={[tw`  w-80 h-40 border border-white  rounded-2xl mb-6 justify-center items-center`]} key={itemData.index} >
              <View id="card" style={tw` ml-3 pl-2 pr-10  items-center `}>
              
          
          <View style={tw`flex flex-row items-center`}>
              <View style={tw`ml-5 mr-1`}>{itemData.item.image}</View>
              <Text style={tw`text-white text-lg py-12`}>{itemData.item.title}</Text>
            
            
            </View>
            
            </View>
            

              
            </View>
            }
            </View>
        )
      }
        
      }/>
      </Motion.View >
      <Motion.View initial={{opacity:0}}  animate={{opacity:1}}  transition={{default: {type:'timing', duration:1200, easing:'backInOut', delay:1200}}} style={tw`flex flex-row justify-center items-center`}>
     {!noBack &&
      <TouchableOpacity style={tw` mx-20 rounded-2xl p-3 px-8 mt-3`} onPress={()=>setStepper(stepper-1)}>
      <MaterialIcons name="navigate-before" size={50} color="white" />
      </TouchableOpacity>
      }
      <TouchableOpacity style={tw`  mx-20 rounded-2xl p-3 px-8 mt-3`} onPress={()=>setStepper(stepper+1)}>
          <MaterialIcons name="navigate-next" size={50} color="white" />
          </TouchableOpacity>
         
        </Motion.View>
      </>
      }
      
    </View>
   
  )
}

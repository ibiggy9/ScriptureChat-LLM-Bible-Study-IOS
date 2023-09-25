import React, { useState } from 'react'
import {View, Text, Easing, TouchableOpacity, FlatList} from 'react-native'
import tw from 'twrnc'
import { Motion } from "@legendapp/motion"
import { Ionicons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons'; 
import { Fontisto } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';



export default function ModuleOverView({navigation}) {
    const [delayCount, setDelayCount] = useState(1600)

  const items=[
    {
        title:"Module 1: Identifying Patterns", 
        description:"Description would go here and would likely be that because you are good to go I am just typing nothing for no reason so what are we going to do is munch on bubbles cheeks",
        linkName:"Begin",
        component:"ModuleOne"

    },
    {
        title:"Module 2: Identifying Negative Automatic Thoughts", 
        description:"Description would go here and would likely be that because you are good to go I am just typing nothing for no reason so what are we going to do is munch on bubbles cheeks",
        linkName:"Unlock",
        component:"ModuleTwo"
    },
    {
        title:"Module 3: Reframing", 
        description:"Description would go here and would likely be that because you are good to go I am just typing nothing for no reason so what are we going to do is munch on bubbles cheeks",
        linkName:'Unlock',
        component:"ModuleThree"
    },
    {
        title:"Module 4: Goal Setting", 
        description:"Description would go here and would likely be that because you are good to go I am just typing nothing for no reason so what are we going to do is munch on bubbles cheeks",
        linkName:'Unlock',
        component:"ModuleFour",
    
    },
  ]

  const icons=[
    <MaterialCommunityIcons style={tw`mt-9`} name="lock-pattern" size={50} color="white" />,
    <FontAwesome5 style={tw`mt-9`} name="brain" size={50} color="white" />,
    <Feather style={tw`mt-9`} name="framer" size={50} color="white" />,
    <Feather style={tw`mt-9`} name="target" size={50} color="white" />
    
  ]

  return (
    <View style={{width: '100%', height:'100%', backgroundColor:'#030B27', flex:1}}> 
            <TouchableOpacity onPress={()=> navigation.pop(2)} style={tw`flex flex-row mt-18 ml-3 mb-3 `}>
            <Ionicons name="chevron-back-circle" size={38} color="white" />
        </TouchableOpacity>
        <View style={tw`flex flex-1 flex-col justify-center items-center`}>
        <Motion.Text initial={{opacity:0}} animate={{opacity:1}} transition={{type:'timing', duration:1200, ease:Easing.ease}} style={tw`text-white text-2xl mb-2 rounded-2xl`}>Core Anxiety Reduction Modules</Motion.Text>
        
        <FlatList
            style={tw`mb-10`}
            ListHeaderComponent={false}
            showsVerticalScrollIndicator={false}
            data={items}
            s
            renderItem={(itemData)=>{
                return(
                    <Motion.View id="card" initial={{scale:0.0}} animate={{scale:1}} transition={{type:'spring', damping:20, stiffness:200, delay:200*itemData.index}} style={tw` bg-blue-900 p-5 rounded-xl mt-5 w-90`}>
                        
                    <Text style={tw`text-white font-bold text-xl text-center`}>{itemData.item.title}</Text>
                    <View style={tw` flex flex-row rounded-xl bg-blue-900 border-purple-900 p-4 mt-3 mb-3`}>
                        {icons[itemData.index]}
                        
                        <Text style={tw`my-3 text-white ml-5 mr-10 mb-5`}>{itemData.item.description}</Text>
                    </View>
                    <TouchableOpacity style={tw`flex flex-row bg-blue-800 p-3 mx-10 rounded-xl items-center justify-center`} onPress={() => navigation.navigate(itemData.item.component)}>
                        {itemData.item.linkName == "Unlock" ? <Fontisto style={tw`pb-1`}  name="locked" size={24} color="white" /> : <FontAwesome5 style={tw`pb-1`} name="unlock-alt" size={24} color="white" />}
                        <Text style={tw`ml-3 text-center text-lg font-light text-white`}>{itemData.item.linkName}</Text>
                    </TouchableOpacity>
                </Motion.View>



                )
            }}
        />
        
        </View>

    </View>
  )
  
}

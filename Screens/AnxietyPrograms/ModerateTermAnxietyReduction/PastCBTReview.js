import { ScrollView } from 'moti'
import React from 'react'
import {View, Text, useWindowDimensions, TouchableOpacity} from 'react-native'
import tw from 'twrnc'
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

export default function PastCBTReview({navigation, route}) {
  const {title, date, situation, mentalFilter, thoughts, support, against, reframe} = route.params
  const {height, width } = useWindowDimensions()
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
    <View style={[tw`flex-1 justify-start mt-20 pb-40`,{height:height, width:width, opacity:1, position:'absolute'}]}>
    <View style={tw`flex-1`}>
    <ScrollView> 
        
        <View style={tw` flex-row item-start`}>
        <Text style={tw`text-white font-light text-lg`}>{date}</Text>
        </View>
        <View style={tw`items-center mt-5`}>
        <Text style={tw`text-white text-3xl font-bold`}>{title}</Text>
        </View>
        <View style={tw`mx-3 mt-5`}>
        <Text style={tw`text-white text-2xl`}>Situation:</Text>
        <Text style={tw`text-white text-xl`}>{situation}</Text>
        </View>
        <View style={tw`mx-3 mt-5`}>
        <Text style={tw`text-white text-2xl`}>Thoughts:</Text>
        <Text style={tw`text-white text-xl`}>{thoughts}</Text>
        </View>
        <View style={tw`mx-3 mt-5`}>
        <Text style={tw`text-white text-2xl`}>Mental Filter:</Text>
        <Text style={tw`text-white text-xl`}>{mentalFilter}</Text>
        </View>
        <View style={tw`mx-3 mt-5`}>
        <Text style={tw`text-white text-2xl`}>Evidence For:</Text>
        <Text style={tw`text-white text-xl`}>{support}</Text>
        </View>
        <View style={tw`mx-3 mt-5`}>
        <Text style={tw`text-white text-2xl`}>Evidence Against:</Text>
        <Text style={tw`text-white text-xl`}>{against}</Text>
        </View>
        <View style={tw`mx-3 mt-5`}>
        <Text style={tw`text-white text-2xl`}>Reframe:</Text>
        <Text style={tw`text-white text-xl`}>{reframe}</Text>
        </View>
        
        
    
    </ScrollView>
    </View>
    <TouchableOpacity style={tw`justify-end mt-5 mb-10 items-center`} onPress={()=> navigation.goBack()}>
    <Ionicons name="arrow-back-circle" size={60} color="white" />
        </TouchableOpacity>
    </View>
    </View>
  )
}

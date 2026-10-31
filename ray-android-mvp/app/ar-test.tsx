import React,{useState} from 'react';
import {StyleSheet,Text,View} from 'react-native';
import {useRouter} from 'expo-router';
import {ViroARSceneNavigator} from '@reactvision/react-viro';
import ARCube from '../src/ar/ARCube';
import {Page,Topbar,Caption,Headline,Primary,PressScale,Eyebrow} from '../src/components/Ui';
import {C} from '../src/theme';
export default function Test(){
 const [active,setActive]=useState(false);const router=useRouter();
 return <Page scroll={false}><Topbar title="ARCORE CHECK" number="M0"/>{active?<View style={{flex:1}}><ViroARSceneNavigator initialScene={{scene:ARCube}} provider="none" style={StyleSheet.absoluteFill}/><View style={{position:'absolute',top:18,left:16,right:16,padding:18,backgroundColor:'#10141CE0',borderRadius:18}}><Eyebrow>DEVICE-ONLY / NATIVE AR TEST</Eyebrow><Caption style={{marginTop:8,color:C.white}}>Move your phone slowly. Tap a highlighted floor/table to place a 10 cm cube. Walk around to test tracking.</Caption></View><View style={{position:'absolute',bottom:24,left:20,right:20}}><Primary title="End test" onPress={()=>setActive(false)} secondary/></View></View>:<View style={{paddingHorizontal:25,paddingTop:27}}><Eyebrow>BUILD VALIDATION / MILESTONE ZERO</Eyebrow><Headline size={39} style={{marginTop:18}}>One cube.{'\n'}<Text style={{color:C.lavender}}>Real tracking.</Text></Headline><Caption style={{marginTop:20}}>This separate test checks that ViroReact's native scene starts and that your Android phone can detect a real surface. Expo Go will not run it.</Caption><Primary title="Launch AR cube test" onPress={()=>setActive(true)} style={{marginTop:28}}/><Primary title="Return to studio" secondary onPress={()=>router.back()} style={{marginTop:12}}/></View>}</Page>
}

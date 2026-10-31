import React,{useState} from 'react';
import {Alert,StyleSheet,Text,View} from 'react-native';
import {ViroARSceneNavigator} from '@reactvision/react-viro';
import {useRouter} from 'expo-router';
import {useProject} from '../src/state/Project';
import {ARPlacementScene} from '../src/ar/Scenes';
import {Page,Topbar,Headline,Caption,Eyebrow,Primary,PressScale} from '../src/components/Ui';
import {C} from '../src/theme';
export default function AR(){
 const router=useRouter();const {plan,selectedStep,setSelectedStep}=useProject();
 const [begin,setBegin]=useState(false),[placed,setPlaced]=useState(false);
 if(!plan) return <Page><Topbar title="AR STUDIO"/><View style={{padding:24}}><Headline>No model available.</Headline><Caption style={{marginTop:14}}>Create a concept before entering AR.</Caption><Primary title="Create a design" onPress={()=>router.replace('/space')} style={{marginTop:24}}/></View></Page>;
 return <Page scroll={false}><Topbar title="AR / RAY" number="LIVE"/>
 {!begin?<View style={{paddingHorizontal:25,flex:1}}><Eyebrow style={{marginTop:26}}>REAL-SPACE PREVIEW</Eyebrow><Headline size={39} style={{marginTop:17}}>Put the idea{'\n'}<Text style={{color:C.lavender}}>in its place.</Text></Headline><Caption style={{marginTop:20}}>On an ARCore-supported Android phone, move slowly to find a table or floor. Tap the detected surface to anchor the design.</Caption>
 <View style={s.info}><Eyebrow>BEFORE YOU BEGIN</Eyebrow><Caption style={{marginTop:14}}>• Physical ARCore-capable Android device required.{'\n'}• Expo Go does not support this experience.{'\n'}• Camera permission and good lighting are required.{'\n'}• The preview is conceptual, not safety certification.</Caption></View>
 <Primary title="Start AR session" onPress={()=>{setBegin(true);setPlaced(false);}} style={{marginTop:28}}/><Primary title="Back to 3D preview" secondary onPress={()=>router.back()} style={{marginTop:12}}/></View>:
 <View style={{flex:1}}><ViroARSceneNavigator style={StyleSheet.absoluteFill} provider="none" initialScene={{
  scene: ARPlacementScene as unknown as () => React.JSX.Element}} viroAppProps={{plan,step:selectedStep,onPlaced:()=>setPlaced(true)}}/>
 <View pointerEvents="none" style={s.hint}><Eyebrow>{placed?'SURFACE ANCHORED':'SEARCHING FOR A SURFACE'}</Eyebrow><Text style={{color:C.white,fontSize:15,marginTop:7}}>{placed?'Model placed. Walk around to inspect.':'Move your camera, then tap a highlighted flat surface.'}</Text></View>
 <View style={s.bottom}><View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Text style={{color:C.white,fontSize:16,fontWeight:'600'}}>{plan.assembly_steps[selectedStep]?.title}</Text><Text style={{color:C.dim,fontSize:11}}>{selectedStep+1}/{plan.assembly_steps.length}</Text></View><Caption style={{fontSize:11,marginTop:8}}>{plan.assembly_steps[selectedStep]?.instructions}</Caption><View style={{flexDirection:'row',gap:8,marginTop:12}}><Primary title="Prev" secondary onPress={()=>setSelectedStep(s=>Math.max(0,s-1))} style={{flex:1}}/><Primary title="Next" onPress={()=>setSelectedStep(s=>(s+1)%plan.assembly_steps.length)} style={{flex:1}}/></View><PressScale onPress={()=>{setBegin(false);setPlaced(false);}}><Text style={{color:C.lavender,textAlign:'center',paddingTop:15,fontSize:13}}>END AR SESSION</Text></PressScale></View>
 </View>}
 </Page>
}
const s=StyleSheet.create({info:{backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:23,padding:22,marginTop:36},hint:{position:'absolute',top:19,left:16,right:16,borderRadius:18,backgroundColor:'#141720D9',borderWidth:1,borderColor:'#FFFFFF30',padding:17},bottom:{position:'absolute',bottom:0,left:0,right:0,backgroundColor:'#10121BF2',borderTopLeftRadius:24,borderTopRightRadius:24,paddingHorizontal:18,paddingTop:20,paddingBottom:17}});

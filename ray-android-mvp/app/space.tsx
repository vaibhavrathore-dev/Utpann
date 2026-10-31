import React,{useState} from 'react';
import {View,Text,Image,Alert,StyleSheet} from 'react-native';
import {useRouter} from 'expo-router';
import {CameraView,useCameraPermissions} from 'expo-camera';
import {Page,Topbar,Headline,Caption,Eyebrow,Field,Primary,PressScale} from '../src/components/Ui';
import {useProject} from '../src/state/Project';
import {validateSpace} from '../src/domain/scene';
import {C} from '../src/theme';
export default function SpaceScreen(){
 const router=useRouter();const {space,setSpace}=useProject();
 const [width,setWidth]=useState(String(space.width));const [height,setHeight]=useState(String(space.height));const [depth,setDepth]=useState(String(space.depth));
 const [cameraOn,setCameraOn]=useState(false);
 const [permission,requestPermission]=useCameraPermissions();
 const handleCamera=async()=>{
   if(cameraOn){setCameraOn(false);return;}
   if(!permission?.granted){const p=await requestPermission();if(!p.granted){Alert.alert('Camera not available','Manual measurements always work.');return;}}
   setCameraOn(true);
 };
 const next=()=>{const parse=(x:string)=>Number(x.trim().replace(',','.'));const candidate={width:parse(width),height:parse(height),depth:parse(depth),source:'user_confirmed' as const};const error=validateSpace(candidate);if(error){Alert.alert('Check measurements',error);return;}setSpace(candidate);router.push('/materials');};
 return <Page><Topbar title="SPACE / 01" number="01—04"/><View style={{paddingHorizontal:24,paddingTop:18}}><Eyebrow>STEP ONE / SET YOUR BOUNDARIES</Eyebrow><Headline size={40} style={{marginTop:17}}>Every great idea{'\n'}<Text style={{color:C.lavender}}>starts somewhere.</Text></Headline><Caption style={{marginTop:15,marginBottom:23}}>Point at a wall or corner to preview the space, then enter measurements you have confirmed.</Caption>
   <View style={s.camera}>{cameraOn && permission?.granted?<CameraView style={StyleSheet.absoluteFill} facing="back"/>:<Image source={require('../assets/images/room.jpg')} style={StyleSheet.absoluteFill} resizeMode="cover"/>}
     <View pointerEvents="none" style={s.frame}><View style={s.marker}><Text style={{color:C.bg,fontSize:11,fontWeight:'800'}}>A</Text></View><View style={s.marker}><Text style={{color:C.bg,fontSize:11,fontWeight:'800'}}>B</Text></View></View>
     <View style={s.tag}><Text style={{color:C.white,fontSize:10,letterSpacing:1.4}}>{cameraOn?'LIVE CAMERA · PREVIEW ONLY':'SPACE VISUALIZATION'}</Text></View>
   </View>
   <Caption style={{marginTop:12,fontSize:11}}>Camera preview is not an AR measurement. Enter dimensions from a tape measure or a trusted source.</Caption>
   <PressScale onPress={handleCamera} style={{marginTop:16}}><View style={s.cameraButton}><Text style={{color:C.white,fontWeight:'600'}}>{cameraOn?'Close camera preview':'Open camera preview'}</Text><Text style={{color:C.lavender,fontSize:20}}>↗</Text></View></PressScale>
   <View style={{marginTop:30,marginBottom:20,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Eyebrow>CONFIRMED DIMENSIONS</Eyebrow><Text style={{color:C.faint,fontSize:11}}>CENTIMETERS</Text></View>
   <View style={{flexDirection:'row',gap:10,marginBottom:18}}><Field label="WIDTH" value={width} onChange={setWidth}/><Field label="HEIGHT" value={height} onChange={setHeight}/><Field label="DEPTH" value={depth} onChange={setDepth}/></View>
   <View style={s.note}><Text style={{color:C.lime,fontSize:13}}>◎</Text><Text style={{color:C.dim,fontSize:12,flex:1,lineHeight:19}}>These values are editable. AR estimates require a supported phone and separate tracked-surface measurements.</Text></View>
   <Primary title="Continue to materials" onPress={next} style={{marginTop:28}}/>
 </View></Page>
}
const s=StyleSheet.create({
 camera:{height:250,backgroundColor:C.panel2,borderRadius:24,overflow:'hidden',borderWidth:1,borderColor:'#FFFFFF20'},
 frame:{position:'absolute',left:'16%',right:'16%',top:'18%',bottom:'19%',borderWidth:1,borderStyle:'dashed',borderColor:C.lavender,justifyContent:'space-between',flexDirection:'row',alignItems:'flex-end',paddingHorizontal:0},
 marker:{height:24,width:24,borderRadius:12,backgroundColor:C.lavender,alignItems:'center',justifyContent:'center',marginHorizontal:-12,marginBottom:-12},
 tag:{position:'absolute',left:12,top:14,backgroundColor:'#10141CCB',borderWidth:1,borderColor:'#FFFFFF25',padding:11,borderRadius:11},
 cameraButton:{height:50,borderRadius:15,backgroundColor:C.panel,borderColor:C.line,borderWidth:1,flexDirection:'row',alignItems:'center',justifyContent:'space-between',paddingHorizontal:18},
 note:{backgroundColor:C.panel,flexDirection:'row',alignItems:'flex-start',gap:10,padding:14,borderRadius:14},
});

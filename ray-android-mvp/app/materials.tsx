import React,{useState} from 'react';
import {Alert,Image,ScrollView,StyleSheet,Text,View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import {useRouter} from 'expo-router';
import {Caption,Chip,Eyebrow,Field,Headline,Page,PressScale,Primary,Topbar} from '../src/components/Ui';
import {useProject} from '../src/state/Project';
import {C} from '../src/theme';
import type {Material} from '../src/domain/scene';
export default function Materials(){
 const router=useRouter();const {materials,setMaterials,setPlan}=useProject();
 const existing=materials[0];
 const [qty,setQty]=useState(String(existing?.quantity ?? 5));
 const [length,setLength]=useState(String(existing?.length_cm ?? 80));
 const [width,setWidth]=useState(String(existing?.width_cm ?? 24));
 const [thickness,setThickness]=useState(String(existing?.thickness_cm ?? 1.8));
 const [condition,setCondition]=useState<Material['condition']>(existing?.condition??'good');
 const [photo,setPhoto]=useState<string | undefined>(existing?.photoUri);
 const choose=async(camera:boolean)=>{
   try{
     if(camera){const permission=await ImagePicker.requestCameraPermissionsAsync();if(!permission.granted){Alert.alert('Camera access denied','You can continue without a photo.');return;}}
     const result=camera?await ImagePicker.launchCameraAsync({mediaTypes:['images'],quality:.75}):await ImagePicker.launchImageLibraryAsync({mediaTypes:['images'],quality:.75});
     if(result.canceled || !result.assets?.[0])return;
     const asset=result.assets[0];
     if(asset.fileSize && asset.fileSize>10*1024*1024){Alert.alert('Image too large','Please choose an image up to 10 MB.');return;}
     setPhoto(asset.uri);
   }catch(e){Alert.alert('Photo unavailable',String(e));}
 };
 const next=()=>{
   const num=(str:string)=>Number(str.trim().replace(',','.'));
   const q=num(qty),l=num(length),w=num(width),t=num(thickness);
   if(![q,l,w,t].every(n=>Number.isFinite(n)&&n>0)||!Number.isInteger(q)||q>100||l>500||w>500||t>30){Alert.alert('Check your materials','Use a whole-number quantity (1–100) and positive dimensions below 500 cm.');return;}
   setMaterials([{id:'board_1',category:'wood',quantity:q,length_cm:l,width_cm:w,thickness_cm:t,condition,photoUri:photo}]);
   setPlan(null);router.push('/results');
 };
 return <Page><Topbar title="MATERIALS / 02" number="02—04"/><View style={{paddingHorizontal:24,paddingTop:17}}><Eyebrow>STEP TWO / WORK WITH WHAT YOU HAVE</Eyebrow><Headline size={40} style={{marginTop:17}}>What's already{'\n'}<Text style={{color:C.lavender}}>within reach?</Text></Headline><Caption style={{marginTop:15,marginBottom:23}}>Add your available boards. RAY uses confirmed sizes, never guesses dimensions from a photo.</Caption>
   <View style={s.photo}>{photo?<Image source={{uri:photo}} style={StyleSheet.absoluteFill} resizeMode="cover"/>:<Image source={require('../assets/images/boards.jpg')} style={StyleSheet.absoluteFill} resizeMode="cover"/>}<View style={s.dark}><Eyebrow>{photo?'YOUR MATERIAL PHOTO':'REFERENCE PHOTO / WOOD'}</Eyebrow><Text style={{color:C.white,fontSize:21,marginTop:7}}>Material inventory</Text></View></View>
   <View style={{flexDirection:'row',gap:10,marginTop:13}}><PressScale onPress={()=>choose(false)} style={{flex:1}}><View style={s.photoButton}><Text style={{color:C.white,textAlign:'center',fontWeight:'600'}}>Choose photo</Text></View></PressScale><PressScale onPress={()=>choose(true)} style={{flex:1}}><View style={s.photoButton}><Text style={{color:C.white,textAlign:'center',fontWeight:'600'}}>Take photo</Text></View></PressScale></View>
   <Caption style={{marginTop:9,fontSize:11}}>Image up to 10 MB. Optional for the offline design demo.</Caption>
   <View style={{height:1,backgroundColor:C.line,marginVertical:26}}/>
   <Eyebrow>SPECIFICATIONS / WOODEN BOARDS</Eyebrow><View style={{flexDirection:'row',gap:10,marginTop:15}}><Field label="QUANTITY" value={qty} onChange={setQty} unit="pcs"/><Field label="LENGTH" value={length} onChange={setLength}/></View><View style={{flexDirection:'row',gap:10,marginTop:15}}><Field label="BOARD WIDTH" value={width} onChange={setWidth}/><Field label="THICKNESS" value={thickness} onChange={setThickness}/></View>
   <Eyebrow style={{marginTop:26,marginBottom:12}}>CONDITION</Eyebrow><ScrollView horizontal showsHorizontalScrollIndicator={false}>{(['good','fair','needs_inspection'] as const).map(c=><Chip key={c} selected={condition===c} onPress={()=>setCondition(c)}>{c.replace(/_/g,' ')}</Chip>)}</ScrollView>
   <View style={s.callout}><Text style={{color:C.lime,fontSize:14}}>◎</Text><Caption style={{fontSize:12,flex:1}}>MVP supports a single group of identical wooden boards. Multi-material understanding is planned for later.</Caption></View>
   <Primary title="Reimagine this material" onPress={next} style={{marginTop:24}}/>
 </View></Page>
}
const s=StyleSheet.create({photo:{height:206,borderRadius:24,overflow:'hidden',backgroundColor:C.panel},dark:{position:'absolute',bottom:0,left:0,right:0,padding:18,backgroundColor:'#101117C7'},photoButton:{height:47,borderWidth:1,borderColor:C.line,backgroundColor:C.panel,borderRadius:14,justifyContent:'center'},callout:{marginTop:24,backgroundColor:C.panel,borderRadius:16,padding:14,flexDirection:'row',gap:12,alignItems:'flex-start'}});

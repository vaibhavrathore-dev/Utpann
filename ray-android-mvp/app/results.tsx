import React,{useCallback,useEffect,useState} from 'react';
import {ActivityIndicator,Image,Text,View} from 'react-native';
import {useRouter} from 'expo-router';
import {Caption,Eyebrow,Headline,Page,Primary,PressScale,Topbar} from '../src/components/Ui';
import {useProject} from '../src/state/Project';
import {createPlan,isDemoMode} from '../src/services/reimagineApi';
import {C} from '../src/theme';
export default function Results(){
 const {space,materials,plan,setPlan,setSelectedStep}=useProject();const router=useRouter();
 const [busy,setBusy]=useState(!plan);const [error,setError]=useState<string|null>(null);
 const generate=useCallback(async()=>{setBusy(true);setError(null);try{const result=await createPlan(space,materials);setPlan(result);setSelectedStep(0);}catch(e){setError(e instanceof Error?e.message:String(e));}finally{setBusy(false);}},[space,materials,setPlan,setSelectedStep]);
 useEffect(()=>{if(!plan)void generate();},[plan,generate]);
 return <Page><Topbar title="REIMAGINE / 03" number="03—04"/><View style={{paddingHorizontal:24,paddingTop:27}}><Eyebrow>STEP THREE / DESIGN INSIGHT</Eyebrow><Headline size={40} style={{marginTop:17}}>Give it a{'\n'}<Text style={{color:C.lavender}}>second story.</Text></Headline>
 {busy?<View style={{alignItems:'center',paddingVertical:95}}><ActivityIndicator size="large" color={C.lavender}/><Text style={{color:C.white,marginTop:23,fontSize:18}}>Preparing a design…</Text><Caption style={{marginTop:10,textAlign:'center'}}>Checking the dimensions and available material information.</Caption></View>:error?<View style={{marginTop:30,padding:23,borderRadius:22,borderWidth:1,borderColor:C.line,backgroundColor:C.panel}}><Text style={{color:C.peach,fontSize:19}}>Design unavailable</Text><Caption style={{marginTop:13}}>{error}</Caption><Primary title="Retry request" onPress={()=>void generate()} style={{marginTop:20}}/><Primary title="Edit measurements" secondary onPress={()=>router.replace('/space')} style={{marginTop:12}}/></View>:plan?<>
   <View style={{marginTop:22,borderRadius:24,overflow:'hidden',height:290,backgroundColor:C.panel}}><Image source={require('../assets/images/organizer.jpg')} style={{height:'100%',width:'100%'}} resizeMode="cover"/><View style={{position:'absolute',left:14,top:14,borderRadius:10,backgroundColor:'#090A10C9',padding:11}}><Text style={{color:C.lavender,fontWeight:'700',letterSpacing:1.8,fontSize:10}}>{isDemoMode?'OFFLINE DEMO / NOT AI GENERATED':'BACKEND APPROVED'}</Text></View></View>
   <Eyebrow style={{marginTop:26}}>MATCH / 01</Eyebrow><Text style={{color:C.white,fontSize:30,marginTop:10,letterSpacing:-1,fontWeight:'600'}}>{plan.design_name}</Text><Caption style={{marginTop:12}}>A configurable concept based on your space. Inspect all parts before attempting a real build.</Caption>
   <View style={{flexDirection:'row',gap:9,marginTop:24}}>{[['W',plan.scene.components[0].size_cm[0]],['H',Math.max(...plan.scene.components.map(p=>p.position_cm[1]+p.size_cm[1]/2))],['PARTS',plan.scene.components.length]].map(([k,v])=><View key={String(k)} style={{flex:1,backgroundColor:C.panel,borderRadius:17,padding:16,borderWidth:1,borderColor:C.line}}><Eyebrow>{k}</Eyebrow><Text style={{color:C.white,fontSize:24,marginTop:10}}>{typeof v==='number'?Math.round(v):v}</Text></View>)}</View>
   <View style={{marginTop:23,borderWidth:1,borderColor:plan.missing_materials.length?C.peach:C.line,borderRadius:18,padding:17,backgroundColor:C.panel}}><Text style={{color:C.white,fontWeight:'700'}}>Material check</Text><Caption style={{marginTop:8}}>{plan.missing_materials.length?plan.missing_materials.join('\n'):'Basic dimensions and quantities look sufficient for the concept. Strength and safety are not verified.'}</Caption></View>
   <Primary title="Inspect the 3D design" onPress={()=>router.push('/preview')} style={{marginTop:25}}/>
 </>:null}</View></Page>
}

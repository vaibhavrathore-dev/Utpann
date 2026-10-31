import React from 'react';
import {Image,Text,View} from 'react-native';
import {useRouter} from 'expo-router';
import {Page,Topbar,Headline,Eyebrow,Caption,Primary,PressScale} from '../src/components/Ui';
import {useProject} from '../src/state/Project';
import {C} from '../src/theme';
export default function Projects(){
 const r=useRouter();const {plan,saved}=useProject();
 return <Page><Topbar title="RAY / PROJECTS"/><View style={{paddingHorizontal:24,paddingTop:24}}><Eyebrow>STUDIO INDEX</Eyebrow><Headline size={39} style={{marginTop:17}}>Ideas in{'\n'}<Text style={{color:C.lavender}}>progress.</Text></Headline><Caption style={{marginTop:17}}>Your current session lives here. Long-term cloud saving will follow backend integration.</Caption>
 <View style={{marginTop:28,backgroundColor:C.panel,borderColor:C.line,borderWidth:1,borderRadius:22,overflow:'hidden'}}><Image source={require('../assets/images/organizer.jpg')} style={{width:'100%',height:220}} resizeMode="cover"/><View style={{padding:19}}><Eyebrow>{plan?(saved?'SAVED THIS SESSION':'CURRENT CONCEPT'):'NO PROJECT YET'}</Eyebrow><Text style={{color:C.white,fontSize:24,marginTop:9}}>{plan?.design_name??'Create your first design'}</Text><Caption style={{marginTop:10}}>{plan?`Parts: ${plan.scene.components.length} · ${plan.status==='demo'?'Offline demo':'Backend approved'}`:'Measure your space and add materials to begin.'}</Caption><Primary title={plan?'Open 3D preview':'Start creating'} onPress={()=>r.push(plan?'/preview':'/space')} style={{marginTop:17}}/></View></View>
 <View style={{height:1,backgroundColor:C.line,marginVertical:26}}/><Eyebrow>ENGINEERING / TEST ACCESS</Eyebrow><Text style={{color:C.white,fontSize:23,marginTop:12}}>ARCore device test</Text><Caption style={{marginTop:9}}>Before using the full AR flow, verify that a simple native cube stays anchored on a real surface.</Caption><Primary title="Launch AR cube check" onPress={()=>r.push('/ar-test')} secondary style={{marginTop:19}}/>
 </View></Page>
}

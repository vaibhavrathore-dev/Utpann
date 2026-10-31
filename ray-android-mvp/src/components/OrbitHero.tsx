import React, {useEffect,useMemo,useRef} from 'react';
import {Animated,Dimensions,Image,Pressable,StyleSheet,Text,View} from 'react-native';
import Svg,{Circle,Line} from 'react-native-svg';
import {useRouter} from 'expo-router';
import {C} from '../theme';
import {Headline,PressScale} from './Ui';
const W=Dimensions.get('window').width;
const cardImages=[require('../../assets/images/boards.jpg'),require('../../assets/images/shelf.jpg'),require('../../assets/images/room.jpg'),require('../../assets/images/organizer.jpg')];
const tiles=[
  {x:0.025,y:16,w:99,h:120,a:-8,label:'01 / MATERIALS',to:'/materials'},
  {x:0.67,y:43,w:109,h:126,a:8,label:'02 / MODEL',to:'/preview'},
  {x:0.01,y:267,w:110,h:121,a:7,label:'03 / SPACE',to:'/space'},
  {x:0.68,y:280,w:105,h:124,a:-9,label:'04 / AR VIEW',to:'/ar'},
] as const;
function Tile({index,tick}:{index:number,tick:Animated.Value}){
 const router=useRouter();const t=tiles[index];const move=tick.interpolate({inputRange:[0,1],outputRange:[-7-index*2,8+index*2]});
 const x=Math.min(W-t.w-14,Math.max(10,W*t.x));
 return <Animated.View style={[s.tile,{left:x,top:t.y,width:t.w,height:t.h,transform:[{translateY:move},{rotate:`${t.a}deg`}]}]}>
   <PressScale onPress={()=>router.push(t.to)} accessibilityLabel={t.label}>
    <View style={{borderRadius:13,overflow:'hidden',backgroundColor:'#33374A',borderWidth:1,borderColor:'#77758355'}}>
      <Image source={cardImages[index]} style={{width:'100%',height:t.h-25}} resizeMode="cover"/>
      <Text style={{fontSize:8,color:C.white,letterSpacing:1.1,padding:7,fontWeight:'700',backgroundColor:'#10121B'}} numberOfLines={1}>{t.label}</Text>
    </View>
   </PressScale>
 </Animated.View>
}
export default function OrbitHero(){
 const t=useRef(new Animated.Value(0)).current;
 useEffect(()=>{const loop=Animated.loop(Animated.sequence([Animated.timing(t,{toValue:1,duration:3200,useNativeDriver:true}),Animated.timing(t,{toValue:0,duration:3500,useNativeDriver:true})]));loop.start();return ()=>loop.stop();},[t]);
 return <View style={{height:438,marginTop:6,overflow:'hidden'}}>
   <View pointerEvents="none" style={{position:'absolute',top:39,left:(W-350)/2}}>
     <Svg width="350" height="350" viewBox="0 0 350 350">
       {[68,114,159].map((r,i)=><Circle key={i} cx={175} cy={175} r={r} fill="none" stroke={i===2?'#A58CF7':'#A7B0C7'} strokeOpacity={i===2?.24:.14} strokeWidth="1" strokeDasharray={i===1?'7 10':'0'}/>)}
       <Line x1={175} y1={0} x2={175} y2={350} stroke="#FFFFFF" strokeOpacity=".05"/>
       <Line x1={0} y1={175} x2={350} y2={175} stroke="#FFFFFF" strokeOpacity=".05"/>
     </Svg>
   </View>
   <View style={{position:'absolute',top:164,width:'100%',alignItems:'center',zIndex:5}} pointerEvents="none">
     <Text style={{fontSize:9,letterSpacing:3.8,color:C.lavender,fontWeight:'700'}}>MATERIAL-AWARE CREATION</Text>
     <Headline size={49} style={{textAlign:'center',marginTop:14,fontWeight:'600',lineHeight:53,letterSpacing:-2.9}}>Make room{'\n'}for <Text style={{color:C.lavender}}>more.</Text></Headline>
   </View>
   {tiles.map((_,i)=><Tile key={i} index={i} tick={t}/>)}
   <View pointerEvents="none" style={{position:'absolute',bottom:1,width:'100%',alignItems:'center'}}><Text style={{color:C.faint,letterSpacing:2.5,fontSize:9}}>EXPLORE THE POSSIBILITIES  ↓</Text></View>
 </View>
}
const s=StyleSheet.create({tile:{position:'absolute',borderRadius:12,zIndex:1,shadowColor:C.lavender,shadowOpacity:.14,shadowRadius:22}});

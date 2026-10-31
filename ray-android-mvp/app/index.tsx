import React,{useEffect,useRef} from 'react';
import {Animated,Image,Pressable,ScrollView,StyleSheet,Text,View} from 'react-native';
import {useRouter} from 'expo-router';
import {Page,Primary,Headline,Caption,Eyebrow,PressScale} from '../src/components/Ui';
import OrbitHero from '../src/components/OrbitHero';
import {C} from '../src/theme';
const features=[
 {id:'01',title:'Your space',subtitle:'Take control of every centimeter.',image:require('../assets/images/room.jpg'),route:'/space' as const},
 {id:'02',title:'Your materials',subtitle:'Start with what you already own.',image:require('../assets/images/boards.jpg'),route:'/materials' as const},
 {id:'03',title:'A new purpose',subtitle:'Bring a useful idea into focus.',image:require('../assets/images/organizer.jpg'),route:'/space' as const},
];
export default function Home(){
 const router=useRouter();const fade=useRef(new Animated.Value(0)).current;
 useEffect(()=>{Animated.timing(fade,{toValue:1,duration:700,useNativeDriver:true}).start();},[fade]);
 return <Page><Animated.View style={{opacity:fade}}>
    <View style={s.nav}><PressScale onPress={()=>router.push('/')}><View style={s.logo}><Text style={{color:C.white,fontSize:25,fontWeight:'800',letterSpacing:-2}}>R.</Text></View></PressScale><Text style={s.wordmark}>RAY <Text style={{color:C.faint,fontWeight:'400'}}> / STUDIO</Text></Text><PressScale onPress={()=>router.push('/projects')}><View style={s.round}><Text style={{color:C.white,fontSize:18}}>☰</Text></View></PressScale></View>
    <View style={{paddingHorizontal:23,marginTop:17,flexDirection:'row',alignItems:'center',justifyContent:'space-between'}}><Eyebrow>THE CREATION LAB</Eyebrow><Text style={{color:C.faint,fontSize:11}}>EST. 2026  ·  01—04</Text></View>
    <OrbitHero/>
    <View style={{paddingHorizontal:24,marginTop:10}}>
     <View style={{width:38,height:2,backgroundColor:C.lavender,marginBottom:19}}/>
     <Headline size={33}>Don't just imagine.{'\n'}<Text style={{color:C.lavender}}>See what fits.</Text></Headline>
     <Caption style={{marginTop:16,marginBottom:24,maxWidth:325}}>Measure your space. Add the materials you own. Explore a personalized model and place it in your room.</Caption>
     <Primary title="Start creating" onPress={()=>router.push('/space')}/>
     <View style={s.separator}/>
     <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:24}}><Eyebrow>THE PROCESS / 03 MOVES</Eyebrow><Text style={{color:C.faint,fontSize:12}}>SWIPE & EXPLORE</Text></View>
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingLeft:24,paddingRight:10,paddingBottom:24}}>
      {features.map(x=><PressScale key={x.id} onPress={()=>router.push(x.route)} style={{width:225,marginRight:14}}><View style={s.feature}><Image source={x.image} style={{width:'100%',height:170}} resizeMode="cover"/><View style={{padding:17}}><Eyebrow>{x.id} / RAY METHOD</Eyebrow><Text style={{fontSize:22,color:C.white,marginTop:13,letterSpacing:-.7}}>{x.title}</Text><Caption style={{marginTop:5,fontSize:12}}>{x.subtitle}</Caption></View></View></PressScale>)}
    </ScrollView>
    <View style={{paddingHorizontal:24,paddingBottom:26}}><View style={s.lastCard}><Eyebrow>WORKING PROTOTYPE</Eyebrow><Text style={{color:C.white,fontSize:20,marginTop:12,letterSpacing:-.3}}>Built for the real world.</Text><Caption style={{marginTop:9}}>Interactive scene demo + native AR surface placement. AI backend is connected only when configured.</Caption><PressScale onPress={()=>router.push('/projects')}><Text style={{marginTop:17,color:C.lavender,fontWeight:'700'}}>VIEW PROJECT SPACE   ↗</Text></PressScale></View></View>
   </Animated.View></Page>
}
const s=StyleSheet.create({
 nav:{marginHorizontal:23,marginTop:8,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 logo:{width:45,height:45,borderRadius:12,borderWidth:1,borderColor:'#FFFFFF50',justifyContent:'center',alignItems:'center',backgroundColor:C.panel},
 round:{width:44,height:44,borderRadius:22,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center'},
 wordmark:{color:C.white,fontSize:13,letterSpacing:2.9,fontWeight:'800'},
 separator:{height:1,backgroundColor:C.line,marginVertical:32},
 feature:{borderRadius:22,overflow:'hidden',borderWidth:1,borderColor:C.line,backgroundColor:C.panel,minHeight:270},
 lastCard:{borderWidth:1,borderColor:C.line,backgroundColor:C.bg2,borderRadius:24,padding:23},
});

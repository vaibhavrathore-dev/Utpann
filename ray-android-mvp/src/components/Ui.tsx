import React, {useRef} from 'react';
import {Animated, Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View, type ViewStyle, type TextStyle} from 'react-native';
import {useRouter} from 'expo-router';
import {SafeAreaView} from 'react-native-safe-area-context';
import {C} from '../theme';
export function Headline({children, size=38, color=C.white, style}: {children: React.ReactNode,size?:number,color?:string,style?:TextStyle}) {
 return <Text style={[{fontSize:size,lineHeight:size*1.08,fontWeight:'500',color,letterSpacing:-1.6},style]}>{children}</Text>;
}
export function Caption({children,style}: {children:React.ReactNode,style?:TextStyle}){
 return <Text style={[{color:C.dim,fontSize:14,lineHeight:22,letterSpacing:0.1},style]}>{children}</Text>;
}
export function Eyebrow({children,style}:{children:React.ReactNode,style?:TextStyle}){
 return <Text style={[{color:C.lavender,fontSize:10,fontWeight:'700',letterSpacing:2.6,textTransform:'uppercase'},style]}>{children}</Text>;
}
export function PressScale({children,onPress,style,disabled=false,accessibilityLabel}:{children:React.ReactNode,onPress?:()=>void,style?:ViewStyle,disabled?:boolean,accessibilityLabel?:string}){
 const scale=useRef(new Animated.Value(1)).current;
 const down=()=>Animated.spring(scale,{toValue:0.975,useNativeDriver:true,friction:8}).start();
 const up=()=>Animated.spring(scale,{toValue:1,useNativeDriver:true,friction:8}).start();
 return <Animated.View style={[style,{transform:[{scale}]}]}><Pressable accessible accessibilityRole="button" accessibilityLabel={accessibilityLabel} disabled={disabled} onPressIn={down} onPressOut={up} onPress={onPress} style={{opacity:disabled?.5:1}}>{children}</Pressable></Animated.View>;
}
export function Primary({title,onPress,secondary=false,disabled=false,style}:{title:string,onPress:()=>void,secondary?:boolean,disabled?:boolean,style?:ViewStyle}) {
 return <PressScale onPress={onPress} disabled={disabled} style={style}><View style={[styles.cta,{backgroundColor:secondary?C.panel2:C.lavender,borderWidth:secondary?1:0,borderColor:C.line}]}><Text style={{color:secondary?C.white:C.bg,fontSize:15,fontWeight:'700',letterSpacing:0.1}}>{title}</Text><Text style={{color:secondary?C.white:C.bg,fontSize:21,marginLeft:12}}>↗</Text></View></PressScale>
}
export function Chip({children,selected=false,onPress}:{children:React.ReactNode,selected?:boolean,onPress?:()=>void}) {
 return <PressScale onPress={onPress}><View style={[styles.chip,{backgroundColor:selected?C.lavender:C.panel,borderColor:selected?C.lavender:C.line}]}><Text style={{color:selected?C.bg:C.dim,fontSize:12,fontWeight:'600'}}>{children}</Text></View></PressScale>
}
export function Page({children,scroll=true,style}:{children:React.ReactNode,scroll?:boolean,style?:ViewStyle}) {
 return <SafeAreaView style={[{flex:1,backgroundColor:C.bg},style]} edges={['top','bottom']}><StatusBar barStyle="light-content" backgroundColor={C.bg}/>{scroll?<ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:36}}>{children}</ScrollView>:children}</SafeAreaView>
}
export function Topbar({title,number,back=true}:{title:string,number?:string,back?:boolean}){
 const router=useRouter();return <View style={styles.topbar}><PressScale onPress={()=>router.back()} disabled={!back}><View style={styles.topCircle}><Text style={{fontSize:20,color:C.white}}>{back?'‹':'R'}</Text></View></PressScale><Text style={{color:C.white,letterSpacing:2.8,fontWeight:'700',fontSize:12}}>{title}</Text><Text style={{color:C.faint,fontSize:12}}>{number||'RAY'}</Text></View>
}
export function Field({label,value,onChange,unit='cm'}:{label:string,value:string,onChange:(x:string)=>void,unit?:string}){
 return <View style={{flex:1,minWidth:85}}><Eyebrow style={{marginBottom:9}}>{label}</Eyebrow><View style={styles.field}><TextInput accessibilityLabel={label} keyboardType="decimal-pad" value={value} onChangeText={onChange} selectionColor={C.lavender} placeholder="0" placeholderTextColor={C.faint} style={{flex:1,minWidth:15,color:C.white,fontSize:23,fontWeight:'500',padding:0}}/><Text style={{color:C.dim,fontSize:13}}>{unit}</Text></View></View>
}
export const styles=StyleSheet.create({
 topbar:{height:62,marginHorizontal:23,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},
 topCircle:{width:42,height:42,borderRadius:21,borderWidth:1,borderColor:C.line,alignItems:'center',justifyContent:'center',backgroundColor:C.panel},
 cta:{height:60,borderRadius:18,flexDirection:'row',alignItems:'center',justifyContent:'center'},
 chip:{borderWidth:1,borderRadius:50,paddingHorizontal:16,paddingVertical:10,marginRight:8},
 field:{height:68,backgroundColor:C.panel,borderRadius:16,borderWidth:1,borderColor:C.line,paddingHorizontal:13,flexDirection:'row',alignItems:'center',gap:4},
 card:{backgroundColor:C.panel,borderRadius:22,borderWidth:1,borderColor:C.line},
});

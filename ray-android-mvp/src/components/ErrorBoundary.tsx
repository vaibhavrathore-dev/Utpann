import React from 'react';
import {Text,View,Pressable} from 'react-native';
import {C} from '../theme';
type State={failed:boolean,message:string};
/** Prevent a JavaScript component exception from leaving an unexplained blank screen. */
export default class ErrorBoundary extends React.Component<{children:React.ReactNode},State>{
 state:State={failed:false,message:''};
 static getDerivedStateFromError(e:Error):State{return{failed:true,message:e?.message||'Unknown application error'};}
 componentDidCatch(e:Error,info:React.ErrorInfo){console.error('[RAY UI error]',e,info.componentStack);}
 render(){
  if(!this.state.failed)return this.props.children;
  return <View style={{flex:1,justifyContent:'center',padding:32,backgroundColor:C.bg}}>
    <Text style={{color:C.lavender,fontSize:10,letterSpacing:2}}>RAY / RECOVERY</Text>
    <Text style={{color:C.white,fontSize:33,marginTop:15}}>Something interrupted the scene.</Text>
    <Text style={{color:C.dim,fontSize:14,marginTop:14,lineHeight:22}}>{this.state.message}</Text>
    <Pressable onPress={()=>this.setState({failed:false,message:''})} accessibilityRole="button" style={{backgroundColor:C.lavender,borderRadius:16,padding:18,alignItems:'center',marginTop:26}}>
     <Text style={{color:C.bg,fontWeight:'700'}}>Try again</Text>
    </Pressable>
   </View>;
 }
}

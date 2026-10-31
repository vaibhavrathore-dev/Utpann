import 'react-native-gesture-handler';
import React from 'react';
import {Stack} from 'expo-router';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import {ProjectProvider} from '../src/state/Project';
import {C} from '../src/theme';
import ErrorBoundary from '../src/components/ErrorBoundary';
export default function RootLayout(){
 return <GestureHandlerRootView style={{flex:1,backgroundColor:C.bg}}><SafeAreaProvider><ErrorBoundary><ProjectProvider><Stack screenOptions={{headerShown:false,animation:'fade',contentStyle:{backgroundColor:C.bg}}}/></ProjectProvider></ErrorBoundary></SafeAreaProvider></GestureHandlerRootView>
}

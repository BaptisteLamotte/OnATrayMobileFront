console.disableYellowBox = true;

import { StatusBar } from 'expo-status-bar';
import React, {useState} from 'react';

import { StyleSheet, Text, View, ImageBackground } from 'react-native';
import { Entypo } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

import isConnect from './reducers/isConnect'
import token from './reducers/token'
import movement from './reducers/reloadData'
import chatRoomData from './reducers/chatRoomData'
import adresses from './reducers/adresses'


import {Provider} from 'react-redux';
import {createStore, combineReducers}  from 'redux';


import {createAppContainer } from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createBottomTabNavigator} from 'react-navigation-tabs';

import SignInScreen from './screens/SignIn/SignInScreen'
//import SignInScreen from './screens/SignIN/SignInScreen'


import HomeRestauScreen from './screens/Restaurant/HomeRestauScreen'
import WhishListRestauScreen from './screens/Restaurant/WhislistRestauScreen'

import ChatListScreen from './screens/Messaging/ChatListScreen'
import ChatRoomScreen from './screens/Messaging/ChatRoomScreen'


import HomeTalentScreen from './screens/Talent/HomeTalentScreen'
import  WhishListTalentScreen from './screens/Talent/WhishListTalentScreen'
import MapScreen from './screens/Talent/mapScreen'

import {Button} from 'react-native-elements'

const store = createStore(combineReducers({isConnect, token, chatRoomData, movement, adresses}));

var TalentBottomNavigator = createBottomTabNavigator({
  HomeTalent : HomeTalentScreen,
  WhishListTalent : WhishListTalentScreen,
  ChatList : ChatListScreen
},{
  defaultNavigationOptions : ({navigation}) => ({
    tabBarIcon:({tintColor})=>{
      if (navigation.state.routeName == 'HomeTalent'){
        return <FontAwesome name="search" size={24} color={tintColor} />
      }else if (navigation.state.routeName == 'WhishListTalent'){
        return <Entypo name='heart' size={24} color={tintColor}/>
      }else  if (navigation.state.routeName == 'ChatList'){
        return <Entypo name='chat' size={24} color={tintColor}/>
      }
    }
  }), tabBarOptions:{
      activeTintColor :'#4B6584',
      inactiveTintColor:'#FFFFFF',
      style: {
      backgroundColor: '#FED330',
      
  }, showLabel:false
  },
})

var RestauBottomNavigator = createBottomTabNavigator({
  HomeRestau : HomeRestauScreen,
  WhishListRestau : WhishListRestauScreen,
  ChatList : ChatListScreen,
},{
  defaultNavigationOptions : ({navigation}) => ({
    tabBarIcon:({tintColor})=>{
      if (navigation.state.routeName == 'HomeRestau'){
        return <FontAwesome name="search" size={24} color={tintColor} />
      }else if (navigation.state.routeName == 'WhishListRestau'){
        return <Entypo name='heart' size={24} color={tintColor}/>
      }else if(navigation.state.routeName == 'ChatList'){
        return <Entypo name='chat' size={24} color={tintColor}/>
      }
    }
  }), tabBarOptions:{
    activeTintColor :'#4B6584',
    inactiveTintColor:'#FFFFFF',
    style: {
    backgroundColor: '#FED330',
  }, showLabel:false
  },
});

var StackNavigator = createStackNavigator({
    SignIn : SignInScreen,
    TalentBottomNavigator,
    RestauBottomNavigator,
    chatRoom : ChatRoomScreen, 
    mapScreen : MapScreen
  
    
},{
  headerMode:'none'
})

const Navigation = createAppContainer(StackNavigator);


export default function App(props){

  return (
    <Provider store={store}>
      <Navigation/>
     </Provider>
  );
 }



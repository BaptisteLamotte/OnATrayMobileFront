import React from 'react'
import {connect} from 'react-redux'

import * as WebBrowser from 'expo-web-browser';

import { View, Text, Image } from 'react-native'
import { Card } from 'react-native-elements'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

function CardRestaurant(props){
    let isLike = props.isLike
    const restaurant = props.restaurant
    const image = props.image
    
    var toggleWhishList = async () => {
        let rawResponse = await fetch('http://192.168.1.78:3000/talents/whishlist',{
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `token=${props.tokenToDisplay}&restaurant=${restaurant._id}`
        })
        
        let response = await rawResponse.json()
        props.onSendReload({movement:'movement'});
    }
    var cuisine = ' '
    if(restaurant.typeOfFood){
        for(var i=0; i<restaurant.typeOfFood.length; i++){
            if(i==restaurant.typeOfFood.length-1){
                cuisine+= restaurant.typeOfFood[i]
            } else {
                cuisine+=restaurant.typeOfFood[i] + ', '
            }
        }
    }
    var clientele = ' '
    if(restaurant.clientele){
        for(var i=0; i<restaurant.clientele.length; i++){
            if(i==restaurant.clientele.length-1){
                clientele+= restaurant.clientele[i]
            } else {
                clientele+=restaurant.clientele[i] + ', '
            }
        }
    }
    var ambiance = ' '
    if(restaurant.typeOfRestaurant){
        for(var i=0; i<restaurant.typeOfRestaurant.length; i++){
            if(i==restaurant.typeOfRestaurant.length-1){
                ambiance+= restaurant.typeOfRestaurant[i]
            } else {
                ambiance+=restaurant.typeOfRestaurant[i] + ', '
            }
        }
    }
    if(restaurant.pricing == 0){
        var prix = ' €'
    } else if(restaurant.pricing == 1){
        var prix = ' €€'
    } else if(restaurant.pricing == 1){
        var prix = ' €€€'
    } else {
        var prix = '--'
    }


    if(isLike){
        var heartToDisplay = <AntDesign onPress={()=>toggleWhishList()} name="heart" size={24} color={iconColor} />
    }else{
       var heartToDisplay = <AntDesign onPress={()=>toggleWhishList()}  name="hearto" size={24} color={iconColor} />
    }
    var openFacebook = () => {
        WebBrowser.openBrowserAsync('https://facebook.com');
    }
    var openInsta = () => {
        WebBrowser.openBrowserAsync('https://instagram.com');
    }
    return (
        <Card>
            <View style={{flex:1,display:'flex', flexDirection:'row',alignItems:'center', justifyContent:'space-between'}}>
            <Image 
            borderRadius='40%'
            style={{height:50, width:50}}
            source={{uri:image}}
            alt='profilePic'
            resizeMode="cover"
            />
            <View style={{display:'flex', flexDirection:'column'}}>
            <Text style={{paddingLeft:10, fontSize:18}}>{restaurant.name}</Text>
            <Text  style={{fontSize:12,paddingLeft:10}}><FontAwesome style={{paddingRight:5}} name="map-marker" size={12} color="black" />  {restaurant.adress}</Text>
            <Text style={{fontSize:12,paddingLeft:10}}><AntDesign style={{paddingRight:5}} name="phone" size={12} color="black"/>  {restaurant.phone}</Text>
            <Text style={{fontSize:12,paddingLeft:10}}><FontAwesome name="envelope-o" size={12} color="black"/>  {restaurant.email}</Text>
            </View>
            <View style={{display:'flex',flexDirection:'column'}}>
            <FontAwesome onPress={()=>openFacebook()} style={{paddingLeft:2}} name="facebook-square" size={30} color='#4B6584' />
            <AntDesign onPress={()=>openInsta()}  name="instagram" size={30} color="#4B6584" />
            </View>
            </View>
            <Card.Divider/>
            <View style={{display:'flex', flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
            <View style={{display:'flex', flexDirection:'column'}}>
            <Text>Clientèle : {clientele}</Text>
            <Text>Cuisine : {cuisine}</Text>
            <Text>Ambiance : {ambiance}</Text>
            <Text>Gamme de prix : {prix}</Text>
            </View>
            {heartToDisplay}
            </View>
         
        </Card>

    )
}
const iconColor = '#4B6584'
function mapStateToProps(state){
    return { tokenToDisplay : state.token}
}
function mapDispatchToProps(dispatch) {
    return {
      onSendReload: function(movement){
          dispatch({type:'reloadData',movement})
      }
    }
  }
export default connect(mapStateToProps,mapDispatchToProps)(CardRestaurant)
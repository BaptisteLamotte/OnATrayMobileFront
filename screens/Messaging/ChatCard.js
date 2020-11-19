import React from 'react'
import { withNavigation } from 'react-navigation';
import {connect} from 'react-redux'

import { View, Text, Image } from 'react-native'
//Cette fonction permet de se rendre dans la chat Room approprié, grâce aux informations envoyés au store
function ChatCard(props){

    var navigate = () => {
    props.onSendChatRoomData({name:props.myToken,desti:props.tokenDesti, room: props.roomName, destiName: props.name})
    props.navigation.navigate('chatRoom')
}
//Ce composant enfant retourne une vignette comprenant le premier message adresser à un interlocuteur, son nom et sa pgoto de profil.
    return(
        <View 
            style={{ height:80, backgroundColor:'white', display:'flex', flexDirection:'row', alignItems:'center', marginBottom:1}}
            >
            <Image 
            onPress={()=>navigate()}
            borderRadius='40%'
            style={{height:40, width:40, marginLeft:10}}
            source={{uri:'http://res.cloudinary.com/dpyqb49ha/image/upload/v1604656987/yxxwniyub5pcrbqvw1s1.jpg'}}
            resizeMode="cover"
            />
            <View>
                <Text onPress={()=>navigate()} style={{paddingLeft:10}}>{props.name}</Text>
                <Text style={{paddingLeft:10}}>{props.content}</Text>
            </View>
        </View>
    )
}
//Envoi au store des informations approprié 
function mapDispatchToProps(dispatch) {
    return {
      onSendChatRoomData: function(data) { 
          dispatch( {type: 'addChatRoomData', data} ) 
      }
    }
  }
  //Export du composant en forcant la navigation 
  export default connect(
      null, 
      mapDispatchToProps
  )(withNavigation(ChatCard));

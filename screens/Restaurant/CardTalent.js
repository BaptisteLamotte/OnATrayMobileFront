import React from 'react'
import {connect} from 'react-redux'
import { withNavigation } from 'react-navigation';

import { View, Text, Image } from 'react-native'
import { Card } from 'react-native-elements'
import { AntDesign } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';

function CardTalent (props) {
    
    
    let isLike = props.isLike
    const experiences = props.talent.experience
    const formations = props.talent.formation
    const talent = props.talent

    if(experiences!= undefined){
        var experienceList = experiences.map((experience,i) => {
            return(<Text  key={i}> {experience.firm}- {experience.job} - {experience.startingDate} - {experience.endingDate} - {experience.city}</Text>)
        })
        
        var experiencelistToDisplay = experiences.map((experience,i) =>{
            if(experience && i<1){
            return(<Text  key={i}>{experience.firm}- {experience.job} - {experience.city}</Text>)}
        })
    }
    
    if(formations !=undefined){
        var formationList = formations.map((formation,i) => {
            return(<div> {formation.endingDate} - {formation.city} - {formation.school}</div>)
        })
    
        var formationListToDisplay= formations.map((formation,i) =>{
            if(i<1){
                return(<Text key={i}>{formation.endingDate} - {formation.school}</Text>)
                
                }          
            })
    }

    if(talent.working){
        var enPoste = <Text>Actuellement en poste</Text> 
    } 
    else {
        var enPoste = <Text> Sans emploi pour le moment.</Text>
    }
   
    if(talent.lookingForJob ){
        var jobs = ' en tant que'
        for(var i=0; i<talent.lookingJob.length; i++){
            if(i==talent.lookingJob.length-1){
                jobs+= ' '+talent.lookingJob[i]+'.'
                
            }
            else{
                jobs+= ' '+talent.lookingJob[i]+','
             
            }
        }
    } 
    else{
    var jobs =''
    
    }

    if(talent.speakLangage){
        var langues = ''
        for(var i=0; i<talent.speakLangage.length; i++){
            if(i==talent.speakLangage.length-1){
                langues+= ''+talent.speakLangage[i]+'.'
            } 
            else{
              langues+= ''+talent.speakLangage[i]+','
            }
        }   
    } 
    else{
        var langues =''
    }

    if(talent.lookingForJob){
        var chercheUnEmploi = 'Je cherche un emploi en ce moment'
    } 
    else {
        var chercheUnEmploi = "Je ne cherche pas d'emploi en ce moment"
    }

    
    if(isLike){
        var heartToDisplay = <AntDesign onPress={()=>toggleWhishList()} name="heart" size={24} color={iconColor} />
    }else{
       var heartToDisplay = <AntDesign onPress={()=>toggleWhishList()}  name="hearto" size={24} color={iconColor} />
    }

    var toggleWhishList = async () => {

        let rawResponse = await fetch('http://192.168.1.78:3000/restaurants/addToWishList',{
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `id=${talent._id}&token=${props.tokenToDisplay}`
        })
        
        let response = await rawResponse.json()
        props.onSendReload({movement:'movement'});
    }
    var onSendDm = async () => {
        // fonction qui crée une chat room entre deux personnes 
           let rawResponse = await fetch('http://192.168.1.78:3000/createChatRoom', {
                method:'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body : `expediteur=${props.tokenToDisplay}&desti=${talent.token}`
            })
   
            let response = await rawResponse.json()
              
     props.onSendChatRoomData({name:props.tokenToDisplay,desti:talent.token, room: response.chatRoomId, destiName: `${talent.firstName}${talent.lastName}`})
     props.navigation.navigate('chatRoom')
    }

var firstParagraphe = <Text>{chercheUnEmploi}{jobs}</Text>
    return(
        <Card>
          <View style={{flex:1,display:'flex', flexDirection:'row',alignItems:'center'}}>
            <Image 
            borderRadius='40%'
            style={{height:40, width:40}}
            source={{uri:props.image}}
            alt='profilePic'
            resizeMode="cover"
            />
            <Text style={{paddingLeft:10}}>{talent.firstName} {talent.lastName}</Text>
            </View>
            <Card.Divider/>
            <View>
            {enPoste}
            {firstParagraphe}
            <Text style={{fontWeight:'bold'}}>Formation</Text>
            {formationListToDisplay}
            <Text style={{fontWeight:'bold'}}>Experience</Text>
            {experiencelistToDisplay}
            <Text style={{fontWeight:'bold'}}>Langues parlées</Text>
            <Text>{langues}</Text>
            </View>
            {/* <Text>{talent.countFav}</Text> */}
            <Card.Divider/>
            <View style={{flex:1,display:'flex', flexDirection:'row', justifyContent:'space-between'}}>
            {heartToDisplay}
            <FontAwesome onPress={()=>onSendDm()} name="paper-plane-o" size={24} color={iconColor} />
            <AntDesign name="arrowsalt" size={24} color={iconColor} />
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
      onSendChatRoomData: function(data) { 
          dispatch( {type: 'addChatRoomData', data} ) 
      },
      onSendReload: function(movement){
          dispatch({type:'reloadData',movement})
      }
    }
  }
export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(withNavigation(CardTalent));
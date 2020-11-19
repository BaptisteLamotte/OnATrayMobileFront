import React, {useState ,useEffect} from 'react'
import {connect} from 'react-redux'

import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Button, Header} from 'react-native-elements'

import ChatCard from './ChatCard'

function ChatListScreen (props) {
    //États permettant de savoir si l'on est un talent ou un restaurant car ce composant est commun aux deux typoes d'utilisateurs
    const isTalent  = props.connectToDisplay.isTalent;
    const isRestau = props.connectToDisplay.isRestau;
    
    //État regroupant toutes les chat room auquel l'utilisateur appartient
    const [listRoom, setListRoom] = useState([])
    
    // UseEffect permettant, à l'initialisation du composant, de récuperer tout les chat room auquel l'utilisateur appartient
    useEffect(() => {
        
        async function getMyChatRoom(){
            let rawResponse = await fetch('https://hidden-meadow-10798.herokuapp.com/getMyChatRoom', {
                method:'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body : `token=${props.tokenToDisplay}`
            })
            
            let response = await rawResponse.json()
            var tempList = [] 
            //Si l'utilisateur est talent, il était forcement destinataire du premier message 
            if(isTalent){
                for (let i=0;i<response.result.length;i++){
                    tempList.push({nom : response.result[i].message[0].expediteur, contenu :response.result[i].message[0].content , roomName :response.result[i]._id, myToken :props.tokenToDisplay, tokenDesti : response.result[i].message[0].tokenExpe})
                }
            }
            //Si l'utilisateur est restaurant, il était forcement expediteir du premier message 
            else if (isRestau){
                for (let i=0;i<response.result.length;i++){
                    tempList.push({nom : response.result[i].message[0].destinataire, contenu :response.result[i].message[0].content , roomName :response.result[i]._id, myToken :props.tokenToDisplay, tokenDesti : response.result[i].message[0].tokenDesti })
                }
            }
            //Inversion de la liste pour voir en premier les dernières chat room 
        let inverseList = tempList.reverse();
        setListRoom(inverseList)
            
        }
        getMyChatRoom()

    }, [])
   //Map sur le composant enfant ChatCard
    var chatCardList = listRoom.map((message,i)=>{
        if (message.contenu.length > 50){
            var contenu = message.contenu.slice(0, 60) + '...'
        } else {
            var contenu = message.contenu
        }
        return (
            <ChatCard key={i} roomName={message.roomName} myToken={message.myToken} tokenDesti={message.tokenDesti} content={contenu} name={message.nom}/>
        )
    })

    //Ce composant retourne donc la liste de chat room 
    return (
        <View style={{flex:1, backgroundColor:'white'}}>
            <Header
            backgroundColor='#FED330'
            centerComponent={{ text: 'Mes messages', style: { color: '#4B6584' } }}
            />
            <ScrollView>
            {chatCardList}
            </ScrollView>
        </View>
    )
}

function mapStateToProps(state) {
    return {tokenToDisplay: state.token, connectToDisplay : state.isConnect}
  }
  //Export du composant 
  export default connect(
    mapStateToProps, 
    null
  )(ChatListScreen);
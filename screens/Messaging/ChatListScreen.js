import React, {useState ,useEffect} from 'react'
import {connect} from 'react-redux'

import {StyleSheet, Text, View, ScrollView} from 'react-native';
import {Button, Header} from 'react-native-elements'

import ChatCard from './ChatCard'

function ChatListScreen (props) {
    const isTalent  = props.connectToDisplay.isTalent;
    const isRestau = props.connectToDisplay.isRestau;
    
    const [listRoom, setListRoom] = useState([])
    
    
    useEffect(() => {
        
        async function getMyChatRoom(){
            let rawResponse = await fetch('http://192.168.1.78:3000/getMyChatRoom', {
                method:'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body : `token=${props.tokenToDisplay}`
            })
            
            let response = await rawResponse.json()
            var tempList = [] 
            
            if(isTalent){
                for (let i=0;i<response.result.length;i++){
                    tempList.push({nom : response.result[i].message[0].expediteur, contenu :response.result[i].message[0].content , roomName :response.result[i]._id, myToken :props.tokenToDisplay, tokenDesti : response.result[i].message[0].tokenExpe})
                }
            }
            else if (isRestau){
                for (let i=0;i<response.result.length;i++){
                    tempList.push({nom : response.result[i].message[0].destinataire, contenu :response.result[i].message[0].content , roomName :response.result[i]._id, myToken :props.tokenToDisplay, tokenDesti : response.result[i].message[0].tokenDesti })
                }
            }
        let inverseList = tempList.reverse();
        setListRoom(inverseList)
            
        }
        getMyChatRoom()

    }, [])
   
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
    
  export default connect(
    mapStateToProps, 
    null
  )(ChatListScreen);
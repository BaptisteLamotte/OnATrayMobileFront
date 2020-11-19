import React, {useState, useEffect} from 'react'
import {connect} from 'react-redux'

import socketIOClient from 'socket.io-client';

import { StyleSheet, Text, View, Button, SafeAreaView, ScrollView } from 'react-native';
import {Input,Header} from 'react-native-elements'


import { FontAwesome } from '@expo/vector-icons';
var socket = socketIOClient("https://hidden-meadow-10798.herokuapp.com");

function ChatRoomScreen (props) {

    const [myName, setMyName] = useState('')
    const [hisName, setHisName] = useState('')
    const isTalent = props.connectToDisplay.isTalent
    const isRestau = props.connectToDisplay.isRestau

    const [messageToSend, setMessageToSend] = useState('')
    const [messageList, setMessageList] = useState([])
    const [sender, setSender] = useState('')
    const [desti, setDesti] = useState('')
    const [chatRoom, setChatRoom] = useState('')

    useEffect(()=>{
        async function getOldMessage(){
            let rawResponse = await fetch('https://hidden-meadow-10798.herokuapp.com/getOldMessage', {
            method:'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body : `chatRoomId=${props.chatRoomDataToDisplay.room}&token=${props.chatRoomDataToDisplay.desti}`
        })
        
        let response = await rawResponse.json();
        
        var messageTab = response.result
            var tempMessageTab = []
            for(let i=0; i<messageTab.length; i++){
                tempMessageTab.push({message : messageTab[i].content, token : messageTab[i].tokenExpe})
            }
            setMessageList(tempMessageTab)

        if(isRestau){
            setMyName(response.restau)
            setHisName(response.talent)
        }
        else if(isTalent){
            setMyName(response.talent)
            setHisName(response.restau)
        }
    }
    getOldMessage();
    },[])

    useEffect(()=>{
            console.log(props.chatRoomDataToDisplay)
            const name = props.chatRoomDataToDisplay.name
            const room = props.chatRoomDataToDisplay.room

            setDesti(props.chatRoomDataToDisplay.desti)
            setSender(name)
            setChatRoom(room)

        socket.emit('join', {name:name, room:room}, ({})=>{     
        })

        return ()=> {
            socket.emit('disco')
            socket.off();
        }
    },[socket, props.chatRoomDataToDisplay])


    useEffect(()=>{
         
        socket.on('message',(message)=>{
            setMessageList([...messageList,{message : message.message,token : message.tokenExpe} ])
           })
       }, [messageList])


    var sendMessage =  () => {
        var message = messageToSend
        console.log(message,sender,desti, chatRoom)
        socket.emit("sendMessage", {message, name: sender, desti:desti , room : chatRoom }, ()=>{
            console.log("je passe ici")
        })
        setMessageList([...messageList, {message : message, token : sender}])
        setMessageToSend('')
    }

var dataMessage = messageList.map(function(message,i){
    if(message.token == props.tokenToDisplay){
        return([
            <Text style={{marginLeft:170}}>{myName}</Text>,
            <View style={{backgroundColor:'#FED330', flex:1, display:'flex', marginLeft:160, padding:10,marginRight:5, marginTop:5, marginBottom:5, borderRadius:10 }} >
                <Text> 
                    {message.message}
                </Text>
            </View>
        ])
    }
    else{
        return ([
            <Text style={{marginLeft:10}}>{hisName}</Text>,
            <View style={{backgroundColor:'grey', flex:1, display:'flex', marginLeft:5, padding:10,marginRight:160, marginTop:5, marginBottom:5, borderRadius:10 }} >
                <Text> {message.message}</Text>
            </View>
        ])
    }
})


    return (
        <View style={{flex:1}}>
            <Header
            backgroundColor='#FED330'
            placement="left"
            leftComponent={<FontAwesome onPress={()=>props.navigation.navigate('ChatList')} name="arrow-left" size={24} color="#4B6584" />}
            centerComponent={{ text: props.chatRoomDataToDisplay.destiName, style: { color: '#4B6584' } }}
            />
            
            <SafeAreaView style={{flex:1, height:'200%', display:'flex', flexDirection:'column-reverse'}} >
                <View style={{ display:'flex', alignItems:'center', backgroundColor:'white'}}>
                    <Input onChangeText={(value)=>setMessageToSend(value)} value={messageToSend} containerStyle={{ width:'80%', paddingTop:20}} placeholder='Votre message' rightIcon={<FontAwesome onPress={()=>sendMessage()} name="paper-plane" size={24} color="#FED330" />} />
                </View>
                <ScrollView style={{display:'flex', flexDirection:'column-reverse'}} >         
                    {dataMessage}
                </ScrollView>
            </SafeAreaView>
        </View>
    )
}


function mapStateToProps(state) {
    return { chatRoomDataToDisplay: state.chatRoomData, tokenToDisplay : state.token, connectToDisplay : state.isConnect }
  }
    
  export default connect(
    mapStateToProps, 
    null
  )(ChatRoomScreen);
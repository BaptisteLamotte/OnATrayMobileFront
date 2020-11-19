import React, {useState} from 'react'
import {connect} from 'react-redux'
import * as WebBrowser from 'expo-web-browser';


import { StyleSheet,Linking, Text, View} from 'react-native';
import {Button, Input} from 'react-native-elements'


function SignInScreen (props) {

const [email, setEmail] = useState('')
const [password, setPassword] = useState('')

const [errorMessage, setErrorMessage] = useState(<Text></Text>)

//Fonction permettant à l'utilisateur déja inscrit de se connecter
var navigate = async () => {
    let isRestau = false;
    let isTalent = false;
  
    var rawResponse = await fetch("https://hidden-meadow-10798.herokuapp.com/sign_in", {
        method: 'post',
        headers: {'Content-Type':'application/x-www-form-urlencoded'},
        body:`email=${email}&password=${password}`
        })
    var response = await rawResponse.json()
    
    if(response.result == 'Error'){
        setErrorMessage(<Text  style={{color:'red', paddingBottom:10}}>Email ou mot de passe incorrecte</Text>)
    }
    else{
        // Navigation conditionnel en fonction du type d'utilisateur
        if(response.type == 'talent'){
            isTalent = true;
            props.onSendToken(response.token)
            props.onSendIsConnect({isTalent : true, isRestau : false})
        }else if(response.type == 'restaurant'){
            isRestau = true;
            props.onSendToken(response.token)
            props.onSendIsConnect({isTalent : false, isRestau : true})
        }
    }
    if(isRestau){
        props.navigation.navigate('HomeRestau')
    }else if(isTalent){
        props.navigation.navigate('HomeTalent')
    }
    setEmail('')
    setPassword('')
}

//Lien permettant d'acceder à l'application web pour se créer un compte si l'utilisateur n'en possède pas
var openBrowser = () => {
    WebBrowser.openBrowserAsync('https://nameless-lake-13290.herokuapp.com');
}
 
    return (
        <View style={{flex:1,width:'100%', justifyContent: "center", alignItems:'center'}}>
            <Input
            placeholder='Email'
            containerStyle={{width:'80%'}}
            onChangeText={(value)=>setEmail(value.toLowerCase())}
            value={email}
            />
            <Input
            placeholder='Mot de passe'
            secureTextEntry={true}
            containerStyle={{width:'80%'}}
            onChangeText={(value)=>setPassword(value)}
            value={password}
            />
            {errorMessage}
            <Button 
            buttonStyle={{backgroundColor:'#FED330'}}
            titleStyle={{color:'#4B6584'}}
            title='Sign-In'
            onPress={()=>navigate()}
            >
            </Button>   
            <Text onPress={()=>openBrowser()} style={{width:'50%', paddingTop:50}}>Vous n'avez pas de compte ? Creez en un dès maintenant</Text>
        </View>
    )
}

function mapDispatchToProps(dispatch) {
    return {
        //Envoi au store du token de l'utilisateur 
      onSendToken: function(token) { 
          dispatch( {type: 'addToken', token} ) 
      }, 
      //Envoi au store d'un objet permmetant d'identifié s'il est restaurant ou talent 
      onSendIsConnect : function(isConnect){
          dispatch({type:'addConnect', isConnect})
      }
    }
  }
  
  export default connect(
      null, 
      mapDispatchToProps
  )(SignInScreen);
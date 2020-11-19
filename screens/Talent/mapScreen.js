//Composant affichant les restaurants sur la carte via des marqueurs
import React, {useEffect, useState} from 'react'
import {View, Text} from 'react-native'
import MapView, {Marker} from 'react-native-maps';
import {Header,Button} from 'react-native-elements'
import { connect } from 'react-redux';
import { useSafeArea } from 'react-native-safe-area-context';
import { FontAwesome } from '@expo/vector-icons';


const zoneFrance= [
    [ -5.3173828125, 48.458124202908934 ],
    [ 2.1313476562500004, 51.26170001449684 ],
    [ 8.811035156250002, 48.90783374365477 ],
    [ 7.998046875000001, 43.70709714273101 ],
    [ 3.2080078125000004, 42.228008913641865 ],
    [ 1.4941406250000002, 42.293056273848215 ],
    [ -2.0214843750000004, 43.06838615478111 ],
    [ -5.3173828125, 48.458124202908934 ]
  ]


function mapScreen(props){
    const [myAdress, setMyAdress] = useState(null)
    const adressList = props.adressList

//UseEffect permettant de recuperer l'adresse du talent connécté de de l'affiché sur la carte via un marqeurs 
useEffect(()=>{

        async function getMyAdress(){
        let rawResponse = await fetch('https://hidden-meadow-10798.herokuapp.com/talents/getMyAdress',{
        method: 'POST',
        headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        body: `token=${props.tokenToDisplay}`
        })
        let response = await rawResponse.json() 
        setMyAdress({long : response.long, lat : response.lat})
    }
    getMyAdress();
      
},[])
//Map sur les adresses des restaurants pour affiché les marqueurs 
var markerListToDisplay = adressList.map((e,i)=>{
return (
    <Marker 
    pinColor='#4B6584'
    key={i}
    title={e.name}
    coordinate={{latitude: e.lat, longitude: e.long}}/>
)
})




let markerToDisplay;
if(myAdress != null){
    markerToDisplay = <Marker
    title='Moi'
    coordinate={{latitude: myAdress.lat, longitude: myAdress.long}}
    pinColor='#FED330'
/>
}
else{ markerToDisplay;
}


return (
    <View style={{flex:1}}>
        <Header
            backgroundColor='#FED330'
            centerComponent={{ text: 'Rechercher', style: { color: '#4B6584' } }}
            leftComponent={<FontAwesome onPress={()=>props.navigation.navigate('HomeTalent')} name="arrow-left" size={24} color="#4B6584" />}
            />
            {/* <View style={{display:'flex', justifyContent:'center', alignItems:'center', paddingTop:10, paddingBottom:10}}>
                <Button buttonStyle={{backgroundColor:'#FED330'}} titleStyle={{color:'#4B6584'}} title='Afficher uniquement pour ma zone'></Button>
            </View> */}
        <MapView style={{flex : 1}}
        backgroundColor='#FED330'
        initialRegion={{
        latitude: 48.856697 ,
        longitude: 2.351462,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
        }}>
        {markerToDisplay}
        {markerListToDisplay}
        </MapView>
    </View>

)
}


function mapStateToProps(state){
    return { tokenToDisplay : state.token, adressList : state.adresses}
}
export default connect(
    mapStateToProps,
    null
)(mapScreen);
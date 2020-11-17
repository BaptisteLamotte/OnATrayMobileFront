import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import {Header, Button} from 'react-native-elements'
import CardRestaurant from './CardRestaurant'
import MultiSelect from 'react-native-multiple-select';

const listePrix = [0, 1, 2]
const listeCuisines = ['francaise', 'italienne', 'japonaise', 'chinoise', 'healthy', 'viande', 'poisson', 'pizza', 'burger', 'vegetarienne', 'vegan' ]
const listeTypes = ['touristique', 'quartier', 'jeune', 'agée', 'familiale', 'business']
const listeAmbiances = ['calme', 'animé', 'branché', 'sobre']

const cookOption = [{id:'francaise',name:'francaise'},{id:'italienne',name:'italienne'},{id:'japonaise',name:'japonaise'},{id:'chinoise',name:'chinoise'},{id:'healthy',name:'healthy'},{id:'viande',name:'viande'},{id:'poisson',name:'poisson'},{id:'pizza',name:'pizza'},{id:'burger',name:'burger'},{id:'vegetarienne',name:'vegetarienne'},{id:'vegan',name:'vegan'}]
const ambianceOption = [{id:'calme', name : 'calme'},{id:'animé', name : 'animé'},{id:'branché', name : 'branché'},{id:'sobre', name : 'sobre'}]

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

function HomeTalentScreen (props) {
    const [seeIndicator, setSeeIndicator] = useState(false)
    const [zone, setZone] = useState(zoneFrance)
    const [restaurantList, setRestaurantList] = useState([])
    const [ambianceCochee, setAmbiancecochee] = useState(listeAmbiances)
    const [prixCoche, setPrixcoche] = useState(listePrix)
    const [typeCuisinecochee, setTypeCuisinecochee] = useState(listeCuisines)
    const [typeRestaurantcochee, setTypeRestaurantcochee] = useState(listeTypes)
    const [restoAAfficher, setRestoAAfficher] = useState({})
    const [talentWhishList, setTalentWhishList] = useState([])

    const [cookOptionchoosen, setCookOptionChoosen] = useState([])
    const [ambianceOptionChoosen, setAmbianceOptionChoosen] = useState([])

    const token = props.tokenToDisplay
    
    useEffect(() => {
        async function cherche(){
            setSeeIndicator(true)
            if(ambianceCochee==[]){
                setAmbiancecochee(listeAmbiances)
            }
            if(prixCoche ==[]){
                setPrixcoche(listePrix)
            }
            if(listeCuisines == []){
                setTypeCuisinecochee(listeCuisines)
            }
            if(typeRestaurantcochee == []){
                setTypeRestaurantcochee(listeTypes)
            }
           
            var criteres = JSON.stringify({ambiance: ambianceCochee, cuisine: typeCuisinecochee, prix: prixCoche, type:typeRestaurantcochee, zone:zone})
            var rawResponse = await fetch(`http://192.168.1.78:3000/talents/recherche-liste-restaurants`, {
                method:'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `token=${token}&restaurant=${criteres}`
            })
            var response = await rawResponse.json()

            setTalentWhishList(response.whishlist)
            setRestaurantList(response.liste)
            setSeeIndicator(false)
 
            var temptab= []
            for(let i=0;i<response.liste.length;i++){
                temptab.push(response.liste[i].adresselgtlat)
            }
            var adresse = []
            for(let i=0; i<temptab.length;i++){
               adresse.push(temptab[i].coordinates) 
            }
            var objAdress = []
            for(let i=0;i<adresse.length;i++){
                objAdress.push({lat:adresse[i][1], long:adresse[i][0], name :response.liste[i].name})
            }
            props.onSendAdresses(objAdress)       
        }
        cherche()
    }, [props.movementToDisplay])

    useEffect(() => {
        async function cherche(){
            setSeeIndicator(true)
            if(ambianceOptionChoosen.length == 0){
                setAmbiancecochee(listeAmbiances)
            }
            if(prixCoche ==[]){
                setPrixcoche(listePrix)
            }
            if(cookOptionchoosen.length == 0){
                setTypeCuisinecochee(listeCuisines)
            }
            if(typeRestaurantcochee == []){
                setTypeRestaurantcochee(listeTypes)
            }
            var criteres = JSON.stringify({ambiance: ambianceCochee, cuisine: typeCuisinecochee, prix: prixCoche, type:typeRestaurantcochee, zone:zone})
            var rechercheListe = await fetch(`http://192.168.1.78:3000/talents/recherche-liste-restaurants`, {
                method:'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `token=${token}&restaurant=${criteres}`
            })
            var response = await rechercheListe.json()
            setTalentWhishList(response.whishlist)
            setRestaurantList(response.liste)
            setSeeIndicator(false)

            var temptab= []
            for(let i=0;i<response.liste.length;i++){
                temptab.push(response.liste[i].adresselgtlat)
            }
            var adresse = []
            for(let i=0; i<temptab.length;i++){
               adresse.push(temptab[i].coordinates) 
            }
            var objAdress = []
            for(let i=0;i<adresse.length;i++){
                objAdress.push({lat:adresse[i][1], long:adresse[i][0], name :response.liste[i].name})
            }
            props.onSendAdresses(objAdress)
        }
        cherche()
    }, [ambianceCochee,cookOptionchoosen,typeRestaurantcochee, prixCoche, zone])
    

    var onCookOptionChange = (cookOptionchoosen) => {
        setCookOptionChoosen(cookOptionchoosen)
        setTypeCuisinecochee(cookOptionchoosen)
    }
    var onAmbianceOptionChange  = (ambianceOptionChoosen) => {
        setAmbianceOptionChoosen(ambianceOptionChoosen)
        setAmbiancecochee(ambianceOptionChoosen)
    }

    var restauList = restaurantList.map((e,i)=>{
        
        if(talentWhishList.includes(e._id)){
            var isLike = true
        }
        else{
            var isLike = false
        }
        return(
            <CardRestaurant key={i} image={e.photo} restaurant={e} isLike={isLike}/>
        )
    })
    if(seeIndicator){
        var viewToReturn = <ActivityIndicator style={{paddingTop:100}} size="large" color="#4B6584" />
    }else {
        var viewToReturn = <ScrollView >{restauList}</ScrollView> 
    }
    
    return (
        <View style={{flex:1, backgroundColor:'white'}}>
           <Header
            backgroundColor='#FED330'
            centerComponent={{ text: 'Rechercher', style: { color: '#4B6584' } }}
            /> 
            <MultiSelect
            uniqueKey="id"
            items={cookOption}
            selectedItems={cookOptionchoosen}
            onSelectedItemsChange={onCookOptionChange}
            submitButtonText='Fermer'
            tagRemoveIconColor="#4B6584"
            tagBorderColor="#4B6584"
            tagTextColor="#4B6584"
            selectedItemTextColor="#FED330"
            selectedItemIconColor="#FED330"
            itemTextColor="#4B6584"
            selectText='Type de cuisine'
            submitButtonColor="#FED330"
            searchInputPlaceholderText="Choisir un ou plusieurs"
            />
            <MultiSelect
            uniqueKey="id"
            items={ambianceOption}
            selectedItems={ambianceOptionChoosen}
            onSelectedItemsChange={onAmbianceOptionChange}
            submitButtonText='Fermer'
            tagRemoveIconColor="#4B6584"
            tagBorderColor="#4B6584"
            tagTextColor="#4B6584"
            selectedItemTextColor="#FED330"
            selectedItemIconColor="#FED330"
            itemTextColor="#4B6584"
            selectText="Type d'ambiance"
            submitButtonColor="#FED330"
            searchInputPlaceholderText="Choisir un ou plusieurs"
            />
            
            <View style={{display:'flex', justifyContent:'center', alignItems:'center', paddingTop:10}}>
            <Button onPress={()=>props.navigation.navigate('mapScreen')} buttonStyle={{backgroundColor:'#FED330'}} titleStyle={{color:'#4B6584'}} title='Voir sur la carte'></Button>
            </View>
            {viewToReturn}
        </View>
    )
}
function mapDispatchToProps(dispatch) {
    return {
      onSendAdresses: function(adresses){
          dispatch({type:'addAdresses',adresses})
      }
    }
  }

function mapStateToProps(state){
    return { tokenToDisplay : state.token, movementToDisplay : state.movement}
}

export default connect(
    mapStateToProps, 
    mapDispatchToProps
  )(HomeTalentScreen);

import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import {Header, Button} from 'react-native-elements'
import CardRestaurant from './CardRestaurant'

const listePrix = [0, 1, 2]
const listeCuisines = ['francaise', 'italienne', 'japonaise', 'chinoise', 'healthy', 'viande', 'poisson', 'pizza', 'burger', 'vegetarienne', 'vegan' ]
const listeTypes = ['touristique', 'quartier', 'jeune', 'agée', 'familiale', 'business']
const listeAmbiances = ['calme', 'animé', 'branché', 'sobre']

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

            var temprep = response.liste
        

        let restauList = []
        for(let i =0; i<response.whishlist.length;i++){
            if(response.whishlist.includes(temprep[i]._id)){
                restauList.push(temprep)
            }
        }

            
            var temptab= []
            for(let i=0;i<restauList.length;i++){
                temptab.push(restauList[0][i].adresselgtlat)
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
            props.onSendNavigationMemory({message : 'remember me'})
        }

        cherche()
    }, [props.movementToDisplay])

    var restauList = restaurantList.map((e,i)=>{
        
        if(talentWhishList.includes(e._id)){
            var isLike = true
            return(
                <CardRestaurant key={i} image={e.photo} restaurant={e} isLike={isLike}/>
            )
        }
        else{
            var isLike = false
        }
    })

    if(seeIndicator){
        var viewToReturn = <ActivityIndicator style={{paddingTop:100}} size="large" color="#4B6584" />
    }else {
        var viewToReturn = <ScrollView >{restauList}</ScrollView> 
    }


    return (
        <View>
           <Header
            backgroundColor='#FED330'
            centerComponent={{ text: 'Rechercher', style: { color: '#4B6584' } }}
            /> 
            <View style={{display:'flex', justifyContent:'center', alignItems:'center', paddingTop:10}}>
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

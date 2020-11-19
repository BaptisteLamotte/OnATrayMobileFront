import React, {useEffect, useState} from 'react'
import {connect} from 'react-redux'
import { StyleSheet, Text, View, ScrollView, ActivityIndicator } from 'react-native';
import {Header} from 'react-native-elements'
import MultiSelect from 'react-native-multiple-select';
import CardTalent from './CardTalent'

function HomeRestauScrenn (props) {

    const [seeIndicator, setSeeIndicator] = useState(false)

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
    const token = props.tokenToDisplay

    const [posterecherché,setposterecherché] = useState('tous les postes')
    const jobToChoose = [{d:"Serveur",name:'Serveur'},{id:"Chef de cuisine",name:'Chef de cuisine'},{id:"Comis",name:'Comis'},{id:"Runner",name:'Runner'},{id:'Manager', name:'Manager'}]
    const [jobChoosen, setJobChoosen] = useState([]);

    const [typedecontrat,settypedecontrat]=useState('Tous type de contrat')
    const contractToChoose = [{id:'CDD',name:'CDD'},{id:'CDI',name:'CDI'},{id:'Extra',name:'Extra'}]
    const [contractChoosen, setContractChosen] = useState([])

    
    const [zone, setZone] = useState(zoneFrance)

    const [wishlistRestaurantID,setwishlistRestaurantID]=useState([])
    const [talentToDisplay, setTalentToDisplay] = useState([])

    let talentTab=[{name:'Gérard Depardieu',url : 'http://res.cloudinary.com/dpyqb49ha/image/upload/v1604656987/yxxwniyub5pcrbqvw1s1.jpg'}]

    //UseEffect permettant l'affichage de la liste de talent ajouté en favoris
    useEffect(() => {

        async function loaddata(){
            setSeeIndicator(true)
        var criteres = JSON.stringify({posterecherché: posterecherché, zone:zone,typedecontrat:typedecontrat})
        var rawResponse = await fetch(`https://hidden-meadow-10798.herokuapp.com/restaurants/recherche-liste-talents`, {
            method:'POST',
            headers: {'Content-Type':'application/x-www-form-urlencoded'},
            body: `token=${token}&criteres=${criteres}`
        })
            var response = await rawResponse.json()
           
            setTalentToDisplay(response.liste)
            setwishlistRestaurantID(response.restaurantwishlistid)  
            setSeeIndicator(false)
        }
        loaddata()
         // En parametre le string venant du store et qui force le rechargement du composant
        },[props.movementToDisplay])

        //UseEffect permettant aux restaurant de trier leur recherche avec des filtres
        useEffect(()=>{
            async function cherche(){
                console.log('jobchoosen length',jobChoosen.length)
                    if (jobChoosen.length == 0){
                        setposterecherché('tous les postes')
                    }
                    if(contractChoosen.length==0){
                        settypedecontrat('Tous type de contrat')
                    }
                    console.log('post recherché',posterecherché)
        
            var criteres = JSON.stringify({posterecherché: posterecherché,typedecontrat:typedecontrat})
            var rechercheListe = await fetch(`https://hidden-meadow-10798.herokuapp.com/restaurants/recherche-liste-talents`, {
                method:'POST',
                headers: {'Content-Type':'application/x-www-form-urlencoded'},
                body: `token=${token}&criteres=${criteres}`
            })
                var response = await rechercheListe.json()
                console.log('response list',response.liste)
                setTalentToDisplay(response.liste)
                
            }
            cherche()
        },[posterecherché,typedecontrat])

        //Map sur les talents à afficher    
        var talentList = talentToDisplay.map((e,i)=>{
            if(wishlistRestaurantID.includes(e._id)){
                var isLike = true
                return(  
                    <CardTalent key={i} image={e.avatar} talent={e} wishlistRestaurantID={wishlistRestaurantID} token={token} isLike={isLike}/>
                )
            }
        })

        const onJobChoosenChange = (jobChoosen) => {
            setJobChoosen(jobChoosen);
            
          };
          const onContractChoosen = (contractChoosen) => {
            setContractChosen(contractChoosen);
           
          };

          if(seeIndicator){
            var viewToReturn = <ActivityIndicator style={{paddingTop:100}} size="large" color="#4B6584" />
        }else {
            var viewToReturn = <ScrollView >{talentList}</ScrollView> 
        }

    return (
        <View style={{flex:1, backgroundColor:'white'}}>
            <Header
            backgroundColor='#FED330'
            centerComponent={{ text: 'Mes favoris', style: { color: '#4B6584' } }}
            />
           {/* input permettant de filtré par type de metier  */}
            <MultiSelect
            uniqueKey="id"
            items={jobToChoose}
            selectedItems={jobChoosen}
            onSelectedItemsChange={onJobChoosenChange}
            submitButtonText="Choisir"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            selectText="Métier recherchés"
            searchInputPlaceholderText="Choisir un ou plusieurs"
            />
            {/* input permettant de filtré par type de contrat  */}
            <MultiSelect
            uniqueKey="id"
            items={contractToChoose}
            selectedItems={contractChoosen}
            onSelectedItemsChange={onContractChoosen}
            submitButtonText="Choisir"
            tagRemoveIconColor="#CCC"
            tagBorderColor="#CCC"
            tagTextColor="#CCC"
            selectedItemTextColor="#CCC"
            selectedItemIconColor="#CCC"
            itemTextColor="#000"
            selectText="Type de contrat"
            searchInputPlaceholderText="Choisir un ou plusieurs"
            />
            {viewToReturn}
        </View>
    )
}

function mapStateToProps(state){
    return { tokenToDisplay : state.token, movementToDisplay : state.movement}
}

export default connect(
    mapStateToProps, 
    null
  )(HomeRestauScrenn);
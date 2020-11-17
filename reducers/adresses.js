export default function(adresses={},action){
   
    if(action.type == 'addAdresses'){
        return action.adresses
    }
    else {
        return adresses 
    }
}
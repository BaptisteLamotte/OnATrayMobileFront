export default function(movement={},action){
   
    if(action.type == 'reloadData'){
        console.log(action.movement)
        return action.movement
    }
    else {
        return movement 
    }
}
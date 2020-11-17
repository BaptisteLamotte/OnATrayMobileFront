export default function(data={},action){
   
    if(action.type == 'addChatRoomData'){
        return action.data
    }
    else {
        return data 
    }
}
export default function(isConnect = {isRestau : false, isTalent : false}, action) {
  
    if(action.type == 'addConnect') {
      return action.isConnect;
    } else {
      return isConnect;
    }
}
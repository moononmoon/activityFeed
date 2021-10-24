import firestore from '@react-native-firebase/firestore';
export const ADD_FEED = 'ADD_FEED';
export const UPDATE_ACTIVITY = 'UPDATE_ACTIVITY';
export const DELETE_ACTIVITY = 'DELETE_ACTIVITY';

export const fetchFeeds = (newUsername, newMessage, newImageUri) => {
    return async (dispatch) => {
        if (newUsername) {
          const response = await firestore().collection("Feeds").add({
            username: newUsername, message: newMessage, imageUri: newImageUri
          });
            dispatch({ 
                type: ADD_FEED, feedData: {
                    id: response.id, username: newUsername, message: newMessage, imageUri: newImageUri
              }});
            return;
        }
        await firestore().collection("Feeds")
        .get().then(async(querySnapshot) => {          
          querySnapshot.forEach(async(doc) => {
            const { username, message, imageUri} = doc.data();
            dispatch({ 
              type: ADD_FEED, feedData: {
                  id: doc.id, username: username, message: message, imageUri: imageUri
            }});
          });
        });
    }}

export const updateActivity = (AId, newUsername, newMessage, newImageUri) => {
    return async (dispatch) => {
      firestore().collection('Feeds').doc(AId)
  .update({
    username: newUsername, message: newMessage, imageUri: newImageUri
  });
  dispatch({ 
    type: UPDATE_ACTIVITY, updateData: {
        id: AId, username: newUsername, message: newMessage, imageUri: newImageUri
}
});
    }
}

export const deleteActivity = (ActId) => {
  return async (dispatch) => { 
      try {
          const ref = firestore().collection('Feeds').doc(ActId);
          await ref.delete();
          dispatch({type: DELETE_ACTIVITY, deleteData: {id: ActId}});          
      } catch (err) {
          throw err;
      }
};
};
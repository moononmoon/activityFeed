/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

 import React, {useCallback, useState, useEffect } from 'react';
 import {createStore, combineReducers, applyMiddleware} from 'redux';
 import {Provider, useSelector, useDispatch} from 'react-redux';
 import ReduxThunk from 'redux-thunk';
 import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import feedReducer from './store/reducers';
import * as feedActions from './store/actions';
import {
  FlatList, TouchableOpacity, TextInput, Image, Button, 
  KeyboardAvoidingView, StyleSheet, Text, View, ScrollView,
} from 'react-native';


const rootReducer = combineReducers({
  feeds: feedReducer
});
const store = createStore(rootReducer, applyMiddleware(ReduxThunk));
const Item = ({ userName, message, imageUri, onSelect }) => (
  <TouchableOpacity onPress={onSelect}>
  <View style={styles.item}>
    <Image 
      style={styles.image} 
      resizeMode='contain'
      source={{ uri: imageUri}} />
    <Text style={styles.title}>{message}</Text>
  </View>
  </TouchableOpacity>
);

function HomeScreen({navigation}) {
  const feeds = useSelector(state => state.feeds.activities);
  const [isAdd, setIsAdd] = useState(false);
  const [userName, setUserName] = useState('');
  const [message, setMessage] = useState('');
  const [imageUri, setImageUri] = useState('');

  const dispatch = useDispatch();

  const loadFeeds = useCallback(async () => {
    try {
      dispatch(feedActions.fetchFeeds());
    } catch (err) {}
  });

  const addActivityHandler = useCallback(async () => {
    try {
      if (isAdd && userName !== '' && message !== '' && imageUri !== '') {
      setIsAdd(!isAdd)
      dispatch(feedActions.fetchFeeds(userName, message, imageUri));
      setImageUri('');
      setMessage('');
      setUserName('');
      return;
      }
      setIsAdd(!isAdd)
    } catch (err) {}
  },[dispatch, imageUri, setIsAdd, message,userName]);
  useEffect(() => {
    loadFeeds().then(() => {
    });
}, [dispatch, loadFeeds]);
  const renderItem = ({ item }) => (
    <Item 
      userName={item.username} 
      imageUri={item.imageUri}
      message={item.message}
    onSelect={() => {
      navigation.navigate('Details', {
        id: item.id,
        userName: item.username,
        imageUri: item.imageUri,
        message: item.message
      });
    }}/>
  );
  return (
    <KeyboardAvoidingView 
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={200}
      >
    <View>
      <FlatList style={{height: isAdd ? '60%' : '90%'}}
        data={feeds}
        renderItem={renderItem}
        keyExtractor={item => item.id}
      />
      <View>
        {isAdd && <View>
          <ScrollView>
      <TextInput
        style={styles.input}
        onChangeText={(userName) => {setUserName(userName)}}
        value={userName}
        multiline
        placeholder="user name"
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        onChangeText={(message) => {setMessage(message)}}
        value={message}
        multiline
        placeholder="message"
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        onChangeText={(imageUri) => {setImageUri(imageUri)}}
        value={imageUri}
        multiline
        placeholder="imageUri"
        keyboardType="default"
      />
            </ScrollView>

      </View>}
      <Button 
      title={`${isAdd ? "Save" : "Add Activity"}`}
      onPress={addActivityHandler}/>
      </View>

      </View>

      </KeyboardAvoidingView>
  );
};

function DetailsScreen({ route, navigation }) {
  const { id, imageUri, userName, message, otherParam } = route.params;
  const [newUserName, setNewUserName] = useState(userName);
  const [newMessage, setNewMessage] = useState(message);
  const [newImageUri, setNewImageUri] = useState(imageUri);
  const [isEdit, setIsEdit] = useState(false);
  const dispatch = useDispatch();

  const editActivityHandler = useCallback(async () => {
    try {

      dispatch(feedActions.updateActivity(id, newUserName, newMessage, newImageUri));
      setIsEdit(!isEdit);
    } catch (err) {}
  },[dispatch, newUserName, newImageUri,newMessage]);
  const deleteActivityHandler = useCallback(async () => {
    try {

      dispatch(feedActions.deleteActivity(id));
      navigation.goBack();
    } catch (err) {}
  },[dispatch]);

  return (
    <KeyboardAvoidingView 
      style={{flex: 1}}
      behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={90}
      >
    <View style={{ flex: 1, flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
      <View style={{height: '50%', width: '100%'}}>
      <ScrollView>

        <Image 
      style={{height: 200, width: '100%'}} 
      resizeMode='stretch'
      source={{ uri: newImageUri}} />
      <Text style={styles.title}>{newMessage}</Text>
      </ScrollView>

      </View>
    { isEdit && <View >
      <TextInput
        style={styles.input}
        onChangeText={(userName) => {setNewUserName(userName)}}
        value={newUserName}
        multiline
        placeholder="user name"
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        onChangeText={(message) => {setNewMessage(message)}}
        value={newMessage}
        multiline
        placeholder="message"
        keyboardType="default"
      />
      <TextInput
        style={styles.input}
        onChangeText={(imageUri) => {setNewImageUri(imageUri)}}
        value={newImageUri}
        multiline
        placeholder="imageUri"
        keyboardType="default"
      />
      <Button 
      title="Save Changes"
      onPress={editActivityHandler}/>
      </View>}
    <View style={{flexDirection: "row", paddingBottom: 20, alignContent: 'space-between'}}>
      <View style={{borderRightColor: 'black', borderRightWidth: 1}}><Button 
    title="Delete"
    onPress={deleteActivityHandler}/>
    </View>
    <View style={{borderLeftWidth: 1}}>
    <Button 
    title="Edit"
    onPress={() => {setIsEdit(!isEdit)}}/>
    </View>
    </View>
    </View>
    </KeyboardAvoidingView>
  );
}

const Stack = createNativeStackNavigator();
const App = () => {
  return (
    <Provider store={store}>
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Feed" component={HomeScreen} options={ navData => {
                return {
                  headerTitle: 'Activities'
                }}}/>
        <Stack.Screen name="Details" component={DetailsScreen} options={ navData => {
                return {
                  headerTitle: 'Activity Information'
                }}}/>
      </Stack.Navigator>
    </NavigationContainer>
    </Provider>
  );
};

const styles = StyleSheet.create({
  item: {
    backgroundColor: '#f9c2ff',
    padding: 20,
    flexDirection: 'row',
    marginVertical: 8,
    marginHorizontal: 16,
  },
  input: {
    fontSize: 20,
    height: 60,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
  title: {
    fontSize: 32,
    paddingLeft: 10
  },
//   container: {
//     flex: 1,
//     justifyContent: 'flex-start',
//     alignItems: 'center',
//     marginTop: 25,
// },
  // sectionDescription: {
  //   marginTop: 8,
  //   fontSize: 18,
  //   fontWeight: '400',
  // },
  // highlight: {
  //   fontWeight: '700',
  // },
  image: {
    height: 50,
    width: 50
  }
});

export default App;

/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React from 'react';
// import type {Node} from 'react';
import {
  Button,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  useColorScheme,
  View,
  FlatList,
  Alert,
  TouchableNativeFeedback,
} from 'react-native';

import {
  useState,
  useEffect
} from 'react';

import Realm from 'realm';
import { PersonSchema } from './db/schema';
import ItemView from './components/ItemView';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
// : Node
const Section = ({children, title}) => {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text
        style={[
          styles.sectionDescription,
          {
            color: isDarkMode ? Colors.light : Colors.dark,
          },
        ]}>
        {children}
      </Text>
    </View>
  );
};
// : () => Node
const App = () => {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  let realm = new Realm({schema:[PersonSchema],deleteRealmIfMigrationNeeded:true});

  const [textId, setTextId] = useState('');
  const [textName, setTextName] = useState('');
  const [personList,setPersonList] = useState([]);

  useEffect(() => {
  
    const getRealmInstance = async () => {
      try {
        realm = await Realm.open({
          path: 'myrealm',
          schema: [PersonSchema],
        });
      } catch (e) {
        console.log(e);
      }

    };

    getRealmInstance();

    // JSON.parse(JSON.stringify(
    try {
      const dbList = realm.objects('Persons');
    // setPersonList([])
      console.log("PersonList : ",dbList)
      setPersonList([...dbList])//personList.concat(dbList))

      //Change Listner ************
      // realm.addListener("change", onRealmChange);
      dbList.addListener(onPersonsChangeListner)
    } catch (error) {
      alert(error)
    }

    //Destructor ****************
    return () => {
      realm.removeAllListeners()
      dbList.removeAllListeners()
      realm.close();
    }
  },[])

  // function onRealmChange() {
  //   console.log("Something changed!");
  // }

  function onPersonsChangeListner(personsList,changes) {
    // Handle deleted Person objects
    changes.deletions.forEach((index) => {
      // You cannot directly access deleted objects,
      // but you can update a UI list, etc. based on the index.
      const temp = [...personsList];
      // removing the element using splice
      temp.splice(index, 1);
      setPersonList(temp)
      console.log(`Looks like Person #${index} has left the realm.`);
    });
    // Handle newly added Person objects
    changes.insertions.forEach((index) => {
      const insertedPerson = personsList[index];
      setPersonList((currentItems) => [...currentItems,insertedPerson])
      console.log(`Welcome our new friend, ${insertedPerson.name}!`);

    });
    // Handle Person objects that were modified
    changes.modifications.forEach((index) => {
      const modifiedPerson = personsList[index];
      console.log(`Hey ${modifiedPerson.name}, you look different!`);
    });
  }

  function onTextIdChanged(enteredText) {
    setTextId(enteredText)
  }
  function onTextNameChanged(enteredText) {
    setTextName(enteredText) 
  }

  function onAddPerson() {
      // setPersonList((currentItem) => [... currentItem,textName])
      // {id: textId, name: textName}

      try {
        if(textId == '' || textName == '') {
          alert('ID or Name Cant be Empty!')
        } else {
          realm.write(() => {
            realm.create('Persons', {
              id: textId,
              name: textName,
              age: textId,
            });
          });
  
          setTextId('')
          setTextName('')
        }
      } catch (error) {
        alert(error)
      }
      // setPersonList(personList.concat(JSON.parse(JSON.stringify(realm.objectForPrimaryKey('Persons', textId))))) 

      // console.log("Real Name",JSON.parse(JSON.stringify(realm.objectForPrimaryKey('Persons',textId))))
  }

  function incrementID() {
    const lastUser = realm.objects(personList.get()).sorted('id', true)[0];
    const highestId = lastUser == null ? 0+1 : lastUser.id+1;
    return highestId
  }

  function onUpdatePerson() {
    try {
      if(textId == '' || textName == '') {
        alert('ID or Name Cant be Empty!')
      } else {
        realm.write(() => {
          realm.create('Persons', {
            id: textId,
            name: textName,
            age: textId,
          },
          "modified");
        });

        setTextId('')
        setTextName('')
      }
    } catch (error) {
      alert(error)
    }
  }

  function onSearchPerson() {
    try {
      const query = "name BEGINSWITH[c] '"+textName+"'";
      console.log("Query : ",query)
      const searchList = realm.objects('Persons').filtered(query);
      console.log("SearchList : ",searchList)
      setPersonList([...searchList])

    } catch (error) {
      alert(error)
    }
  }

  function onCrossClicked(item) {

    Alert.alert("Delete!","Are you Sure to Delete This Person?",
    [
      {
        text: 'Yes',
        onPress: () => {
          DeleteItemFromDB(item);
        }
      },
      {
        text: 'No',
        onPress: () => {}
      }
    ])
    
  }

  function DeleteItemFromDB(item) {
    console.log("Click", item)
    try {
      realm.write(() => {
        // Delete all instances of Cat from the realm.
        // realm.delete(realm.objects("Cat"));
        realm.delete(item);
      });
    } catch (error) {
      alert(error)
    }
  }

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      {/* <ScrollView */}
        {/* contentInsetAdjustmentBehavior="automatic"
        style={backgroundStyle}> */}
        <Header />
        <View>
        <TextInput style = {styles.inputText}
          placeholder='Enter ID'
          keyboardType='numeric'
          maxLength={10} 
          value = {textId}
          onChangeText={onTextIdChanged}/>
        <TextInput style = {styles.inputText}
          placeholder ='Enter Name' 
          value = {textName}
          onChangeText={onTextNameChanged}/>
        </View>

        <View style = {{margin:10,width:'90%',flexDirection: 'row', justifyContent: 'space-around'}}>
          <View style={styles.buttonStyle}>
            <Button title='Add' onPress={() => onAddPerson()}></Button>
          </View>
          <View style={styles.buttonStyle}>
            <Button title='Update' onPress={() => onUpdatePerson()}></Button>
          </View>
          <View style={styles.buttonStyle}>
            <Button title='Search' onPress={() => onSearchPerson()}></Button>
          </View>
        </View>

        <View style={styles.subContainer}>
          <FlatList 
            data={personList}
            renderItem = {(itemData) => {
              // console.log("Item: ",itemData.item.id +" "+ itemData.item.name);
              return <TouchableNativeFeedback>
                      <ItemView person = {itemData}
                          onclick = {() => onCrossClicked(itemData.item)}
                          />
                  </TouchableNativeFeedback>
              // <Text style = {styles.textList}>{itemData.item.id + " : " + itemData.item.name}</Text>
            }}
            keyExtractor = {(item,index) => {
              return index;
            }}
            alwaysBounceVertical={false}
            />
      </View>
        
        {/* <View
          style={{
            backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          <Section title="Step One" children="Children One">
            Edit <Text style={styles.highlight}>App.js</Text> to change this
            screen and then come back to see your edits.
          </Section>
          <Section title="See Your Changes">
            <ReloadInstructions />
          </Section>
          <Section title="Debug">
            <DebugInstructions />
          </Section>
          <Section title="Learn More">
            Read the docs to discover what to do next:
          </Section>
          <LearnMoreLinks />
        </View> */}
      {/* </ScrollView> */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  inputText: {
    width:'70%',
    borderWidth:2,
    borderColor:'red',
    padding:10,
    margin:10
  },
  subContainer:{
    margin:10,
    padding:10,
    paddingBottom: 30,
    color: 'red',
    borderWidth: 2,
    borderColor: 'green',
    height:250,
  },
  textList: {
    margin: 10,
    color:'black',
  },
  buttonStyle: {
    width: '25%'
  }
});

export default App;

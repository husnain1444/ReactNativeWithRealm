import {StyleSheet,View,Text, Image, Pressable, TouchableOpacity} from 'react-native';
import React from 'react';
import { defaultColors } from '../utils/defaultColors';
import { crossImage } from '../images/crossImage';

export default function ItemView(props) {
    // console.log("String", props.person)

    return(
        <TouchableOpacity activeOpacity={.5}>
          <View style = {styles.subContainer}>

              <View style = {{width: '88%'}}>
                  <Text style={styles.textSubItem}>{"(" + props.person.item.id + ") " + "Name: " + props.person.item.name}</Text>
              </View> 

              <Pressable onPress={() => props.onclick()}>
                  <Image 
                  style = {styles.imageStyle} 
                  source={ crossImage } //{require('./my-icon.png')}
                  />
              </Pressable>
          </View>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    subContainer:{
        height: 50,
        borderColor: '#cccc',
        borderWidth: 2,
        borderRadius: 10,
        marginBottom: 5,
        marginTop: 5,
        backgroundColor: defaultColors.appBgLight,
        flexDirection: 'row',
        alignItems: 'center',
        // backgroundColor: 'red'
      },
    textItem: {
        marginLeft:10,
        // borderRadius:10,
        // backgroundColor: '#777777',
        color: 'white',
        fontSize: 20,
      },
      textSubItem: {
        marginLeft:10,
        // borderRadius:10,
        // backgroundColor: '#777777',
        color: 'white',
      },
      imageStyle: {
        width: 25,
        height: 25,
        alignItems: 'flex-end',
        alignContent: 'flex-end',
      },
}) ;
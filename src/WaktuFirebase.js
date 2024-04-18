/* 

Fetch
1. Jakim Location         - WaktuSolat / Setting
2. Fetch Waktu            - WaktuSolat / Setting / Activity
3. Fetch Waktu's Activity - WaktuSolat / Activity

Editing Firebase
1. Add                    - Activity
2. Update                 - Activity
3. Delete                 - Activity

*/

import { firestore } from "../config";
import { collection, doc, getDoc, getDocs, where } from 'firebase/firestore';
import { View, Text, FlatList, StyleSheet, Pressable, TouchableOpacity, ImageBackground, ScrollView, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import styles from "./styles";
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SumTwoValues } from "./SumTwoValues";

const FetchWaktu = ({waktuField}) => {
    const navigation = useNavigation();

    // Collection = Ipan, Ina, ...
    const [collectionName, setCollectionName] = useState('');
    const [users, setUsers] = useState([]);

    // Waktu Firebase Field
    const [waktuF, setWaktuField] = useState(waktuField);

// Get Current Username
    useEffect(() => {
        const getUsername = async () => {
          try {
            const username = await AsyncStorage.getItem('username');
            if (username) {
              setCollectionName(username);
              const unsubscribe = firestore
                .collection(username)
                .where('waktuTitle', '==', waktuF)
                .onSnapshot((querySnapshot) => {
                  const documents = [];
                  querySnapshot.forEach((doc) => {
                    const data = doc.data();
                    documents.push({
                      id: doc.id,
                      ...data,
                    });
                  });
                  setUsers(documents);
                });
            } else {
              console.log('No username stored.');
            }
          } catch (error) {
            console.error('Error retrieving username:', error);
          }
        };
      
        getUsername();
    }, []);

// Get Current User's Data
    const retrieveAllData = async () => {
        try {
            if (!collectionName) {
                return;
            }
          
            const collectionRef = collection(firestore, collectionName);
            const querySnapshot = await getDocs(collectionRef);
            const documents = [];

            querySnapshot.forEach((doc) => {
            const data = doc.data();
            if (data.waktuTitle === waktuF) {
                documents.push(data);
            }
            });

            setUsers(documents);

        } catch (error) {
            console.error('Error retrieving documents:', error);
        }
      };
    useEffect(() => {
        retrieveAllData();
    }, [waktuF, collectionName]);

    const ActivityPage = (item) => {
      console.log("old page");
      if (item.waktuTitle) {
        navigation.navigate('Activity Screen', { username: collectionName, users: item });
      } else {
        Alert.alert(
          'Where are you?',
          'You must set location first.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
      }
      };
    
    const NewPage = (item) => {
      console.log("new page");
      if (item) {
      navigation.navigate('Activity Screen', { username: collectionName, users: {waktuTitle: item.waktuTitle, waktuTime: item.waktuTime, waktuNegeri: item.waktuNegeri, waktuZon: item.waktuZon }});
      } else {
        Alert.alert(
          'Missing Data',
          'You must set location first.',
          [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
        );
      }
    };

    return (
      <View style={[styles.container6]}>
        <Text></Text>
    
        <ScrollView>
          {users.map((item, index) => {
            const [waktuHour, waktuMinute] = item.waktuTime.split(':');
            const calculatedTime = SumTwoValues(0, item.triggerTime, "AM", waktuHour, waktuMinute, "AM");
            if (!item.triggerTitle) {
              return null; // Skip rendering this item
            }
        
            return (
              <Pressable
                key={index}
                style={[styles.container3, { width: '101%', marginLeft: -10, justifyContent: 'space-between', alignContent: 'space-between', padding: 12, borderRadius: 0, height: 50, margin: 5 }]}
                onPress={() => ActivityPage(item)}>
        
                <Text style={[styles.textSmall, { color: "black", fontSize: 17, width: 190, alignSelf: 'flex-start', textAlign: 'left', paddingLeft: 10 }]}>
                  {item.triggerTitle}
                </Text>
        
                <Text style={[styles.textSmall, { color: "#e2c675", fontSize: 16, textAlign: 'right', textShadowColor: "#000", textShadowOffset: { width: 1, height: 1 }, textShadowRadius: 1, paddingRight: 3 }]}>
                  {calculatedTime.calcHour}:{calculatedTime.calcMinuteInDoubleDigitValue} {calculatedTime.calcAmPm} {'\u00A0'}
                </Text>
        
              </Pressable>
            );
          })}
        </ScrollView>
    
        <Pressable
          style={[styles.button, {margin:10}]}
          onPress={() => NewPage(users[0])}>
          <Text>Create</Text>
        </Pressable>
    
      </View>
    );
}

const FetchImsak = () => {
  const waktuField = "imsak"; // Create an object with 'name' property
  return (
    <FetchWaktu waktuField={waktuField} />
  );
};

const FetchSubuh = () => {
    const waktuField = "subuh"; // Create an object with 'name' property
    return (
      <FetchWaktu waktuField={waktuField} />
    );
  };

  const FetchSyuruk = () => {
    const waktuField = "syuruk"; // Create an object with 'name' property
    return (
      <FetchWaktu waktuField={waktuField} />
    );
  };
  
  const FetchZohor = () => {
    const waktuField = "zohor"; // Create an object with 'name' property
    return (
      <FetchWaktu waktuField={waktuField} />
    );
  };
  
  const FetchAsar = () => {
    const waktuField = "asar"; // Create an object with 'name' property
    return (
      <FetchWaktu waktuField={waktuField} />
    );
  };
  
  const FetchMaghrib = () => {
    const waktuField = "maghrib"; // Create an object with 'name' property
    return (
      <FetchWaktu waktuField={waktuField} />
    );
  };
  
  const FetchIsyak = () => {
    const waktuField = "isyak"; // Create an object with 'name' property
    return (
      <FetchWaktu waktuField={waktuField} />
    );
  };


  export {FetchImsak, FetchSubuh, FetchSyuruk, FetchZohor, FetchAsar, FetchMaghrib, FetchIsyak};
import React, { useState, useEffect } from 'react';
import { View, TextInput, TouchableOpacity, Text, ImageBackground, SafeAreaView } from 'react-native';
import { auth } from '../config';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles';
import { firestore } from '../config';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = () => {
  const navigation = useNavigation();

  const [username, setUsername] = useState('');
  const [email, setEmail] = useState(username + "@solatTime.com");
  const [password, setPassword] = useState('');

// Login 
  const handleLogin = () => {
    // (Ipan , 000000)
    auth
    .signInWithEmailAndPassword(email, password)
    .then(async (userCredentials) => {
      const user = userCredentials.user;
      const storedUsername = await AsyncStorage.getItem('username');

      console.log("Who was the previous user? ", storedUsername);
      // Clear the storedUsername from AsyncStorage
      await AsyncStorage.removeItem('username');
      await AsyncStorage.setItem('username', username); // Store the new username in AsyncStorage
      console.log("Logged in as : ", username);
      navigation.replace('Waktu Solat Screen');
    })
    .catch((error) => alert(error.message));
};

// Register
  const handleRegister = () => {  
    setEmail(username + "@solatTime.com");
    auth
        .createUserWithEmailAndPassword(email, password, username)
        .then(userCredentials => {
            const user = userCredentials.user;

            AsyncStorage.setItem('username', username)
          .then(() => {
            console.log('Username stored successfully.');
            alert(`${username} has registered successfully. Please use the login button to enter :)`);
          })
          .catch(error => console.error('Error storing username:', error));
        })
        .catch(error => alert(error.message));

    firestore.collection(username).add({})
    .then((docRef) => {
      console.log(`Collection "${username}" created with ID: ${docRef.id}`);
    })
    .catch((error) => {
      console.error('Error creating collection:', error);
    });
  };

//
  const storeUsername = async (username) => {
    try {
      await AsyncStorage.setItem('username', username);
      console.log('Username stored successfully.');
    } catch (error) {
      console.error('Error storing username:', error);
    }
  };

  return (
    <SafeAreaView style={styles.background}>
        <ImageBackground
        source={require('../images/waktu_bg.png')}
        style={styles.imageBackground}
        resizeMode='stretch'>
         <View style={[styles.inviContainer, {flex: 1, justifyContent:'center', alignItems: 'center'}]}>
            <View style={styles.inputContainer2}>
                <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={(text) => {
                  setUsername(text);
                  setEmail(text + "@solatTime.com");
                }}
                />
                <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry={true}
                onChangeText={(text) => setPassword(text)}
                />
            </View>

          <View style={[{flexDirection:'row'}]}>
            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={handleRegister}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
      </SafeAreaView>
  );
};

export default LoginScreen;
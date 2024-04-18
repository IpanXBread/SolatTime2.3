import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Text, Modal, StyleSheet } from 'react-native';
import { Audio } from 'expo-av';
import styles from './styles';
import * as FileSystem from 'expo-file-system';

// if its hard to make it choose between 3 azans, just make it only have 1 option
// then choose between turn it on or turn it off

const RingtoneManager = () => {
  const [soundObject, setSoundObject] = useState(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const playRingtone = async () => {
    let ringtonePath = ''; // Replace with your ringtone path

    switch (selectedOption) {
      case 'Mexican Cat':
        ringtonePath = require('./ringtones/mexicoCatto.mp3');
        break;
      case 'Azan - Short Version':
        ringtonePath = require('./ringtones/AzanShort.mp3');
        break;
      case 'Azan - Long Version':
        ringtonePath = require('./ringtones/AzanLong.mp3');
        break;
      default:
        return;
    }

    try {
      // Stop currently playing sound if exists
      if (soundObject) {
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
      }

      const sound = new Audio.Sound();
      await sound.loadAsync(ringtonePath);
      await sound.playAsync();
      setSoundObject(sound);
    } catch (error) {
      console.log('Error playing ringtone:', error);
      Alert.alert('Error', 'No ringtone found');
    }
  };

  const stopRingtone = async () => {
    try {
      if (soundObject) {
        await soundObject.stopAsync();
        await soundObject.unloadAsync();
        setSoundObject(null);
      }
    } catch (error) {
      console.log('Error stopping ringtone:', error);
    }
  };

  const handleOpenDrawer = () => {
    setIsDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerOpen(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    handleCloseDrawer();
  };
  
  const azanOptions = ['Azan - Short Version', 'Azan - Long Version', 'Mexican Cat'];

  return (
    <View>
      <Text style={[styles.text, { paddingTop: 15, paddingLeft: 20, paddingBottom: 3 }]}>
        Azan Setting
      </Text>
      <View style={[styles.container, { backgroundColor: 'rgba(255, 255, 255, 0.3)', padding: 10 }]}>
        <Text>Selected Azan: {selectedOption}</Text>
        <TouchableOpacity style={[styles.container3, { width: 'auto' }]} onPress={playRingtone}>
          <Text>Play</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.container3, { width: 'auto' }]} onPress={stopRingtone}>
          <Text>Stop</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            backgroundColor: '#ccc',
            padding: 10,
            marginTop: 10,
            alignItems: 'center',
          }}
          onPress={handleOpenDrawer}
        >
          <Text>Choose..</Text>
        </TouchableOpacity>

        <Modal
          visible={isDrawerOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={handleCloseDrawer}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={[{fontSize:18,paddingLeft:10, textDecorationLine:'underline'}]}>Azan Options</Text>
              {azanOptions.map((option, index) => (
                <TouchableOpacity
                  key={index}
                  style={styles.drawerOption}
                  onPress={() => handleOptionSelect(option)}
                >
                  <Text style={[{padding:5, backgroundColor:'lightgray', margin:3, fontSize:16, borderRadius:10}]}>• {option}</Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={styles.drawerOption} onPress={handleCloseDrawer}>
                <Text style={[{color:'red', paddingTop:10, fontSize:15}]}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </View>
  );
};

export default RingtoneManager;
import React, { useState } from 'react';
import { TouchableOpacity, Vibration, Text, View } from 'react-native';
import styles from './styles';
import Slider from '@react-native-community/slider';

const VibrateManager = () => {
  const [vibrationDuration, setVibrationDuration] = useState(500);

  const handleVibration = () => {
    Vibration.vibrate(vibrationDuration);
  };

  const handleSliderChange = (value) => {
    setVibrationDuration(value);
  };

  return (
    <View>
      <Text style={[styles.text, {paddingTop:15, paddingLeft:20, paddingBottom:3}]}>Vibrate Setting</Text>
      <View style={[styles.container, {backgroundColor:'rgba(255, 255, 255, 0.3)', padding:10}]}>
        <Slider
          minimumValue={100}
          maximumValue={2000}
          step={100}
          value={vibrationDuration}
          onValueChange={handleSliderChange}
          style={{ margin: 5 }}
        />
      <Text style={{ textAlign: 'center', paddingBottom:5 }}>Duration: {vibrationDuration}ms</Text>
      <TouchableOpacity style={[styles.smallerButton, {width:125, alignSelf:'center'}]} onPress={handleVibration}>
        <Text style={[styles.text, {}]}>Test Vibrate</Text>
      </TouchableOpacity>
      </View>
    </View>
  );
};

export default VibrateManager;
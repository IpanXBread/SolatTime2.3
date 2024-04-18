import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Switch, Alert, ImageBackground, ScrollView } from 'react-native';
import styles from '../src/styles';
import { useNavigation } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import { SumTwoValues } from '../src/SumTwoValues';
import Icon from 'react-native-vector-icons/Ionicons';
import { firestore } from "../config";

export default function ActivityScreen({ route }) {

  const navigation = useNavigation();
  const { users } = route.params || {};
  const { username } = route.params || {};

  TheTimeValue = users.triggerTime || 0;

  const [title, setTitle] = useState(users?.triggerTitle || '');
  const [time, setTime] = useState(users?.triggerTime || '0');
  const [turn, setTurn] = useState(users?.triggerTurn || true);
  const [waktuTitle, setWaktuTitle] = useState(users?.waktuTitle || '0');
  const [waktuTime, setWaktuTime] = useState(users?.waktuTime || '0');
  const [waktuNegeri, setWaktuNegeri] = useState(users?.waktuNegeri || '0');
  const [waktuZon, setWaktuZon] = useState(users?.waktuZon || '0');

  const [clockView, setClockView] = useState('Shifting');
  const buttonView = users.triggerTitle ? 'Update' : 'Create';
  const [differences, setDifferences] = useState(TheTimeValue > 0 ? 'after' : 'before');

  let [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
  let [currentHour, currentMinute, currentAmPm] = currentTime.split(/[:\s]/);
  let [hourWaktu, minuteWaktu] = users.waktuTime ? users.waktuTime.split(':').map(Number) : [0, 0];

  waktuPLUStime = SumTwoValues(hourWaktu, minuteWaktu, "AM", 0, TheTimeValue, "");
  shiftingValue = SumTwoValues(0, TheTimeValue, "", 0, 0, "");
  waktuValue = SumTwoValues(hourWaktu, minuteWaktu, "AM", 0, 0, "");
  currentValue = SumTwoValues(currentHour, currentMinute, currentAmPm, 0, 0, "");
  inputTOcurrent = SumTwoValues(waktuPLUStime.calcHour, waktuPLUStime.calcMinute, waktuPLUStime.calcAmPm, currentHour, currentMinute, currentAmPm);

  let [clockHour, setClockHour] = useState(waktuPLUStime.calcHour || '00'); 
  let [clockMinute, setClockMinute] = useState(waktuPLUStime.calcMinuteInDoubleDigitValue || '00');
  console.log("inputToCurrent's 6 value are : ");
  console.log("waktuPLUStime.calcHour :", waktuPLUStime.calcHour);
  console.log("waktuPLUStime.calcMinute :", waktuPLUStime.calcMinute);
  console.log("waktuPLUStime.calcAmPm :", waktuPLUStime.calcAmPm);
  console.log("currentHour :", currentHour);
  console.log("currentMinute :", currentMinute);
  console.log("currentAmPm :", currentAmPm);

  console.log("Then, we get inputTOcurrent's value of :");
  console.log("inputTOcurrent.calcHourRingsIn :", inputTOcurrent.calcHourRingsIn);
  console.log("Math.abs(inputTOcurrent.calcHourRingsIn) :", Math.abs(inputTOcurrent.calcHourRingsIn));
  console.log("Math.abs(inputTOcurrent.calcHourRingsIn)+h :", Math.abs(inputTOcurrent.calcHourRingsIn) + "h");
  
  let [hour, setHour] = useState(Math.abs(inputTOcurrent.calcHourRingsIn) !== 0 ? Math.abs(inputTOcurrent.calcHourRingsIn) + "h" : '');
  let [minute, setMinute] = useState(Math.abs(inputTOcurrent.calcMinuteRingsIn) + "m" || ''); //Doesnt work if the input time has passed the current time
  let [shiftingHour, setShiftingHour] = useState(shiftingValue.calcShiftingHour !== 0 ? Math.abs(shiftingValue.calcShiftingHour) + "h" : '');
  let [shiftingMinute, setShiftingMinute] = useState(shiftingValue.calcShiftingMinute !== 0 ? Math.abs(shiftingValue.calcShiftingMinute) + "m" : ''); 
  let [AmPm, setAmPm] = useState(waktuPLUStime.calcAmPm);

  // REPEATING CALCULATION
  useEffect(() => {
    setHour(Math.abs(inputTOcurrent.calcHourRingsIn) !== 0 ? Math.abs(inputTOcurrent.calcHourRingsIn) + "h" : '');
    setMinute(Math.abs(inputTOcurrent.calcMinuteRingsIn) + "m" || '');

    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1000);

    return () => clearInterval(timer);
  }, [currentHour, currentMinute]);

// CREATE
  const handleButtonCreate = async () => {
    console.log("create!");
    if (title.trim() === '') {
      Alert.alert('Error', 'Please enter a valid activity name.');
      return;
    }

    await firestore.collection(username).add({
      triggerTitle: title,
      triggerTime: time,
      triggerTurn: turn, 
      waktuTitle: users.waktuTitle,
      waktuTime: users,waktuTime,
      waktuNegeri: users.waktuNegeri,
      waktuZon: users.waktuZon,
    });
    Alert.alert("Success", "Document created successfully!");
    navigation.navigate('Waktu Solat Screen');
  }

// UPDATE
  const handleButtonUpdate = async () => {
     console.log("update!");
     if (users.triggerTitle !== title) {
      const snapshot = await firestore.collection(username).where('triggerTitle', '==', users.triggerTitle).get();
      snapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
  
      await firestore.collection(username).add({
        triggerTitle: title,
        triggerTime: time,
        triggerTurn: turn, 
        waktuTitle: users.waktuTitle,
        waktuTime: users,waktuTime,
        waktuNegeri: users.waktuNegeri,
        waktuZon: users.waktuZon,
      });
      Alert.alert("Success", "Document created successfully!");
      navigation.navigate('Waktu Solat Screen');
    } else {
      const snapshot = await firestore.collection(username).where('triggerTitle', '==', title).get();
      snapshot.forEach(async (doc) => {
        await doc.ref.delete();
      });
  
      await firestore.collection(username).add({
        triggerTitle: title,
        triggerTime: time,
        triggerTurn: turn, 
        waktuTitle: users.waktuTitle,
        waktuTime: users,waktuTime,
        waktuNegeri: users.waktuNegeri,
        waktuZon: users.waktuZon,
      });
      Alert.alert("Success", "Document created successfully!");
      navigation.navigate('Waktu Solat Screen');
    }
  }

// DELETE
  const handleButtonDelete = async () => {
    const snapshot = await firestore.collection(username).where('triggerTitle', '==', title).get();
    if (snapshot.empty) {
      Alert.alert('Error', 'Document with the given title does not exist.');
    } else {
      Alert.alert(
        'Confirmation',
        'Are you sure you want to delete this document?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              const doc = snapshot.docs[0];
              await firestore.collection(username).doc(doc.id).delete();
              Alert.alert('Success', 'Document deleted successfully!');
              navigation.navigate('Waktu Solat Screen');
            },
          },
        ]
      );
    }
  }

// ADJUSTING HOUR  
const handleClockHourChange = (passHour) => {
  setClockHour(passHour); 

  inputMINUSwaktu = SumTwoValues(passHour, clockMinute, AmPm, -hourWaktu, -minuteWaktu, "-AM");
  shiftingValue = SumTwoValues(0, inputMINUSwaktu.calcTotalMinute, "", 0, 0, "");
  inputTOcurrent = SumTwoValues(passHour, clockMinute, AmPm, currentHour, currentMinute, currentAmPm);

  setTime(inputMINUSwaktu.calcTotalMinute);
  setHour(Math.abs(inputTOcurrent.calcHourRingsIn) !== 0 ? Math.abs(inputTOcurrent.calcHourRingsIn) + "h" : '');
  setMinute(Math.abs(inputTOcurrent.calcMinuteRingsIn) + "m" || ''); 
  setShiftingHour(shiftingValue.calcShiftingHour !== 0 ? Math.abs(shiftingValue.calcShiftingHour) + "h" : ''); 
  setShiftingMinute(shiftingValue.calcShiftingMinute !== 0 ? Math.abs(shiftingValue.calcShiftingMinute) + "m" : ''); 
  if (inputMINUSwaktu.calcTotalMinute > 0) { setDifferences('after'); }
  else { setDifferences('before'); }
}
  
// ADJUSTING MINUTE
const handleClockMinuteChange = (passMinute) => {                
  setClockMinute(passMinute.toString().padStart(2, '0'));

  inputMINUSwaktu = SumTwoValues(clockHour, passMinute, AmPm, -hourWaktu, -minuteWaktu, "-AM");
  shiftingValue = SumTwoValues(0, inputMINUSwaktu.calcTotalMinute, "", 0, 0, "");
  inputTOcurrent = SumTwoValues(clockHour, passMinute, AmPm, currentHour, currentMinute, currentAmPm); 

  setTime(inputMINUSwaktu.calcTotalMinute);
  setHour(Math.abs(inputTOcurrent.calcHourRingsIn) !== 0 ? Math.abs(inputTOcurrent.calcHourRingsIn) + "h" : '');
  setMinute(Math.abs(inputTOcurrent.calcMinuteRingsIn) + "m" || ''); 
  setShiftingHour(shiftingValue.calcShiftingHour !== 0 ? Math.abs(shiftingValue.calcShiftingHour) + "h" : ''); 
  setShiftingMinute(shiftingValue.calcShiftingMinute !== 0 ? Math.abs(shiftingValue.calcShiftingMinute) + "m" : '');
  if (inputMINUSwaktu.calcTotalMinute > 0) { setDifferences('after'); }
  else { setDifferences('before'); }

}

// ADJUSTING AM/PM
const handleAmPm = (AmPm) => {
    
  const updatedAmPm = AmPm === 'AM' ? 'PM' : 'AM';
  setAmPm(updatedAmPm);

  inputMINUSwaktu = SumTwoValues(clockHour, clockMinute, updatedAmPm, -hourWaktu, -minuteWaktu, "-AM"); // time = input - waktu
  shiftingValue = SumTwoValues(0, inputMINUSwaktu.calcTotalMinute, "", 0, 0, "");
  inputTOcurrent = SumTwoValues(clockHour, clockMinute, updatedAmPm, currentHour, currentMinute, currentAmPm); // {hour} = input to current

  setTime(inputMINUSwaktu.calcTotalMinute);
  setHour(Math.abs(inputTOcurrent.calcHourRingsIn) !== 0 ? Math.abs(inputTOcurrent.calcHourRingsIn) + "h" : '');
  setMinute(Math.abs(inputTOcurrent.calcMinuteRingsIn) + "m" || ''); 
  setShiftingHour(shiftingValue.calcShiftingHour !== 0 ? Math.abs(shiftingValue.calcShiftingHour) + "h" : ''); 
  setShiftingMinute(shiftingValue.calcShiftingMinute !== 0 ? Math.abs(shiftingValue.calcShiftingMinute) + "m" : '');
  if (inputMINUSwaktu.calcTotalMinute > 0) { setDifferences('after'); }
  else { setDifferences('before'); } 

}

  const handleNow = async () => {
  }

  const handleWaktu = async () => {

  }

  const handleClockView = () => {
    switch (clockView) {
      case 'Alarm':
        setClockView('Shifting');
        break;
      case 'Shifting':
        setClockView('Clock');
        break;
      case 'Clock':
        setClockView('Alarm');
        break;
      default:
        setClockView('Shifting');
        break;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../images/activity_bg.png')}
        style={styles.imageBackground}
        resizeMode='stretch'>

      {/* <TouchableOpacity onPress={handleBackButton} style={[styles.createButton, {height:50, width:50, flexDirection:'row'}]}>
        <Icon name="arrow-back" size={24} color="#e2c675" />
      </TouchableOpacity> */}
      
        <Text style={[styles.text, {paddingTop:10, paddingBottom:20, alignSelf:'center', color:'#e2c675'}]}>{username?.charAt(0).toUpperCase() + username?.slice(1)}.</Text>

        <View style={[styles.inviContainer, {flex: 1, justifyContent:'center', alignItems: 'center'}]}>
       
          

          <TouchableOpacity style={[styles.container3, {backgroundColor: 'rgba(255, 255, 255, 0.1),', alignSelf:'center', width:175, marginTop: 75, height:75, alignContent:'center', flexDirection:'column'}]} onPress={handleClockView}>
        {clockView === 'Shifting' && (
          <>
            <Text style={[styles.textSmall, {color: 'lightgray', fontSize:13}]}>Shifting</Text>
            <Text style={[styles.text, {alignSelf:'center', fontSize:15, fontWeight:'bold'}]}>{shiftingHour} {shiftingMinute}</Text>
            <Text style={[styles.textSmall, {color: 'lightgray', fontSize:13}]}>
            <Text style={[styles.textSmall, {fontSize: 12, color: differences === 'before' ? 'pink' : 'lightblue', textDecorationLine:'underline'}]}>{differences}</Text> {users?.waktuTitle}</Text>
          </>
        )}
        {clockView === 'Alarm' && (
          <>
            <Text style={[styles.textSmall, {color: 'lightgray'}]}>Alarm will ring in</Text>
            <Text style={[styles.text, {alignSelf:'center', fontWeight:'bold', paddingBottom:7}]}>{hour} {minute}</Text>
          </>
        )}
        {clockView === 'Clock' && (
          <>
            <Text style={[styles.textSmall, {color: 'lightgray'}]}>Alarm will ring at</Text>
            <Text style={[styles.text , {alignSelf:'center', fontWeight:'bold', paddingBottom:7}]}>{clockHour}:{clockMinute} {AmPm}</Text>
          </>
        )}
      </TouchableOpacity>  

      <Text style={[styles.textSmall, {fontSize:18 ,fontWeight: 'bold', color:'#e2c675'}]}>- {users?.waktuTitle} - {users?.waktuTime} AM -</Text>

        <View style={[styles.box,{marginBottom:30, marginTop:10, flexDirection: 'column', width:"90%", alignSelf:'center'}]}> 
          <Slider
              style={{ width: '100%', alignSelf: 'center',  }}
              value={parseFloat(clockHour) || 0}
              minimumValue={1}
              maximumValue={12}
              step={1}
              maximumTrackTintColor="lightgray"
              onValueChange={(text) => handleClockHourChange(text)}
            />
            
            <View style={styles.container5}>
              <Text style={[styles.container4, {marginRight:3, width:40, height:30, textAlign:'center'}]}>
                {clockHour.toString()}
              </Text>
                <Text style={[styles.text,{paddingBottom:3, fontSize:25}]}>:</Text>
              <Text style={[styles.container4, {marginLeft:3, width:40, height:30, textAlign:'center'}]}>
                {clockMinute.toString()}
              </Text>

              <View style={[styles.container4, {backgroundColor: 'rgba(255, 255, 255, 0.1),', width:40, height:40, marginLeft:-5, marginTop:-1}]}>
                <TouchableOpacity style={[styles.container4, {width:35, height:35, backgroundColor:'rgba(255, 255, 255, 0.1),'}]} onPress={() => handleAmPm(AmPm)}>
                  <Text >{AmPm}</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Slider
            style={{ width: '100%', alignSelf: 'center'}}
            value={parseFloat(clockMinute) || 0}
            minimumValue={0}
            maximumValue={59}
            step={1}
            maximumTrackTintColor="lightgray"
            thumbStyle={[styles.thumb, currentValue.calcMinute === 50 && styles.thumbSelected]}
            onValueChange={(text) => handleClockMinuteChange(text)}
          />

          <View style={[styles.inviContainer, {justifyContent:'center', flexDirection: 'row', alignItems:'center'}]}>
            <View style={[styles.container4, {backgroundColor: 'rgba(255, 255, 255, 0.1),', width:100, height:75}]}>
              <Text style={[styles.text, {fontSize:15}]}>Now</Text>
              <TouchableOpacity style={[styles.smallerButton, { backgroundColor: 'gray' }]} onPress={handleNow} >
              <Text style={[styles.buttonText, {width:100}]}>{currentTime}</Text>
            </TouchableOpacity>
            </View>
            
            <View style={[styles.container4, {backgroundColor: 'rgba(255, 255, 255, 0.1),', width:100, height:75}]}>
            <Text style={[styles.text, {fontSize:15}]}>{users?.waktuTitle}</Text>
            <TouchableOpacity style={[styles.smallerButton, { backgroundColor: 'gray' }]} onPress={handleWaktu} >
              <Text style={[styles.buttonText, {width:100}]}>{users?.waktuTime}</Text>
            </TouchableOpacity>
            </View>
          </View>
        </View>

        <TextInput
            style={[styles.input, {fontSize:17, height:60, margin:-20, width:350}]}
            placeholder="Enter a title"
            placeholderTextColor="#3a3c3d"
            value={title} 
            onChangeText={(text) => setTitle(text)}
          />
          

        <View style={[styles.container7, {marginBottom:5, width:390}]}>
          <Text style={[styles.text, {marginLeft:10, padding:3}]}>Turn</Text>
          <View style={styles.container5}>
            <Switch
            style={[{marginRight:15 }]}
              trackColor={{ false: 'darkgray', true: 'lightblue' }}
              thumbColor={turn ? 'cyan' : 'lightgray'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={(value) => setTurn(value)}
              value={turn}
            />
          </View>       
        </View> 

        <View style={[styles.inviContainer, {marginBottom:100, justifyContent:'center', flexDirection: 'row', alignItems:'center'}]}>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'darkcyan' }]} onPress={users?.triggerTitle ? handleButtonUpdate : handleButtonCreate} >
          <Text style={styles.buttonText}>{buttonView}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={[styles.button, { backgroundColor: 'darkcyan' }]} onPress={handleButtonDelete} >
          <Text style={[styles.buttonText]}>{`Delete`}</Text>
        </TouchableOpacity>

      </View>


        </View>

      </ImageBackground>
    </SafeAreaView>
  );
};
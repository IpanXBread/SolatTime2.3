import React, { useState, useEffect } from 'react';
import { Text, SafeAreaView, TouchableOpacity, View, ImageBackground, ScrollView, StatusBar} from 'react-native';
import { auth } from '../config';
import { NavigationContainer } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import styles from '../src/styles';
import { Ionicons } from '@expo/vector-icons';
import { SumTwoValues } from '../src/SumTwoValues';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { FetchImsak, FetchSubuh, FetchSyuruk, FetchZohor, FetchAsar, FetchMaghrib, FetchIsyak } from '../src/WaktuFirebase';
import { firestore } from '../config';
import { useFocusEffect } from '@react-navigation/native';

const WaktuSolatScreen = () => {

  const navigation = useNavigation();
  
  const [username, setUsername] = useState('');
  const [users, setUsers] = useState([]);
  const [data, setData] = useState(null);

  const [ImsakShow, setImsakShow] = useState(false);
  const [SubuhShow, setSubuhShow] = useState(false);
  const [SyurukShow, setSyurukShow] = useState(false);
  const [ZohorShow, setZohorShow] = useState(false);
  const [AsarShow, setAsarShow] = useState(false);
  const [MaghribShow, setMaghribShow] = useState(false);
  const [IsyakShow, setIsyakShow] = useState(false);

// Get The Current Username
useEffect(() => {
  const retrieveUsername = async () => {
    try {
      const username = await AsyncStorage.getItem('username');
      if (username) {
        setUsername(username);
        const unsubscribe = firestore
          .collection(username)
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
        // console.log('No username stored.');
      }
    } catch (error) {
      console.error('Error retrieving username:', error);
    }
  };

  retrieveUsername();
}, []);

// Log Out Function
  const handleLogOut = async () => {

    try {
      await AsyncStorage.removeItem('username');
      console.log('Username removed from AsyncStorage');
      setUsername(''); // Reset the username state
    } catch (error) {
      console.error('Error removing username from AsyncStorage:', error);
    }

    console.log('Logging out...');
    
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login Screen")
      })
      .catch(error => alert(error.message))
  };
  
// Click Each Waktu Function
  const clickWaktu = (name) => {

    if (name === "Subuh") {
      setSubuhShow(!SubuhShow);
      setImsakShow(false);
      setSyurukShow(false);
      setZohorShow(false);
      setAsarShow(false);
      setMaghribShow(false);
      setIsyakShow(false);
    } else if (name === "Imsak") {
      setImsakShow(!ImsakShow);
      setZohorShow(false);
      setSyurukShow(false);
      setSubuhShow(false);
      setAsarShow(false);
      setMaghribShow(false);
      setIsyakShow(false);
    } else if (name === "Syuruk") {
      setSyurukShow(!SyurukShow);
      setZohorShow(false);
      setImsakShow(false);
      setSubuhShow(false);
      setAsarShow(false);
      setMaghribShow(false);
      setIsyakShow(false);
    } else if (name === "Zohor") {
      setZohorShow(!ZohorShow);
      setImsakShow(false);
      setSyurukShow(false);
      setSubuhShow(false);
      setAsarShow(false);
      setMaghribShow(false);
      setIsyakShow(false);
    } else if (name === "Asar") {
      setAsarShow(!AsarShow);
      setImsakShow(false);
      setSyurukShow(false);
      setSubuhShow(false);
      setZohorShow(false);
      setMaghribShow(false);
      setIsyakShow(false);
    } else if (name === "Maghrib") {
      setMaghribShow(!MaghribShow);
      setImsakShow(false);
      setSyurukShow(false);
      setSubuhShow(false);
      setZohorShow(false);
      setAsarShow(false);
      setIsyakShow(false);
    } else if (name === "Isyak") {
      setIsyakShow(!IsyakShow);
      setImsakShow(false);
      setSyurukShow(false);
      setSubuhShow(false);
      setZohorShow(false);
      setAsarShow(false);
      setMaghribShow(false);
    }
  };

// Go To Setting Screen
  const SettingPage = () => {
    navigation.navigate('Setting Screen', { username: username, users: users });
  };

// Get Each Waktu Solat
const fetchDataForName = async (name) => {
  try {
    const querySnapshot = await firestore.collection(username)
      .where('waktuTitle', '==', name)
      .get();

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      const data = doc.data();
      console.log("Data retrieved for", name, ":", data); // Log the data here
      return data;
    } else {
      return null; // Return null when no data is found
    }
  } catch (error) {
    console.error('Error retrieving data from Firestore:', error);
  }
};

const prayerNames = ['imsak', 'subuh', 'syuruk', 'zohor', 'asar', 'maghrib', 'isyak'];

// Current problem, system does not detect username instantly, so there will be an error
const fetchUserData = async () => {
  if (username) {
    const promises = prayerNames.map(name => fetchDataForName(name));
    const newData = await Promise.all(promises);
    setData(newData);
  }
};

useEffect(() => {
  fetchUserData();
}, [username]);

  const capitalizedNegeri = users[0]?.waktuNegeri?.charAt(0).toUpperCase() + users[0]?.waktuNegeri?.slice(1);
  const capitalizedZon = users[0]?.waktuZon?.charAt(0).toUpperCase() + users[0]?.waktuZon?.slice(1);

  console.log("test1");

  if (data == null) {
    // Perform the find operation and other related code
    calculatedImsakTime = SumTwoValues(0, 0, "AM", 0, 0, "AM");
    calculatedSubuhTime = SumTwoValues(0, 0, "AM", 0, 0, "AM");
    calculatedSyurukTime = SumTwoValues(0, 0, "AM", 0, 0, "AM");
    calculatedZohorTime = SumTwoValues(0, 0, "AM", 0, 0, "AM");
    calculatedAsarTime = SumTwoValues(0, 0, "AM", 0, 0, "AM");
    calculatedMaghribTime = SumTwoValues(0, 0, "AM", 0, 0, "AM");
    calculatedIsyakTime = SumTwoValues(0, 0, "AM", 0, 0, "AM");
  } else {
    const validData = data.filter(item => item && item.waktuTime);
    const [imsakTime, subuhTime, syurukTime, zohorTime, asarTime, maghribTime, isyakTime] = validData.map(item => item.waktuTime);
  
    console.log("test2");

    const [imsakHour, imsakMinute] = imsakTime ? imsakTime.split(':') : [0, 0];
    calculatedImsakTime = SumTwoValues(imsakHour, imsakMinute, "AM", 0, 0, "AM");
  
    const [subuhHour, subuhMinute] = subuhTime ? subuhTime.split(':') : [0, 0];
    calculatedSubuhTime = SumTwoValues(subuhHour, subuhMinute, "AM", 0, 0, "AM");
  
    const [syurukHour, syurukMinute] = syurukTime ? syurukTime.split(':') : [0, 0];
    calculatedSyurukTime = SumTwoValues(syurukHour, syurukMinute, "AM", 0, 0, "AM");
  
    const [zohorHour, zohorMinute] = zohorTime ? zohorTime.split(':') : [0, 0];
    calculatedZohorTime = SumTwoValues(zohorHour, zohorMinute, "AM", 0, 0, "AM");
  
    const [asarHour, asarMinute] = asarTime ? asarTime.split(':') : [0, 0];
    calculatedAsarTime = SumTwoValues(asarHour, asarMinute, "AM", 0, 0, "AM");
  
    const [maghribHour, maghribMinute] = maghribTime ? maghribTime.split(':') : [0, 0];
    calculatedMaghribTime = SumTwoValues(maghribHour, maghribMinute, "AM", 0, 0, "AM");
  
    const [isyakHour, isyakMinute] = isyakTime ? isyakTime.split(':') : [0, 0];
    calculatedIsyakTime = SumTwoValues(isyakHour, isyakMinute, "AM", 0, 0, "AM");

    console.log("isyakTime: ", isyakTime);
  }

  useFocusEffect(
    React.useCallback(() => {
      fetchUserData();
    }, [username])
  );
    
  return (
    <SafeAreaView style={styles.background}>
      <ImageBackground
        source={require('../images/waktu_bg.png')} // Replace with your image source
        style={styles.imageBackground}
        resizeMode='stretch'
      >
      <Text style={[styles.text, {paddingTop:37, alignSelf:'center', color:'#e2c675'}]}>{username?.charAt(0).toUpperCase() + username?.slice(1)}.</Text>

    <View style={{ height: 69, marginTop:150 }}>
    <TouchableOpacity
        style={[styles.container6, {height:69, margin:5}]}
        onPress={() => SettingPage()}
        >
        <View style={[{flexDirection:'row', alignItems: 'center'}]}>
          <View><Ionicons name="settings-outline" size={26} color="#0c0c0c"/></View>
          {capitalizedNegeri || capitalizedZon ? (
            <Text style={[styles.text, {color:'black', margin:7}]}>{capitalizedNegeri}, {capitalizedZon}</Text>
          ) : (
            <Text style={[styles.text, {fontSize: 14, color:'black', margin:7}]}>Click here to set your location.</Text>
          )}
          <View><Ionicons name="settings-outline" size={26} color="#0c0c0c"/></View>
        </View>
      </TouchableOpacity>
    </View>

    <View style={{ height: 450 }}>
      <ScrollView style={[styles.inviContainer, {}]}>
        <View style={{flexGrow: 1, backgroundColor:'rgba(255, 255, 255, 0.1)', borderRadius: 20, paddingBottom:15, margin:5}}>
          
        <TouchableOpacity style={[{marginLeft: 20}]} onPress={() => clickWaktu('Imsak')}>
            <View style={styles.box}>
              <Text style={styles.text}>Imsak</Text>
              <Text style={styles.textRight}>{calculatedImsakTime.calcHour}:{calculatedImsakTime.calcMinuteInDoubleDigitValue} {calculatedImsakTime.calcAmPm}</Text>
            </View>
          </TouchableOpacity>
          {ImsakShow ? <FetchImsak/> : null}

          <TouchableOpacity style={[{marginLeft: 20}]} onPress={() => clickWaktu('Subuh')}>
            <View style={styles.box}>
              <Text style={styles.text}>Subuh</Text>
              <Text style={styles.textRight}>{calculatedSubuhTime.calcHour}:{calculatedSubuhTime.calcMinuteInDoubleDigitValue} {calculatedSubuhTime.calcAmPm}</Text>
            </View>
          </TouchableOpacity>
          {SubuhShow ? <FetchSubuh/> : null}

          {/* <TouchableOpacity style={[{marginLeft: 20}]} onPress={() => clickWaktu('Syuruk')}>
            <View style={styles.box}>
              <Text style={styles.text}>Syuruk</Text>
              <Text style={styles.textRight}>{calculatedSyurukTime.calcHour}:{calculatedSyurukTime.calcMinuteInDoubleDigitValue} {calculatedSyurukTime.calcAmPm}</Text>
            </View>
          </TouchableOpacity>
          {SyurukShow ? <FetchSyuruk/> : null} */}

          <TouchableOpacity style={[{marginLeft: 20}]} onPress={() => clickWaktu('Zohor')}>
            <View style={styles.box}>
              <Text style={styles.text}>Zohor</Text>
              <Text style={styles.textRight}>{calculatedZohorTime.calcHour}:{calculatedZohorTime.calcMinuteInDoubleDigitValue} {calculatedZohorTime.calcAmPm}</Text>
            </View>
          </TouchableOpacity>
          {ZohorShow ? <FetchZohor/> : null}

          <TouchableOpacity style={[{marginLeft: 20}]} onPress={() => clickWaktu('Asar')}>
            <View style={styles.box}>
              <Text style={styles.text}>Asar</Text>
              <Text style={styles.textRight}>{calculatedAsarTime.calcHour}:{calculatedAsarTime.calcMinuteInDoubleDigitValue} {calculatedAsarTime.calcAmPm}</Text>
            </View>
          </TouchableOpacity>
          {AsarShow ? <FetchAsar /> : null}

          <TouchableOpacity style={[{marginLeft: 20}]} onPress={() => clickWaktu('Maghrib')}>
            <View style={styles.box}>
              <Text style={styles.text}>Maghrib</Text>
              <Text style={styles.textRight}>{calculatedMaghribTime.calcHour}:{calculatedMaghribTime.calcMinuteInDoubleDigitValue} {calculatedMaghribTime.calcAmPm}</Text>
            </View>
          </TouchableOpacity>
          {MaghribShow ? <FetchMaghrib /> : null}

          <TouchableOpacity style={[{marginLeft: 20}]} onPress={() => clickWaktu('Isyak')}>
            <View style={styles.box}>
              <Text style={styles.text}>Isyak</Text>
              <Text style={styles.textRight}>{calculatedIsyakTime.calcHour}:{calculatedIsyakTime.calcMinuteInDoubleDigitValue} {calculatedIsyakTime.calcAmPm}</Text>
            </View>
          </TouchableOpacity>
          {IsyakShow ? <FetchIsyak /> : null}

        </View>

        <TouchableOpacity style={[styles.button, {justifyContent:'center', alignSelf: 'center', marginBottom:60, marginTop:20}]} onPress={handleLogOut}>
        <Text style={styles.text}>Log Out</Text>
      </TouchableOpacity>

      </ScrollView>
    
    </View>

      

    </ImageBackground>
    </SafeAreaView>
  );
}

export default WaktuSolatScreen;

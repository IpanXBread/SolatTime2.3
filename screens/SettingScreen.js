import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, TextInput, TouchableOpacity, Switch, Alert, ImageBackground, ScrollView } from 'react-native';
import styles from '../src/styles';
import { useNavigation } from '@react-navigation/native';
import { SumTwoValues } from '../src/SumTwoValues';
import { firestore } from '../config';
import { Picker } from '@react-native-picker/picker';
import RingtoneManager from '../src/RingtoneManager';
import VibrateManager from '../src/VibrateManager';

const WaktuSetting = ({username, waktuData, isFirstTime, users }) => {

  const navigation = useNavigation();

  const [capitalizedNegeri, setCapitalizedNegeri] = useState(users[0]?.waktuNegeri?.charAt(0).toUpperCase() + users[0]?.waktuNegeri?.slice(1));
  const [capitalizedZon, setCapitalizedZon] = useState(users[0]?.waktuZon?.charAt(0).toUpperCase() + users[0]?.waktuZon?.slice(1));
  const [solatDataArray, setSolatDataArray] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [selectedNegeri, setSelectedNegeri] = useState(null);
  const [selectedZon, setSelectedZon] = useState(null);
  const [showNegeri, setShowNegeri] = useState('');
  const [showZon, setShowZon] = useState('');
  const [data, setData] = useState(null); // state to store the retrieved data
  const [modalVisible, setModalVisible] = useState(false);

  let [time, setTime] = useState(null);
  time = data?.waktuTime;

  if (time) {
    const [hour, minute] = time.split(':');
    masa = SumTwoValues(hour, minute, "AM", 0, 0, "AM");
  } else {
    masa = SumTwoValues(0, 0, "AM", 0, 0, "AM");
  }

// After this make sure to check if waktuTitle exist or not cuz some dont yet
  useEffect(() => {
    firestore.collection(username).where('waktuTitle', '==', waktuData).get()
    .then(querySnapshot => {
      const doc = querySnapshot.docs[0];
      if (doc) {
        const newData = doc.data();
        setData(newData);
      }
      })
      .catch(error => {
        console.error('Error retrieving data from Firestore:', error);
      });

      fetch('https://waktu-solat-api.herokuapp.com/api/v1/prayer_times.json')
        .then(response => response.json())
        .then(data => {
          setPrayerTimes(data);
        })
        .catch(error => {
          console.error(error);
        });
  }, [waktuData]);

  useEffect(() => {
    if (data?.negeri) {
      setShowNegeri(data.negeri);
    }
    if (data?.zon) {
      setShowZon(data.zon);
    }
  }, [data]);

  useEffect(() => {
}, [selectedNegeri]);

useEffect(() => {
}, [selectedZon]);

useEffect(() => {
  if (prayerTimes && selectedNegeri && selectedZon) {
    const selectedNegeriName = prayerTimes.data.negeri[selectedNegeri]?.nama;
    const selectedZonName = prayerTimes.data.negeri[selectedNegeri]?.zon[selectedZon]?.nama;

    if (selectedNegeriName && selectedZonName) {
      setCapitalizedNegeri(selectedNegeriName.charAt(0).toUpperCase() + selectedNegeriName.slice(1));
      setCapitalizedZon(selectedZonName.charAt(0).toUpperCase() + selectedZonName.slice(1));
    
      const solatDataArray = prayerTimes.data.negeri[selectedNegeriName]?.zon[selectedZonName]?.solat;
      setSolatDataArray(solatDataArray);
    }
  } else {

  }
  if (!capitalizedNegeri && !capitalizedZon) {
    setCapitalizedNegeri("Select location here");
      setCapitalizedZon("TQ.");
  }
}, [selectedNegeri, selectedZon, prayerTimes]);

const handleNegeriChange = (value) => {
  setSelectedNegeri(value);
  setSelectedZon(null);
};

const handleZonChange = (value) => {
  setSelectedZon(value);  
};

const togglePicker = () => {
  setModalVisible(!modalVisible);
};

const handleSave = async () => {
  const selectedNegeriName = prayerTimes.data.negeri[selectedNegeri]?.nama;
  const selectedZonName = prayerTimes.data.negeri[selectedNegeri]?.zon[selectedZon]?.nama;

  if (selectedNegeriName && selectedZonName) {
    setCapitalizedNegeri(selectedNegeriName.charAt(0).toUpperCase() + selectedNegeriName.slice(1));
    setCapitalizedZon(selectedZonName.charAt(0).toUpperCase() + selectedZonName.slice(1));

    const ArrayWaktuSolatName = [];
  const ArrayWaktuSolatTime = [];

  prayerTimes.data.negeri[selectedNegeri].zon[selectedZon].waktu_solat.forEach((solat) => {
    ArrayWaktuSolatName.push(solat.name);
    ArrayWaktuSolatTime.push(solat.time);
  });
    
  try {
    console.log("ArrayWaktuSolatName: ", ArrayWaktuSolatName);
    console.log("ArrayWaktuSolatTime: ", ArrayWaktuSolatTime);
    const docRefs = await Promise.all(
      ArrayWaktuSolatName.map((waktuTitle, index) =>
        firestore.collection(username).where('waktuTitle', '==', waktuTitle).get()
      )
    );
  
    const updates = [];
  
    docRefs.forEach((querySnapshot, index) => {
      if (querySnapshot.empty) {
        const updatePromise = firestore.collection(username).add({
          waktuTitle: ArrayWaktuSolatName[index],
            waktuNegeri: selectedNegeriName,
            waktuZon: selectedZonName,
            waktuTime: ArrayWaktuSolatTime[index],
        });
        updates.push(updatePromise);
      } else {
        querySnapshot.forEach((doc) => {
          const updatePromise = firestore.collection(username).doc(doc.id).update({
            waktuTitle: ArrayWaktuSolatName[index],
            waktuNegeri: selectedNegeriName,
            waktuZon: selectedZonName,
            waktuTime: ArrayWaktuSolatTime[index],
          });
          updates.push(updatePromise);
        });
      }
    });
  
    await Promise.all(updates);
  
    alert('Your data has been saved.');
  } catch (error) {
    console.error('Error updating/creating documents: ', error);
  }
  } else {
    alert('Please select both negeri and zon first.');
  }
  
};

  if (isFirstTime) {
    return (
      <View style={{ flex: 1 }}>

        <TouchableOpacity
          style={[styles.box, { justifyContent: 'center', alignSelf: 'center', marginBottom: 5 }]}
          onPress={togglePicker}>
            <Text style={[styles.text, { alignSelf: 'center' }]}>
              {capitalizedNegeri && capitalizedNegeri.charAt(0).toUpperCase() + capitalizedNegeri.slice(1)}
              {capitalizedZon && `, ${capitalizedZon.charAt(0).toUpperCase() + capitalizedZon.slice(1)}`}
            </Text>
        </TouchableOpacity>

      {modalVisible && prayerTimes && prayerTimes.data && (
        <View style={[styles.modalContent, { backgroundColor: 'rgba(255, 255, 255, 0.3)', marginTop: 5, flex:1 }]}>

          <View style={[{ margin: 5, backgroundColor: 'gray', color: 'white' }]}>
            <Picker
            style={[styles.container2, {backgroundColor:'#fff'}]}
              selectedValue={selectedNegeri}
              onValueChange={handleNegeriChange}
              itemStyle={{ height: 30, width:30 }}
            >
              <Picker.Item label="Select Negeri" value="" />
              {prayerTimes.data.negeri.map((negeri, index) => (
                <Picker.Item
                  key={index}
                  label={negeri.nama}
                  value={index} />
              ))}
            </Picker>
          </View>

          {selectedNegeri !== null && (
            <View>

              <View style={[{ margin: 5, backgroundColor: 'gray', color: 'white' }]}>
                <Picker
                style={[styles.container2, {backgroundColor:'#fff'}]}
                  selectedValue={selectedZon}
                  onValueChange={handleZonChange}
                  >
                  <Picker.Item label="Select Zon" value="" />
                  {prayerTimes.data.negeri[selectedNegeri].zon.map((zon, index) => (
                    <Picker.Item
                      key={index}
                      label={zon.nama}
                      value={index} />
                  ))}
                </Picker>
              </View>

              

              {selectedZon !== null && (
                <View>

                  <Text style={[{alignSelf:'center', fontSize:12}]}>
                    Waktu solat for
                  </Text>
                  <Text style={[{alignSelf:'center', fontSize:18}]}>
                    {prayerTimes.data.negeri[selectedNegeri].nama.charAt(0).toUpperCase() + prayerTimes.data.negeri[selectedNegeri].nama.slice(1)}, {prayerTimes.data.negeri[selectedNegeri].zon[selectedZon].nama.charAt(0).toUpperCase() + prayerTimes.data.negeri[selectedNegeri].zon[selectedZon].nama.slice(1)}:
                  </Text>

                  {prayerTimes.data.negeri[selectedNegeri].zon[selectedZon].waktu_solat.map((solat, index) => (
                    <View key={index}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10 }}>
                        <Text style={{ marginLeft: 30, fontSize: 16 }}>{solat.name.charAt(0).toUpperCase() + solat.name.slice(1)}</Text>
                        <Text style={{ marginRight: 30, fontSize: 16 }}>{solat.time}</Text>
                      </View>
                      <View style={{ borderBottomWidth: 1, borderBottomColor: 'black' }} />
                    </View>
                  ))}

                  <TouchableOpacity style={[styles.createButton, {marginTop:10, marginBottom:-10, alignSelf:'center',width:300, backgroundColor:'#00141c'}]} onPress={handleSave}>
                    <Text style={[styles.buttonText, {color:'#e2c675', fontSize:18}]}>Save</Text>
                  </TouchableOpacity>

                </View>
              )}
            </View>
            )}
          </View>
        )}
      </View>
    );
  }
  return (
    <View style={[styles.container5,{backgroundColor: 'rgba(0, 0, 0, 0.5)', marginTop:2}]}>
      <View style={[{padding:5}]}>
        <Text
          style={[
            { fontSize: 16, fontWeight: 'bold', marginLeft: 10, color: '#e2c675'  },
          ]}
        >
          {waktuData}
        </Text>
        <Text
          style={[
            { fontSize:15, marginLeft:8, color:'white' },
          ]}
        >
          {masa.calcHour}:{masa.calcMinuteInDoubleDigitValue} {masa.calcAmPm}
        </Text>
      </View>
      </View> 
);
}

export default function SettingScreen({ route }) {
  
  const { users } = route.params || {};
  const { username } = route.params || {};

  const [capitalizedNegeri, setCapitalizedNegeri] = useState(users[0]?.waktuNegeri?.charAt(0).toUpperCase() + users[0]?.waktuNegeri?.slice(1));
  const [capitalizedZon, setCapitalizedZon] = useState(users[0]?.waktuZon?.charAt(0).toUpperCase() + users[0]?.waktuZon?.slice(1));

  return (
    <SafeAreaView style={styles.container}>
      <ImageBackground
        source={require('../images/activity_bg.png')}
        style={styles.imageBackground}
        resizeMode='stretch'>
          <ScrollView>
            <WaktuSetting waktuData={"Jakim"} isFirstTime={true} users={users} username={username}/>
            <VibrateManager/>
            <RingtoneManager/>

        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
};
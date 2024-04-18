// stylish
import { AppRegistry, Text, View, Platform, TouchableOpacity, ScrollView, Vibration, StatusBar, Alert } from 'react-native';
import styles from './src/styles';

// navigation
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// screens
import LoginScreen from './screens/LoginScreen';
import WaktuSolatScreen from './screens/WaktuSolatScreen';
import ActivityScreen from './screens/ActivityScreen';
import SettingScreen from './screens/SettingScreen';

// firebase
import { auth } from './config';
import { firestore } from './config';
import AsyncStorage from '@react-native-async-storage/async-storage';

// notifications
import * as Notifications from 'expo-notifications';

// functions
import { useState, useEffect, useRef, useCallback } from 'react';
import { SumTwoValues } from './src/SumTwoValues';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true, // if only false (the rest r true), vibrate no, top notification no, slide notification no. || Notification && Vibrate OFF
    shouldPlaySound: true, //if only false, vibrate no, top notification no, slide notification yes. || Notification OFF && Vibrate OFF
    shouldSetBadge: true, // if only false, vibrate yes, top notification no, slide notification yes. || Notification OFF / Vibrate ON
  }),
});

const Stack = createNativeStackNavigator();

export default function App() {

  const responseListener = useRef();
  const notificationListener = useRef();

  const [groupedData, setGroupedData] = useState({});
  const [username, setUsername] = useState('');
  const [user, setUser] = useState(null);

  const [currentDate, setCurrentDate] = useState(new Date()); // Date: 2023-06-12T06:55:26.669Z
  const [triggerData, setTriggerData] = useState([]); // Trigger Data: {"notification": true, "ringtone": true, "time": 1, "title": "activitysubuh3", "vibrate": true}
  const [waktuData, setTimeData] = useState([]); // Waktu Data: {}
  const [isGroupedTriggerReady, setIsGroupedTriggerReady] = useState(false); // Add a state to track if groupedData is ready
  const [isGroupedWaktuReady, setIsGroupedWaktuReady] = useState(false);
  const [shouldScheduleNotifications, setShouldScheduleNotifications] = useState(true);
  const [shouldRunNotifications, setShouldRunNotifications] = useState(true);
  const shouldRunNotificationsRef = useRef(true);
  const [intervalIds, setIntervalIds] = useState([]);
  const [prayerTimes, setPrayerTimes] = useState(null);
  const [waktuNegeri, setWaktuNegeri] = useState(null);
  const [waktuZon, setWaktuZon] = useState(null);
  
  const currentHour = currentDate.getHours();
  const currentMinute = currentDate.getMinutes();
  const currentSecond = currentDate.getSeconds();
  const totalCurrentSecond = (currentHour * 3600) + (currentMinute * 60) + currentSecond;
  
  // Get Current Username here and also do debugging like i did

  // Update Username in Realtime
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        const retrieveStoredUsername = async () => {
          try {
            const storedUsername = await AsyncStorage.getItem('username');
            if (storedUsername) {
              retrieveData(storedUsername); // Call retrieveData with the stored username
              fetchDataFromFirestore(storedUsername);
            } else {
              // If storedUsername is null, wait for 500ms and try again
              setTimeout(() => {
                retrieveStoredUsername();
              }, 500);
            }
          } catch (error) {
            console.error('Error retrieving username:', error);
          }
        };
        retrieveStoredUsername();
      }
      setWaktuNegeri(null);
      setWaktuZon(null);
    });
    return unsubscribe;
  }, [retrieveData, fetchDataFromFirestore]);
  
// Fetch Trigger & Waktu
  const retrieveData = useCallback(async (storedUsername) => {
    try {
      if (storedUsername) {
        setUsername(storedUsername);
        const snapshot = await firestore.collection(storedUsername).get();
        const documents = snapshot.docs.map((doc) => doc.data());

        // Grouping data based on 'waktuTitle'
        const grouped = groupDataByWaktuTitle(documents);
        setGroupedData(grouped);

        const uniqueWaktuNegeri = [...new Set(documents.map((item) => item.waktuNegeri))].filter(Boolean);
        const uniqueWaktuZon = [...new Set(documents.map((item) => item.waktuZon))].filter(Boolean);

        if (uniqueWaktuNegeri.length > 0) {
          setWaktuNegeri(uniqueWaktuNegeri[0]);
        }
  
        if (uniqueWaktuZon.length > 0) {
          setWaktuZon(uniqueWaktuZon[0]);
        }
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }, []);

// Group 1 (Trigger Title|Time|Turn, Waktu Title|Time)
  const groupDataByWaktuTitle = (data) => {
    return data.reduce((acc, item) => {
      const {  triggerTitle, triggerTime, triggerTurn, waktuTitle, waktuTime} = item;
      if (!acc[waktuTitle]) {
        acc[waktuTitle] = [];
      }
      acc[waktuTitle].push({ triggerTitle, triggerTime, triggerTurn, waktuTitle, waktuTime });
      return acc;
    }, {});
  };

// Updates Waktu Solat based on JAKIM
const updateWaktuButton = useCallback(() => {
  // console.log("who am i? : ", username);
  if (!waktuNegeri || !waktuZon) {
    console.log('Cannot update waktu solat: Missing waktuNegeri or waktuZon.');
    return;
  }

  
  // console.log("whats my negeri? : ", waktuNegeri);
  // console.log("whats my zon? : ", waktuZon);
  // console.log("groupedData : ", groupedData);

  fetch('https://waktu-solat-api.herokuapp.com/api/v1/prayer_times.json')
    .then(response => response.json())
    .then(data => {
      setPrayerTimes(data);

      if (data && data.data && data.data.negeri) {
        const negeriData = data.data.negeri.find(negeriData => negeriData.nama.toLowerCase() === waktuNegeri.toLowerCase());
        if (negeriData && negeriData.zon) {
          const zonData = negeriData.zon.find(zonData => zonData.nama.toLowerCase() === waktuZon.toLowerCase());
          if (zonData) {
            const waktuTitles = Object.keys(groupedData);
            waktuTitles.forEach(waktuTitle => {
              console.log("waktuTitle:", waktuTitle);
              console.log("zonData:", zonData);

              const matchingWaktu = zonData.waktu_solat.find(waktu => waktu.name.toLowerCase() === waktuTitle.toLowerCase());
              if (matchingWaktu) {
                const latestWaktuTime = matchingWaktu.time;
                console.log("latestWaktuTime:", latestWaktuTime);
                // The rest of your code...
              } else {
                console.log("Matching waktu not found for waktuTitle:", waktuTitle);
              }

              const firestoreRef = firestore.collection(username).where('waktuNegeri', '==', waktuNegeri).where('waktuZon', '==', waktuZon).where('waktuTitle', '==', waktuTitle);
              firestoreRef.get()
                .then(snapshot => {
                  if (snapshot.empty) {
                    //console.log(`No document found for waktuTitle: ${waktuTitle}`);
                  } else {
                    snapshot.forEach(doc => {
                      firestore.collection(username).doc(doc.id).update({ waktuTime: latestWaktuTime })
                        .then(() => {
                          //console.log(`Successfully updated waktuTime for waktuTitle: ${waktuTitle}`);
                        })
                        .catch(error => {
                          //console.error(`Error updating waktuTime for waktuTitle: ${waktuTitle}`, error);
                        });
                    });
                  }
                })
                .catch(error => {
                  //console.error(`Error fetching documents for waktuTitle: ${waktuTitle}`, error);
                });
            });
          }
        }
      } else {
        console.log("There's no data or matching negeri/zon");
      }
    })
    .catch(error => {
      console.error(error);
    });
  }, [waktuNegeri, waktuZon, groupedData]);

  useEffect(() => {
    updateWaktuButton();
    const interval = 10 * 60 * 1000; // 10 minutes
    const intervalId = setInterval(updateWaktuButton, interval);
    return () => {
      clearInterval(intervalId);
    };
  }, [updateWaktuButton]);

// If any updates on Activities, it will instantly update here
  const fetchDataFromFirestore = useCallback(async (storedUsername) => {
    try {
      if (storedUsername) {
        setUsername(storedUsername);

        // Create a reference to the Firestore collection
        const collectionRef = firestore.collection(storedUsername);

        // Fetch initial data
        const snapshot = await collectionRef.get();
        const documents = snapshot.docs.map((doc) => doc.data());
        const grouped = groupDataByWaktuTitle(documents);
        setGroupedData(grouped);

        // Set up a real-time listener to listen for changes to the collection
        const unsubscribe = collectionRef.onSnapshot((querySnapshot) => {
          const updatedDocuments = querySnapshot.docs.map((doc) => doc.data());
          const updatedGrouped = groupDataByWaktuTitle(updatedDocuments);
          setGroupedData(updatedGrouped);
        });

        // Save the unsubscribe function to be used during cleanup
        responseListener.current = unsubscribe;
      }
    } catch (error) {
      console.error('Error retrieving data:', error);
    }
  }, []);

// Fetch Current
  useEffect(() => { 
    // Update the current time every second
    const interval = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    
    // Cleanup the interval on component unmount
    return () => {
      clearInterval(interval);
    };
  }, []);

// Notification
  const scheduleLocalNotification = async (item) => {
    let formattedTime = SumTwoValues(currentHour, currentMinute+1, 'AM', 0, 0, 'AM');
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'SolatTime',
          body: `${item.triggerTitle} has ringed on ${formattedTime.calcHour}:${formattedTime.calcMinuteInDoubleDigitValue} ${formattedTime.calcAmPm}.`,
        },
        trigger: {
          seconds: 1,
          repeats: false,
        },
      });
    } catch (error) {
      console.log('Failed to schedule notification.', error);
    }
  };

  // useEffect(() => {
  // scheduleLocalNotification();
  // }, []);

  // Calculation
  for (const waktuTitle of Object.keys(groupedData)) {
    const data = groupedData[waktuTitle];
    const validData = data.filter((item) => item.triggerTime !== undefined && item.triggerTitle !== undefined);
    if (validData.length > 0) {
      for (const item of validData) {
        
        let approachingTime;
        if (!item.waktuTime) {
          console.log("Error: 'waktuTime' is undefined in this item:", item);
          continue; // Skip this item and move to the next one
        }
        const [waktuHour, waktuMinute] = item.waktuTime.split(':');
        calculatedTrigger = SumTwoValues(0, item.triggerTime, "AM", waktuHour, waktuMinute, "AM");
        approachingTime = calculatedTrigger.calcTotalSeconds - totalCurrentSecond;
        if (approachingTime <= 0) {
          approachingTime = 86400 - totalCurrentSecond + calculatedTrigger.calcTotalSeconds;
        }
        
        // console.log('Activity:', item.triggerTitle);
        // console.log("Approaching Time: ", approachingTime);
        // console.log(); 

        if (approachingTime <= 1) {
          scheduleLocalNotification(item);
        }
      }
    }
  }

  return (
    <View style={{ flex: 1 }}>

      {/* <View style={{ flex: 0.9 }}> */}
      
    <NavigationContainer>

      <StatusBar backgroundColor="#060911" barStyle="light-content" />
      <Stack.Navigator
            initialRouteName="Login Screen"
            screenOptions={{
              headerStyle: {
                backgroundColor: '#060910',
              },
              headerTintColor: '#e2c675',
            }}
          >
      <Stack.Screen options={{ headerShown: false }} name="Login Screen" component={LoginScreen} />
      <Stack.Screen options={{ headerShown: false }} name="Waktu Solat Screen" component={WaktuSolatScreen} retrieveData={retrieveData} />
      <Stack.Screen name="Activity Screen" component={ActivityScreen} />
      <Stack.Screen name="Setting Screen" component={SettingScreen} />
      </Stack.Navigator>
    </NavigationContainer>
    
    {/* </View>
      <View style={{ flex: 0.1, flexDirection:'row' ,alignItems: 'center', justifyContent: 'space-around' , backgroundColor:'#0f0f0f'}}>    
        <ScrollView>
            <TouchableOpacity style={styles.button} onPress={updateWaktuButton}>
              <Text>Waktu Solat</Text>
            </TouchableOpacity>
          {Object.entries(groupedData).map(([waktuTitle, data]) => (
            <View key={waktuTitle}>
              <Text style={{ fontSize: 7, fontWeight: 'bold', color: 'gray' }}>{waktuTitle}</Text>
              {data.map(({ triggerTitle, triggerTime, waktuTime }, index) => {
                if (!waktuTime) {
                  return null; // Skip this item and do not render anything
                }
                const [waktuHour, waktuMinute] = waktuTime.split(':');
                calculatedTrigger = SumTwoValues(0, triggerTime, "AM", waktuHour, waktuMinute, "AM");
                let approachingTime = calculatedTrigger.calcTotalSeconds - totalCurrentSecond;
                if (approachingTime <= 0) {
                  approachingTime = 86400 - totalCurrentSecond + calculatedTrigger.calcTotalSeconds;
                }
                return (
                  <View key={index} style={{ marginLeft: 10 }}>
                    {triggerTitle && triggerTime ? (
                      <Text style={[{ color: 'white', fontSize: 10 }]}>{`${triggerTitle} : ${approachingTime}`}</Text>
                    ) : null}
                  </View>
                );
              })}
            </View>
          ))}
        </ScrollView>
      </View> */}

    </View>
  );
}
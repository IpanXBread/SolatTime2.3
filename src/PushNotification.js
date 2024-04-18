import messaging from '@react-native-firebase/messaging';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {PermissionsAndroid} from 'react-native';
  PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);

export const requestUserPermission = async () => {
  const authStatus = await messaging().requestPermission();
  console.log("authStatus is ", authStatus);
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
  }
}

export const GetFCMToken = async () => {
    let fcmtoken = await AsyncStorage.getItem("fcmtoken");
    console.log(fcmtoken, "old token");
    if(!fcmtoken){
        try {
            const fcmtoken = await messaging().getToken();
            if (fcmtoken){
                console.log(fcmtoken, "new token");
                await AsyncStorage.setItem("fcmtoken", fcmtoken);
            }
        } catch(error) {
            console.log(error, "error in fcmtoken");
        }
    }
}

const NotificationListener = () => {
    messaging().onNotificationOpenedApp(remoteMessage => {
        console.log(
            'Notification caused app to open from background state:',
            remoteMessage.notification,
        );
    });

    messaging()
    .getInitialNotification()
    .then(remoteMessage => {
        if (remoteMessage) {
            console.log(
                'Notification caused app to open from quit state:',
                remoteMessage.notification,
            );
        }
    });

    messaging().onMessage(async remoteMessage => {
        console.log("notification on foreground state.....", remoteMessage);
    })
}

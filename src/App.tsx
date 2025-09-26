import {
  StyleSheet,
  Text,
  View,
  Platform,
  StatusBar,
  Image,
  PermissionsAndroid
} from 'react-native';
// import { useEffect } from 'react';
// import RNBluetoothClassic from 'react-native-bluetooth-classic';
import FirstScreen from './components/FirstScreen';
import logo from '../assets/images/logo.png'
import { useState } from 'react';
export default function App() {
  // async function requestBluetoothPermissions() {
  //   if (Platform.OS === 'android') {
  //     try {
  //       const granted = await PermissionsAndroid.requestMultiple([
  //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
  //         PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
  //         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
  //         PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
  //       ]);

  //       const allGranted = Object.values(granted).every(
  //         status => status === PermissionsAndroid.RESULTS.GRANTED
  //       );

  //       if (!allGranted) {
  //         console.log('❌ Some Bluetooth permissions denied');
  //       } else {
  //         console.log('✅ All Bluetooth permissions granted');
  //         await enableBluetooth(); // turn ON bluetooth if off
  //       }
  //     } catch (err) {
  //       console.warn(err);
  //     }
  //   }
  // }

  // async function enableBluetooth() {
  //   try {
  //     const enabled = await RNBluetoothClassic.isBluetoothEnabled();
  //     if (!enabled) {
  //       console.log("⚠️ Bluetooth is off, requesting enable...");
  //       await RNBluetoothClassic.requestBluetoothEnabled();
  //     } else {
  //       console.log("✅ Bluetooth is already ON");
  //       listDevices();
  //     }
  //   } catch (err) {
  //     console.warn("Error enabling Bluetooth:", err);
  //   }
  // }

  // async function listDevices() {
  //   try {
  //     const devices= await RNBluetoothClassic.getBondedDevices();
  //     console.log("Paired Devices", devices);
  //     const h205= devices.find(device=> device.name === 'HC-05');

  //     if(h205){
  //       console.log("HC-05 found:", h205.address);
  //       connectToHC05(h205.address);
  //     }else{
  //       console.log("HC-05 not found");
        
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // }

  // let hc05Device;

  // async function connectToHC05(address: string){
  //   try {
  //     hc05Device= await RNBluetoothClassic.connectToDevice(address);
  //     console.log("Connected to HC-05:", hc05Device.name);
      
  //   } catch (error) {
  //     console.error("Connection faild: ", error);
      
  //   }
  // }

  // useEffect(() => {
  //   requestBluetoothPermissions();
  // }, []);
  const [isConnected, setIsConnected]=useState(false);

  
  return (
    <View style={styles.mainBox}>
      <StatusBar />
      <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
        <Image
        source={logo}
        style={styles.logo}
        />
        <View style={{marginRight:60}}>
        {
          isConnected ?
          <Text style={{color:"green", fontWeight:600, fontSize:16}}>🟢 Connected</Text> :
          <Text style={{color:"red", fontWeight:500}}>🔴 Not Connected</Text>
        }
        </View>
      </View>
      <FirstScreen connected={setIsConnected} />
    </View>
  );
}

const styles = StyleSheet.create({
  mainBox: {
    flex: 1,
    height:50,
    backgroundColor: 'black',
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 2,
  },
   logo: {
    height: 120,
    width: 250,
    // marginVertical: 20,   
  },
});


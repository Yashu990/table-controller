import React, { useRef, useState } from 'react';
import {
    Image, TouchableOpacity, StyleSheet, View, ScrollView,
    PermissionsAndroid,
    Platform, Dimensions
} from 'react-native';
import { useEffect } from 'react';
import RNBluetoothClassic from 'react-native-bluetooth-classic';
import { heightPercentageToDP as hp } from 'react-native-responsive-screen';

// ✅ Import all images as variables
import H12 from '../../assets/images/H12.png';
import H2 from '../../assets/images/H2.png';
import Trangel from '../../assets/images/trangel.png';
import Treverse from '../../assets/images/treverse.png';
import Backup from '../../assets/images/backup.png';
import Backdn from '../../assets/images/backdn.png';
import First from '../../assets/images/first.png';
import Second from '../../assets/images/second.png';
import Three from '../../assets/images/three.png';
import four from '../../assets/images/four.png';
import slide from '../../assets/images/slide.png';
import slide2 from '../../assets/images/slide2.png';
import sliderr1 from '../../assets/images/sliderr1.png';
import slider2 from '../../assets/images/slider2.png';
import Snackbar from 'react-native-snackbar';


export default function FirstScreen({ connected }: any) {

    const intervalRef = useRef<number | null>(null);
    const intervalReconnectRef = useRef<number | null>(null);
    let hc05Device: any;
    const [isTablet, setIsTablet] = useState(Dimensions.get('window').width > 800);

    async function requestBluetoothPermissions() {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.requestMultiple([
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
                    PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                    PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
                ]);

                const allGranted = Object.values(granted).every(
                    status => status === PermissionsAndroid.RESULTS.GRANTED
                );

                if (!allGranted) {
                    console.log('❌ Some Bluetooth permissions denied');
                } else {
                    console.log('✅ All Bluetooth permissions granted');
                    await enableBluetooth(); // turn ON bluetooth if off
                }
            } catch (err) {
                console.warn(err);
            }
        }
    }

    async function enableBluetooth() {
        try {
            const enabled = await RNBluetoothClassic.isBluetoothEnabled();
            if (!enabled) {
                console.log("⚠️ Bluetooth is off, requesting enable...");
                await RNBluetoothClassic.requestBluetoothEnabled();
            } else {
                console.log("✅ Bluetooth is already ON");
                listDevices();
            }
        } catch (err) {
            console.warn("Error enabling Bluetooth:", err);
        }
    }

    async function listDevices() {
        try {
            const devices = await RNBluetoothClassic.getBondedDevices();
            console.log("Paired Devices", devices);
            const h205 = devices.find(device => device.name === 'HC-05');

            if (h205) {
                console.log("HC-05 found:", h205.address);
                connectToHC05(h205.address);
            } else {
                console.log("HC-05 not found");
                Snackbar.show({
                    text: "HC-05 not found",
                    duration: Snackbar.LENGTH_SHORT,
                    backgroundColor: '#ff0000',
                    textColor: 'white'
                })
            }
        } catch (error) {
            console.error(error);
        }
    }


    async function connectToHC05(address: string) {
        try {
            hc05Device = await RNBluetoothClassic.connectToDevice(address);
            console.log("Connected to HC-05:", hc05Device.name);
            Snackbar.show({
                text: "Connected to HC-05",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#46d134ff',
                textColor: 'white'
            })
            connected(true)
            if (intervalReconnectRef.current !== null) {
                console.log("cleared interval");

                clearInterval(intervalReconnectRef.current);
                intervalReconnectRef.current=null;
            }

        } catch (error) {
            console.error("Connection faild: ", error);
            Snackbar.show({
                text: "Not Connected to HC-05",
                duration: Snackbar.LENGTH_SHORT,
                backgroundColor: '#cf0a0aff',
                textColor: 'white'
            })
            if (intervalReconnectRef.current !== null) {
                clearInterval(intervalReconnectRef.current);
                intervalReconnectRef.current=null;
            }
            intervalReconnectRef.current = setInterval(() => {
                listDevices();
                console.log("started interval");

            }, 5000);
        }
    }


    async function sendTextCommand(dynamicByte: string) {
        if (!hc05Device) {
            console.log("Not connected to HC-05");
            listDevices();
            return;
        }

        try {
            const command = [
                0x43, 0x47, 0xFE, dynamicByte, // <-- here is the variable part
                0x00, 0x00, 0x00, 0x01,
                0x00, 0x95, 0xA5, 0xB5,
                0xC5, 0xD5, 0x00, 0x4E,
            ];

            await hc05Device.write(command);
            console.log("Command sent with dynamic byte:", dynamicByte);

        } catch (error) {
            console.error("error sending text comand", error);
        }
    }


    const pressIn = (code: string) => {
        intervalRef.current = setInterval(() => {
            console.log('Repeated action while pressing...');
            console.log(hc05Device);

            sendTextCommand(code);
        }, 200);
    };

    const pressOut = () => {
        console.log("Pressed out");
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;

            sendTextCommand("0x00");
        }
    };

    const clickCommand =(code: string) =>{
        sendTextCommand(code);
        setTimeout(() => {
            sendTextCommand('0x00')
        }, 200);
    }

    useEffect(() => {
        requestBluetoothPermissions();
    }, []);

    useEffect(() => {
        const subscription = Dimensions.addEventListener('change', ({ window }) => {
            if (window.width > 800) {
                setIsTablet(true);
            } else if (window.width <= 800) {
                setIsTablet(false);
            }
        })
        return () => subscription?.remove();
    }, []);


    return (
        // <ScrollView>
        <View style={[styles.mainContainer, { flexDirection: isTablet ? 'row' : 'column' }]}>
            <View>
                <View style={styles.container}>
                    <View style={styles.mainBox}>
                        <TouchableOpacity onPressIn={() => pressIn('0x01')} onPressOut={pressOut} onPress={()=>clickCommand('0x01')}>
                            <Image source={H12} style={styles.icon} />
                        </TouchableOpacity>

                        <Image source={First} style={styles.bigIcon} />

                        <TouchableOpacity onPressIn={() => pressIn('0x02')} onPressOut={pressOut} onPress={()=>clickCommand('0x02')}>
                            <Image source={H2} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.container}>
                    <View style={styles.mainBox}>
                        <TouchableOpacity onPressIn={() => pressIn('0x03')} onPressOut={pressOut} onPress={()=>clickCommand('0x03')}>
                            <Image source={Trangel} style={styles.icon} />
                        </TouchableOpacity>

                        <Image source={Second} style={styles.bigIcon} />

                        <TouchableOpacity onPressIn={() => pressIn('0x04')} onPressOut={pressOut} onPress={()=>clickCommand('0x04')}>
                            <Image source={Treverse} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.container}>
                    <View style={styles.mainBox}>
                        <TouchableOpacity onPressIn={() => pressIn('0x05')} onPressOut={pressOut} onPress={()=>clickCommand('0x05')}>
                            <Image source={Backup} style={styles.icon} />
                        </TouchableOpacity>

                        <Image source={Three} style={styles.bigIcon} />

                        <TouchableOpacity onPressIn={() => pressIn('0x06')} onPressOut={pressOut} onPress={()=>clickCommand('0x06')}>
                            <Image source={Backdn} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            <View>
                <View style={styles.container}>
                    <View style={styles.mainBox}>
                        <TouchableOpacity onPressIn={() => pressIn('0x07')} onPressOut={pressOut} onPress={()=>clickCommand('0x07')}>
                            <Image source={slide} style={styles.icon} />
                        </TouchableOpacity>

                        <Image source={four} style={styles.bigIcon} />

                        <TouchableOpacity onPressIn={() => pressIn('0x08')} onPressOut={pressOut} onPress={()=>clickCommand('0x08')}>
                            <Image source={slide2} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.container}>
                    <View style={styles.mainBox}>
                        <TouchableOpacity onPressIn={() => pressIn('0x09')} onPressOut={pressOut} onPress={()=>clickCommand('0x09')}>
                            <Image source={sliderr1} style={styles.icon} />
                        </TouchableOpacity>

                        <Image source={First} style={styles.bigIcon} />

                        <TouchableOpacity onPressIn={() => pressIn('0x10')} onPressOut={pressOut} onPress={()=>clickCommand('0x10')}>
                            <Image source={slider2} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
        // </ScrollView>
    );
}

const styles = StyleSheet.create({
    mainBox: {
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    container: {
        height: hp('18%'),
        justifyContent: "space-between",
        alignItems: "center",
        margin: 15,
    },
    icon: {
        resizeMode: "contain",
        marginHorizontal: 20,
    },
    bigIcon: {
        width: 150,
        height: 150,
        resizeMode: "contain",
    },
    mainContainer: {
        height: hp('75%'),
        justifyContent: "space-evenly",
    }
});

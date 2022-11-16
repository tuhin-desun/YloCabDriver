import React, { useEffect, useState, useRef } from "react";
import * as Battery from 'expo-battery';
import { startActivityAsync, ActivityAction } from 'expo-intent-launcher';
import { Modal, StyleSheet, Text, AppState, View, TouchableOpacity } from 'react-native';
import NetInfo from "@react-native-community/netinfo";
import NoConnection from "./component/NoConnection";

export default function Check({ children }) {
    const [modalVisible, setModalVisible] = useState(false);
    const [netWorkState, setNetWorkState] = useState(false);
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        checkBatteryOptimization()
    }, [])

    useEffect(() => {
        const subscription = NetInfo.addEventListener(state => {
            setNetWorkState(state.isInternetReachable);
        });
        return () => {
            subscription();
        };
    }, [netWorkState]);

    useEffect(() => {
        const subscription = AppState.addEventListener("change", _handleAppStateChange);
        return () => {
            subscription.remove();
        };
    }, [appState]);

    const _handleAppStateChange = nextAppState => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            checkBatteryOptimization();
        }
        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };

    const checkBatteryOptimization = async () => {
        let result = await Battery.isBatteryOptimizationEnabledAsync();
        if (result) {
            setModalVisible(true); return;
        }
        setModalVisible(false);
    }

    const tryToGotoBatteryOptimization = async () => {
        const resultof = await startActivityAsync(ActivityAction.APPLICATION_SETTINGS);
    }

    return (
        <View style={{ flex: 1 }}>
            {netWorkState ? (
                <View style={styles.centeredView}>
                    {children}
                    {/* <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}>
                        <View style={[styles.centeredView, { backgroundColor: 'rgba(194,130,4,0.9)' }]}>
                            <View style={styles.modalView}>
                                <View style={styles.headingBackground}>
                                    <Text style={styles.heading}>Hello Captain</Text>
                                </View>
                                <View style={styles.body}>
                                    <Text style={styles.bodyText}>We have detected you have battery optimization enabled. We are accessing background location. Please disable battery optimization so that app can run smoothly and does not get killed by OS when not in use.</Text>
                                    <Text>{''}</Text>
                                    <Text style={styles.bodyText}>Battery Optimization</Text>
                                    <Text>{'________________'}</Text>
                                    <Text>{'1. Go to settings'}</Text>
                                    <Text>{'2. Search for app management'}</Text>
                                    <Text>{'3. Select YLO Cab Driver'}</Text>
                                    <Text>{'4. Select No restriction/Allow background activity/Disable battery optimization'}</Text>
                                    <Text>{''}</Text>
                                    <Text>{'You can also click on optimize button below we can try to take you there'}</Text>
                                </View>
                                <View style={{ flexDirection: 'row', justifyContent: 'space-around' }}>
                                    <TouchableOpacity
                                        style={[styles.buttonStyle, { backgroundColor: 'red' }]}
                                        activeOpacity={0.7}
                                        onPress={() => setModalVisible(!modalVisible)}
                                    >
                                        <Text style={styles.buttonTextColor}>IGNORE</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={[styles.buttonStyle, { backgroundColor: '#000' }]}
                                        activeOpacity={0.7}
                                        onPress={() => tryToGotoBatteryOptimization()}
                                    >
                                        <Text style={styles.buttonTextColor}>OPTIMIZE</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal> */}
                </View>
            ) : (
                <NoConnection netWorkState={netWorkState} />
            )}
        </View>
    );

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: 'center'
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        paddingHorizontal: 20,
        paddingVertical: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    headingBackground: {
        alignItems: 'center'
    },
    heading: {
        fontSize: 30,
        fontWeight: 'bold'
    },
    body: {
        marginVertical: 10
    },
    bodyText: {
        fontSize: 16,
        textAlign: 'justify'
    },
    buttonStyle: {
        width: '45%',
        borderRadius: 3,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center'
    },
    buttonTextColor: {
        color: '#fff'
    }
});
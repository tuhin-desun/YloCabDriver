import React, { useEffect, useState, useContext, useRef } from 'react';
import { Text, View, StyleSheet, Dimensions, FlatList, Modal, TouchableHighlight, TouchableWithoutFeedback, Switch, Image, Platform } from 'react-native';
import { Button } from 'react-native-elements';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import colors from '../config/colors';
import { Alert } from 'react-native';
import moment from 'moment';
import Header from "../component/Header";
import AppContext from "../context/AppContext";
import { getTimeStamp } from "../utils/Util";
import { updateTempBookingDataFirebase } from "../utils/helper";
import { updateBookingRequest } from "../services/APIServices";

var { width, height } = Dimensions.get('window');

export default function DriverTrips(props) {
    const context = useContext(AppContext);
    const mapRef = useRef();
    const [modalVisible, setModalVisible] = useState(false);
    const [isTimerActive, setIsTimerActive] = useState(props.route.params.timerState ?? true);
    const [providerTimeout, setProviderTimeout] = useState(props.route.params.providerTimeout ?? 30);
    const [selectedItem, setSelectedItem] = useState(null);
    const [activeBookings, setActiveBookings] = useState([]);
    const [region, setRegion] = useState(null);
    const latitudeDelta = 0.0922;
    const longitudeDelta = 0.0421;
    const [bookData, setBookData] = useState(props.route.params.bookData[0])
    useEffect(() => {
        const timer = setTimeout(() => {
            if (isTimerActive) {
                onPressIgnore(bookData);
                // console.log("Hello, World!")
            } else {
                clearTimeout(timer);
            }
        }, 30000);
        return () => clearTimeout(timer);
    }, [isTimerActive]);


    useEffect(() => {
        //Point 1 will be driver last location
        let point1 = { lat: bookData.tripdata.pickup.lat, lng: bookData.tripdata.pickup.lng };
        let point2 = { lat: bookData.tripdata.drop.lat, lng: bookData.tripdata.drop.lng };
        fitMap(point1, point2);
    }, []);

    const fitMap = (point1, point2) => {
        let startLoc = '"' + point1.lat + ',' + point1.lng + '"';
        let destLoc = '"' + point2.lat + ',' + point2.lng + '"';
        setTimeout(() => {
            mapRef.current.fitToCoordinates([{ latitude: point1.lat, longitude: point1.lng }, { latitude: point2.lat, longitude: point2.lng }], {
                edgePadding: { top: 40, right: 40, bottom: 40, left: 40 },
                animated: true,
            })
        }, 1000)
    }

    const onPressAccept = (item) => {
        let bookDataArr = [];

        const { first_name, last_name, id, mobile, picture, email, mini_id, wallet, vehicle_number, vehicle_model, service_name, service_type } = context.driverData
        console.log(context.driverData)
        if (wallet <= 0) {
            alert("Your wallet balance is 0. Please recharge first");
            return;
        }

        item.status = "ACCEPTED";
        item.driver_name = `${first_name} ${last_name}`;
        item.driver_contact = mobile;
        item.driver_image = picture;
        item.driver_arrive_time = getTimeStamp();
        item.vehicle_number = vehicle_number;
        item.vechile_model = vehicle_model;
        item.mini_id = mini_id ?? '';
        item.car_type = service_name ?? '';
        item.service_type = service_type ?? '';
        item.driver_id = id;
        item.driver_wallet = wallet;
        // console.log(context.driverData)
        // updateTempBookingDataFirebase(item, id);
        context.soundAlert.stopAsync();
        bookDataArr.push(item);
        setIsTimerActive(false);
        updateBookingRequest(item)
            .then((response) => {
                if (response.type == 'success') {
                    updateTempBookingDataFirebase(item, id);
                }
                if (response.type == 'error') {
                    alert(response.msg);
                }
            })
            .catch((err) => { console.log(err) })
        // props.navigation.navigate('StartTrip',{'curBooking': bookDataArr})
    };

    const onPressIgnore = (item) => {
        const { first_name, last_name, id, mobile, picture, email, wallet, vehicle_number, vehicle_model, service_name, service_type } = context.driverData
        item.status = "IGNORED";
        item.driver_name = `${first_name} ${last_name}`;
        item.driver_contact = mobile;
        item.driver_image = picture;
        item.driver_arrive_time = getTimeStamp();
        item.vehicle_number = vehicle_number;
        item.vechile_model = vehicle_model;
        item.car_type = service_name ?? '';
        item.service_type = service_type ?? ''
        // console.log(context.driverData)
        setIsTimerActive(false);
        updateTempBookingDataFirebase(item, id);
        context.soundAlert.stopAsync();
        props.navigation.goBack();
    };

    const goToBooking = (id) => {
        props.navigation.navigate('BookedCab', { bookingId: id });
    };



    useEffect(() => {

    }, []);

    return (
        <View style={styles.mainViewStyle}>
            <Header
                leftIconName={"ios-menu-sharp"}
                leftButtonFunc={() => props.navigation.toggleDrawer()}
                title={"Booking Request"}
                rightIconName={"name"}
                walletBalance={context.driverData.wallet}
            />

            <View style={styles.listItemView}>
                <View style={[styles.mapcontainer, activeBookings && activeBookings.length >= 1 ? { height: height - 500 } : null]}>
                    <MapView
                        ref={mapRef}
                        style={styles.map}
                        provider={PROVIDER_GOOGLE}
                        initialRegion={{
                            latitude: bookData.tripdata.pickup.lat,
                            longitude: bookData.tripdata.pickup.lng,
                            latitudeDelta: activeBookings && activeBookings.length >= 1 ? 0.0922 : 0.0822,
                            longitudeDelta: activeBookings && activeBookings.length >= 1 ? 0.0421 : 0.0321
                        }}
                    >
                        <Marker
                            coordinate={{ latitude: bookData.tripdata.pickup.lat, longitude: bookData.tripdata.pickup.lng }}
                            title={bookData.tripdata.pickup.add}
                            description={"Pickup Location"}
                            pinColor={colors.GREEN.default}
                        />

                        <Marker
                            coordinate={{ latitude: bookData.tripdata.drop.lat, longitude: bookData.tripdata.drop.lng }}
                            title={bookData.tripdata.drop.add}
                            description={"Drop Location"}
                        />
                        {bookData.estimate.waypoints ?
                            <MapView.Polyline
                                coordinates={bookData.estimate.waypoints}
                                strokeWidth={4}
                                strokeColor={colors.black}
                            />
                            : null}
                    </MapView>
                </View>

                <View style={[styles.mapDetails, { paddingHorizontal: 10 }]}>
                    <View style={styles.dateView}>
                        <Text style={styles.listDate}>{bookData.tripdata.type == 'round' ? bookData.tripdata.tripDate + ' to ' + bookData.tripdata.returnDate : bookData.tripdata.tripDate}</Text>
                        <Text style={styles.listDate}>{bookData.tripdata.type == 'round' ? 'Round Trip' : bookData.estimate.estimateDistance > 50 ? 'Out Station' : null}</Text>
                    </View>
                    
                    {/* <View style={styles.rateViewStyle}>
                                    <Text style={styles.rateViewTextStyle}>{'Rs'}{bookData ? bookData.estimate.estimateFare > 0 ? parseFloat(bookData.estimate.estimateFare).toFixed(2) : 0 : null}</Text>
                                </View> */}
                    <View style={styles.distance}>
                        <View style={styles.distanceColumn1}>
                            <Text style={styles.title}>Time</Text>
                            <Text style={styles.caption}>{bookData.estimate.estimateTime ? parseFloat(bookData.estimate.estimateTime).toFixed(1) > 59 ? `${parseFloat(bookData.estimate.estimateTime / 60).toFixed(0)} hour` : `${parseFloat(bookData.estimate.estimateTime).toFixed(0)} minutes` : `${0} minutes`}</Text>
                        </View>
                        <View style={styles.distanceColumn2}>
                            <Text style={styles.title}>Distance</Text>
                            <Text style={styles.caption}>{bookData.estimate.estimateDistance ? parseFloat(bookData.estimate.estimateDistance).toFixed(2) : 0} {'KM'}</Text>
                        </View>
                    </View>
                   
                    <View style={styles.addressViewStyle}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={styles.greenDot}></View>
                            <Text style={styles.addressViewTextStyle}>{bookData.tripdata.pickup.add}</Text>
                        </View>
                        <View style={styles.fixAdressStyle}>
                            <View style={styles.redDot}></View>
                            <Text style={styles.addressViewTextStyle}>{bookData.tripdata.drop.add}</Text>
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ color: 'black', fontSize: 16 }}>{"Booking For"}</Text>
                        <Text style={{ color: 'black', fontSize: 16 }}>{bookData.carName}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                        <Text style={{ color: 'black', fontSize: 16 }}>{"Booking ID"}</Text>
                        <Text style={{ color: 'black', fontSize: 16 }}>{bookData.bookingID}</Text>
                    </View>
                    
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between',  marginTop: 10  }}>
                        <Text style={{ fontSize: 20 }}>{"Total "}</Text>
                        <Text style={styles.rateViewTextStyle}>{"₹ "}{bookData ? bookData.estimate.estimateFare > 0 ? parseFloat(bookData.estimate.estimateFare).toFixed(2) : 0 : null}</Text>
                    </View>
                    {activeBookings && activeBookings.length >= 1 ?
                        <View style={styles.detailsBtnView}>
                            <View style={{ flex: 1 }}>
                                <Button
                                    onPress={() => {
                                        goToBooking(bookData.id);
                                    }}
                                    title={"Go to booking"}
                                    titleStyle={styles.titleStyles}
                                    buttonStyle={{
                                        backgroundColor: colors.GREEN.light,
                                        width: 180,
                                        height: 50,
                                        padding: 2,
                                        borderColor: colors.TRANSPARENT,
                                        borderWidth: 0,
                                        borderRadius: 5,
                                    }}
                                    containerStyle={{
                                        flex: 1,
                                        alignSelf: 'center',
                                        paddingRight: 14
                                    }}
                                />
                            </View>
                        </View>
                        :
                        <View style={styles.detailsBtnView}>
                            <View style={{ flex: 1 }}>
                                <Button
                                    onPress={() => {
                                        onPressIgnore(bookData);
                                    }}
                                    title={"Pass"}
                                    titleStyle={styles.titleStyles}
                                    buttonStyle={styles.myButtonStyle}
                                />
                            </View>
                            <View style={styles.viewFlex1}>
                                <Button
                                    title={"Accept"}
                                    titleStyle={styles.titleStyles}
                                    onPress={() => {
                                        onPressAccept(bookData)
                                    }}
                                    buttonStyle={[styles.myButtonStyle, { backgroundColor: colors.primary }]}
                                />
                            </View>
                        </View>
                    }
                </View>
            </View>




            <View style={styles.modalPage}>
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert("Modal Closed");
                    }}>
                    <View style={styles.modalMain}>
                        <View style={styles.modalContainer}>
                            <View style={styles.modalHeading}>
                                <Text style={styles.alertStyle}>{"Are you sure?"}</Text>
                            </View>
                            <View style={styles.modalBody}>
                                <Text style={{ fontSize: 16 }}>{"Ignore"}</Text>
                            </View>
                            <View style={styles.modalFooter}>
                                <TouchableHighlight
                                    style={[styles.btnStyle, styles.clickText]}
                                    onPress={() => {
                                        setModalVisible(!modalVisible);
                                        setSelectedItem(null);
                                    }}>
                                    <Text style={styles.cancelTextStyle}>{"Cancel"}</Text>
                                </TouchableHighlight>
                                <TouchableHighlight
                                    style={styles.btnStyle}
                                    onPress={() => {
                                        console.log("Cnceled")
                                    }}>
                                    <Text style={styles.okStyle}>{"Ok"}</Text>
                                </TouchableHighlight>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        </View>

    )




}

//Screen Styling
const styles = StyleSheet.create({
    headerStyle: {
        backgroundColor: colors.GREY.default,
        borderBottomWidth: 0
    },
    headerInnerStyle: {
        marginLeft: 10,
        marginRight: 10
    },
    headerTitleStyle: {
        color: colors.WHITE,
        fontFamily: 'Roboto-Bold',
        fontSize: 20
    },
    mapcontainer: {
        width: width,
        height: height / 2.5,
        borderBottomWidth: 3,
        borderColor: colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapDetails: {
        backgroundColor: colors.WHITE,
        flex: 1,
        flexDirection: 'column',
    },
    map: {
        flex: 1,
        ...StyleSheet.absoluteFillObject,
        overflow: 'hidden'
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: colors.TRANSPARENT,
        borderStyle: 'solid',
        borderLeftWidth: 9,
        borderRightWidth: 9,
        borderBottomWidth: 10,
        borderLeftColor: colors.TRANSPARENT,
        borderRightColor: colors.TRANSPARENT,
        borderBottomColor: colors.YELLOW.secondary,
        transform: [
            { rotate: '180deg' }
        ]
    },
    signInTextStyle: {
        fontFamily: 'Roboto-Bold',
        fontWeight: "700",
        color: colors.WHITE
    },
    listItemView: {
        height: height,
        width: '100%',
        marginBottom: 10,
        flexDirection: 'column',
    },
    dateView: {
        height: "10%",
        marginTop: -39,
        backgroundColor: colors.primary,
        width: '50%',
        alignSelf: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10
    },
    listDate: {
        fontSize: 20,
        fontWeight: 'bold',
        color: colors.GREY.default,
    },
    estimateView: {
        height: '20%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
        backgroundColor: 'green'
    },
    listEstimate: {
        fontSize: 20,
        color: colors.GREY.secondary,
    },
    addressViewStyle: {
        justifyContent: 'center',
        height: "30%",
        paddingLeft: 10,

    },
    no_driver_style: {
        color: colors.GREY.secondary,
        fontSize: 18,
    },
    addressViewTextStyle: {
        color: colors.GREY.secondary,
        fontSize: 15,
        marginLeft: 15,

        flexWrap: "wrap",
    },
    greenDot: {
        backgroundColor: colors.GREEN.default,
        width: 10,
        height: 10,
        borderRadius: 50
    },
    redDot: {
        backgroundColor: colors.RED,
        width: 10,
        height: 10,
        borderRadius: 50
    },
    detailsBtnView: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width,
        marginTop: 20,
        position: 'absolute',
        bottom: 50,
    },

    modalPage: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalMain: {
        flex: 1,
        backgroundColor: colors.GREY.background,
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalContainer: {
        width: '80%',
        backgroundColor: colors.WHITE,
        borderRadius: 10,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 15,
        flex: 1,
        maxHeight: 180
    },
    modalHeading: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBody: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalFooter: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        borderTopColor: colors.GREY.iconPrimary,
        borderTopWidth: 1,
        width: '100%',
    },
    btnStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mainViewStyle: {
        flex: 1,
        //marginTop: StatusBar.currentHeight
    },
    fixAdressStyle: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    myButtonStyle: {
        backgroundColor: colors.BLACK,
        width: "100%",
        padding: 2,
        borderColor: colors.TRANSPARENT,
        height: 60
    },
    alertStyle: {
        fontWeight: 'bold',
        fontSize: 18,
        width: '100%',
        textAlign: 'center'
    },
    cancelTextStyle: {
        color: colors.BLUE.secondary,
        fontSize: 18,
        fontWeight: 'bold',
        width: "100%",
        textAlign: 'center'
    },
    okStyle: {
        color: colors.BLUE.secondary,
        fontSize: 18,
        fontWeight: 'bold'
    },
    viewFlex1: {
        flex: 1
    },
    clickText: {
        borderRightColor: colors.GREY.iconPrimary,
        borderRightWidth: 1
    },
    titleStyles: {
        width: "100%",
        alignSelf: 'center'
    },
    rateViewStyle: {
        alignItems: 'center',
        height: "20%",
    },
    rateViewTextStyle: {
        fontSize: 24,
        color: colors.BLACK,
        fontFamily: 'Roboto-Bold',
        fontWeight: 'bold',
        textAlign: "center"
    },
    textContainerStyle: {
        flexDirection: 'row',
        alignItems: "flex-start",
        marginLeft: 35,
        marginRight: 35,
        marginTop: 10
    },
    textContainerStyle2: {
        flexDirection: 'column',
        alignItems: "flex-start",
        marginLeft: 35,
        marginRight: 35,
        marginTop: 10
    },
    textHeading: {
        fontWeight: 'bold',
        color: colors.GREY.secondary,
        fontSize: 15,
    },
    textContent: {
        color: colors.GREY.secondary,
        fontSize: 15,
        marginLeft: 3,
    },
    textContent2: {
        marginTop: 4,
        color: colors.GREY.secondary,
        fontSize: 15
    },
    distance: {
		flexDirection: "row",
		marginHorizontal: 10,
		paddingHorizontal: 10,
		marginTop: 15,
		paddingVertical: 20,
		borderRadius: 5,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	distanceColumn1: {
		borderRightWidth: 0.5,
		borderColor: colors.textInputBorder,
		width: "50%",
		alignItems: "center",
	},
	distanceColumn2: {
		borderLeftWidth: 0.5,
		borderColor: colors.textInputBorder,
		width: "50%",
		alignItems: "center",
	},
});
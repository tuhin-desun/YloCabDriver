import React from "react";
import {
	Text,
	StyleSheet,
	View,
	ImageBackground,
	Switch,
	Modal,
	Dimensions,
	ScrollView,
	TouchableOpacity,
	Image,
	Alert,
	Platform
} from "react-native";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import Header from "../component/Header";
import * as Location from "expo-location";
import * as IntentLauncher from "expo-intent-launcher";
import { Ionicons } from "@expo/vector-icons";
import * as TaskManager from 'expo-task-manager';
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps";
import carImageIcon from "../assets/track_Car.png";
import { postLocationData, getDriverProfile, fetchSettings } from '../services/APIServices';
import AppContext from "../context/AppContext";
import firebase from "../config/firebase";
import { Audio } from 'expo-av';
import { updateLocation } from "../utils/helper"
import { getValueOfSetting } from "../utils/Util";
import offline from "../assets/offline.png";


const windowHeight = Dimensions.get("window").height;
const windowWidth = Dimensions.get("window").width;
var { height, width } = Dimensions.get("window");
const hasNotch =
	Platform.OS === "ios" &&
	!Platform.isPad &&
	!Platform.isTVOS &&
	(height === 780 ||
		width === 780 ||
		height === 812 ||
		width === 812 ||
		height === 844 ||
		width === 844 ||
		height === 896 ||
		width === 896 ||
		height === 926 ||
		width === 926);

const LOCATION_TASK_NAME = 'background-location-task';

TaskManager.defineTask(LOCATION_TASK_NAME, ({ data: { locations }, error }) => {
	if (error) {
		console.log(error);
		return;
	}
	if (locations.length > 0) {
		let location = locations[locations.length - 1];
		if (location.coords) {
			//console.log(location)
			return location.coords;
		}
	}
});

// const StopBackgroundLocation = async () => {
//     try {
//       TaskManager.getRegisteredTasksAsync().then((res) => {
//           for (let i = 0; i < res.length; i++) {
//             if (res[i].taskName == LOCATION_TASK_NAME) {
//               Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
//               break;
//             }
//           }
//       });
//     } catch (error) {
//       console.log(error);
//     }
//   }


export default class Dashboard extends React.Component {
	static contextType = AppContext
	constructor(props) {
		super(props);

		this.state = {
			isOnline: false,
			modalVisible: false,
			serviceStatus: 'inactive',
			location: {},
			coordinates: [],
			region: {
				latitude: 22.4812931,
				longitude: 88.3859895,
				latitudeDelta: 0.0043,
				longitudeDelta: 0.0034,
			},
			intervalId: 0,
			bookingData: null,
			sound: '',
			providerTimeout: 30
		};

		this.mapViewRef = React.createRef();
		this.watcher = React.createRef();
		this.locationOn = React.createRef();


	}




	componentDidMount = () => {
		// this.StopBackgroundLocation();
		this.focusListeners = this.props.navigation.addListener('focus', () => {
			this.getSettings();
			getDriverProfile(this.context.driverData.id).then((response) => {
				console.log(response)
				if (response.check == 'success') {
					this.context.setDriverData(response.data);
					this.context.setServiceStatus(response.data.service_status)
				}
			}).catch((err) => { console.log(err) });
		})


		this.tempBookingRef = firebase.database().ref('TempBooking/' + this.context.driverData.id);

		Location.requestForegroundPermissionsAsync()
			.then((permissionResult) => {
				if (permissionResult.status === "granted") {
					Location.getProviderStatusAsync()
						.then((providerStatus) => {
							if (providerStatus.gpsAvailable) {
								this.getCurrentPosition();
							} else {
								Alert.alert(
									"Warning",
									"Please keep you GPS on to detect your location",
									[
										{ text: "Cancel", onPress: this.exitApp },
										{ text: "OK", onPress: this.openDeviceLocationSetting },
									]
								);
							}
						})
						.catch((error) => console.log(error));
				} else {
					Alert.alert(
						"Warning",
						"Please grant the permission to detect your location"
					);
				}
			})
			.catch((error) => console.log(error));

		this.StartBackgroundLocation();
		var intervalId = setInterval(this.getCurrentPosition, 1000);
		this.setState({ intervalId: intervalId });
		this.listernfortempBooking(this.tempBookingRef);



	};
	componentWillUnmount() {
		clearInterval(this.state.intervalId);
		this.focusListeners();
	}

	getSettings = () => {
		fetchSettings().then((response) => {
			if (response.type == 'success') {
				this.context.setSettings(response.data);
				this.setState({
					providerTimeout: getValueOfSetting(response.data, 'provider_select_timeout')[0].value
				})
			}
		}).catch((err) => { console.log(err) });
	}

	listernfortempBooking(tempBookingRef) {
		tempBookingRef.on('value', (snapshot) => {
			this.bookingData(snapshot);
		});
	}


	bookingData = (bookingData) => {
		let bookDataArr = [];
		let waypointsArr = [];
		let bookData = JSON.stringify(bookingData);
		if (bookData != 'null') {
			bookData = JSON.parse(bookData)
			if (bookData.hasOwnProperty('bookingID')) {
				let testObj = bookData.estimate.waypoints;
				const array = Object.keys(testObj).map(key => testObj[key]);
				bookData.estimate.waypoints = '';
				bookData.estimate.waypoints = array;
				bookDataArr.push(bookData);
				if (bookData.status == 'SEARCHING') {
					this.playSound();
					this.props.navigation.navigate("ActiveBooking", { 'bookData': bookDataArr, "timerState": true, "providerTimeout": this.state.providerTimeout, })
				}

				if (bookData.status == 'ACCEPTED') {

					this.props.navigation.navigate("ReachedScreen", { 'curBooking': bookDataArr, })
				}

				if (bookData.status == 'REACHED') {
					this.props.navigation.navigate("StartTrip", { 'curBooking': bookDataArr })
				}

				if (bookData.status == 'STARTED') {
					this.props.navigation.navigate("StopTrip", { 'curBooking': bookDataArr })
				}

				if (bookData.status == 'CANCELLED') {
					this.props.navigation.navigate("DashboardScreen")
				}

				if (bookData.status == 'PAYMENT_PENDING') {
					this.props.navigation.navigate("PaymentDetails", { 'curBooking': bookDataArr })
				}

				//console.log("waypointsArr",bookData.estimate.waypoints);
			}
		} else {
			console.log("Book data i am null inside else")
		}
	}



	playSound = async () => {
		console.log(this.context)
		this.context.soundAlert.playAsync();

	}

	stopPlaying = async () => {
		this.context.soundAlert.stopAsync();
	}

	StartBackgroundLocation = async () => {
		let permResp = await Location.requestForegroundPermissionsAsync();
		let tempWatcher = await Location.watchPositionAsync({
			accuracy: Location.Accuracy.Balanced
		}, location => {
			let latitude = location.coords.latitude;
			let longitude = location.coords.longitude;
			let latitudeDelta = 0.0043;
			let longitudeDelta = 0.0034;
			let new_location = {
				latitude: latitude,
				longitude: longitude,
			};
			// console.log("here-----",{ latitude, longitude, latitudeDelta, longitudeDelta })
			this.setState({
				location: new_location,
				region: { latitude, longitude, latitudeDelta, longitudeDelta }
			}, () => {
				this.sendLocationData();
			})
			tempWatcher.remove();
		})
		if (permResp.status == 'granted') {
			try {
				let { status } = await Location.requestBackgroundPermissionsAsync();
				if (status === 'granted') {
					await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
						accuracy: Location.Accuracy.BestForNavigation,
						showsBackgroundLocationIndicator: true,
						activityType: Location.ActivityType.AutomotiveNavigation,
						foregroundService: {
							killServiceOnDestroy: true,
							notificationTitle: 'Background Location Running',
							notificationBody: '',
							notificationColor: Colors.SKY
						}
					});
				} else {
					if (__DEV__) {
						this.StartForegroundGeolocation();
					} else {
						Alert.alert(t('alert'), 'location_permission_error')
					}
				}
			} catch (error) {
				if (__DEV__) {
					this.StartForegroundGeolocation();
				} else {
					Alert.alert(t('alert'), 'location_permission_error')
				}
			}
		} else {
			Alert.alert(t('alert'), 'location_permission_error')
		}
	}


	StartForegroundGeolocation = async () => {
		this.watcher.current = await Location.watchPositionAsync({
			accuracy: Location.Accuracy.High,
			activityType: Location.ActivityType.AutomotiveNavigation,
		}, location => {
			let latitude = location.coords.latitude;
			let longitude = location.coords.longitude;
			let latitudeDelta = 0.0043;
			let longitudeDelta = 0.0034;
			let new_location = {
				latitude: latitude,
				longitude: longitude,
			};
			this.setState({
				location: new_location,
				region: { latitude, longitude, latitudeDelta, longitudeDelta }
			}, () => {
				this.sendLocationData();
			})
		});
	}

	StopBackgroundLocation = async () => {
		this.locationOn.current = false;
		try {
			TaskManager.getRegisteredTasksAsync().then((res) => {
					for (let i = 0; i < res.length; i++) {
						if (res[i].taskName == LOCATION_TASK_NAME) {
							Location.stopLocationUpdatesAsync(LOCATION_TASK_NAME);
							break;
						}
					}
			});
		} catch (error) {
			console.log(error);
		}
	}



	openDeviceLocationSetting = () => {
		IntentLauncher.startActivityAsync(
			IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
		)
			.then((result) => this.getCurrentPosition())
			.catch((error) => console.log(error));
	};

	getCurrentPosition = () => {
		Location.getCurrentPositionAsync({ accuracy: 1 })
			.then((locationResult) => {
				let location = {
					latitude: locationResult.coords.latitude,
					longitude: locationResult.coords.longitude,
				};
				// this.getAddress(location);
				this.setState({ location: location }, () => {
					this.sendLocationData();
				});
			})
			.catch((error) => console.log(error));
	};

	getAddress = async (location) => {
		let address = await Location.reverseGeocodeAsync(location);
		this.geRegion();
		this.setState({
			currentAddress: `${address[0].name}, ${address[0].city}, ${address[0].country}`,
		});
	};

	geRegion = () => {
		let { location } = this.state;
		let latitude = location.latitude;
		let longitude = location.longitude;
		let latitudeDelta = 0.0043;
		let longitudeDelta = 0.0034;
		this.setState({
			region: { latitude, longitude, latitudeDelta, longitudeDelta }
		})
	};

	onRegionChange = (region) => {
		let location = {
			latitude: region.latitude,
			longitude: region.longitude,
		}
		this.setState({ region: region, location: location }, () => {
			this.sendLocationData();
		});
	}


	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};

	sendLocationData = () => {
		let reqObj = {
			'location': this.state.location,
			'user_id': this.context.driverData.id
		}
		this.context.setLocationUpdateData(reqObj);
		// console.log(reqObj)
		// console.log(this.context.locationUpdateData)
		updateLocation(this.state.location, this.context.driverData.id);
		postLocationData(reqObj)
			.then((response) => {

			})
			.catch((error) => { console.log(error) })
	}

	render = () => {
		const { modalVisible } = this.state;
		// console.log("location ---",this.state.region, this.state.location, typeof this.state.location?.latitude)
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"ios-menu-sharp"}
					leftButtonFunc={() => this.props.navigation.toggleDrawer()}
					title={"Hello Captain"}
					rightIconName={"name"}
					walletBalance={this.context.driverData.wallet}
					{...this.props}
				/>
				{this.context.serviceStatus == 'active' ? (
					<View style={styles.mapcontainer}>
						{typeof this.state.location?.latitude != 'undefined' ? (
							<MapView
								ref={this.mapViewRef}
								style={styles.mapViewStyle}
								provider={PROVIDER_GOOGLE}
								region={this.state.region}
								showsUserLocation={false}
								followsUserLocation={true}
								loadingEnabled={false}
								loadingIndicatorColor={Colors.primary}
								userLocationUpdateInterval={500}
								onRegionChange={this.onRegionChange}
							>
								<Marker
									coordinate={{ latitude: this.state.region.latitude, longitude: this.state.region.longitude }}
									pinColor={Colors.GREEN.default}
								>
									<View style={{ alignItems: 'center' }}>
										<Image
											source={carImageIcon}
											style={{ height: 40, width: 40 }}
										/>
									</View>
								</Marker>
							</MapView>
						) : null}
					</View>
				) : (
					<View style={{ flex: 1, backgroundColor: Colors.white }}>
						<View style={{height: 100, justifyContent: 'center', alignItems: 'center'}}>
							<Text style={{fontSize: 20}}>Be Online!</Text>
							<Text style={{fontSize: 18}}>Customers are waiting to travel with you</Text>
						</View>
						<View>
							<Image source={offline} resizeMode={'contain'} style={{ height: '100%', width: '100%' }} />
						</View>
					</View>
				)}

			</View>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	image: {
		flex: 1,
		resizeMode: "contain",
		justifyContent: "flex-end",
	},
	text: {
		fontSize: 20,
		color: Colors.white,
		fontWeight: "bold",
	},
	centeredView: {
		height: windowHeight,
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalView: {
		margin: 15,
		backgroundColor: "white",
		borderRadius: 10,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 4,
		elevation: 5,
	},
	mapcontainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
	},
	mapViewStyle: {
		flex: 1,
		...StyleSheet.absoluteFillObject,
	},
	mapFloatingPinView: {
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "transparent",
	},
	mapFloatingPin: {
		height: 40,
	},
	button: {
		borderRadius: 5,
		paddingHorizontal: 10,
		paddingVertical: 15,
		elevation: 2,
		width: "48%",
	},
	buttonCancel: {
		backgroundColor: Colors.lightGrey,
	},
	buttonUpdate: {
		backgroundColor: Colors.primary,
	},
	textStyle: {
		// color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalHead: {
		paddingVertical: 40,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.white,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	headtext: {
		fontSize: 25,
		fontWeight: "bold",
	},
	modalBody: {
		height: windowHeight / 4,
		justifyContent: "center",
	},
	modalText: {
		fontWeight: "bold",
		fontSize: 13,
		marginLeft: 5,
	},
	switchOuter: {
		height: 100,
		width: 100,
		borderRadius: 100 / 2,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.29,
		shadowRadius: 4.65,

		elevation: 7,
	},
	switchText: {
		fontWeight: "bold",
		fontSize: 16,
	},
	switchInner: {
		height: 90,
		width: 90,
		borderRadius: 90 / 2,
		borderWidth: 3,
		borderColor: Colors.white,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
	},
});

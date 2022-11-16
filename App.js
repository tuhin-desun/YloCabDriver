import React from "react";
import AppLoading from "expo-app-loading";
import * as Notifications from "expo-notifications";
import Configs from "./config/Configs";
import GlobalState from "./context/GlobalState";
import Navigation from "./navigation/Navigation";
import { getDriverProfile, getCancelReasons, fetchSettings } from "./services/APIServices";
import {
	readDriverData,
	writeDriverData,
	removeDriverData,
} from "./utils/Util";
import { LogBox } from 'react-native';
import AppContext from "./context/AppContext";
import { Audio, INTERRUPTION_MODE_ANDROID_DO_NOT_MIX } from 'expo-av';
import Check from './Check';


Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: true,
		shouldSetBadge: true,
	}),
});

export default class App extends React.Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			isReady: false,
			driverData: null,
			driverBookingData: undefined,
			sound: '',
			cancelReasons: null
		};
		this.notificationListener = React.createRef();
		this.responseListener = React.createRef();
	}

	loadSound = async () => {
		Audio.setAudioModeAsync({
			allowsRecordingIOS: false,
			staysActiveInBackground: true,
			playsInSilentModeIOS: true,
			shouldDuckAndroid: true,
			playThroughEarpieceAndroid: false,
			useNativeControls: false
		});

		const { sound } = await Audio.Sound.createAsync(require('./assets/sound/car_horn_gap.wav'));
		sound.setIsLoopingAsync(true);
		this.setState({
			sound: sound
		});
	}


	componentDidMount() {
		LogBox.ignoreAllLogs();
		this.notificationListener.current =
			Notifications.addNotificationReceivedListener((notification) => {
				// console.log(notification);
			});

		this.responseListener.current =
			Notifications.addNotificationResponseReceivedListener((response) => {
				// console.log(response);
			});
	}

	componentWillUnmount = () => {
		Notifications.removeNotificationSubscription(
			this.notificationListener.current
		);
		Notifications.removeNotificationSubscription(this.responseListener.current);
	};


	persistData = () => {
		Promise.all([readDriverData(), getCancelReasons(), this.loadSound(), fetchSettings()])
			.then((response) => {
				let data = response[0];
				this.setState({
					cancelReasons: response[1]?.data,
					settingsData: response[3]?.data,
				})
				if (data !== null) {
					getDriverProfile(data.id).then((response) => {
						// this.loadSound()
						if (response.check === Configs.SUCCESS_TYPE) {
							let resData = response.data;
							resData.access_token = data.access_token;
							delete resData["gender"];
							delete resData["member_since"];

							writeDriverData(resData);
							this.setState({

								driverData: resData,
								isReady: true,
							});
						} else {
							removeDriverData();
							this.setState({
								driverData: null,
								isReady: true,
							});
						}
					});
				} else {

					this.setState({
						driverData: data,
						isReady: true,
					});
				}
			})
			.catch((error) => console.log(error));
	};

	onFinish = () => null;

	render = () =>
		this.state.isReady ? (
			<Check>
				<GlobalState driverData={this.state.driverData} sound={this.state.sound} cancelReasons={this.state.cancelReasons} settingsData={this.state.settingsData}>
					<Navigation />
				</GlobalState>
			</Check>
		) : (
			<AppLoading
				startAsync={this.persistData}
				onFinish={this.onFinish}
				onError={console.log}
			/>
		);
}

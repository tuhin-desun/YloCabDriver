import React, { useState, useRef, useContext, useEffect } from "react";
import {
	View,
	StyleSheet,
	Text,
	Dimensions,
	Animated,
	Platform,
	TouchableOpacity,
	SafeAreaView,
} from "react-native";
import {
	CodeField,
	Cursor,
	useBlurOnFulfill,
	useClearByFocusCell,
} from "react-native-confirmation-code-field";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { FontAwesome } from "@expo/vector-icons";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import firebase from "../config/firebase";
import { OverlayLoader } from "../component";
import { driverAuthentication } from "../services/APIServices";
import { writeDriverData } from "../utils/Util";
import AppContext from "../context/AppContext";
import { writeUserDataToFirebase } from '../utils/helper';
import { errorToast } from "../utils/Alerts";
import { Root } from 'react-native-alert-notification';
import ProgressLoader from 'rn-progress-loader';
import { sendOTP } from "../services/APIServices";

const windowheight = Dimensions.get("window").height;
const windowwidth = Dimensions.get("window").width;
const CELL_COUNT = 4;
const CELL_SIZE = 35;

const styles = StyleSheet.create({
	container: {
		height: windowheight + Constants.statusBarHeight,
		backgroundColor: Colors.white,
	},
	section: {
		marginTop: 60,
		paddingHorizontal: 25,
	},
	codeFiledRoot: {
		marginTop: 20,
		width: 280,
		marginLeft: "auto",
		marginRight: "auto",
	},
	cellRoot: {
		width: CELL_SIZE,
		height: CELL_SIZE,
		justifyContent: "center",
		alignItems: "center",
		borderBottomColor: "#ccc",
		borderBottomWidth: 1,
	},
	cellText: {
		color: "#000",
		fontSize: 18,
		textAlign: "center",
	},
	focusCell: {
		borderBottomColor: Colors.primary,
		borderBottomWidth: 2,
	},
	title: {
		marginTop: 30,
		color: "#000",
		fontSize: 25,
		fontWeight: "600",
		paddingBottom: 5,
	},
	subTitle: {
		color: "#000",
		marginBottom: 30,
	},
	backImageContainer: {
		position: "absolute",
		bottom: 0,
		alignItems: "center",
		width: windowwidth,
	},
	resendOtp: {
		width: 120,
		flexDirection: "row",
		marginTop: 30,
		padding: 5,
		alignSelf: "center",
		alignItems: "center",
		justifyContent: "center",
		borderWidth: 1,
		borderColor: Colors.danger,
		borderRadius: 3,
	},
	resentOtpText: {
		color: Colors.danger,
		fontWeight: "bold",
		fontSize: 16,
	},
	borderDanger: {
		borderWidth: 1,
		borderColor: Colors.danger,
	},
});

const OtpVerification = ({ navigation, route }) => {
	const context = useContext(AppContext);
	const recaptchaVerifier = useRef(null);
	const phoneNumber =
		typeof route.params !== "undefined" ? route.params.phoneNumber : undefined;
	const [otp, setOtp] = useState(typeof route.params !== "undefined" ? route.params.otp : undefined);
	const [value, setValue] = useState("");
	const [timerValue, setTimerValue] = useState(Configs.TIMER_VALUE);
	const [timerExpired, setTimerExpired] = useState(false);
	const [loaderVisible, setLoaderVisible] = useState(false);
	const [verificationToken, setVerificationToken] = useState(
		route.params !== "undefined" ? route.params.verificationToken : undefined
	);
	const [message, setMessage] = useState(
		"Please enter the verification code\nwe send to " +
		Configs.PHONE_NUMBER_COUNTRY_CODE +
		phoneNumber
	);

	const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
	const [props, getCellOnLayoutHandler] = useClearByFocusCell({
		value,
		setValue,
	});

	const finishHandler = (value) => {
		if (value != null) {
			setValue(value);
			if (value.length === CELL_COUNT) {
				// setLoaderVisible(true);
				if (value == otp) {
					Promise.all([
						Notifications.getExpoPushTokenAsync({ experienceId: '@ylocab/YloCabDriver' }),
					])
						.then((result) => {
							setTimerExpired(true);
							let tokenData = result[0];
							let reqObj = {
								mobile: phoneNumber,
								device_token: tokenData.data,
								device_type: Platform.OS,
							};

							driverAuthentication(reqObj)
								.then((response) => {
									console.log(response)
									setLoaderVisible(false);
									if (response.check === Configs.SUCCESS_TYPE) {
										let data = response.data;
										if (data.status === Configs.STATUS_ONBOARDING) {
											if (data.first_name === null || data.last_name === null || data.owner_name === null || data.vehicle_number === null || data.vehicle_number === "") {
												navigation.navigate("SetupAccount", {
													id: data.id,
													mobile: data.mobile,
													accessToken: data.access_token,
												});
											} else {
												navigation.navigate("OnboardingStatus", { id: data.id });
											}
										} else if (data.status === Configs.STATUS_BANNED) {
											navigation.navigate("BannedStatus");
										} else {
											writeDriverData(data);
											writeUserDataToFirebase(data, data.id)
											context.setDriverData(data);
										}
									} else {
										setMessage(response.message);
									}
								})
								.catch((error) => console.log(error));
						})
						.catch((error) => {
							console.log(error);
							setLoaderVisible(false);
							setValue('');
						});
				} else {
					setLoaderVisible(false);
					setMessage(
						"The SMS verification code used to validate phone number is invalid. Please resend the verification code sms and be sure to use the verification code provided by the user."
					);
					errorToast('Error', 'Oops! Wrong OTP')
					setValue('');
				}
			}
		}
	};

	const resendOTP = () => {
		setValue("");
		setMessage(
			"Please enter the verification code\nwe send to " +
			Configs.PHONE_NUMBER_COUNTRY_CODE +
			phoneNumber
		);
		sendOTP({ mobile: phoneNumber }).then((res) => {
			setTimerExpired(false);
			setTimerValue(Configs.TIMER_VALUE);
			setOtp(res.body);
		}).catch((err) => {
			console.log(err)

		});
	};

	const updateTimer = () => {
		const x = setInterval(() => {
			if (timerValue <= 1) {
				setTimerExpired(true);
			} else {
				setTimerValue(timerValue - 1);
			}
		}, 1000);
		return x;
	};

	const renderCell = ({ index, symbol, isFocused }) => {
		return (
			<View
				key={index}
				style={[styles.cellRoot, isFocused && styles.focusCell]}
				onLayout={getCellOnLayoutHandler(index)}
			>
				<Text style={styles.cellText}>
					{symbol || (isFocused ? <Cursor /> : null)}
				</Text>
			</View>
		);
	};

	useEffect(() => {
		const timer = updateTimer();
		return () => clearInterval(timer);
	}, [timerValue]);

	return (
		<Root theme={'dark'}>
			<SafeAreaView>
				<View style={styles.container}>
					<View style={styles.section}>
						<Text style={styles.title}>Verify phone number</Text>
						<Text style={styles.subTitle}>{message}</Text>

						<CodeField
							ref={ref}
							{...props}
							value={value}
							onChangeText={finishHandler}
							cellCount={CELL_COUNT}
							rootStyle={styles.codeFiledRoot}
							keyboardType="number-pad"
							textContentType="oneTimeCode"
							renderCell={renderCell}
						/>

						{timerExpired ? (
							<TouchableOpacity
								activeOpacity={0.6}
								style={styles.resendOtp}
								onPress={resendOTP}
							>
								<FontAwesome name="repeat" size={14} color={Colors.danger} />
								<Text style={styles.resentOtpText}>{" Resend OTP"}</Text>
							</TouchableOpacity>
						) : (
							<Text style={{ marginTop: 25, textAlign: "center" }}>
								{"Resend OTP in "}
								<Text style={{ color: Colors.danger }}>{timerValue + " Secs"}</Text>
							</Text>
						)}
					</View>
					<View style={styles.backImageContainer}>
						<Animated.Image
							source={require("../assets/mobile_verification.png")}
							resizeMode="cover"
							style={{
								height: Math.floor(windowwidth / 3),
								width: windowwidth,
							}}
						/>
					</View>
					<FirebaseRecaptchaVerifierModal
						ref={recaptchaVerifier}
						firebaseConfig={firebase.app().options}
						attemptInvisibleVerification={true}
					/>
					<ProgressLoader
						visible={loaderVisible}
						color={Colors.primary}
						hudColor={Colors.WHITE}
						isModal={true} isHUD={true}
					/>
				</View>
			</SafeAreaView>
		</Root>


	);
};

export default OtpVerification;

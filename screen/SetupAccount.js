import React from "react";
import {
	Text,
	StyleSheet,
	View,
	TextInput,
	TouchableOpacity,
	ScrollView,
	Image,
	Alert,
	BackHandler,
	StatusBar,
	Platform
} from "react-native";
import {
	FontAwesome,
	Entypo,
	Ionicons,
	MaterialCommunityIcons,
} from "@expo/vector-icons";
import Animated, { FadeInRight, FadeOutLeft, Layout } from "react-native-reanimated";
import Constants from "expo-constants";
import DropDownPicker from "react-native-dropdown-picker";
import { Picker } from '@react-native-picker/picker';
import CheckBox from "@react-native-community/checkbox";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { OverlayLoader, RadioButton, ImageHandler, ImageComponent } from "../component";
import { isMobile, isEmail, isNumeric, getFileData, getValueOfSetting, writeSignupData, readSignupData, removeSignupData } from "../utils/Util";
import { getServiceTypes, setupAccount, getStates, uploadDocument, fetchSettings } from "../services/APIServices";
import * as Updates from 'expo-updates';
import { successDailog, errorToast } from "../utils/Alerts";
import { Root } from 'react-native-alert-notification';

const COMMISION_TYPE = [
	{ label: 'Fixed', value: 'fixed' },
	{ label: 'Percentage', value: 'percentage' }
]



export default class SetupAccount extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			showLoader: false,
			imageLoader: false,
			nextStep: 1,
			services: [],
			id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
			accessToken:
				typeof props.route.params !== "undefined"
					? props.route.params.accessToken
					: null,
			firstName: "",
			lastName: "",
			email: "",
			password: "",
			driveMobile: props.route.params?.mobile ?? '',
			drivergender: "Male",
			driverAddress: "",
			driverPincode: "",
			driverState: "1",
			miniID: "",
			alternateNumber: '',
			relativeNumber: '',
			relativeNumber2: '',
			relationWithRelative: '',
			relationWithRelative2: '',
			commisionType: '',
			states: [],
			selectedState: '',
			driverPO: "",
			driverPS: "",
			drivingLicenseNumber: "",
			issueOfLicense: "",
			drivingExperience: "",
			driverBloodGroup: "",
			perTripCharge: 0.00,
			ownerName: "",
			ownergender: "Male",
			ownerMobile: "",
			ownerEmail: "",
			ownerAddress: "",
			ownerPincode: "",
			ownerState: "",
			ownerPO: "",
			ownerPS: "",
			ownerBloodGroup: "",
			serviceTypeID: undefined,
			vehicleModel: "",
			vehicleNumber: "",
			yearOfRegistration: "",
			baseFare: "",
			isAgreeTOC: false,
			commisionTypes: COMMISION_TYPE,
			firstNameValidationFailed: false,
			lastNameValidationFailed: false,
			emailValidationFailed: false,
			passwordValidationFailed: false,
			driverAddressValidationFailed: false,
			driverPincodeValidationFailed: false,
			driverStateValidationFailed: false,
			driverPOValidationFailed: false,
			driverPSValidationFailed: false,
			drivingLicenseNumberValidationFailed: false,
			issueOfLicenseValidationFailed: false,
			drivingExperienceValidationFailed: false,
			driverBloodGroupValidationFailed: false,
			perTripChargeValidationFailed: false,
			ownerNameValidationFailed: false,
			ownerMobileValidationFailed: false,
			ownerAddressValidationFailed: false,
			ownerPincodeValidationFailed: false,
			ownerStateValidationFailed: false,
			ownerPOValidationFailed: false,
			ownerPSValidationFailed: false,
			ownerBloodGroupValidationFailed: false,
			serviceTypeValidationFailed: false,
			vehicleModelValidationFailed: false,
			vehicleNumberValidationFailed: false,
			yearOfRegistrationValidationFailed: false,
			baseFareValidationFailed: false,
			passwordHidden: true,
			fixed_commision: 0,
			percentage_commision: 0,

			ownerAdharCardFront: undefined,
			ownerAdharCardBack: undefined,
			ownerPanCardFront: undefined,
			ownerPanCardBack: undefined,
			ownerVoterCardFront: undefined,
			ownerVoterCardBack: undefined,
			driverPanCardFront: undefined,
			driverPanCardBack: undefined,
			driverVoterCardFront: undefined,
			driverVoterCardBack: undefined,
			driverAdharCardFront: undefined,
			driverAdharCardBack: undefined,
			driverDrivingLicenceFront: undefined,
			driverDrivingLicenceBack: undefined,
			ownerAgreementCopy1: undefined,
			ownerAgreementCopy2: undefined,
			ownerAgreementCopy3: undefined,
			ownerAgreementCopy4: undefined,
			ownerAgreementCopy5: undefined,
			nocCopy1: undefined,
			nocCopy2: undefined,
			nocCopy3: undefined,
			nocCopy4: undefined,
			nocCopy5: undefined,
			vehiclePaper: undefined,
			insuranceCopy: undefined,
			registrationCopy: undefined,
			carFrontPhoto: undefined,
			cfCopy: undefined,
			permitCopy: undefined,
			vehicleTaxPaper: undefined,

			ownerAdharCardFrontURI: undefined,
			ownerAdharCardBackURI: undefined,
			ownerPanCardFrontURI: undefined,
			ownerPanCardBackURI: undefined,
			ownerVoterCardFrontURI: undefined,
			ownerVoterCardBackURI: undefined,
			driverPanCardFrontURI: undefined,
			driverPanCardBackURI: undefined,
			driverVoterCardFrontURI: undefined,
			driverVoterCardBackURI: undefined,
			driverAdharCardFrontURI: undefined,
			driverAdharCardBackURI: undefined,
			driverDrivingLicenseFrontURI: undefined,
			driverDrivingLicenseBackURI: undefined,
			ownerAgreementCopy1URI: undefined,
			ownerAgreementCopy2URI: undefined,
			ownerAgreementCopy3URI: undefined,
			ownerAgreementCopy4URI: undefined,
			ownerAgreementCopy5URI: undefined,
			nocCopy1URI: undefined,
			nocCopy2URI: undefined,
			nocCopy3URI: undefined,
			nocCopy4URI: undefined,
			nocCopy5URI: undefined,
			vehiclePaperURI: undefined,
			insuranceCopyURI: undefined,
			registrationCopyURI: undefined,
			carFrontPhotoURI: undefined,
			cfCopyURI: undefined,
			permitCopyURI: undefined,
			vehicleTaxPaperURI: undefined,

			ownerAdharCardFrontVisible: false,
			ownerAdharCardBackVisible: false,
			ownerPanCardFrontVisible: false,
			ownerPanCardBackVisible: false,
			ownerVoterCardFrontVisible: false,
			ownerVoterCardBackVisible: false,
			driverPanCardFrontVisible: false,
			driverPanCardBackVisible: false,
			driverVoterCardFrontVisible: false,
			driverVoterCardBackVisible: false,
			driverAdharCardFrontVisible: false,
			driverAdharCardBackVisible: false,
			driverDrivingLicenseFrontVisible: false,
			driverDrivingLicenseBackVisible: false,
			ownerAgreementCopy1Visible: false,
			ownerAgreementCopy2Visible: false,
			ownerAgreementCopy3Visible: false,
			ownerAgreementCopy4Visible: false,
			ownerAgreementCopy5Visible: false,
			nocCopy1Visible: false,
			nocCopy2Visible: false,
			nocCopy3Visible: false,
			nocCopy4Visible: false,
			nocCopy5Visible: false,
			vehiclePaperVisible: false,
			insuranceCopyVisible: false,
			registrationCopyVisible: false,
			carFrontPhotoVisible: false,
			cfCopyVisible: false,
			permitCopyVisible: false,
			vehicleTaxPaperVisible: false,
			isSameDO: false,
		};

	}




	componentDidMount = () => {
		console.log(this.state.driveMobile)
		let { accessToken } = this.state;
		this.setState({ showLoader: true })
		Promise.all([getServiceTypes(accessToken), getStates(), fetchSettings(), readSignupData()])
			.then((response) => {
				console.log("Response came from promise.all", response[3])
				this.setState({
					showLoader: false,
					services: response[0].map((v, i) => ({
						value: v.id,
						label: v.name,
					})),
					states: response[1].data.map((v, i) => ({
						value: v.id,
						label: v.name,
					})),
					fixed_commision: getValueOfSetting(response[2].data, 'fixed_commision_value')[0].value + 'rs',
					percentage_commision: getValueOfSetting(response[2].data, 'percentage_commision_value')[0].value + '%',
				});
				if(response[3] != null){
						this.setState({
							id: response[3]?.id ?? '',
							firstName: response[3]?.first_name ?? '',
							lastName: response[3]?.last_name ?? '',
							email: response[3]?.email ?? '',
							password: response[3]?.password ?? '',
							drivergender: response[3]?.gender ?? '',
							alternateNumber: response[3]?.alternate_number ?? '',
							relativeNumber: response[3]?.relative_number ?? '',
							relativeNumber2: response[3]?.relative_number2 ?? '',
							driverBloodGroup: response[3]?.bloodgroup ?? '',
							driverAddress: response[3]?.address ?? '',
							driverPincode: response[3]?.pincode ?? '',
							driverState: response[3]?.state ?? '',
							driverPO: response[3]?.po ?? '',
							driverPS: response[3]?.ps ?? '',
							relationWithRelative: response[3]?.relation_with_relative ?? '',
							relationWithRelative2: response[3]?.relation_with_relative2 ?? '',
							commisionType: response[3]?.commision_type ?? '',
							drivingLicenseNumber: response[3]?.dlno ?? '',
							issueOfLicense: response[3]?.issue_of_license ?? '',
							drivingExperience: response[3]?.driving_experience ?? '',
							miniID: response[3]?.mini_id ?? '',
							perTripCharge: response[3]?.per_trip_charge ?? '',
							ownerName: response[3]?.owner_name ?? '',
							ownerEmail: response[3]?.owner_email ?? '',
							ownerMobile: response[3]?.owner_mobile ?? '',
							ownergender: response[3]?.owner_gender ?? '',
							ownerAddress: response[3]?.owner_address ?? '',
							ownerPincode: response[3]?.owner_pincode ?? '',
							ownerState: response[3]?.owner_pincode ?? '',
							ownerPO: response[3]?.owner_po ?? '',
							ownerPS: response[3]?.owner_ps ?? '',
							ownerBloodGroup: response[3]?.owner_bloodGroup ?? '',
							serviceTypeID: response[3]?.service_type_id ?? '',
							vehicleNumber: response[3]?.service_number ?? '',
							vehicleModel: response[3]?.service_model ?? '',
							yearOfRegistration: response[3]?.year_of_registration ?? '',
							baseFare: response[3]?.base_fare ?? '',
							nextStep: response[3]?.step ?? 1
						})	
				}

			})
			.catch((error) => console.log(error));
	};

	reloadApp = () => {
		this.restart()
	}

	restart = () => {
		if (Platform.OS == "web") {
			window.location.reload()
		}
		else {
			removeSignupData();
			setTimeout(() => {
				Updates.reloadAsync();
			}, 200);
		}
	}

	setDriverGender = (value) => this.setState({ drivergender: value });

	setOwnerGender = (value) => this.setState({ ownergender: value });

	toggleTOC = () => this.setState({ isAgreeTOC: !this.state.isAgreeTOC });

	toggleDOS = () => {
		if(this.state.isSameDO){
			this.setState({
				isSameDO: !this.state.isSameDO,
				ownerName: "",
				ownerEmail: "",
				ownerMobile: "",
				ownergender: "",
				ownerAddress: "",
				ownerPincode: "",
				ownerState: "",
				ownerPO: "",
				ownerPS: "",
				ownerBloodGroup: "",
			});
			return;
		}
		this.setState({
			isSameDO: !this.state.isSameDO,
			ownerName: `${this.state.firstName} ${this.state.lastName}`,
			ownerEmail: this.state.email,
			ownerMobile: this.state.driveMobile,
			ownergender: this.state.drivergender,
			ownerAddress: this.state.driverAddress,
			ownerPincode: this.state.driverPincode,
			ownerState: this.state.driverState,
			ownerPO: this.state.driverPO,
			ownerPS: this.state.driverPS,
			ownerBloodGroup: this.state.driverBloodGroup,
		});
	};

	// nextStepHandler = async () => {
	// 	const { nextStep } = this.state;
	// 	let currentStep = parseInt(nextStep) + 1;
	// 	const result = await this.saveData();
	// 	if (typeof result != 'undefinded' && result.check == 'success') {
	// 		if (currentStep != 6) {
	// 			this.setState({
	// 				showLoader: false,
	// 				nextStep: currentStep
	// 			})
	// 		} else {
	// 			alert("Sorry you are in last step")
	// 		}
	// 	}
	// }

	prevStepHandler = () => {
		const { nextStep } = this.state;
		let currentStep = parseInt(nextStep) - 1;
		if (currentStep != 0) {
			this.setState({
				nextStep: currentStep
			})
		}
	}

	showAlertUser = () => {
		Alert.alert(
			"Account Created Successfully",
			" ",
			[
				{ text: "OK", onPress: () => this.reloadApp() }
			]
		);
	}

	handlePasswordVisibility = () => {
		this.setState({
			passwordHidden: !this.state.passwordHidden
		})
	}

	writeSignUpDataForBackUp = (reqObj) => {
		readSignupData().then((res)=>{
			console.log("Result of soemthing", res, reqObj)
			if(res){
				const newObj = {...res,...reqObj};
				writeSignupData(newObj);
			}else{
				writeSignupData(reqObj);
			}
			
		}).catch((err)=>{
			console.log(err)
		});
	}

	saveData = async () => {
		this.setState(
			{
				firstNameValidationFailed: false,
				lastNameValidationFailed: false,
				emailValidationFailed: false,
				driverAddressValidationFailed: false,
				driverPincodeValidationFailed: false,
				driverStateValidationFailed: false,
				driverPOValidationFailed: false,
				driverPSValidationFailed: false,
				drivingLicenseNumberValidationFailed: false,
				issueOfLicenseValidationFailed: false,
				drivingExperienceValidationFailed: false,
				driverBloodGroupValidationFailed: false,
				perTripChargeValidationFailed: false,
				ownerNameValidationFailed: false,
				ownerMobileValidationFailed: false,
				ownerAddressValidationFailed: false,
				ownerPincodeValidationFailed: false,
				ownerStateValidationFailed: false,
				ownerPOValidationFailed: false,
				ownerPSValidationFailed: false,
				ownerBloodGroupValidationFailed: false,
				serviceTypeValidationFailed: false,
				vehicleModelValidationFailed: false,
				vehicleNumberValidationFailed: false,
				yearOfRegistrationValidationFailed: false,
				baseFareValidationFailed: false,
			},
			() => {
				let {
					firstName,
					lastName,
					email,
					password,
					driverAddress,
					driverPincode,
					driverState,
					driverPO,
					driverPS,
					drivingLicenseNumber,
					issueOfLicense,
					drivingExperience,
					driverBloodGroup,
					perTripCharge,
					ownerName,
					ownerMobile,
					ownerEmail,
					ownerAddress,
					ownerPincode,
					ownerState,
					ownerPO,
					ownerPS,
					ownerBloodGroup,
					serviceTypeID,
					vehicleModel,
					vehicleNumber,
					yearOfRegistration,
					baseFare,
					isAgreeTOC,
					alternateNumber,
					relativeNumber,
					relativeNumber2,
					relationWithRelative,
					relationWithRelative2,
					miniID,
					commisionType,
					ownerAdharCardFront,
					ownerAdharCardBack,
					ownerPanCardFront,
					ownerPanCardBack,
					ownerVoterCardFront,
					ownerVoterCardBack,
					driverPanCardFront,
					driverPanCardBack,
					driverVoterCardFront,
					driverVoterCardBack,
					driverAdharCardFront,
					driverAdharCardBack,
					driverDrivingLicenceFront,
					driverDrivingLicenceBack,
					ownerAgreementCopy1,
					ownerAgreementCopy2,
					ownerAgreementCopy3,
					ownerAgreementCopy4,
					ownerAgreementCopy5,
					nocCopy1,
					nocCopy2,
					nocCopy3,
					nocCopy4,
					nocCopy5,
					vehiclePaper,
					insuranceCopy,
					registrationCopy,
					carFrontPhoto,
					cfCopy,
					permitCopy,
					vehicleTaxPaper,
				} = this.state;


				let reqObj = {};

				if (this.state.nextStep == 1) {
					if (firstName.trim().length === 0) {
						this.setState({ firstNameValidationFailed: true });
						return false;
					} else if (lastName.trim().length === 0) {
						this.setState({ lastNameValidationFailed: true });
						return false;
					} else if (email.trim().length === 0) {
						this.setState({ emailValidationFailed: true });
						return false;
					} else if (password.trim().length < 6) {
						this.setState({ passwordValidationFailed: true });
						return false;
					} else if (driverBloodGroup.trim().length === 0) {
						this.setState({ driverBloodGroupValidationFailed: true });
						return false;
					} else if (driverAddress.trim().length === 0) {
						this.setState({ driverAddressValidationFailed: true });
						return false;
					} else if (driverPincode.trim().length !== 6) {
						this.setState({ driverPincodeValidationFailed: true });
						return false;
					} else if (driverPO.trim().length === 0) {
						this.setState({ driverPOValidationFailed: true });
						return false;
					} else if (driverPS.trim().length === 0) {
						this.setState({ driverPSValidationFailed: true });
						return false;
					}
					reqObj = {
						id: this.state.id,
						first_name: firstName,
						last_name: lastName,
						email: email,
						password: password,
						gender: this.state.drivergender,
						alternate_number: alternateNumber,
						relative_number: relativeNumber,
						relative_number2: relativeNumber2,
						bloodgroup: driverBloodGroup,
						address: driverAddress,
						pincode: driverPincode,
						state: driverState,
						po: driverPO,
						ps: driverPS,
						relation_with_relative: relationWithRelative,
						relation_with_relative2: relationWithRelative2,
						step: 1
					}
					this.writeSignUpDataForBackUp(reqObj);
					this.setState({ showLoader: true });
				}

				if (this.state.nextStep == 2) {
					if (drivingLicenseNumber.trim().length === 0) {
						this.setState({ drivingLicenseNumberValidationFailed: true });
						return false;
					} else if (issueOfLicense.trim().length === 0) {
						this.setState({ issueOfLicenseValidationFailed: true });
						return false;
					} else if (drivingExperience.trim().length === 0) {
						this.setState({ drivingExperienceValidationFailed: true });
						return false;
					} else if (driverPO.trim().length === 0) {
						this.setState({ driverPOValidationFailed: true });
						return false;
					}

					reqObj = {
						id: this.state.id,
						commision_type: commisionType,
						dlno: drivingLicenseNumber,
						issue_of_license: issueOfLicense,
						driving_experience: drivingExperience,
						mini_id: miniID,
						per_trip_charge: perTripCharge,
						step: 2
					};
					this.writeSignUpDataForBackUp(reqObj);
					this.setState({ showLoader: true });
				}


				if (this.state.nextStep == 3) {
					if (ownerName.trim().length === 0) {
						this.setState({ ownerNameValidationFailed: true });
						return false;
					} else if (ownerMobile.trim().length === 0 || !isMobile(ownerMobile)) {
						this.setState({ ownerMobileValidationFailed: true });
						return false;
					} else if (ownerAddress.trim().length === 0) {
						this.setState({ ownerAddressValidationFailed: true });
						return false;
					} else if (ownerPincode.trim().length !== 6) {
						this.setState({ ownerPincodeValidationFailed: true });
						return false;
					} else if (ownerPO.trim().length === 0) {
						this.setState({ ownerPOValidationFailed: true });
						return false;
					} else if (ownerPS.trim().length === 0) {
						this.setState({ ownerPSValidationFailed: true });
						return false;
					} else if (ownerBloodGroup.trim().length === 0) {
						this.setState({ ownerBloodGroupValidationFailed: true });
						return false;
					}

					reqObj = {
						id: this.state.id,
						owner_name: ownerName,
						owner_email: ownerEmail,
						owner_mobile: ownerMobile,
						owner_gender: this.state.ownergender,
						owner_address: ownerAddress,
						owner_pincode: ownerPincode,
						owner_state: ownerState,
						owner_po: ownerPO,
						owner_ps: ownerPS,
						owner_bloodGroup: ownerBloodGroup,
						step: 3
					}
					this.writeSignUpDataForBackUp(reqObj);
					this.setState({ showLoader: true });
				}


				if (this.state.nextStep == 4) {
					if (typeof serviceTypeID === "undefined") {
						this.setState({ serviceTypeValidationFailed: true });
						return false;
					} else if (vehicleModel.trim().length === 0) {
						this.setState({ vehicleModelValidationFailed: true });
						return false;
					} else if (vehicleNumber.trim().length === 0) {
						this.setState({ vehicleNumberValidationFailed: true });
						return false;
					} else if (yearOfRegistration.trim().length !== 4) {
						this.setState({ yearOfRegistrationValidationFailed: true });
						return false;
					} else if (!isAgreeTOC) {
						alert("Please accept Terms & Conditions and Privacy Policy");
						return false;
					}

					reqObj = {
						id: this.state.id,
						service_type_id: serviceTypeID,
						service_number: vehicleNumber,
						service_model: vehicleModel,
						year_of_registration: yearOfRegistration,
						base_fare: baseFare,
						step: 4
					};
					this.writeSignUpDataForBackUp(reqObj);
					this.setState({ showLoader: true });
				}

				// let reqObj = {
				// 	ownerAdharCardFront,
				// 	ownerAdharCardBack,
				// 	ownerPanCardFront,
				// 	ownerPanCardBack,
				// 	ownerVoterCardFront,
				// 	ownerVoterCardBack,
				// 	driverPanCardFront,
				// 	driverPanCardBack,
				// 	driverVoterCardFront,
				// 	driverVoterCardBack,
				// 	driverAdharCardFront,
				// 	driverAdharCardBack,
				// 	driverDrivingLicenceFront,
				// 	driverDrivingLicenceBack,
				// 	ownerAgreementCopy1,
				// 	ownerAgreementCopy2,
				// 	ownerAgreementCopy3,
				// 	ownerAgreementCopy4,
				// 	ownerAgreementCopy5,
				// 	nocCopy1,
				// 	nocCopy2,
				// 	nocCopy3,
				// 	nocCopy4,
				// 	nocCopy5,
				// 	vehiclePaper,
				// 	insuranceCopy,
				// 	registrationCopy,
				// 	carFrontPhoto,
				// 	cfCopy,
				// 	permitCopy,
				// 	vehicleTaxPaper,
				// };

				setupAccount(this.state.accessToken, reqObj)
					.then((response) => {
						console.log(response);
						if(response.result == false){
							alert(response.msg);	
							this.setState({
								showLoader: false
							})
							return;
						}
						if(response.check == 'failure'){
							alert("Please Enter correct Mini ID");	
							this.setState({
								showLoader: false
							})
							return;
						}
						const { nextStep } = this.state;
						let currentStep = parseInt(nextStep) + 1;
						if (currentStep != 5) {
							this.setState({
								showLoader: false,
								nextStep: currentStep
							})
						} else {
							this.setState({
								showLoader: false,
							},
								() => {
									successDailog("Success", 'Account created successfully',this.reloadApp);
									// this.props.navigation.navigate("OnboardingStatus", {id: this.state.id});
								}
							)

						}

						// this.setState(
						// 	{
						// 		showLoader: false,
						// 	},
						// 	() => {
						// 		this.props.navigation.navigate("OnboardingStatus");
						// 	}
						// );
					})
					.catch((error) => {
						console.log(error);
						this.setState({ showLoader: false });
					});
			}
		);
	};



	render() {
		// console.log(this.state)
		return (
			<Root >
				<View style={styles.container}>
					<StatusBar barStyle={'dark-content'} />
					<ScrollView>
						<View style={styles.section}>
							<Text style={styles.h1}>What's your name ? </Text>
							<Text style={styles.h3}>
								users will confirm it's you when they book ride
							</Text>
							<View style={styles.form}>
								{/* Driver details */}
								{this.state.nextStep == 1 ? (
									<Animated.View entering={FadeInRight.duration()} exiting={FadeOutLeft.duration()} layout={Layout}>
										<View style={styles.heading}>
											<Text style={styles.h2}>Driver's Personal Details</Text>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>First Name *</Text>
											<View
												style={[
													styles.textInput,
													this.state.firstNameValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.firstName}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="First Name"
													onChangeText={(firstName) => this.setState({ firstName })}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Last Name *</Text>
											<View
												style={[
													styles.textInput,
													this.state.lastNameValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.lastName}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="Last Name"
													onChangeText={(lastName) => this.setState({ lastName })}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Email ID *</Text>
											<View
												style={[
													styles.textInput,
													this.state.emailValidationFailed ? styles.inputError : null,
												]}
											>
												<TextInput
													value={this.state.email}
													autoCapitalize="none"
													autoCompleteType="off"
													keyboardType="email-address"
													placeholder="Email"
													onChangeText={(email) => this.setState({ email })}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Password *</Text>
											<View
												style={[
													styles.textInput,
													{ flexDirection: 'row' },
													this.state.passwordValidationFailed ? styles.inputError : null,
												]}
											>
												<TextInput
													secureTextEntry={this.state.passwordHidden}
													value={this.state.password}
													placeholder="Password"
													style={styles.textInputPass}
													autoCompleteType="off"
													autoCapitalize="none"
													onChangeText={(password) => this.setState({ password })}
												/>
												<TouchableOpacity
													activeOpacity={0.7}
													onPress={this.handlePasswordVisibility}
													style={{alignSelf: 'center'}}
												>
													{this.state.passwordHidden ? (
														<Ionicons name="eye-off-outline" size={24} color="black" />
													) : (
														<Ionicons name="eye-outline" size={24} color="black" />
													)}
												</TouchableOpacity>
												
											</View>
											{this.state.passwordValidationFailed ? (
													<Text style={{fontSize: 14, color: Colors.danger}}>{"Password can not be empty or less than 6 characters"}</Text>
												) : null }
										</View>

										<View style={styles.fieldRow}>
											<Text style={styles.label}>Alterate Number</Text>
											<View style={styles.textInput} >
												<TextInput
													value={this.state.alternateNumber}
													autoCapitalize="none"
													maxLength={10}
													autoCompleteType="off"
													keyboardType="numeric"
													placeholder="Alternate Number"
													onChangeText={(alternateNumber) => {
														alternateNumber = alternateNumber.replace(/[^0-9]/g, "");
														this.setState({ alternateNumber })
													}}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Relative Number</Text>
											<View style={styles.textInput} >
												<TextInput
													value={this.state.relativeNumber}
													maxLength={10}
													autoCapitalize="none"
													autoCompleteType="off"
													keyboardType="numeric"
													placeholder="Relative Number"
													onChangeText={(relativeNumber) => {
														relativeNumber = relativeNumber.replace(/[^0-9]/g, "");
														this.setState({ relativeNumber })
													}}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Relation with relative</Text>
											<View style={{ borderWidth: 1, width: '90%', borderColor: Colors.textInputBorder, borderRadius: 4, flexDirection: 'column' }}>
												<Picker
													selectedValue={this.state.relationWithRelative}
													onValueChange={(itemValue, itemIndex) =>
														this.setState({
															relationWithRelative: itemValue
														})
													}>
													<Picker.Item key={'0'} label={"Select Option"} />
													{Configs.RELATIVES.map((item, index) => {
														return (
															<Picker.Item key={index.toString()} label={item.label} value={item.label} />
														)
													})}

												</Picker>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Alternate Relative Number</Text>
											<View style={styles.textInput} >
												<TextInput
													value={this.state.relativeNumber2}
													maxLength={10}
													autoCapitalize="none"
													autoCompleteType="off"
													keyboardType="numeric"
													placeholder="Relative Number"
													onChangeText={(relativeNumber2) => {
														relativeNumber2 = relativeNumber2.replace(/[^0-9]/g, "");
														this.setState({ relativeNumber2 })
													}}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Relation with relative</Text>
											<View style={{ borderWidth: 1, width: '90%', borderColor: Colors.textInputBorder, borderRadius: 4, flexDirection: 'column' }}>
												<Picker
													selectedValue={this.state.relationWithRelative2}
													onValueChange={(itemValue, itemIndex) =>
														this.setState({
															relationWithRelative2: itemValue
														})
													}>
													<Picker.Item key={'0'} label={"Select Option"} />
													{Configs.RELATIVES.map((item, index) => {
														return (
															<Picker.Item key={index.toString()} label={item.label} value={item.label} />
														)
													})}

												</Picker>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Gender</Text>
											<View style={styles.radioButton}>
												{Configs.GENDERS.map((element) => (
													<TouchableOpacity
														key={element}
														activeOpacity={1}
														onPress={this.setDriverGender.bind(this, element)}
														style={styles.radioItem}
													>
														<RadioButton
															value={element}
															status={
																this.state.drivergender === element ? true : false
															}
														/>
														<Text style={{ marginLeft: 5 }}>{element}</Text>
													</TouchableOpacity>
												))}
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Blood Group *</Text>
											<View
												style={[
													styles.textInput,
													this.state.driverBloodGroupValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.driverBloodGroup}
													autoCapitalize="characters"
													autoCompleteType="off"
													placeholder="Blood Group"
													onChangeText={(driverBloodGroup) =>
														this.setState({ driverBloodGroup })
													}
												/>
											</View>
										</View>

										<View style={styles.fieldRow}>
											<Text style={styles.label}>Address *</Text>
											<View
												style={[
													styles.textInput,
													this.state.driverAddressValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.driverAddress}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="Address"
													onChangeText={(driverAddress) =>
														this.setState({ driverAddress })
													}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Pincode *</Text>
											<View
												style={[
													styles.textInput,
													this.state.driverPincodeValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.driverPincode}
													maxLength={6}
													keyboardType="number-pad"
													autoCompleteType="off"
													placeholder="Pincode"
													onChangeText={(driverPincode) => {
														driverPincode = driverPincode.replace(/[^0-9]/g, "");
														this.setState({ driverPincode })
													}}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>State *</Text>
											<View style={{ borderWidth: 1, width: '90%', borderColor: Colors.textInputBorder, borderRadius: 4, flexDirection: 'column' }}>
												<Picker
													selectedValue={this.state.driverState}
													onValueChange={(itemValue, itemIndex) =>
														this.setState({
															driverState: itemValue
														})
													}>
													<Picker.Item key={'0'} label={"Select Option"} />
													{this.state.states.map((item, index) => {
														return (
															<Picker.Item key={index.toString()} label={item.label} value={item.value} />
														)
													})}

												</Picker>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Post Office *</Text>
											<View
												style={[
													styles.textInput,
													this.state.driverPOValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.driverPO}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="P.O"
													onChangeText={(driverPO) => this.setState({ driverPO })}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Police Station *</Text>
											<View
												style={[
													styles.textInput,
													this.state.driverPSValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.driverPS}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="P.S"
													onChangeText={(driverPS) => this.setState({ driverPS })}
												/>
											</View>
										</View>
									</Animated.View>
								) : null}

								{this.state.nextStep == '2' ? (
									<Animated.View entering={FadeInRight.delay(200).duration()} exiting={FadeOutLeft.duration()} layout={Layout}>
										<View style={styles.heading}>
											<Text style={styles.h2}>Driver's Other Details</Text>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Driving License Number *</Text>
											<View
												style={[
													styles.textInput,
													this.state.drivingLicenseNumberValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.drivingLicenseNumber}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="Driving License Number"
													onChangeText={(drivingLicenseNumber) =>
														this.setState({ drivingLicenseNumber })
													}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Issue of License *</Text>
											<View
												style={[
													styles.textInput,
													this.state.issueOfLicenseValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.issueOfLicense}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="Issue of License"
													onChangeText={(issueOfLicense) =>
														this.setState({ issueOfLicense })
													}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Driving Experience *</Text>
											<View
												style={[
													styles.textInput,
													this.state.drivingExperienceValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.drivingExperience}
													keyboardType="numeric"
													autoCompleteType="off"
													placeholder="Driving Experience"
													onChangeText={(drivingExperience) =>
														this.setState({ drivingExperience })
													}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Mini ID </Text>
											<View style={styles.textInput} >
												<TextInput
													value={this.state.miniID}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="Mini Id"
													onChangeText={(miniID) =>
														this.setState({ miniID })
													}
												/>
											</View>
										</View>

										<View style={styles.fieldRow}>
											<Text style={styles.label}>{`Commision Type (${this.state.commisionType == 'fixed' ? this.state.fixed_commision : this.state.commisionType == 'percentage' ? this.state.percentage_commision : 0}) *`}</Text>
											<View style={{ borderWidth: 1, width: '90%', borderColor: Colors.textInputBorder, borderRadius: 4, flexDirection: 'column' }}>
												<Picker
													selectedValue={this.state.commisionType}
													onValueChange={(itemValue, itemIndex) =>
														this.setState({
															commisionType: itemValue
														})
													}>
													<Picker.Item key={'0'} label={"Select Option"} />
													{this.state.commisionTypes.map((item, index) => {
														return (
															<Picker.Item key={index.toString()} label={item.label} value={item.value} />
														)
													})}

												</Picker>
											</View>
										</View>
									</Animated.View>
								) : null}

								{this.state.nextStep == '3' ? (
									<Animated.View entering={FadeInRight.duration()} exiting={FadeOutLeft.duration(200)} layout={Layout}>
										<View style={styles.heading}>
											<Text style={styles.h2}>Vehicles Owner's Details</Text>
										</View>
										<View style={{ flexDirection: 'row', alignItems: 'center' }}>
											<Text>Same as Driver Details ? </Text>
											<CheckBox
												value={this.state.isSameDO}
												onValueChange={this.toggleDOS}
												tintColors={{ true: Colors.primary, false: Colors.primary }}
											/>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Owner's Name *</Text>
											<View
												style={[
													styles.textInput,
													this.state.ownerNameValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.ownerName}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="Owner's Name"
													onChangeText={(ownerName) => this.setState({ ownerName })}
												/>
											</View>
										</View><View style={styles.fieldRow}>
											<Text style={styles.label}>Owner's Email *</Text>
											<View
												style={[
													styles.textInput,
												]}
											>
												<TextInput
													value={this.state.ownerEmail}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="Owner's Email"
													onChangeText={(ownerEmail) => this.setState({ ownerEmail })}
												/>
											</View>
										</View>

										<View style={styles.fieldRow}>
											<Text style={styles.label}>Gender *</Text>
											<View style={styles.radioButton}>
												{Configs.GENDERS.map((element) => (
													<TouchableOpacity
														key={element}
														activeOpacity={1}
														onPress={this.setOwnerGender.bind(this, element)}
														style={styles.radioItem}
													>
														<RadioButton
															value={element}
															status={
																this.state.ownergender === element ? true : false
															}
														/>
														<Text style={{ marginLeft: 5 }}>{element}</Text>
													</TouchableOpacity>
												))}
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Mobile *</Text>
											<View
												style={[
													styles.textInput,
													this.state.ownerMobileValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.ownerMobile}
													maxLength={10}
													placeholder="Mobile Number"
													keyboardType="numeric"
													autoCompleteType="off"
													onChangeText={(ownerMobile) => {
														ownerMobile = ownerMobile.replace(/[^0-9]/g, "");
														this.setState({ ownerMobile })
													}
													}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Address *</Text>
											<View
												style={[
													styles.textInput,
													this.state.ownerAddressValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.ownerAddress}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="Address"
													onChangeText={(ownerAddress) =>
														this.setState({ ownerAddress })
													}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Pincode *</Text>
											<View
												style={[
													styles.textInput,
													this.state.ownerPincodeValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.ownerPincode}
													maxLength={6}
													autoCompleteType="off"
													keyboardType="number-pad"
													placeholder="Pincode"
													onChangeText={(ownerPincode) =>
														this.setState({ ownerPincode })
													}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>State </Text>
											<View style={[{ borderWidth: 1, width: '90%', borderColor: Colors.textInputBorder, borderRadius: 4, flexDirection: 'column' },
											this.state.ownerStateValidationFailed
												? styles.inputError
												: null,]}>
												<Picker
													selectedValue={this.state.ownerState}
													onValueChange={(itemValue, itemIndex) =>
														this.setState({
															ownerState: itemValue
														})
													}>
													<Picker.Item key={'0'} label={"Select Option"} />
													{this.state.states.map((item, index) => {
														return (
															<Picker.Item key={index.toString()} label={item.label} value={item.value} />
														)
													})}

												</Picker>
											</View>
										</View>

										<View style={styles.fieldRow}>
											<Text style={styles.label}>P.O *</Text>
											<View
												style={[
													styles.textInput,
													this.state.ownerPOValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.ownerPO}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="P.O"
													onChangeText={(ownerPO) => this.setState({ ownerPO })}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>P.S *</Text>
											<View
												style={[
													styles.textInput,
													this.state.ownerPSValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.ownerPS}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="P.S"
													onChangeText={(ownerPS) => this.setState({ ownerPS })}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Blood Group *</Text>
											<View
												style={[
													styles.textInput,
													this.state.ownerBloodGroupValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.ownerBloodGroup}
													autoCapitalize="characters"
													autoCompleteType="off"
													placeholder="Blood Group"
													onChangeText={(ownerBloodGroup) =>
														this.setState({ ownerBloodGroup })
													}
												/>
											</View>
										</View>
									</Animated.View>
								) : null}

								{this.state.nextStep == '4' ? (
									<Animated.View entering={FadeInRight.delay(400).duration()} exiting={FadeOutLeft.duration()} layout={Layout}>
										<View style={styles.heading}>
											<Text style={styles.h2}>Vehicle's Details</Text>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Service Type *</Text>
											<View style={{ borderWidth: 1, width: '90%', borderColor: Colors.textInputBorder, borderRadius: 4, flexDirection: 'column' }}>
												<Picker
													selectedValue={this.state.serviceTypeID}
													onValueChange={(itemValue, itemIndex) =>
														this.setState({
															serviceTypeID: itemValue,
														})
													}>
													<Picker.Item key={0} label={"Select Option"} />
													{this.state.services.map((item, index) => {
														return (
															<Picker.Item key={index.toString()} label={item.label} value={item.value} />
														)
													})}

												</Picker>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Vehicle Model *</Text>
											<View
												style={[
													styles.textInput,
													this.state.vehicleModelValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.vehicleModel}
													autoCapitalize="words"
													autoCompleteType="off"
													placeholder="Vehicle Model"
													onChangeText={(vehicleModel) =>
														this.setState({ vehicleModel })
													}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Vehicle Number *</Text>
											<View
												style={[
													styles.textInput,
													this.state.vehicleNumberValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.vehicleNumber}
													autoCapitalize="characters"
													autoCompleteType="off"
													placeholder="Vehicle Number"
													onChangeText={(vehicleNumber) =>
														this.setState({ vehicleNumber })
													}
												/>
											</View>
										</View>
										<View style={styles.fieldRow}>
											<Text style={styles.label}>Year Of Registration *</Text>
											<View
												style={[
													styles.textInput,
													this.state.yearOfRegistrationValidationFailed
														? styles.inputError
														: null,
												]}
											>
												<TextInput
													value={this.state.yearOfRegistration}
													maxLength={4}
													keyboardType="number-pad"
													autoCompleteType="off"
													placeholder="Year of Vehicle registration"
													onChangeText={(yearOfRegistration) =>
														this.setState({ yearOfRegistration })
													}
												/>
											</View>
										</View>

									</Animated.View>
								) : null}





								{this.state.nextStep == 4 ? (
									<View style={[styles.fieldRow, { flexDirection: 'row' }]}>
										<CheckBox
											value={this.state.isAgreeTOC}
											onValueChange={this.toggleTOC}
											tintColors={{ true: Colors.primary, false: Colors.secondary }}
										/>
										<View style={[styles.textInput, { borderWidth: 0 }]}>
											<Text>
												I agree to the Terms and Conditions and Privacy Policy
											</Text>
										</View>
									</View>
								) : null}

								{this.state.nextStep == 1 ? (

									<TouchableOpacity
										style={[styles.nextButton, { marginTop: 10 }]}
										activeOpacity={0.7}
										// onPress={this.saveData}
										onPress={this.saveData}
									>
										<Text style={styles.nextButtonText}>Next</Text>
									</TouchableOpacity>
								) : (
									<View style={{
										flex: 1,
										flexDirection: 'row',
										justifyContent: 'space-between',
										marginTop: 10
									}}>
										<TouchableOpacity
											style={[styles.nextButton, { width: "40%" }]}
											activeOpacity={0.7}
											// onPress={this.saveData}
											onPress={this.prevStepHandler}
										>
											<Text style={styles.nextButtonText}>Back</Text>
										</TouchableOpacity>
										<TouchableOpacity
											style={[styles.nextButton, { width: "40%" }]}
											activeOpacity={0.7}
											// onPress={this.saveData}
											onPress={this.saveData}
										>
											<Text style={styles.nextButtonText}>Next</Text>
										</TouchableOpacity>

									</View>
								)}
							</View>
						</View>
					</ScrollView>

					<OverlayLoader visible={this.state.showLoader} />


					{/* <OverlayLoader visible={this.state.imageLoader} /> */}


				</View>
			</Root>

		);
	}
}



const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		paddingTop: Constants.statusBarHeight,
	},
	section: {
		padding: 10,
	},
	h1: {
		fontSize: 25,
		lineHeight: 40,
		fontWeight: "bold",
	},
	h3: {
		fontSize: 15,
		lineHeight: 30,
	},
	heading: {
		paddingTop: 10,
		paddingBottom: 5,
	},
	h2: {
		fontSize: 20,
		fontWeight: "bold",
	},
	label: {
		fontSize: 18,
	},
	form: {
		marginTop: 5,
	},
	fieldRow: {
		paddingVertical: 10,
		paddingHorizontal: 5,
	},
	paymentRow: {
		flexDirection: "row",
		alignItems: "center",
		paddingHorizontal: 10,
		marginHorizontal: 5,
	},
	textInput: {
		borderWidth: 2,
		width: "100%",
		padding: 6,
		borderRadius: 5,
		borderColor: Colors.textInputBorder,
	},
	radioButton: {
		width: "90%",
		padding: 6,
		borderRadius: 5,
		flexDirection: "row",
	},
	radioItem: {
		flexDirection: "row",
		width: "30%",
		paddingVertical: 10,
		paddingHorizontal: 2,
	},
	centeredView: {
		flex: 1,
		justifyContent: "flex-end",
		backgroundColor: "rgba(0,0,0,0.5)",
	},

	modalView: {
		backgroundColor: "white",
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
		padding: 35,
	},
	button: {
		borderRadius: 20,
		padding: 10,
		elevation: 2,
	},
	buttonOpen: {
		backgroundColor: "#F194FF",
	},
	buttonClose: {
		backgroundColor: "#2196F3",
	},
	textStyle: {
		color: "white",
		fontWeight: "bold",
		textAlign: "center",
	},
	modalText: {
		marginBottom: 15,
		textAlign: "center",
	},
	nextButton: {
		borderRadius: 10,
		height: 45,
		backgroundColor: Colors.primary,
		justifyContent: "center",
		alignItems: "center",
	},
	nextButtonText: {
		textAlign: "center",
		fontSize: 20,
		color: "#fff",
	},
	inputError: {
		borderWidth: 2,
		borderColor: Colors.danger,
	},
	textInputPass: {
        fontSize: 17,
        width: "90%",
    },
});

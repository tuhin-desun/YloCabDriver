import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	Image,
	Dimensions,
	ScrollView,
	Modal,
	Pressable,
	TextInput,
	Animated,
	Switch,
} from "react-native";
import { AntDesign, MaterialIcons, Feather, Entypo, Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { Picker } from '@react-native-picker/picker';
import BottomSheet from "reanimated-bottom-sheet";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import firebase from "../config/firebase";
import {
	Header,
	ProfileSkeleton,
	RadioButton,
	OverlayLoader,
} from "../component";
import { getFileData, writeDriverData, isEmail, removeDriverData } from "../utils/Util";
import {
	getDriverProfile,
	setProfileImage,
	updateProfile,
	getServiceTypes,
	updateServiceName,
	updatePass
} from "../services/APIServices";
import AppContext from "../context/AppContext";
import { successToast, errorToast } from "../utils/Alerts";
import { Root } from 'react-native-alert-notification';


const windowwidth = Dimensions.get("screen").width;
const windowheight = Dimensions.get("screen").height;

export default class Profile extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			showLoader: false,
			modalVisible: false,
			modalServiceVisible: false,
			firstName: "",
			lastName: "",
			password: '',
			confirmPassword: '',
			phone: null,
			email: null,
			gender: null,
			services: [],
			memberSince: null,
			serviceType: null,
			serviceTypeID: null,
			serviceName: null,
			vehicleModel: null,
			vehicleNumber: null,
			opacity: new Animated.Value(0),
			isOpen: false,
			isServiceTypeOpen: false,
			serviceTypeOpacity: new Animated.Value(0),
			firstNameValidationFailed: false,
			lastNameValidationFailed: false,
			emailValidationFailed: false,
			modalChangePasswordVisible: false,
			passwordValidationFailed: false,
			confirmPasswordValidationFailed: false,
			passwordHidden: true,
			confirmPasswordHidden: true,
			passwordMatchFailed: false,
		};

		this.bs = React.createRef();
		this.serviceTypebs = React.createRef();
	}

	componentDidMount = () => {
		let { driverData } = this.context;
		this.focusListeners = this.props.navigation.addListener('focus', () => {
			this.getDriverProfileData(driverData);
		})
	};

	componentWillUnmount() {
		this.focusListeners();
	}

	getDriverProfileData = (driverData) => {
		Promise.all([getDriverProfile(driverData.id), getServiceTypes()])
			.then((response) => {
				if (response[0].check === Configs.SUCCESS_TYPE) {
					let data = response[0].data;
					console.log("Profile data", data)
					this.context.setDriverData(response[0].data);
					this.setState({
						services: response[1],
						serviceTypeID: data.provider_service_type_id,
						isLoading: false,
						firstName: data.first_name !== null ? data.first_name : "",
						lastName: data.last_name !== null ? data.last_name : "",
						phone: data.mobile !== null ? data.mobile : null,
						email: data.email !== null ? data.email : null,
						gender: data.gender !== null ? data.gender : null,
						memberSince: data.member_since !== null ? data.member_since : null,
						serviceType: data.service_type !== null ? data.service_type : null,
						serviceName: data.service_name !== null ? data.service_name : null,
						vehicleModel:
							data.vehicle_model !== null ? data.vehicle_model : null,
						vehicleNumber:
							data.vehicle_number !== null ? data.vehicle_number : null,
					});
				}
			})
			.catch((error) => console.log(error));
	}


	setModalVisible = (visible) => {
		this.setState({ modalVisible: visible });
	};


	toggleEditModal = () =>
		this.setState({ modalVisible: !this.state.modalVisible });

	toggleServiceModal = () =>
		this.setState({ modalServiceVisible: !this.state.modalServiceVisible });

	toggleChangePasswordModal = () =>
		this.setState({ modalChangePasswordVisible: !this.state.modalChangePasswordVisible });



	setDriverGender = (value) => this.setState({ gender: value });

	uploadProflieImage = (fileData) => {
		this.setState({ showLoader: true });

		let { driverData } = this.context;
		let reqObj = {
			id: driverData.id,
			profile_image: getFileData(fileData),
		};

		setProfileImage(reqObj)
			.then((response) => {
				if (response.check === Configs.SUCCESS_TYPE) {
					let data = response.data;
					this.setState(
						{
							showLoader: false,
						},
						() => {
							driverData.picture = data.uri;
							writeDriverData(driverData);
							this.context.setDriverData(driverData);
						}
					);
				} else {
					console.log(response);
					this.setState({ showLoader: false });
				}
			})
			.catch((error) => {
				console.log(error);
				this.setState({ showLoader: false });
			});
	};

	saveData = () => {
		this.setState(
			{
				firstNameValidationFailed: false,
				lastNameValidationFailed: false,
				emailValidationFailed: false,
			},
			() => {
				let { firstName, lastName, email } = this.state;
				if (firstName.trim().length === 0) {
					this.setState({ firstNameValidationFailed: true });
					return false;
				} else if (lastName.trim().length === 0) {
					this.setState({ lastNameValidationFailed: true });
					return false;
				} else if (email.trim().length === 0 || !isEmail(email)) {
					this.setState({ emailValidationFailed: true });
					return false;
				} else {
					this.setState({ showLoader: true });
					let { driverData } = this.context;
					let reqObj = {
						id: driverData.id,
						first_name: firstName,
						last_name: lastName,
						email: email,
						gender: this.state.gender,
					};

					updateProfile(reqObj)
						.then((response) => {
							driverData.first_name = firstName;
							driverData.last_name = lastName;
							driverData.email = email;
							writeDriverData(driverData);
							this.context.setDriverData(driverData);

							this.setState({
								showLoader: false,
								modalVisible: false,
							});
						})
						.catch((error) => {
							console.log(error);
							this.setState({ showLoader: false });
						});
				}
			}
		);
	};

	updateServiceNameData = () => {
		let { serviceTypeID } = this.state;
		let { driverData } = this.context;

		let reqObj = {
			driverID: driverData.id,
			service_type_id: serviceTypeID,
		};
		this.setState({ showLoader: true });
		updateServiceName(reqObj)
			.then((response) => {
				this.setState({
					showLoader: false,
					modalServiceVisible: false,
				}, () => { this.getDriverProfileData(driverData) });
			})
			.catch((error) => {
				console.log(error);
				this.setState({ showLoader: false });
			});
	}

	openImagePickerAsync = () => {
		this.onClose();
		ImagePicker.requestMediaLibraryPermissionsAsync().then((status) => {
			if (status.granted) {
				let options = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 0.5,
				};

				ImagePicker.launchImageLibraryAsync(options).then((result) => {
					if (!result.cancelled) {
						this.uploadProflieImage(result);
					}
				});
			} else {
				alert("Please allow permission to choose an image");
			}
		});
	};

	openCameraAsync = () => {
		this.onClose();
		ImagePicker.requestCameraPermissionsAsync().then((status) => {
			if (status.granted) {
				this.setState({
					image: undefined,
					imageData: undefined,
				});

				let options = {
					mediaTypes: ImagePicker.MediaTypeOptions.Images,
					allowsEditing: true,
					aspect: [1, 1],
					quality: 0.5,
				};

				ImagePicker.launchCameraAsync(options).then((result) => {
					if (!result.cancelled) {
						this.uploadProflieImage(result);
					}
				});
			} else {
				alert("Please allow permission to take photo");
			}
		});
	};

	logout = () => {
		this.setState({ showLoader: true });
		firebase
			.auth()
			.signOut()
			.then(() => {
				this.setState({ showLoader: false });
				removeDriverData();
				this.context.unsetDriverData();
			})
			.catch((error) => console.log(error));
	};

	onOpen = () => {
		this.setState({ isOpen: true });
		this.bs.current.snapTo(0);
		Animated.timing(this.state.opacity, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};


	onClose = () => {
		Animated.timing(this.state.opacity, {
			toValue: 0,
			duration: 350,
			useNativeDriver: true,
		}).start();
		this.bs.current.snapTo(1);
		setTimeout(() => {
			this.setState({ isOpen: false });
		}, 50);
	};

	onServiceTypeOpen = () => {
		this.setState({ isServiceTypeOpen: true });
		this.serviceTypebs.current.snapTo(0);
		Animated.timing(this.state.serviceTypeOpacity, {
			toValue: 1,
			duration: 300,
			useNativeDriver: true,
		}).start();
	};

	onServiceTypeClose = () => {
		Animated.timing(this.state.serviceTypeOpacity, {
			toValue: 0,
			duration: 350,
			useNativeDriver: true,
		}).start();
		this.serviceTypebs.current.snapTo(1);
		setTimeout(() => {
			this.setState({ isServiceTypeOpen: false });
		}, 50);
	};

	renderHeader = () => (
		<View style={styles.bsheader}>
			<View style={styles.panelHeader}>
				<View style={styles.panelHandle}></View>
			</View>
		</View>
	);

	handlePasswordVisibility = () => {
		this.setState({
			passwordHidden: !this.state.passwordHidden
		})
	}

	handleConfirmPasswordVisibility = () => {
		this.setState({
			confirmPasswordHidden: !this.state.confirmPasswordHidden
		})
	}

	passwordChange = (password) => {
		this.setState({
			password: password,
			passwordValidationFailed: false,
		})
	}

	confirmPasswordChange = (confirmPassword) => {
		if (this.state.password != confirmPassword) {
			this.setState({
				passwordMatchFailed: true
			})
		} else {
			this.setState({
				passwordMatchFailed: false
			})
		}
		this.setState({
			confirmPasswordValidationFailed: false,
			confirmPassword: confirmPassword
		})
	}

	updatePassword = () => {
		const { password, confirmPassword, passwordValidationFailed, confirmPasswordValidationFailed } = this.state;
		if (password.trim().length < 6) {
			this.setState({
				passwordValidationFailed: true
			})
			return false;
		}

		if (confirmPassword.trim().length < 6) {
			this.setState({
				confirmPasswordValidationFailed: true
			})
			return false;
		}

		this.setState({ showLoader: true, modalChangePasswordVisible: !this.state.modalChangePasswordVisible });
		let { driverData } = this.context;
		let reqObj = {
			id: driverData.id,
			password: password
		};

		updatePass(reqObj)
			.then((response) => {
				if (response.check == 'success') {
					this.setState({ showLoader: false }, () => {
						successToast("Success", "Password Updated successfully");
					});
				} else {
					errorToast("Error", "Failed to update password")
				}
			}).catch((error) => { 
				errorToast("Error", "Sorry we are facing some issue")
				this.setState({
				showLoader: false
			}) })
		}

	renderInner = () => (
		<View style={styles.panel}>
			<View style={{ alignItems: "center" }}>
				<Text style={styles.panelTitle}>Upload Photo</Text>
				<Text style={styles.panelSubtitle}>Choose Your Profile Picture</Text>
			</View>
			<TouchableOpacity
				style={styles.panelButton}
				onPress={this.openCameraAsync}
			>
				<MaterialIcons
					name="photo-camera"
					size={18}
					color="white"
					style={{ marginRight: 5 }}
				/>
				<Text style={styles.panelButtonTitle}>Take Photo</Text>
			</TouchableOpacity>
			<TouchableOpacity
				style={styles.panelButton}
				onPress={this.openImagePickerAsync}
			>
				<MaterialIcons
					name="photo-library"
					size={18}
					color="white"
					style={{ marginRight: 5 }}
				/>
				<Text style={styles.panelButtonTitle}>Choose From Library</Text>
			</TouchableOpacity>
			<TouchableOpacity style={styles.panelButton} onPress={this.onClose}>
				<MaterialIcons
					name="cancel"
					size={20}
					color="white"
					style={{ marginRight: 5 }}
				/>
				<Text style={styles.panelButtonTitle}>Cancel</Text>
			</TouchableOpacity>
		</View>
	);

	renderServiceTypeContent = () => {
		return (
			<View style={styles.panel}>
				<View style={styles.form}>
					<Text style={styles.modalText}>Select Service Name</Text>
					<ScrollView>
						{this.state.services.length > 0 ? this.state.services.map((item, index) => {
							return (
								<View style={{ height: 80, marginBottom: 5, flexDirection: 'row', alignItems: 'center' }}>
									<Text key={index.toString()} >{item.name}</Text>
									<Switch
										trackColor={{ false: "#767577", true: "#D8A300" }}
										thumbColor={true ? Colors.primary : "#f4f3f4"}
										ios_backgroundColor="#3e3e3e"
										onValueChange={() => { console.log("Hi") }}
										value={true}
										style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
									/>
								</View>
							)
						}) : null}
					</ScrollView>


					<View
						style={{
							flexDirection: "row",
							justifyContent: "space-between",
						}}
					>
					</View>
				</View>
			</View>

		)
	}

	renderBackDrop = () => (
		<Animated.View
			style={{
				opacity: this.state.opacity,
				backgroundColor: "rgba(0,0,0,0.7)",
				position: "absolute",
				top: 0,
				left: 0,
				right: 0,
				bottom: 0,
				zIndex: 1,
			}}
		>
			<TouchableOpacity
				style={{
					width: windowwidth,
					height: windowheight,
					backgroundColor: "transparent",
				}}
				activeOpacity={1}
				onPress={this.onClose}
			/>
		</Animated.View>
	);

	renderServiceTypeBackDrop = () => {
		return (
			<Animated.View
				style={{
					opacity: this.state.serviceTypeOpacity,
					backgroundColor: "rgba(0,0,0,0.7)",
					position: "absolute",
					top: 0,
					left: 0,
					right: 0,
					bottom: 0,
					zIndex: 1,
				}}
			>
				<TouchableOpacity
					style={{
						width: windowwidth,
						height: windowheight,
						backgroundColor: "transparent",
					}}
					activeOpacity={1}
					onPress={this.onServiceTypeClose}
				/>
			</Animated.View>
		)
	}

	render = () => {
		const { driverData } = this.context;
		return (
			<Root>
				<View style={styles.container}>
					<Header
						leftIconName={"ios-menu-sharp"}
						leftButtonFunc={() => this.props.navigation.toggleDrawer()}
						title={"My Profile"}
						rightIconName={"name"}
						walletBalance={this.context.driverData.wallet}
					/>
					<View style={styles.profileSection}>
						<TouchableOpacity
							activeOpacity={0.8}
							style={styles.imageButton}
							onPress={this.onOpen}
						>
							<View style={styles.profileImageContainer}>
								<Image
									source={
										driverData && driverData.picture !== null
											? { uri: driverData.picture }
											: require("../assets/deafult-profile-img.png")
									}
									style={styles.ImageStyle}
									resizeMode={"contain"}
								/>
							</View>
							<View style={styles.camIcon}>
								<MaterialIcons name="photo-camera" size={15} color="black" />
							</View>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={this.toggleEditModal}
							style={{ padding: 10, flexDirection: "row", marginTop: 5 }}
						>
							<Text style={styles.nameText}>
								{driverData !== null
									? driverData.first_name + " " + driverData.last_name
									: null}
							</Text>
							<AntDesign name="edit" size={24} color="black" />
						</TouchableOpacity>
					</View>
					{this.state.isLoading ? (
						<ProfileSkeleton />
					) : (
						<ScrollView>
							<View style={styles.section}>
								<View style={styles.heading}>
									<Text style={styles.h1}>Account Info</Text>
								</View>
								<View style={styles.detailsSection}>
									<View style={styles.iconContainer}>
										<MaterialIcons name="call" size={26} color="black" />
									</View>
									<View style={styles.name}>
										<Text style={styles.lable}>Phone</Text>
										<Text style={styles.title}>
											{this.state.phone !== null
												? Configs.PHONE_NUMBER_COUNTRY_CODE + this.state.phone
												: "N/A"}
										</Text>
									</View>
								</View>
								<View style={styles.detailsSection}>
									<View style={styles.iconContainer}>
										<MaterialIcons name="email" size={26} color="black" />
									</View>
									<View style={styles.name}>
										<Text style={styles.lable}>Email</Text>
										<Text style={styles.title}>
											{this.state.email !== null ? this.state.email : "N/A"}
										</Text>
									</View>
								</View>

								<View style={styles.detailsSection}>
									<View style={styles.iconContainer}>
										<MaterialIcons name="person" size={28} color="black" />
									</View>
									<View style={styles.name}>
										<Text style={styles.lable}>Gender</Text>
										<Text style={styles.title}>
											{this.state.gender !== null ? this.state.gender : "N/A"}
										</Text>
									</View>
								</View>

								<View style={styles.detailsSection}>
									<View style={styles.iconContainer}>
										<MaterialIcons
											name="perm-contact-calendar"
											size={24}
											color="black"
										/>
									</View>
									<View style={styles.name}>
										<Text style={styles.lable}>Member since</Text>
										<Text style={styles.title}>
											{this.state.memberSince !== null
												? this.state.memberSince
												: "N/A"}
										</Text>
									</View>
								</View>

								<View style={styles.detailsSection}>
									<TouchableOpacity
										activeOpacity={0.7}
										onPress={this.toggleChangePasswordModal}
										style={{ flexDirection: 'row' }}
									>
										<View style={styles.iconContainer}>
											<Entypo name="key" size={24} color="black" />
										</View>
										<View style={[styles.name, { alignSelf: 'center' }]}>
											<Text style={styles.title}>Change Password</Text>
										</View>
									</TouchableOpacity>
								</View>

								<View style={styles.heading}>
									<Text style={styles.h1}>Vehicle Info</Text>
								</View>
								<View style={styles.detailsSection}>
									<View style={styles.name}>
										<Text style={styles.lable}>Service Category</Text>
										<Text style={styles.title}>
											{this.state.serviceType !== null
												? this.state.serviceType
												: "N/A"}
										</Text>
									</View>
								</View>
								<View style={[styles.detailsSection, { justifyContent: 'space-between' }]}>
									<View style={styles.name}>
										<Text style={styles.lable}>Service Name</Text>
										<Text style={styles.title}>
											{this.state.serviceName !== null
												? this.state.serviceName
												: "N/A"}
										</Text>
									</View>
									{/* <TouchableOpacity
										onPress={this.toggleServiceModal}
										style={{ padding: 10, flexDirection: "row", marginTop: 5 }}
									>
										<Feather name="edit-2" size={24} color="black" />
									</TouchableOpacity> */}
								</View>
								<View style={styles.detailsSection}>
									<View style={styles.name}>
										<Text style={styles.lable}>Vehicle Model</Text>
										<Text style={styles.title}>
											{this.state.vehicleModel !== null
												? this.state.vehicleModel
												: "N/A"}
										</Text>
									</View>
								</View>
								<View style={styles.detailsSection}>
									<View style={styles.name}>
										<Text style={styles.lable}>Vehicle Number</Text>
										<Text style={styles.title}>
											{this.state.vehicleNumber !== null
												? this.state.vehicleNumber
												: "N/A"}
										</Text>
									</View>
								</View>
								{/* <TouchableOpacity
								style={styles.detailsSection}
								onPress={this.logout}
							>
								<View style={styles.logouticonContainer}>
									<MaterialIcons name="logout" size={26} color="black" />
								</View>
								<View style={styles.name}>
									<Text style={styles.title}>Log Out</Text>
								</View>
							</TouchableOpacity> */}
							</View>
						</ScrollView>
					)}

					{this.state.isOpen && this.renderBackDrop()}
					<BottomSheet
						ref={this.bs}
						snapPoints={[300, 0]}
						initialSnap={1}
						transparent={true}
						enabledContentGestureInteraction={false}
						renderHeader={this.renderHeader}
						renderContent={this.renderInner}
						onCloseEnd={this.onClose}
					/>

					{this.state.isServiceTypeOpen && this.renderServiceTypeBackDrop()}
					<BottomSheet
						ref={this.serviceTypebs}
						snapPoints={[300, 0]}
						initialSnap={1}
						transparent={true}
						enabledContentGestureInteraction={false}
						renderHeader={this.renderHeader}
						renderContent={this.renderServiceTypeContent}
						onCloseEnd={this.onServiceTypeClose}
					/>

					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.modalServiceVisible}
						statusBarTranslucent={true}
						onRequestClose={this.toggleServiceModal}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<View style={styles.modalHead}>
									<Text style={styles.headtext}>Update Service Name</Text>
								</View>
								<ScrollView>
									<View style={styles.form}>
										<Text style={styles.modalText}>Select Service Name</Text>
										<View
											style={[
												styles.formField,
												this.state.firstNameValidationFailed
													? styles.errorField
													: null,
											]}
										>
											<Picker
												selectedValue={this.state.serviceTypeID}
												onValueChange={(itemValue, itemIndex) =>
													this.setState({
														serviceTypeID: itemValue,
													})
												}>
												<Picker.Item key={0} label={"Select Option"} />
												{this.state.services.length > 0 ? this.state.services.map((item, index) => {
													return (
														<Picker.Item key={index.toString()} label={item.name} value={item.id} />
													)
												}) : null}

											</Picker>
										</View>

										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
											}}
										>
											<Pressable
												style={[styles.button, styles.buttonCancel]}
												onPress={this.toggleServiceModal}
											>
												<Text style={[styles.textStyle, { color: Colors.grey }]}>
													CANCEL
												</Text>
											</Pressable>
											<Pressable
												style={[styles.button, styles.buttonUpdate]}
												onPress={this.updateServiceNameData}
											>
												<Text style={styles.textStyle}>UPDATE</Text>
											</Pressable>
										</View>
									</View>
								</ScrollView>
							</View>
						</View>
					</Modal>

					{/* { Password change modal } */}
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.modalChangePasswordVisible}
						statusBarTranslucent={true}
						onRequestClose={this.toggleChangePasswordModal}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<View style={styles.modalHead}>
									<Text style={styles.headtext}>Update Password</Text>
								</View>
								<ScrollView>
									<View style={styles.form}>
										<Text style={styles.modalText}>Enter Password</Text>
										<View>
											<View
												style={[
													styles.formField,
													{ flexDirection: 'row' },
													this.state.passwordValidationFailed
														? styles.errorField
														: null,
												]}
											>
												<TextInput
													secureTextEntry={this.state.passwordHidden}
													value={this.state.password}
													autoCompleteType="off"
													autoCapitalize="none"
													style={[styles.textInput, { width: '90%' }]}
													selectionColor={Colors.primary}
													onChangeText={this.passwordChange}
												/>
												<TouchableOpacity
													activeOpacity={0.7}
													onPress={this.handlePasswordVisibility}
													style={{ alignSelf: 'center' }}
												>
													{this.state.passwordHidden ? (
														<Ionicons name="eye-off-outline" size={24} color="black" />
													) : (
														<Ionicons name="eye-outline" size={24} color="black" />
													)}
												</TouchableOpacity>
											</View>
											{this.state.passwordValidationFailed ? (
												<Text style={{ fontSize: 14, color: Colors.danger }}>{"Password can not be empty or less than 6 characters"}</Text>
											) : null}
										</View>


										<Text style={styles.modalText}>Confirm Password</Text>
										<View style={{ marginBottom: 5 }}>
											<View
												style={[
													styles.formField,
													{ flexDirection: 'row' },
													this.state.confirmPasswordValidationFailed
														? styles.errorField
														: null,
												]}
											>
												<TextInput
													secureTextEntry={this.state.confirmPasswordHidden}
													value={this.state.confirmPassword}
													autoCompleteType="off"
													autoCapitalize="none"
													style={[styles.textInput, { width: '90%' }]}
													selectionColor={Colors.primary}
													onChangeText={this.confirmPasswordChange}
												/>

												<TouchableOpacity
													style={{ alignSelf: 'center' }}
													activeOpacity={0.7}
													onPress={this.handleConfirmPasswordVisibility}
												>
													{this.state.confirmPasswordHidden ? (
														<Ionicons name="eye-off-outline" size={24} color="black" />
													) : (
														<Ionicons name="eye-outline" size={24} color="black" />
													)}
												</TouchableOpacity>
											</View>
											{this.state.confirmPasswordValidationFailed ? (
												<Text style={{ fontSize: 14, color: Colors.danger }}>{"Password can not be empty or less than 6 characters"}</Text>
											) : null}
											{this.state.passwordMatchFailed ? (
												<Text style={{ fontSize: 14, color: Colors.danger }}>{"Password did not match"}</Text>
											) : null}
										</View>

										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
											}}
										>
											<Pressable
												style={[styles.button, styles.buttonCancel]}
												onPress={this.toggleChangePasswordModal}
											>
												<Text style={[styles.textStyle, { color: Colors.grey }]}>
													CANCEL
												</Text>
											</Pressable>
											<Pressable
												style={[styles.button, styles.buttonUpdate]}
												onPress={this.state.passwordMatchFailed ? () => { console.log("Hi") } : this.updatePassword}
											>
												<Text style={styles.textStyle}>UPDATE</Text>
											</Pressable>
										</View>
									</View>
								</ScrollView>
							</View>
						</View>
					</Modal>


					{/* {Service type change} */}
					<Modal
						animationType="slide"
						transparent={true}
						visible={this.state.modalVisible}
						statusBarTranslucent={true}
						onRequestClose={this.toggleEditModal}
					>
						<View style={styles.centeredView}>
							<View style={styles.modalView}>
								<View style={styles.modalHead}>
									<Text style={styles.headtext}>Update Profile</Text>
								</View>
								<ScrollView>
									<View style={styles.form}>
										<Text style={styles.modalText}>First Name</Text>
										<View
											style={[
												styles.formField,
												this.state.firstNameValidationFailed
													? styles.errorField
													: null,
											]}
										>
											<TextInput
												value={this.state.firstName}
												autoCapitalize="words"
												autoCompleteType="off"
												style={styles.textInput}
												selectionColor={Colors.primary}
												onChangeText={(firstName) => this.setState({ firstName })}
											/>
										</View>

										<Text style={styles.modalText}>Last Name</Text>
										<View
											style={[
												styles.formField,
												this.state.lastNameValidationFailed
													? styles.errorField
													: null,
											]}
										>
											<TextInput
												value={this.state.lastName}
												autoCapitalize="words"
												autoCompleteType="off"
												style={styles.textInput}
												selectionColor={Colors.primary}
												onChangeText={(lastName) => this.setState({ lastName })}
											/>
										</View>

										<Text style={styles.modalText}>Mobile Number</Text>
										<View style={styles.formField}>
											<TextInput
												editable={false}
												value={this.state.phone}
												style={styles.textInput}
											/>
										</View>

										<Text style={styles.modalText}>Email</Text>
										<View
											style={[
												styles.formField,
												this.state.emailValidationFailed
													? styles.errorField
													: null,
											]}
										>
											<TextInput
												value={this.state.email}
												style={styles.textInput}
												keyboardType="email-address"
												selectionColor={Colors.primary}
												onChangeText={(email) => this.setState({ email })}
											/>
										</View>

										<Text style={styles.modalText}>Gender</Text>
										<View style={styles.genderContainer}>
											{Configs.GENDERS.map((element) => (
												<TouchableOpacity
													key={element}
													activeOpacity={1}
													onPress={this.setDriverGender.bind(this, element)}
													style={styles.radioItem}
												>
													<RadioButton
														value={element}
														status={this.state.gender === element ? true : false}
													/>
													<Text style={{ marginLeft: 5 }}>{element}</Text>
												</TouchableOpacity>
											))}
										</View>

										<View
											style={{
												flexDirection: "row",
												justifyContent: "space-between",
											}}
										>
											<Pressable
												style={[styles.button, styles.buttonCancel]}
												onPress={this.toggleEditModal}
											>
												<Text style={[styles.textStyle, { color: Colors.grey }]}>
													CANCEL
												</Text>
											</Pressable>
											<Pressable
												style={[styles.button, styles.buttonUpdate]}
												onPress={this.saveData}
											>
												<Text style={styles.textStyle}>UPDATE</Text>
											</Pressable>
										</View>
									</View>
								</ScrollView>
							</View>
						</View>
					</Modal>
					<OverlayLoader visible={this.state.showLoader} />
				</View>
			</Root>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
		position: "relative",
	},
	section: {
		paddingHorizontal: 20,
		// paddingVertical: 10,
	},
	profileSection: {
		paddingVertical: 10,
		paddingHorizontal: 20,
		// flexDirection: 'row',
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		height: windowheight / 6,
	},
	imageButton: {
		position: "relative",
	},
	detailsSection: {
		paddingVertical: 18,
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
	},
	profileImageContainer: {
		backgroundColor: Colors.white,
		overflow: "hidden",
		height: 80,
		width: 80,
		borderWidth: 2,
		borderColor: Colors.white,
		borderRadius: 80 / 2,
		alignItems: "center",
		justifyContent: "center",
	},
	ImageStyle: {
		height: 80,
		width: 80,
	},
	camIcon: {
		borderWidth: 0.5,
		borderRadius: 20 / 2,
		borderColor: Colors.primary,
		width: 20,
		height: 20,
		alignItems: "center",
		justifyContent: "center",
		position: "absolute",
		top: 8,
		right: 0,
		backgroundColor: Colors.white,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 3,
		},
		shadowOpacity: 0.27,
		shadowRadius: 4.65,

		elevation: 6,
	},
	heading: {
		paddingTop: 20,
		// paddingBottom: 10,
	},
	h1: {
		fontSize: 17,
		fontWeight: "bold",
	},
	iconContainer: {
		backgroundColor: Colors.primary,
		overflow: "hidden",
		height: 50,
		width: 50,
		borderRadius: 50 / 2,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	logouticonContainer: {
		backgroundColor: "#d4d4d2",
		overflow: "hidden",
		height: 50,
		width: 50,
		borderRadius: 50 / 2,
		alignItems: "center",
		justifyContent: "center",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	name: {
		marginLeft: 15,
	},
	nameText: {
		fontSize: 20,
		fontWeight: "bold",
		paddingHorizontal: 5,
	},
	title: {
		fontSize: 15,
		fontWeight: "bold",
	},
	lable: {
		color: Colors.medium,
	},
	editButton: {
		marginLeft: 30,
		borderWidth: 1,
		borderColor: Colors.primary,
		borderRadius: 50,
		paddingHorizontal: 10,
		paddingVertical: 2,
	},
	editText: {
		fontSize: 15,
		color: Colors.primary,
	},
	centeredView: {
		height: windowheight,
		flex: 1,
		justifyContent: "center",
		backgroundColor: "rgba(0,0,0,0.5)",
	},
	modalView: {
		margin: 10,
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
		fontWeight: "bold",
		textAlign: "center",
	},
	modalHead: {
		paddingVertical: 15,
		flexDirection: "row",
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: Colors.primary,
		borderTopLeftRadius: 10,
		borderTopRightRadius: 10,
	},
	headtext: {
		fontSize: 18,
		fontWeight: "bold",
	},
	form: {
		marginVertical: 20,
		paddingHorizontal: 20,
	},
	formField: {
		paddingVertical: 5,
		marginTop: 5,
		marginBottom: 15,
		paddingHorizontal: 5,
		borderRadius: 5,
		borderWidth: 1,
		borderColor: Colors.textInputBorder,
	},
	genderContainer: {
		flexDirection: "row",
		marginBottom: 15,
		paddingHorizontal: 5,
	},
	radioItem: {
		flexDirection: "row",
		width: "30%",
		paddingVertical: 8,
		paddingHorizontal: 2,
	},
	modalText: {
		fontWeight: "bold",
		fontSize: 13,
		marginLeft: 5,
	},
	modalLable: {
		marginBottom: 15,
	},
	textInput: {
		paddingVertical: 5,
		paddingHorizontal: 5,
	},
	bsheader: {
		backgroundColor: Colors.primary,
		paddingTop: 20,
		borderTopLeftRadius: 20,
		borderTopRightRadius: 20,
	},
	panelHeader: {
		alignItems: "center",
	},
	panelHandle: {
		width: 40,
		height: 8,
		borderRadius: 4,
		backgroundColor: Colors.white,
		marginBottom: 10,
	},
	panelTitle: {
		fontSize: 20,
		height: 30,
	},
	panelSubtitle: {
		fontSize: 14,
		color: "gray",
		height: 20,
		marginBottom: 10,
	},
	panel: {
		padding: 20,
		backgroundColor: Colors.white,
	},
	panelButton: {
		flexDirection: "row",
		padding: 10,
		borderRadius: 10,
		backgroundColor: Colors.primary,
		alignItems: "center",
		justifyContent: "center",
		marginVertical: 7,
	},
	panelButtonTitle: {
		fontSize: 15,
		fontWeight: "bold",
		color: "white",
	},
	errorField: {
		borderWidth: 1,
		borderColor: Colors.danger,
	},
});

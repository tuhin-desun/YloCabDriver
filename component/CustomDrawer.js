import React from "react";
import {
	Text,
	StyleSheet,
	View,
	Image,
	Switch,
	TouchableOpacity,
} from "react-native";
import {
	DrawerContentScrollView,
	DrawerItemList,
} from "@react-navigation/drawer";
import { MaterialIcons } from "@expo/vector-icons";
import { OverlayLoader } from "../component";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import firebase from "../config/firebase";
import AppContext from "../context/AppContext";
import { removeDriverData } from "../utils/Util";
import { changeOutstation, changeServiceStatus, getDriverProfile } from "../services/APIServices";
import * as TaskManager from 'expo-task-manager';
import * as Location from "expo-location";

export default class CustomDrawer extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			showLoader: false,
			outstation: false,
			routbooking: false,
			serviceStatus: false
		};
	}

	componentDidMount = () => {
		getDriverProfile(this.context.driverData.id).then((response) => {
			if (response.check == 'success') {
				this.context.setDriverData(response.data);
				this.setState({
					outstation: response.data.outstation_status == '0' ? false : true ,
					serviceStatus: response.data.service_status == 'offline' ? false : true 
				})
			}
		}).catch((err) => {
			console.log(err)
		});
	}

	logout = () => {
		this.setState({ showLoader: true });
		firebase
			.auth()
			.signOut()
			.then(() => {
				this.setState({ showLoader: false });
				removeDriverData();
				this.context.unsetDriverData();
				this.StopBackgroundLocation();
			})
			.catch((error) => console.log(error));
	};

	handleOutStationChange = () => {
		let driverID = this.context.driverData.id;
		this.setState({ outstation: !this.state.outstation, showLoader: true });
		let status;
		if (!this.state.outstation) {
			status = 1;
		} else {
			status = 0;
		}
		let obj = {
			driverID: driverID,
			status: status
		}
		changeOutstation(obj)
			.then((response) => {
				if (response.type == "error") {
					this.setState({
						showLoader: false,
					}, () => {
						alert("Sorry failed to enable outstation")
					})
				} else {
					this.setState({
						showLoader: false,
					})
				}
			})
			.catch((error) => {
				this.setState({
					showLoader: false,
				}, () => {
					alert("Sorry failed to enable outstation")
				})
				console.log(error)
			})

	}

	StopBackgroundLocation = async () => {
		try {
			TaskManager.getRegisteredTasksAsync().then((res) => {
				Location.stopLocationUpdatesAsync('background-location-task');
			});
		} catch (error) {
			console.log(error);
		}
	}

	handleServiceStatus  = () => {
		let driverID = this.context.driverData.id;
		this.setState({ serviceStatus: !this.state.serviceStatus, showLoader: true });
		let status;
		if (!this.state.serviceStatus) {
			status = 'active';
		} else {
			status = 'offline';
		}
		let obj = {
			driverID: driverID,
			status: status
		}
		console.log('obj', obj);
		changeServiceStatus(obj)
			.then((response) => {
				console.log('response====>', response);
				if (response.type == "error") {
					this.setState({
						showLoader: false,
					}, () => {
						alert("Sorry failed to change status")
					})
				} else {
					if(status == 'offline'){this.StopBackgroundLocation()}
					this.context.setServiceStatus(status);
					this.setState({
						showLoader: false,
					})
				}
			})
			.catch((error) => {
				console.log('error=====>', error);
				this.setState({
					showLoader: false,
				}, () => {
					alert("Sorry failed to change status")
				})
				console.log(error)
			})
		}

	render = () => {
		const { driverData } = this.context;
		return (
			<View style={styles.container}>
				<DrawerContentScrollView {...this.props}>
					<View style={styles.drawerContent}>
						<View style={{ marginTop: -5, backgroundColor: Colors.primary }}>
							<View style={styles.userInfoSection}>
								<View style={styles.userImage}>
									<Image
										source={
											driverData && driverData.picture !== null
												? { uri: driverData.picture }
												: require("../assets/deafult-profile-img.png")
										}
										style={{ height: 70, width: 70, borderRadius: 70 / 2 }}
										resizeMode={"cover"}
									/>
								</View>
								<View style={{ width: "68%" }}>
									{driverData !== null ? (
										<>
											<Text style={styles.title}>
												{driverData.first_name + " " + driverData.last_name}
											</Text>
											<Text style={styles.caption}>
												{"Mobile : " +
													Configs.PHONE_NUMBER_COUNTRY_CODE +
													driverData.mobile}
											</Text>
										</>
									) : null}
								</View>
							</View>
						</View>
						<DrawerItemList {...this.props} />
					</View>
					<View style={styles.bottomDrawerSection}>
						<View style={styles.preference}>
							<Text>Outstation</Text>
							<Switch
								trackColor={{ false: "#767577", true: "#D8A300" }}
								thumbColor={this.state.outstation ? Colors.primary : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
								onValueChange={this.handleOutStationChange}
								value={this.state.outstation}
								style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
							/>
						</View>
						<View style={styles.preference}>
							<Text>ON/OFF Duty</Text>
							<Switch
								trackColor={{ false: "#767577", true: "#D8A300" }}
								thumbColor={this.state.serviceStatus ? Colors.primary : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
								onValueChange={this.handleServiceStatus}
								value={this.state.serviceStatus}
								style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
							/>
						</View>
						{/* <View style={styles.preference}>
							<Text>My Rout Booking</Text>
							<Switch
								trackColor={{ false: "#767577", true: "#D8A300" }}
								thumbColor={this.state.routbooking ? Colors.primary : "#f4f3f4"}
								ios_backgroundColor="#3e3e3e"
								onValueChange={() =>
									this.setState({ routbooking: !this.state.routbooking })
								}
								value={this.state.routbooking}
								style={{ transform: [{ scaleX: 1.5 }, { scaleY: 1.5 }] }}
							/>
						</View> */}
					</View>
				</DrawerContentScrollView>
				<TouchableOpacity
					style={styles.logout}
					onPress={this.logout}
				>
					<MaterialIcons name="logout" size={24} color="black" />
					<Text style={{ marginLeft: 15 }}>Logout</Text>
				</TouchableOpacity>
				<OverlayLoader visible={this.state.showLoader} />
			</View>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	drawerContent: {
		flex: 1,
	},
	userInfoSection: {
		//borderWidth: 1,
		paddingHorizontal: 10,
		marginVertical: 20,
		flexDirection: "row",
		//justifyContent: 'space-between'
	},
	userImage: {
		overflow: "hidden",
		height: 70,
		width: 70,
		borderRadius: 70 / 2,
		borderWidth: 2,
		borderColor: "#fff",
		alignItems: "center",
		justifyContent: "center",
		marginRight: 10,
	},
	title: {
		fontSize: 18,
		fontWeight: "bold",
		marginTop: 10,
	},
	caption: {
		fontSize: 12,
		fontWeight: "bold",
		marginTop: 10,
	},
	preference: {
		flexDirection: "row",
		paddingVertical: 15,
		paddingLeft: 25,
		paddingRight: 35,
		justifyContent: "space-between",
	},
	bottomDrawerSection: {
		marginTop: 15,
		borderColor: "#f4f4f4",
		borderTopWidth: 1,
		borderBottomWidth: 1,
	},
	logout: {
		paddingHorizontal: 25,
		paddingVertical: 20,
		flexDirection: "row",
		borderColor: "#f4f4f4",
		borderTopWidth: 1,
	},
});

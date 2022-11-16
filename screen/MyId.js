import React from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
import { Header, IDCardSkeleton } from "../component";
import Colors from "../config/colors";
import Configs from "../config/Configs";
import { getIDCard, getDriverProfile } from "../services/APIServices";
import AppContext from "../context/AppContext";
import IDHtml from "../component/IDHtml";

export default class MyId extends React.Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			isLoading: true,
			profileData: null,
		};
	}

	componentDidMount = () => {
		let { driverData } = this.context;
		this.focusListeners = this.props.navigation.addListener('focus', () => {
			getDriverProfile(this.context.driverData.id).then((response) => { 
				if(response.check == 'success'){
					this.context.setDriverData(response.data);
				}
			 }).catch((err) => { console.log(err) });
		})
		getIDCard(driverData.id)
			.then((response) => {
				if (response.check === Configs.SUCCESS_TYPE) {
					this.setState({
						isLoading: false,
						profileData: response.data,
					});
				}
			})
			.catch((error) => console.log(error));
	};

	componentWillUnmount() {
		this.focusListeners();
	}

	render = () => {
		let { profileData } = this.state;
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"ios-menu-sharp"}
					leftButtonFunc={() => this.props.navigation.toggleDrawer()}
					title={"YLO ID-Card"}
					rightIconName={"name"}
					walletBalance = {this.context.driverData.wallet}
				/>
				<View style={styles.section}>
					{this.state.isLoading ? (
						<IDCardSkeleton />
					) : (
						<>
							<View style={styles.card}>
								<View style={styles.imageSection}>
									<Image
										source={
											profileData && profileData.picture !== null
												? { uri: profileData.picture }
												: require("../assets/deafult-profile-img.png")
										}
										style={{ height: 160, width: 140, borderRadius: 10 }}
									/>
									<Image
										source={require("../assets/logo.png")}
										style={{ height: 150, width: 150 }}
									/>
								</View>
								<Text style={styles.name}>
									{profileData !== null
										? profileData.first_name + " " + profileData.last_name
										: null}
								</Text>
								<View style={styles.detailsRow}>
									<View style={{ flex: 1 }}>
										<Text style={styles.lable}>Mobile</Text>
										<Text style={styles.title}>
											{profileData && profileData.mobile !== null
												? Configs.PHONE_NUMBER_COUNTRY_CODE + profileData.mobile
												: "N/A"}
										</Text>
									</View>
									<View style={{ flex: 1 }}>
										<Text style={styles.lable}>Vehicle Number</Text>
										<Text style={styles.title}>
											{profileData && profileData.vehicle_number !== null
												? profileData.vehicle_number
												: "N/A"}
										</Text>
									</View>
								</View>
								<View style={styles.detailsRow}>
									<View style={{ flex: 1 }}>
										<Text style={styles.lable}>Driving License</Text>
										<Text style={styles.title}>
											{profileData && profileData.dlno !== null
												? profileData.dlno
												: "N/A"}
										</Text>
									</View>
									<View style={{ flex: 1 }}>
										<Text style={styles.lable}>Blood Group</Text>
										<Text style={styles.title}>
											{profileData && profileData.bloodgroup !== null
												? profileData.bloodgroup
												: "N/A"}
										</Text>
									</View>
								</View>
								{profileData &&
								profileData.status === Configs.STATUS_APPROVED ? (
									<Image
										source={require("../assets/approved.png")}
										style={styles.statusImg}
										resizeMode={"contain"}
									/>
								) : null}
							</View>
							<View style={styles.declarationRow}>
								{/* <TouchableOpacity>
									<Text style={{ fontWeight: "bold", color: Colors.link }}>
										View Declaration
									</Text>
								</TouchableOpacity> */}
								{/* <TouchableOpacity activeOpacity={0.7} style={styles.button}>
									<Text style={styles.buttonText}>Share Id</Text>
								</TouchableOpacity> */}

								<IDHtml profileData={profileData} />
							</View>
						</>
					)}
				</View>
			</View>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	section: {
		padding: 15,
	},
	card: {
		padding: 20,
		borderRadius: 10,
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
	imageSection: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
	name: {
		fontSize: 23,
		fontWeight: "bold",
		marginTop: 15,
		marginBottom: 20,
	},
	lable: {
		color: Colors.medium,
		fontSize: 16,
		paddingBottom: 5,
	},
	title: {
		fontSize: 17,
		fontWeight: "bold",
	},
	detailsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		// paddingRight: 25,
		paddingVertical: 10,
	},
	statusImg: {
		height: 120,
		width: 120,
		alignSelf: "flex-end",
		opacity: 0.6,
	},
	declarationRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		paddingVertical: 20,
	},
	button: {
		paddingHorizontal: 20,
		paddingVertical: 10,
		backgroundColor: Colors.primary,
		borderRadius: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
	},
	buttonText: {
		fontSize: 18,
		textAlign: "center",
	},
});

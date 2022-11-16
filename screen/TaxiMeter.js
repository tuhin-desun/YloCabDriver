import React, { Component } from "react";
import {
	Text,
	StyleSheet,
	View,
	Image,
	Dimensions,
	TouchableOpacity,
} from "react-native";
import Header from "../component/Header";
import Colors from "../config/colors";

const windowwidth = Dimensions.get("screen").width;
const windowheight = Dimensions.get("screen").height;

export default class TaxiMeter extends Component {
	render() {
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"arrow-back"}
					leftButtonFunc={() => this.props.navigation.goBack()}
					title={"Taxi Meter"}
					rightIconName={"name"}
				/>
				<View style={styles.section}>
					<View style={{ alignItems: "center" }}>
						<Image
							source={require("../assets/mobile_verification.png")}
							style={{ width: windowwidth, height: 150 }}
							resizeMode={"cover"}
						/>
					</View>
					<View style={styles.distance}>
						<View style={styles.distanceColumn1}>
							<Text style={styles.title}>Time</Text>
							<Text style={styles.caption}>00.00</Text>
						</View>
						<View style={styles.distanceColumn2}>
							<Text style={styles.title}>Distance</Text>
							<Text style={styles.caption}>0.00 KM</Text>
						</View>
					</View>
					<TouchableOpacity
						activeOpacity={0.7}
						style={styles.button}
						onPress={() => alert("added")}
					>
						<Text style={styles.buttonText}>START NOW</Text>
					</TouchableOpacity>
					<View style={styles.billCard}>
						<View style={styles.billHeading}>
							<Text style={styles.name}>Invoice</Text>
						</View>
						<View style={styles.billSec}>
							<Text style={{ color: Colors.medium }}>Base Fare</Text>
							<Text>₹ 60.00</Text>
						</View>
						<View style={styles.billSec}>
							<Text style={{ color: Colors.medium }}>Distance Fare</Text>
							<Text>₹ 100.00</Text>
						</View>
						<View style={styles.billFoot}>
							<View>
								<Text style={styles.name}>Total</Text>
							</View>
							<Text style={styles.name}>₹ 100.00</Text>
						</View>
						<TouchableOpacity activeOpacity={0.7} style={styles.button}>
							<Text style={styles.buttonText}>RIDE COMPLETED</Text>
						</TouchableOpacity>
					</View>
				</View>
			</View>
		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: Colors.white,
	},
	section: {
		padding: 15,
	},
	distance: {
		flexDirection: "row",
		marginHorizontal: 10,
		paddingHorizontal: 10,
		marginVertical: 20,
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
		borderColor: Colors.textInputBorder,
		width: "50%",
		alignItems: "center",
	},
	distanceColumn2: {
		borderLeftWidth: 0.5,
		borderColor: Colors.textInputBorder,
		width: "50%",
		alignItems: "center",
	},
	title: {
		//color: Colors.medium,
		fontSize: 16,
		paddingVertical: 5,
		fontWeight: "bold",
	},
	caption: {
		fontSize: 17,
	},
	button: {
		marginHorizontal: 10,
		marginTop: 30,
		paddingHorizontal: 10,
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
	billCard: {
		marginVertical: 10,
		paddingVertical: 10,
		paddingHorizontal: 10,
		backgroundColor: "white",
		// shadowColor: "#000",
		// shadowOffset: {
		// 	width: 0,
		// 	height: 2,
		// },
		// shadowOpacity: 0.25,
		// shadowRadius: 3.84,

		// elevation: 5,
	},
	billHeading: {
		marginVertical: 5,
	},
	billSec: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 15,
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
	},
	billFoot: {
		flexDirection: "row",
		justifyContent: "space-between",
		paddingVertical: 15,
		// borderRadius: 10
	},
	name: {
		fontWeight: "bold",
		fontSize: 16,
	},
});

import React from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	BackHandler,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../config/colors";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 10,
		backgroundColor: Colors.white,
		alignItems: "center",
		justifyContent: "center",
	},
	textContainer: {
		width: "100%",
		marginTop: 10,
		alignItems: "center",
		justifyContent: "center",
	},
	msgTitle: {
		fontSize: 18,
		color: Colors.danger,
		fontWeight: "bold",
		marginBottom: 3,
	},
	msg: {
		fontSize: 14,
		color: Colors.darkgrey,
	},
	exitBtn: {
		position: "absolute",
		bottom: 2,
		width: "100%",
		height: 50,
		backgroundColor: Colors.danger,
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
	},
	exitBtnText: {
		fontSize: 18,
		color: Colors.white,
		letterSpacing: 0.5,
		fontWeight: "bold",
	},
});

const BannedStatus = (props) => {
	const closeApp = () => BackHandler.exitApp();

	return (
		<View style={styles.container}>
			<Feather name="alert-circle" size={70} color={Colors.danger} />
			<View style={styles.textContainer}>
				<Text style={styles.msgTitle}>Sorry</Text>
				<Text style={styles.msg}>Your account has been suspended.</Text>
			</View>

			<TouchableOpacity
				activeOpacity={0.8}
				style={styles.exitBtn}
				onPress={closeApp}
			>
				<Text style={styles.exitBtnText}>CLOSE</Text>
			</TouchableOpacity>
		</View>
	);
};

export default BannedStatus;

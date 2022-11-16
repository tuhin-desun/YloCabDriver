import React, { useEffect, useState } from "react";
import {
	View,
	StyleSheet,
	Text,
	TouchableOpacity,
	BackHandler,
} from "react-native";
import { Ionicons } from '@expo/vector-icons';
import Colors from "../config/colors";
import { getUploadedDocumentRecords } from "../services/APIServices";
import { OverlayLoader } from "../component";

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
		color: Colors.success,
		fontWeight: "bold",
		marginBottom: 3,
	},
	msg: {
		alignSelf: "center",
		fontSize: 14,
		color: Colors.darkgrey,
	},
	exitBtn: {
		position: "absolute",
		bottom: 2,
		width: "100%",
		height: 50,
		backgroundColor: Colors.primary,
		borderRadius: 4,
		alignItems: "center",
		justifyContent: "center",
	},
	exitBtnText: {
		fontSize: 18,
		color: "#444",
		letterSpacing: 0.5,
		fontWeight: "bold",
	},
});

const OngoingStatus = (props) => {

	const [showLoader, setShowLoader] = useState(true);
	const [documentCount, setDocumentCount] = useState(0)


	useEffect(() => {
		checkDocumentUpload()
	}, [])

	const checkDocumentUpload = () => {
		getUploadedDocumentRecords({ id: props.route.params.id }).then((response) => {
			console.log(response)
			setShowLoader(false);
			setDocumentCount(response.length);
			
		}).catch((err) => { console.log(err) });
	}

	const closeApp = () => BackHandler.exitApp();
	const documentUploadScreen = () => props.navigation.navigate('DocUploadScreen', { id: props.route.params.id });

	return (
		<View style={styles.container}>
			<Ionicons name="document-text-outline" size={70} color={Colors.warning} />
			<View style={styles.textContainer}>
				<Text style={styles.msgTitle}>Congratulations</Text>
				<Text style={styles.msg}>
					Your account has been successfully created.
				</Text>
				{documentCount == 31 ? (
					<Text style={styles.msg}>Please wait for admin approval.</Text>
				) : (
					<Text style={styles.msg}>Please upload necessary documents to get your account approved.</Text>
				)}

			</View>
			{documentCount == 31 ? (
				<TouchableOpacity
					activeOpacity={0.8}
					style={styles.exitBtn}
					onPress={closeApp}
				>
					<Text style={styles.exitBtnText}>Close </Text>
				</TouchableOpacity>
			) : (
				<TouchableOpacity
					activeOpacity={0.8}
					style={styles.exitBtn}
					onPress={documentUploadScreen}
				>
					<Text style={styles.exitBtnText}>Upload Document </Text>
				</TouchableOpacity>
			)}


			<OverlayLoader visible={showLoader} />
		</View>
	);
};

export default OngoingStatus;

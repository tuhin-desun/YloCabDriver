import React, { useEffect, useState } from "react";
import { View, StyleSheet, ActivityIndicator, Modal } from "react-native";
import Colors from "../config/colors";

const styles = StyleSheet.create({
	modalContainer: {
		flex: 1,
		justifyContent: "center",
		alignItems: "center",
		backgroundColor: "rgba(0, 0, 0, 0.2)",
	},
	modalBody: {
		alignItems: "center",
	},
	loadingText: {
		lineHeight: 50,
		color: Colors.primary,
	},
});

const OverlayLoader = (props) => {
	const [visible, setVisible] = useState(false)
	useEffect(()=>{
		setVisible(props.visible)
		// console.log("Under User Effect Component Props", props)
	},[props.visible])
	
	return(
		<>
			{visible ? (
				<Modal
					animationType="fade"
					transparent={true}
					statusBarTranslucent={true}
					visible={visible}
					onRequestClose={() => {
                        //alert("Modal has been closed.");
                        setVisible(false)
                    }}
				>
					<View style={styles.modalContainer}>
						<View style={styles.modalBody}>
							<ActivityIndicator size="large" color={Colors.primary} />
						</View>
					</View>
				</Modal>
			) : (
				null
			)}
		</>
	)
};

export default OverlayLoader;

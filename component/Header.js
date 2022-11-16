import React from "react";
import {
	StyleSheet,
	Text,
	View,
	TouchableOpacity,
	StatusBar,
} from "react-native";
import Colors from "../config/colors";
import { Ionicons, Entypo } from "@expo/vector-icons";
import { useNavigation } from '@react-navigation/native';



 const Header = (prop) => {
		const { ...props } = prop;
		const navigation = useNavigation();

		return (
			<>
				<StatusBar barStyle="dark-content" backgroundColor={Colors.primary} />
				<View style={styles.header}>
					<TouchableOpacity
						style={{ width: "15%" }}
						onPress={props.leftButtonFunc}
					>
						{props.leftIconType ? (
							<Entypo name="cross" size={26} color="black" />
						) : (
							<Ionicons name={props.leftIconName} size={26} color="black" />
						)}
					</TouchableOpacity>
					{props.title ? (
						<View style={styles.headerLeft}>
							<Text style={styles.headerLeftTitle}>{props.title}</Text>
							{props.subTitle ? (
								<Text style={styles.headerLeftSubTitle}>{props.subTitle}</Text>
							) : null}
						</View>
					) : null}
					{props.rightIconName ? (
						<TouchableOpacity
							style={{
								width: "20%",
								alignItems: "center",
								flexDirection: "row",
								justifyContent: "space-around",
							}}
							onPress={() => navigation.navigate('Wallet')}
						>
							<Ionicons name="wallet" size={24} color="black" />
							<Text>₹ {props.walletBalance ? Math.round(props.walletBalance) : 0}</Text>
						</TouchableOpacity>

					) : null}
				</View>
			</>
		);
}

const styles = StyleSheet.create({
	header: {
		//paddingVertical: 15,
		height: 50,
		alignItems: "center",
		paddingHorizontal: 15,
		flexDirection: "row",
		backgroundColor: Colors.primary,
	},
	headerLeft: {
		// borderWidth: 1,
		width: "65%",
		// paddingLeft: 15,
		alignItems: "center",
	},
	headerLeftTitle: {
		fontSize: 19,
		fontWeight: "bold",
	},
	headerLeftSubTitle: {
		// color: Colors.medium,
		fontSize: 15,
	},
});

export default Header

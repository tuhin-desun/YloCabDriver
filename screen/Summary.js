import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import Colors from "../config/colors";
import Header from "../component/Header";
import { Fontisto } from "@expo/vector-icons";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import AppContext from "../context/AppContext";
import { getDriverProfile, getMonthStatistic } from '../services/APIServices';



export default class Summary extends Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			rideData: []
		};
	}

	componentDidMount() {
		this.focusListeners = this.props.navigation.addListener('focus', () => {
			Promise.all([getDriverProfile(this.context.driverData.id), getMonthStatistic({ driverID: this.context.driverData.id })]).then((response) => {
				if (response.check == 'success') {
					this.context.setDriverData(response.data);
				}
				this.setState({
					rideData: response[1]
				})
			}).catch((err) => { console.log(err) });
		})
	}

	componentWillUnmount() {
		this.focusListeners();
	}


	render() {
		const {rideData} = this.state;
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"ios-menu-sharp"}
					leftButtonFunc={() => this.props.navigation.toggleDrawer()}
					title={"Summary"}
					rightIconName={"name"}
					walletBalance={this.context.driverData.wallet}
				/>
				<View style={styles.section}>
					<View style={styles.headerBar}>
						<Fontisto name="nav-icon-grid" size={24} color={Colors.grey} />
						<Text style={{ marginLeft: 15, fontSize: 17, color: Colors.grey }}>
							Revenue Report
						</Text>
					</View>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}
					>
						<View style={styles.card}>
							<View style={styles.cardRow}>
								<Text style={styles.lable}>Rides</Text>
								<FontAwesome
									name="paper-plane-o"
									size={24}
									color={Colors.primary}
								/>
							</View>

							<Text style={styles.title}>{rideData.length > 0 ? rideData[0].total_completed : 0}</Text>
						</View>
						<View style={styles.card}>
							<View style={styles.cardRow}>
								<Text style={styles.lable}>Revenue</Text>
								<FontAwesome5 name="coins" size={24} color={Colors.primary} />
							</View>
							<Text style={styles.title}>₹ {rideData.length > 0 ? rideData[0].total_amount : 0}</Text>
						</View>
					</View>
					<View
						style={{ flexDirection: "row", justifyContent: "space-between" }}
					>
						{/* <View style={styles.card}>
							<View style={styles.cardRow}>
								<Text style={styles.lable}>Scheduled Rides</Text>
								<FontAwesome5 name="history" size={24} color={Colors.primary} />
							</View>
							<Text style={styles.title}>8</Text>
						</View> */}
						<View style={[styles.card, {width: '100%'}]}>
							<View style={styles.cardRow}>
								<Text style={styles.lable}>Cancelled Rides</Text>
								<MaterialIcons name="cancel" size={24} color={Colors.primary} />
							</View>
							<Text style={styles.title}>{rideData.length > 0 ? rideData[0].total_canceled : 0}</Text>
						</View>
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
		padding: 10,
	},
	headerBar: {
		marginBottom: 15,
		flexDirection: "row",
		paddingVertical: 12,
		paddingHorizontal: 20,
		backgroundColor: Colors.white,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
	},
	card: {
		marginTop: 15,
		padding: 15,
		borderRadius: 5,
		height: 180,
		width: "48%",
		backgroundColor: Colors.white,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,

		elevation: 5,
		position: "relative",
		//overflow: "hidden",
	},
	lable: {
		fontSize: 18,
		width: "80%",
	},
	title: {
		fontWeight: "bold",
		fontSize: 18,
		paddingVertical: 15,
	},
	cardRow: {
		flexDirection: "row",
		alignItems: "center",
	},
});

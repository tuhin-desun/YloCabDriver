import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import Header from "../component/Header";
import Colors from "../config/colors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AppContext from "../context/AppContext";
import { getDriverProfile, getRideStatistic } from '../services/APIServices';



export default class Earnings extends Component {
	static contextType = AppContext;
	constructor(props) {
		super(props);
		this.state = {
			rideData: []
		};
	}

	componentDidMount() {
		this.focusListeners = this.props.navigation.addListener('focus', () => {
			Promise.all([getDriverProfile(this.context.driverData.id), getRideStatistic({ driverID: this.context.driverData.id })]).then((response) => {
				if (response[0].check == 'success') {
					this.context.setDriverData(response[0].data);
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
		const { rideData } = this.state;
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"ios-menu-sharp"}
					leftButtonFunc={() => this.props.navigation.toggleDrawer()}
					title={"Earnings"}
					rightIconName={"name"}
					walletBalance={this.context.driverData.wallet}
				/>
				<View style={styles.section}>
					<Text style={styles.h1}>Today's Report</Text>
					<View style={styles.reporSection}>
						<View
							style={[
								styles.report,
								{ borderColor: Colors.lightGrey },
							]}
						>
							{/* <Text style={styles.h1}></Text> */}
							<View style={styles.circle}>
								<Text style={styles.h1}>{rideData.length}</Text>
							</View>

							<Text style={styles.h2}>Total Earnings</Text>
							<Text style={styles.earning}>₹ {rideData.length > 0 ? rideData[0].total_amount : 0}</Text>
						</View>
					</View>
					<View style={styles.bar}>
						<Text style={styles.h3}>BOOKING ID</Text>
						<Text style={styles.h3}>DISTANCE</Text>
						<Text style={styles.h3}>AMOUNT</Text>
					</View>
					{this.state.rideData.length > 0 ?

						this.state.rideData.map((item) => {
							return (
								<View style={[styles.bar, {backgroundColor: '#fff', alignItems: 'center'}]}>
									<Text style={[styles.h3, {color: '#000', alignSelf: 'center'}]}>{item.booking_id}</Text>
									<Text style={[styles.h3, {color: '#000'}]}>{Math.round(item.distance)}</Text>
									<Text style={[styles.h3, {color: '#000'}]}>{item.amount}</Text>
								</View>
							)
						})

						:

						(<View style={styles.emptyTable}>
							<MaterialCommunityIcons
								name="calendar-clock"
								size={100}
								color={Colors.primary}
							/>
							<Text>No Rides Completed</Text>
						</View>)}

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
	h1: {
		textAlign: "center",
		fontSize: 18,
	},
	report: {
		width: "100%",
		alignItems: "center",
	},
	circle: {
		marginTop: 20,
		marginBottom: 15,
		height: 110,
		width: 110,
		borderRadius: 110 / 2,
		borderWidth: 9,
		borderColor: "#E4E4E4",
		alignItems: "center",
		justifyContent: "center",
	},
	h2: {
		fontSize: 16,
	},
	earning: {
		fontSize: 30,
	},
	reporSection: {
		flexDirection: "row",
		paddingVertical: 20,
	},
	bar: {
		backgroundColor: Colors.primary,
		paddingVertical: 20,
		flexDirection: "row",
		justifyContent: "space-around",
	},
	h3: {
		color: Colors.white,
	},
	emptyTable: {
		alignItems: "center",
		justifyContent: "center",
		height: 300,
		//borderWidth: 1,
	},
});

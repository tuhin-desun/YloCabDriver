import React from "react";
import {
	StyleSheet,
	Text,
	View,
	Dimensions,
	FlatList,
	TouchableOpacity,
	Image,
	ActivityIndicator
} from "react-native";
import Colors from "../config/colors";
import { FontAwesome } from "@expo/vector-icons";
import Header from "../component/Header";
import { getDriverProfile, fetchRideHistory } from '../services/APIServices';
import AppContext from "../context/AppContext";
import { namedDateTime } from "../utils/Util";
import ListEmpty from "../component/ListEmpty";



const windowwidth = Dimensions.get("screen").width;
const windowheight = Dimensions.get("screen").height;

export default class History extends React.Component {

	static contextType = AppContext
	constructor(props) {
		super(props);

		this.state = {
			DATA: [],
			loading: true,
		};
	}

	componentDidMount() {
		this.focusListeners = this.props.navigation.addListener('focus', () => {
			this.setState({
				loading: true,
			}, () => {
				this.getRideHistory();
			})

			getDriverProfile(this.context.driverData.id).then((response) => {
				if (response.check == 'success') {
					this.context.setDriverData(response.data);
				}
			}).catch((err) => { console.log(err) });
		})
	}

	componentWillUnmount() {
		this.focusListeners();
	}

	getRideHistory = () => {
		const { driverData } = this.context;
		let obj = {
			rideType: 'Past',
			user_id: driverData.id,
			user_type: "driver"
		}
		fetchRideHistory(obj)
			.then((response) => {
				let obj = [];
				if (response.data.length > 0) {
					obj = response.data.map((item) => {
						return JSON.parse(item);
					})
				}
				this.setState({ DATA: obj, loading: false });
			})
			.catch((err) => { console.log(err) })
	}

	listEmptyComponent = () => <ListEmpty />;

	renderItem = ({ item }) => {
		item = JSON.parse(item);
		return (
			<TouchableOpacity
				activeOpacity={0.7}
				style={styles.card}
				onPress={() => this.props.navigation.navigate("HistoryDetails", { item })}
			>
				<View style={styles.cardHead}>
					{/* <View style={{ flexDirection: "row" }}> */}
					<View
						style={styles.ImageContainer}
						onPress={() => this.props.navigation.toggleDrawer()}
					>
						<Image
							source={require("../assets/taxi.png")}
							style={styles.ImageStyle}
							resizeMode={"contain"}
						/>
					</View>
					<View style={{ width: "70%", paddingLeft: 20 }}>
						{/* <Text style={styles.title}>Fri, Mar 12, 01:37 PM</Text> */}
						<Text style={styles.title}>{namedDateTime(item.currentTimeSeconds)}</Text>
						<View style={{ flexDirection: "row" }}>
							<View style={{ paddingRight: 5 }}>
								<Text style={{ fontSize: 12 }}>{item.car_type}</Text>
							</View>
							<Text style={{ color: "#ddd", fontSize: 12 }}>|</Text>
							<View style={{ paddingLeft: 5 }}>
								<Text style={{ fontSize: 12 }} ellipsizeMode="tail">
									{item.bookingID}
								</Text>
							</View>
						</View>

						{/* {item.status == "1" ? (
                        <Text style={[styles.status, { color: "green" }]}>Complete</Text>
                    ) : (
                        <Text style={[styles.status, { color: "#d9534f" }]}>
                            Canceled
                        </Text>
                    )} */}
					</View>
					{/* </View> */}
					<View style={{ width: "15%", alignItems: "flex-end" }}>
						<Text style={styles.title}>₹ {item?.estimate?.estimateFare ?? 0}</Text>
						{/* <Text style={styles.paymentStatus}>QR Pay</Text> */}
						<Text style={styles.paymentStatus}>{item.status}</Text>
					</View>
				</View>
				<View style={styles.cardContent}>
					<View style={styles.location}>
						<View style={styles.mapMarker}>
							<FontAwesome name="map-marker" size={15} color="green" />
						</View>
						<View style={styles.address}>
							<Text style={styles.addressText} ellipsizeMode="tail" numberOfLines={2}>
								{item.currentAddress}
							</Text>
						</View>
					</View>
					<View style={styles.timeline}>
						<Text style={styles.timelineItem}>
							{"."}
						</Text>
						<Text style={styles.timelineItem}>
							{"."}
						</Text>
						<Text style={styles.timelineItem}>
							{"."}
						</Text>
						<Text style={styles.timelineItem}>
							{"."}
						</Text>
						<Text style={styles.timelineItem}>
							{"."}
						</Text>
					</View>
					<View style={styles.location}>
						<View style={styles.mapMarker}>
							<FontAwesome name="map-marker" size={15} color="#d9534f" />
						</View>
						<View style={styles.address}>
							<Text style={styles.addressText} ellipsizeMode="tail" numberOfLines={2}>
								{item.destinationAddress}
							</Text>
						</View>
					</View>
				</View>
			</TouchableOpacity>
		)
	};
	render = () => {
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"ios-menu-sharp"}
					leftButtonFunc={() => this.props.navigation.toggleDrawer()}
					title={"History"}
					rightIconName={"name"}
					walletBalance={this.context.driverData.wallet}
				/>
				{this.state.loading ? (
					<View style={{ flex: 1, justifyContent: 'center' }}>
						<ActivityIndicator color={Colors.primary} size="large" />
					</View>
				) : (
					<FlatList
						data={this.state.DATA}
						renderItem={this.renderItem}
						keyExtractor={(item, index) => index.toString()}
						ListEmptyComponent={this.listEmptyComponent.bind(this)}
						// contentContainerStyle={{ height: '100%' }}
						ListFooterComponent={() => <View style={{ height: 10 }} />}
						contentContainerStyle={
							this.state.DATA.length === 0 ? styles.container : null
						}
					/>
				)}
			</View>
		);
	};
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
	},
	card: {
		backgroundColor: Colors.white,
		marginTop: 10,
		marginHorizontal: 8,
		// height: windowheight / 5,
		borderRadius: 5,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	cardHead: {
		// borderWidth: 1,
		paddingVertical: 10,
		paddingHorizontal: 10,
		flexDirection: "row",
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
		alignItems: "center",
	},
	title: {
		fontWeight: "bold",
		fontSize: 14,
	},
	status: {
		fontSize: 12,
		fontWeight: "bold",
	},
	paymentStatus: {
		fontSize: 9,
		color: Colors.medium,
	},
	cardContent: {
		paddingVertical: 10,
		// paddingHorizontal: 10,
		marginHorizontal: 10,
		// borderWidth: 1
	},
	addressText: {
		// borderWidth: 1,
		fontSize: 13,
		color: "#243224",
	},
	timeline: {
		width: "10%",
		alignItems: "center",
		// borderWidth: 1
	},
	timelineItem: {
		fontSize: 8,
		lineHeight: 5,
		fontWeight: "bold",
	},
	location: {
		flexDirection: "row",
		alignItems: "center",
		//borderWidth: 1,
		//marginHorizontal: 10
	},
	mapMarker: {
		width: "10%",
		alignItems: "center",
		paddingVertical: 5,
		//borderWidth: 1
	},
	address: {
		width: "90%",
	},
	ImageContainer: {
		width: "15%",
		//borderWidth: 1
	},
	ImageStyle: {
		height: 40,
		width: 60,
	},
	emptyComponent: {
		flex: 1,
		justifyContent: 'center',
		alignItems: "center",
	},
	emptyComponentText: {
		fontSize: 20
	}
});

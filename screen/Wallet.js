import React, { Component } from "react";
import {
	Text,
	StyleSheet,
	View,
	TextInput,
	Image,
	TouchableOpacity,
	ActivityIndicator,
	SafeAreaView
} from "react-native";
import Header from "../component/Header";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Colors from "../config/colors";
import RadioButton from "../component/RadioButton";
import { getDriverProfile, handleCredit, getCreditAmounts } from '../services/APIServices';
import AppContext from "../context/AppContext";
import { getValueOfSetting } from "../utils/Util";
import { successDailog, errorDailog, warningDailog } from "../utils/Alerts";
import { Root } from 'react-native-alert-notification';


export default class Wallet extends Component {
	static contextType = AppContext
	constructor(props) {
		super(props);

		this.state = {
			amount: undefined,
			paymentGateWayCharge: 8,
			loading: true,
			activeTab: 'recharge',
			prevCreditDue: 0,
			creditAmounts: []
		};
	}

	componentDidMount() {
		this.focusListeners = this.props.navigation.addListener('focus', () => {
			this.setState({ loading: true }, () => {
				this.fetchDriverProfile()
			});

		})
	}

	componentWillUnmount() {
		this.focusListeners();
	}

	fetchDriverProfile = () => {
		Promise.all([getDriverProfile(this.context.driverData.id), getCreditAmounts()]).then((response) => {
			if (response[0].check == 'success') {
				this.context.setDriverData(response[0].data);
				const result = getValueOfSetting(this.context.appSettings, 'payment_gateway_charge')
				this.setState({
					paymentGateWayCharge: result[0].value,
					prevCreditDue: response[0].data.credit_amount,
					creditAmounts: response[1].data,
					loading: false
				})
			} else {
				this.setState({ loading: false })
			}
		}).catch((err) => { console.log(err) });
	}

	cleanAmount = (value) => {
		const cleanNumbers = value.replace(/[^0-9]/g, "");
		this.setState({
			amount: cleanNumbers
		})
	}

	gotoPayment = () => {
		const { amount, paymentGateWayCharge } = this.state;
		if (typeof amount == 'undefined' || amount <= 0) {
			alert("Please enter recharge amount");
			return;
		}

		let amounts = Number(this.state.prevCreditDue) + Number(amount);
		let apiKey = getValueOfSetting(this.context.appSettings, 'cashfree_api_key');
		let apiSecret = getValueOfSetting(this.context.appSettings, 'cashfree_api_secret');
		let paymentEnv = getValueOfSetting(this.context.appSettings, 'payment_env');
		let chargeableAmount = parseInt(amounts) + parseInt(Math.round((amounts * paymentGateWayCharge) / 100));
		const { email, first_name, last_name, mobile, id } = this.context.driverData
		let obj = {
			email: email,
			name: first_name + '' + last_name,
			mobile: mobile,
			amount: chargeableAmount,
			driver_id: id,
		}

		// console.log({ data: obj, actualAmount: amount, prvDue: this.state.prevCreditDue });return;

		this.setState({
			amount: undefined,
			paymentGateWayCharge: 8,
		}, () => { this.props.navigation.navigate("PaymentGateway", { data: obj, apiKey: apiKey, paymentEnv: paymentEnv, apiSecret: apiSecret, actualAmount: amount, prvDue: this.state.prevCreditDue, type: 'wallet' }) })
	}

	gotoCreditPayment = () => {
		const { prevCreditDue, paymentGateWayCharge } = this.state;
		if (typeof prevCreditDue == 'undefined' || prevCreditDue <= 0) {
			alert("Can not pay credit of 0");
			return;
		}

		let amounts = Number(this.state.prevCreditDue);
		let apiKey = getValueOfSetting(this.context.appSettings, 'cashfree_api_key');
		let apiSecret = getValueOfSetting(this.context.appSettings, 'cashfree_api_secret');
		let paymentEnv = getValueOfSetting(this.context.appSettings, 'payment_env');
		let chargeableAmount = parseInt(amounts) + parseInt(Math.round((amounts * paymentGateWayCharge) / 100));
		const { email, first_name, last_name, mobile, id } = this.context.driverData
		let obj = {
			email: email,
			name: first_name + '' + last_name,
			mobile: mobile,
			amount: chargeableAmount,
			driver_id: id,
		}

		// console.log({ data: obj, actualAmount: amount, prvDue: this.state.prevCreditDue });return;

		this.setState({
			amount: undefined,
			paymentGateWayCharge: 8,
		}, () => { this.props.navigation.navigate("PaymentGateway", { data: obj, apiKey: apiKey, paymentEnv: paymentEnv, apiSecret: apiSecret, actualAmount: prevCreditDue, prvDue: this.state.prevCreditDue, type: 'credit' }) })
	}




	addCredit = () => {
		const { amount } = this.state;
		const { id } = this.context.driverData
		this.setState({
			loading: true,
		})
		handleCredit({ amount, driverID: id }) 
			.then((response) => {
				if (response.type == 'success') {
					successDailog('Success', 'Credit added to wallet')
					this.fetchDriverProfile();
				} else {
					errorDailog('Failed', 'Failed to add credit')
				}
				this.setState({
					loading: true,
				})
			})
			.catch((err) => {
				this.setState({
					loading: true,
				})
				errorDailog('Error', 'Failed to add credit')
			})
	}

	changeActiveTab = (tabName) => {
		if (tabName == 'credit' && this.state.prevCreditDue > 0) {
			warningDailog("Credit Pending",`Please clear your previous credit of ${this.state.prevCreditDue}`);
			return;
		}
		this.setState({
			loading: true,
			activeTab: tabName,
			amount: 0
		}, () => {
			this.fetchDriverProfile();
		})
	}

	handleAmountSet = (amount, type) => {
		// if (type == 'credit' && amount > 500) {
		// 	alert("Credit amount can not be greater than 500");
		// 	return;
		// }
		this.setState({
			amount: amount
		})
	}

	render() {
		return (
			<Root>
				<SafeAreaView style={{flex: 1, backgroundColor: 'transparent'}}>
					<View style={styles.container}>
						<Header
							leftIconName={"ios-menu-sharp"}
							leftButtonFunc={() => this.props.navigation.toggleDrawer()}
							title={"Wallet"}
							rightIconName={"name"}
							walletBalance={this.context.driverData.wallet}
						/>
						<View style={styles.tabBar}>
							<TouchableOpacity
								onPress={() =>
									this.state.activeTab !== "recharge"
										? this.changeActiveTab("recharge")
										: null
								}
								style={
									this.state.activeTab == "recharge"
										? styles.tabItemActive
										: styles.tabItem
								}
							>
								<Text
									style={
										this.state.activeTab == "recharge"
											? { fontWeight: "bold" }
											: null
									}
								>
									Recharge
								</Text>
							</TouchableOpacity>

							<TouchableOpacity
								onPress={() =>
									this.state.activeTab !== "credit"
										? this.changeActiveTab("credit")
										: null
								}
								style={
									this.state.activeTab == "credit"
										? styles.tabItemActive
										: styles.tabItem
								}
							>
								<Text
									style={
										this.state.activeTab == "credit" ? { fontWeight: "bold" } : null
									}
								>
									Credit
								</Text>
							</TouchableOpacity>
						</View>
						{this.state.loading ? (
							<View style={{ flex: 1, justifyContent: "center", alignItems: 'center' }}>
								<ActivityIndicator size="large" color={Colors.primary} />
							</View>
						) : (
							<View style={styles.section}>
								<View style={styles.card}>
									<View style={styles.cardInner}>
										<MaterialCommunityIcons
											name="wallet-outline"
											size={50}
											color="black"
										/>
										<View style={styles.wallet}>
											<Text style={styles.title}>Wallet Amount</Text>
											<Text>₹ {Math.round(this.context.driverData.wallet)}</Text>
										</View>
									</View>
								</View>
								{this.state.activeTab == 'recharge' ? (
									<>
										<View style={styles.card}>
											<Text style={styles.title}>Add Amount</Text>
											<View
												style={[
													styles.cardInner,
													{ paddingTop: 15, paddingHorizontal: 10 },
												]}
											>
												<Text>₹</Text>
												<TextInput
													placeholder="0"
													value={this.state.amount}
													onChangeText={(amount) => this.cleanAmount(amount)}
													keyboardType={"numeric"}
													style={{
														borderBottomWidth: 1,
														width: "30%",
														paddingHorizontal: 2,
														marginLeft: 2,
													}}
												/>
												<View
													style={{
														flexDirection: "row",
														width: "70%",
														//borderWidth: 1,
														justifyContent: "space-evenly",
														paddingBottom: 10
													}}
												>
													<TouchableOpacity
														style={styles.chip}
														onPress={() => this.handleAmountSet("500", 'recharge')}
													>
														<Text>₹ 500</Text>
													</TouchableOpacity>
													<TouchableOpacity
														style={styles.chip}
														onPress={() => this.handleAmountSet("1000", 'recharge')}
													>
														<Text>₹ 1000</Text>
													</TouchableOpacity>
													<TouchableOpacity
														style={styles.chip}
														onPress={() => this.handleAmountSet("2000", 'recharge')}
													>
														<Text>₹ 2000</Text>
													</TouchableOpacity>
												</View>
											</View>
											{this.state.prevCreditDue > 0 ? (
												<Text style={[styles.subtext, { color: Colors.RED }]}>{`**Previous credit due of ${this.state.prevCreditDue} will be added at the time of recharge`}</Text>
											) : null}

										</View>
										<View style={styles.card}>
											<Text style={styles.title}>Payment Method</Text>
											<View
												style={[
													styles.cardInner,
													{ paddingTop: 15, paddingHorizontal: 10 },
												]}
											>
												<TouchableOpacity style={{ flexDirection: "row", width: "50%" }}>
													<RadioButton value="male" status={true} />
													<Text style={{ paddingLeft: 5 }}>Card/UPI/NetBanking</Text>
												</TouchableOpacity>
												<View style={{ width: "50%", alignItems: "flex-end" }}>
													<Image
														source={require("../assets/razorpay.png")}
														style={{ height: 30, width: 100 }}
														resizeMode={"contain"}
													/>
												</View>
											</View>
											<Text style={styles.subtext}>{`**payment gateway charge ${this.state.paymentGateWayCharge ? this.state.paymentGateWayCharge : 8}%`}</Text>
										</View>
										<TouchableOpacity
											activeOpacity={0.7}
											style={styles.button}
											onPress={() => this.gotoPayment()}
										>
											<Text style={styles.buttonText}>ADD AMOUNT</Text>
										</TouchableOpacity>

										{this.state.prevCreditDue > 0 ? (
											<TouchableOpacity
												activeOpacity={0.7}
												style={styles.button}
												onPress={() => this.gotoCreditPayment()}
											>
												<Text style={styles.buttonText}>PAY CREDIT AMOUNT</Text>
											</TouchableOpacity>
										) : null}
									</>
								) : (
									<>
										<View style={styles.card}>
											<Text style={styles.title}>Add Amount</Text>
											<View
												style={[
													styles.cardInner,
													{ paddingTop: 15, paddingHorizontal: 10 },
												]}
											>
												<Text>₹</Text>
												<Text
													style={{
														borderBottomWidth: 1,
														width: "30%",
														paddingHorizontal: 2,
														marginLeft: 2,
													}}>
													{this.state.amount}
												</Text>
												{/* <TextInput
											editable={false}
											placeholder="0"
											value={this.state.amount}
											onChangeText={(amount) => this.cleanAmount(amount)}
											keyboardType={"numeric"}
											style={{
												borderBottomWidth: 1,
												width: "30%",
												paddingHorizontal: 2,
												marginLeft: 2,
											}}
										/> */}
												<View
													style={{
														flexDirection: "row",
														width: "70%",
														//borderWidth: 1,
														justifyContent: "space-evenly",
														paddingBottom: 10
													}}
												>
													{this.state.creditAmounts.length > 0 ?
														this.state.creditAmounts.map((item) => {
															return (
																<TouchableOpacity
																	style={styles.chip}
																	onPress={() => this.handleAmountSet(item.amount, 'credit')}
																>
																	<Text>₹ {item.amount}</Text>
																</TouchableOpacity>
															)
														})
														: (
															null
														)}
												</View>
											</View>
										</View>
										{this.state.prevCreditDue == 0 ? (
											<TouchableOpacity
												activeOpacity={0.7}
												style={styles.button}
												onPress={() => this.addCredit()}
											>
												<Text style={styles.buttonText}>ADD CREDIT</Text>
											</TouchableOpacity>
										) : null}

									</>
								)}
							</View>
						)}
					</View>
				</SafeAreaView>
			</Root>


		);
	}
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: "white",
	},
	section: {
		padding: 15,
	},
	card: {
		marginBottom: 15,
		paddingTop: 20,
		paddingHorizontal: 10,
		backgroundColor: "white",
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
	cardInner: {
		flexDirection: "row",
		alignItems: "center",
	},
	wallet: {
		width: "80%",
		alignItems: "center",
		paddingBottom: 10
	},
	title: {
		paddingBottom: 10,
		fontSize: 18,
	},
	chip: {
		backgroundColor: "white",
		borderRadius: 5,
		borderWidth: 0.5,
		borderColor: Colors.medium,
		padding: 8,
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 1,
		},
		shadowOpacity: 0.22,
		shadowRadius: 2.22,

		elevation: 3,
	},
	button: {
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
	subtext: {
		color: Colors.lightGrey,
		fontSize: 12,
		paddingTop: 15,
		paddingBottom: 5
	},
	tabBar: {
		backgroundColor: Colors.primary,
		flexDirection: "row",
	},
	tabItem: {
		alignItems: "center",
		paddingVertical: 15,
		// flex: 1,
		width: "50%",
	},
	tabItemActive: {
		alignItems: "center",
		borderBottomWidth: 2,
		paddingVertical: 15,
		width: "50%",
	},
});

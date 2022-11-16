import React, { Component } from "react";
import { Text, StyleSheet, View, TouchableOpacity, Share } from "react-native";
import { Entypo, MaterialIcons, Ionicons } from "@expo/vector-icons";
import Colors from "../config/colors";
import firebase from "../config/firebase";
import { Header, OverlayLoader } from "../component";
import { getDriverProfile, fetchSettings } from '../services/APIServices';
import { removeDriverData, getValueOfSetting } from "../utils/Util";
import AppContext from "../context/AppContext";
import * as Sharing from 'expo-sharing'; 

export default class Settings extends Component {
	static contextType = AppContext;

	constructor(props) {
		super(props);

		this.state = {
			showLoader: false,
			privacy: '',
			terms: '',
			isLoaded: false
		};
	}

	componentDidMount() {
		this.focusListeners = this.props.navigation.addListener('focus', () => {
			Promise.all([getDriverProfile(this.context.driverData.id), fetchSettings()]).then((response) => {
				if (response[0].check == 'success') {
					this.context.setDriverData(response[0].data);
					this.setState({
						privacy: getValueOfSetting(response[1].data, 'page_privacy')[0].value,
						terms: getValueOfSetting(response[1].data, 'page_terms')[0].value,
						appShare: getValueOfSetting(response[1].data, 'f_p_url')[0].value,
						isLoaded: true
					})
				}
			}).catch((err) => { console.log(err) });
		})
	}

	componentWillUnmount() {
		this.focusListeners();
	}

	gotoContent = (content, name) => { this.props.navigation.navigate("Content",{content, name}) };

	shareApp = async (url) => {
        try {
            const result = await Share.share({
                message: "Download the app from playstore "+url
            });
            if (result.action === Share.sharedAction) {
                if (result.activityType) {
                    // shared with activity type of result.activityType
                } else {
                    // shared
                }
            } else if (result.action === Share.dismissedAction) {
                // dismissed
            }
        } catch (error) {
            alert(error.message);
        }
    };


	render() {
		return (
			<View style={styles.container}>
				<Header
					leftIconName={"ios-menu-sharp"}
					leftButtonFunc={() => this.props.navigation.toggleDrawer()}
					title={"Settings"}
					rightIconName={"name"}
					walletBalance={this.context.driverData.wallet}
				/>
				<View style={styles.section}>
					<TouchableOpacity
						style={styles.detailsSection}
					// onPress={() => this.props.navigation.navigate("TaxiMeter")}
					>
						<View style={styles.iconContainer}>
							<Ionicons name="speedometer-outline" size={24} color="black" />
						</View>
						<View style={[styles.name, { flexDirection: 'row' }]}>
							<Text style={styles.title}>Taxi Meter </Text>
							<View style={{
								alignSelf: 'center',
								width: 70,
								justifyContent: 'center',
								alignItems: 'center',
								backgroundColor: Colors.primary,
								borderRadius: 10,
							}}>
								<Text style={{ fontSize: 10, }}>Coming Soon</Text>
							</View>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={1}
						style={styles.detailsSection}
						onPress={this.state.isLoaded ? this.gotoContent.bind(this,this.state.privacy, 'Privacy Policy') : () => {console.log("Load")}}
					>
						<View style={styles.iconContainer}>
							<MaterialIcons name="privacy-tip" size={24} color={this.state.isLoaded ? styles.iconColor: styles.disableIcon} />
						</View>
						<View style={styles.name}>
							<Text style={this.state.isLoaded ? styles.title : styles.disabled}>Privacy Policy</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={1}
						style={styles.detailsSection}
						onPress={this.state.isLoaded ? this.gotoContent.bind(this,this.state.terms, 'Terms & Conditions') : () => {console.log("Load")}}
					>
						<View style={styles.iconContainer}>
							<Entypo name="text" size={24} color={this.state.isLoaded ? styles.iconColor: styles.disableIcon} />
						</View>
						<View style={styles.name}>
							<Text style={this.state.isLoaded ? styles.title : styles.disabled}>Terms & Conditions</Text>
						</View>
					</TouchableOpacity>
					<TouchableOpacity
						activeOpacity={1}
						style={styles.detailsSection}
						onPress={this.state.isLoaded ? this.shareApp.bind(this,this.state.appShare) : () => {console.log("Load")}}
					>
						<View style={styles.iconContainer}>
							<Entypo name="share" size={24} color="black" />
						</View>
						<View style={styles.name}>
							<Text style={this.state.isLoaded ? styles.title : styles.disabled}>Share</Text>
						</View>
					</TouchableOpacity>
					{/* <TouchableOpacity style={styles.detailsSection} onPress={this.logout}>
						<View style={styles.iconContainer}>
							<MaterialIcons name="logout" size={24} color="black" />
						</View>
						<View style={styles.name}>
							<Text style={styles.title}>Logout</Text>
						</View>
					</TouchableOpacity> */}
				</View>
				<OverlayLoader visible={this.state.showLoader} />
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
		paddingHorizontal: 15,
	},
	detailsSection: {
		paddingVertical: 10,
		flexDirection: "row",
		alignItems: "center",
		borderBottomWidth: 1,
		borderColor: Colors.textInputBorder,
	},
	iconContainer: {
		overflow: "hidden",
		height: 50,
		width: 50,
		borderRadius: 50 / 2,
		alignItems: "center",
		justifyContent: "center",
	},
	title: {
		fontSize: 15,
		fontWeight: "bold",
		color: Colors.BLACK
	},
	lable: {
		color: Colors.medium,
	},
	name: {
		marginLeft: 15,
	},
	disabled: {
		fontSize: 15,
		fontWeight: "bold",
		color: Colors.grey
	},
	iconColor: {
		color: Colors.BLACK
	},
	disableIcon: {
		color: Colors.grey
	}
});

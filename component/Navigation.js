import React, { Component } from "react";
import { Text, StyleSheet, View } from "react-native";
import {
	Entypo,
	FontAwesome,
	MaterialCommunityIcons,
	MaterialIcons,
	AntDesign,
	FontAwesome5,
} from "@expo/vector-icons";
import Colors from "../config/colors";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import DashboardScreen from "../screen/Dashboard";
import MobileVerificationScreen from "../screen/MobileVerification";
import OtpVerificationScreen from "../screen/OtpVerification";
import SetupAccountScreen from "../screen/SetupAccount";
import CustomDrawerContent from "../component/CustomDrawer";
import WalletScreen from "../screen/Wallet";
import ProfileScreen from "../screen/Profile";
import HistoryScreen from "../screen/History";
import HistoryDetailsScreen from "../screen/HistoryDetails";
import MyIdScreen from "../screen/MyId";
import SettingsScreen from "../screen/Settings";
import SupportScreen from "../screen/Support";
import TaximeterScreen from "../screen/TaxiMeter";
import EarningsScreen from "../screen/Earnings";
import SummaryScreen from "../screen/Summary";
const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();
const DrawerNav = () => {
	return (
		<Drawer.Navigator
			initialRouteName={"DashboardScreen"}
			drawerContentOptions={{
				inactiveTintColor: Colors.black,
				activeTintColor: Colors.primary,
				activeBackgroundColor: Colors.white,
				itemStyle: { marginVertical: 5 },
			}}
			drawerContent={(props) => <CustomDrawerContent {...props} />}
		>
			<Drawer.Screen
				name="Home"
				component={DashboardScreen}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							Home
						</Text>
					),
					drawerIcon: ({ focused, color }) => (
						<Entypo
							name="home"
							size={20}
							color={focused ? Colors.primary : "#000"}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Wallet"
				component={WalletScreen}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							Wallet
						</Text>
					),
					drawerIcon: ({ focused, color }) => (
						<Entypo
							name="wallet"
							size={20}
							color={focused ? Colors.primary : "#000"}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="MyProfile"
				component={ProfileScreen}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							My Profile
						</Text>
					),
					drawerIcon: ({ focused, color }) => (
						<FontAwesome
							name="user-o"
							size={20}
							color={focused ? Colors.primary : "#000"}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="History"
				component={HistoryStack}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							History
						</Text>
					),
					drawerIcon: ({ focused, color }) => (
						<MaterialCommunityIcons
							name="history"
							size={22}
							color={focused ? Colors.primary : "#000"}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="MyId"
				component={MyIdScreen}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							ID Card
						</Text>
					),
					drawerIcon: ({ focused, color }) => (
						<AntDesign
							name="idcard"
							size={20}
							color={focused ? Colors.primary : "#000"}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Settings"
				component={SettingStack}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							Settings
						</Text>
					),
					drawerIcon: ({ focused, color }) => (
						<AntDesign
							name="setting"
							size={24}
							color={focused ? Colors.primary : "#000"}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Earnings"
				component={EarningsScreen}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							Earnings
						</Text>
					),
					drawerIcon: ({ focused, color }) => (
						<FontAwesome5
							name="coins"
							size={24}
							color={focused ? Colors.primary : "#000"}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Summary"
				component={SummaryScreen}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							Summary
						</Text>
					),
					drawerIcon: ({ focused, color }) => (
						<AntDesign
							name="piechart"
							size={24}
							color={focused ? Colors.primary : "#000"}
						/>
					),
				}}
			/>
			<Drawer.Screen
				name="Support"
				component={SupportScreen}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							Support
						</Text>
					),
					drawerIcon: ({ focused, color }) => (
						<AntDesign
							name="customerservice"
							size={24}
							color={focused ? Colors.primary : "#000"}
						/>
					),
				}}
			/>
		</Drawer.Navigator>
	);
};
const LoginStack = () => (
	<Stack.Navigator initialRouteName={"MobileVerification"}>
		<Stack.Screen
			options={{
				headerShown: false,
			}}
			name="MobileVerification"
			component={MobileVerificationScreen}
		/>
		<Stack.Screen
			options={{
				title: "",
			}}
			name="OtpVerification"
			component={OtpVerificationScreen}
		/>
		<Stack.Screen
			options={{
				title: "",
			}}
			name="SetupAccount"
			component={SetupAccountScreen}
		/>
	</Stack.Navigator>
);
const HistoryStack = () => {
	return (
		<Stack.Navigator initialRouteName={"History"}>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
				name="History"
				component={HistoryScreen}
			/>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
				name="HistoryDetails"
				component={HistoryDetailsScreen}
			/>
		</Stack.Navigator>
	);
};
const SettingStack = () => {
	return (
		<Stack.Navigator initialRouteName={"Settings"}>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
				name="Settings"
				component={SettingsScreen}
			/>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
				name="TaxiMeter"
				component={TaximeterScreen}
			/>
			<Stack.Screen
				options={{
					headerShown: false,
				}}
				name="HistoryDetails"
				component={HistoryDetailsScreen}
			/>
		</Stack.Navigator>
	);
};
export default class Navigation extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isLoggedin: true,
		};
	}
	render() {
		return (
			<NavigationContainer>
				{this.state.isLoggedin ? <DrawerNav /> : <LoginStack />}
			</NavigationContainer>
		);
	}
}

const styles = StyleSheet.create({});

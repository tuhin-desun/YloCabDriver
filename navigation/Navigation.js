import React from "react";
import { Text } from "react-native";
import {
	Entypo,
	FontAwesome,
	MaterialCommunityIcons,
	AntDesign,
	FontAwesome5,
	Ionicons
} from "@expo/vector-icons";
import {
	createStackNavigator,
	CardStyleInterpolators,
} from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { NavigationContainer } from "@react-navigation/native";

import DashboardScreen from "../screen/Dashboard";
import MobileVerificationScreen from "../screen/MobileVerification";
import LoginWithMobile from "../screen/LoginWithMobile";
import EmailSignin from "../screen/EmailSignin";
import OtpVerificationScreen from "../screen/OtpVerification";
import SetupAccountScreen from "../screen/SetupAccount";
import DocUploadScreen from "../screen/DocUpload";
import OnboardingStatus from "../screen/OnboardingStatus";
import BannedStatus from "../screen/BannedStatus";
import CustomDrawerContent from "../component/CustomDrawer";
import WalletScreen from "../screen/Wallet";
import ProfileScreen from "../screen/Profile";
import HistoryScreen from "../screen/History";
import HistoryDetailsScreen from "../screen/HistoryDetails";
import MyIdScreen from "../screen/MyId";
import SettingsScreen from "../screen/Settings";
import HTMLcontentScreen from "../screen/HTMLcontentScreen";
import SupportScreen from "../screen/Support";
import TaximeterScreen from "../screen/TaxiMeter";
import EarningsScreen from "../screen/Earnings";
import SummaryScreen from "../screen/Summary";
import ActiveBookingScreen from "../screen/ActiveBookingScreen";
import ReachedScreen from "../screen/ReachedScreen";
import StartTripScreen from "../screen/StartTripScreen";
import StopTripScreen from "../screen/StopTripScreen";
import PaymentDetails from "../screen/PaymentDetails";
import PaymentGateway from "../screen/PaymentGateway";
import WalletTransaction from "../screen/WalletTransaction";
import PermissionDeclaration from "../screen/PermissionDeclaration";
import Notification from "../screen/Notification";

import Colors from "../config/colors";
import Configs from "../config/Configs";
import AppContext from "../context/AppContext";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNav = () => {
	return (
		<Drawer.Navigator
			initialRouteName={"Home"}
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
				component={DashboardStack}
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
							Wallet Recharge
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
				name="WalletTransaction"
				component={WalletTransaction}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							Wallet Transaction
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
				name="Notification"
				component={Notification}
				options={{
					drawerLabel: ({ focused, color }) => (
						<Text
							style={[
								{ color, marginLeft: -10 },
								focused ? { fontWeight: "bold" } : null,
							]}
						>
							Notification
						</Text>
					),
					drawerIcon: ({ focused, color }) => (
						<Ionicons
							name="notifications"
							size={20}
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
		</Drawer.Navigator>
	);
};

const LoginStack = () => (
	<Stack.Navigator
		initialRouteName={"PermissionDeclaration"}
		screenOptions={{
			headerShown: false,
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
		}}
	>
		<Stack.Screen
			name="PermissionDeclaration"
			component={PermissionDeclaration}
		/>
		<Stack.Screen
			name="EmailSignin"
			component={EmailSignin}
		/>
		<Stack.Screen name="MobileVerification" component={MobileVerificationScreen} />
		<Stack.Screen name="LoginWithMobile" component={LoginWithMobile} />
		<Stack.Screen name="OtpVerification" component={OtpVerificationScreen} />
		<Stack.Screen name="SetupAccount" component={SetupAccountScreen} />
		<Stack.Screen name="OnboardingStatus" component={OnboardingStatus} />
		<Stack.Screen name="DocUploadScreen" component={DocUploadScreen} />
		<Stack.Screen name="BannedStatus" component={BannedStatus} />
	</Stack.Navigator>
);

const DashboardStack = () => (
	<Stack.Navigator
		initialRouteName={"DashboardScreen"}
		screenOptions={{
			headerShown: false,
			cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
		}}
	>
		<Stack.Screen name="DashboardScreen" component={DashboardScreen} />
		<Stack.Screen name="ActiveBooking" component={ActiveBookingScreen} />
		<Stack.Screen name="ReachedScreen" component={ReachedScreen} />
		<Stack.Screen name="StartTrip" component={StartTripScreen} />
		<Stack.Screen name="StopTrip" component={StopTripScreen} />
		<Stack.Screen name="PaymentDetails" component={PaymentDetails} />
		<Stack.Screen name="PaymentGateway" component={PaymentGateway} />
	</Stack.Navigator>
);

const HistoryStack = () => {
	return (
		<Stack.Navigator
			initialRouteName={"History"}
			screenOptions={{
				headerShown: false,
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			}}
		>
			<Stack.Screen name="History" component={HistoryScreen} />
			<Stack.Screen name="HistoryDetails" component={HistoryDetailsScreen} />

		</Stack.Navigator>
	);
};

const SettingStack = () => {
	return (
		<Stack.Navigator
			initialRouteName={"Settings"}
			screenOptions={{
				headerShown: false,
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			}}
		>
			<Stack.Screen name="Settings" component={SettingsScreen} />
			<Stack.Screen name="Content" component={HTMLcontentScreen} />
			<Stack.Screen name="TaxiMeter" component={TaximeterScreen} />
			<Stack.Screen name="HistoryDetails" component={HistoryDetailsScreen} />
		</Stack.Navigator>
	);
};

const AccountStatusStack = (props) => {
	return (
		<Stack.Navigator
			initialRouteName={
				props.status === Configs.STATUS_ONBOARDING
					? "OnboardingStatus"
					: "BannedStatus"
			}
			screenOptions={{
				headerShown: false,
				cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
			}}
		>
			<Stack.Screen name="OnboardingStatus" component={OnboardingStatus} />
			<Stack.Screen name="BannedStatus" component={BannedStatus} />
		</Stack.Navigator>
	);
};

export default class Navigation extends React.Component {
	static contextType = AppContext;

	render = () => {
		const { driverData, driverBookingData } = this.context;
		return (
			<NavigationContainer>
				{driverData !== null ? (
					driverData.status === Configs.STATUS_APPROVED ? (
						<DrawerNav />
					) : (
						<AccountStatusStack status={driverData.status} />
					)
				) : (
					<LoginStack />
				)}
			</NavigationContainer>
		);
	};
}

import React from "react";
import AppContext from "./AppContext";

export default class GlobalState extends React.Component {
	constructor(props) {
		super(props);
		this.setDriverData = (data) => this.setState({ driverData: data });
		this.unsetDriverData = () => this.setState({ driverData: null });
		this.setDriverBookingData = (data) => this.setState({ driverBookingData: data });
		this.unsetDriverBookingData = () => this.setState({ driverBookingData: null });
		this.setSettings = (data) => this.setState({ appSettings: data });
		this.unsetSettings = () => this.setState({ driverBookingData: null });
		this.setLocationUpdateData = (data) => this.setState({ locationUpdateData: data });
		this.unsetLocationUpdateData = () => this.setState({ locationUpdateData: null });
		this.setServiceStatus = (data) => this.setState({ serviceStatus: data });
		this.unsetServiceStatus = () => this.setState({ serviceStatus: null });
		this.setCancelReason = (data) => this.setState({ cancelReasons: data });
		this.unsetCancelReason = () => this.setState({ cancelReasons: null });

		this.state = {
			driverData: props.driverData,
			setDriverData: this.setDriverData,
			unsetDriverData: this.unsetDriverData,
			driverBookingData: props.driverBookingData,
			setDriverBookingData: this.setDriverBookingData,
			unsetDriverBookingData: this.unsetDriverBookingData,
			soundAlert: props.sound,
			settings: props.settingsData,
			setSettings: this.setSettings,
			unsetSettings: this.unsetSettings,
			locationUpdateData: null,
			setLocationUpdateData: this.setLocationUpdateData,
			unsetLocationUpdateData: this.unsetLocationUpdateData,
			serviceStatus: props?.serviceStatus ?? '',
			setServiceStatus: this.setServiceStatus,
			unsetServiceStatus: this.unsetServiceStatus,
			cancelReasons: props.cancelReasons,
			setCancelReason: this.setCancelReason,
			unsetCancelReason: this.unsetCancelReason
		};
	}

	render = () => (
		<AppContext.Provider value={this.state}>
			{this.props.children}
		</AppContext.Provider>
	);
}

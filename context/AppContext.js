import React from "react";

export default React.createContext({
	driverData: null,
	setDriverData: (data) => { },
	unsetDriverData: () => { },
	driverBookingData: null,
	setDriverBookingData: (data) => { },
	unsetDriverBookingData: () => { },
	soundAlert: '',
	bookingRequestID: null,
	setBookingRequestID: (data) => { },
	unsetBookingRequestID: () => { },
	settings: () => { },
	setSettings: (data) => { },
	unsetSettings: () => { },
	locationUpdateData: null,
	setLocationUpdateData: (data) => { },
	unsetLocationUpdateData: () => { },
	serviceStatus: '',
	setServiceStatus: (data) => {},
	unsetServiceStatus: () => {},
	cancelReasons: [],
	setCancelReason: (data) => {},
	unsetCancelReason: () => {}
});

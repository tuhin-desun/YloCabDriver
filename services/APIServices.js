import Configs from "../config/Configs";
import { getAccessToken } from "../utils/Util";

const getRequestUrl = (segment, requestObj = {}) => {
	let params = [];
	let url = Configs.BASE_URL + segment;

	for (const [key, value] of Object.entries(requestObj)) {
		params.push(key + "=" + value);
	}

	if (params.length > 0) {
		url += "/?" + params.join("&");
	}

	return url;
};

const getRequestUrl2 = (segment, requestObj = {}) => {
	let params = [];
	let url = Configs.BASE_URL2 + segment;
	console.log('url =====>' , url)

	for (const [key, value] of Object.entries(requestObj)) {
		params.push(key + "=" + value);
	}

	if (params.length > 0) {
		url += "/?" + params.join("&");
	}

	return url;
};


const getRequestOptions = async (requestMethod = "GET", requestObj = {}) => {
	let accessToken = await getAccessToken();
	let requestHeaders = new Headers();
	requestHeaders.append("Authorization", "Bearer " + accessToken);

	let requestOptions = { method: requestMethod };

	if (requestMethod === "GET") {
		requestOptions.headers = requestHeaders;
	} else {
		requestHeaders.append("Content-Type", "multipart/form-data");

		let formData = new FormData();
		for (const [key, value] of Object.entries(requestObj)) {
			formData.append(key, value);
		}

		requestOptions.headers = requestHeaders;
		requestOptions.body = formData;
	}
	return requestOptions;
};

export const driverAuthentication = async (reqObj = {}) => {
	let url = Configs.BASE_URL + "driver_authentication";

	let formData = new FormData();
	for (const [key, value] of Object.entries(reqObj)) {
		formData.append(key, value);
	}

	let requestOptions = {
		method: "POST",
		headers: { "Content-Type": "multipart/form-data" },
		body: formData,
	};
	let response = await fetch(url, requestOptions);
	// console.log(url,await response.text())
	return await response.json();
};

export const loginEmail = async (reqObj = {}) => {
	let url = Configs.BASE_URL + "driver_login_email";

	let formData = new FormData();
	for (const [key, value] of Object.entries(reqObj)) {
		formData.append(key, value);
	}

	let requestOptions = {
		method: "POST",
		headers: { "Content-Type": "multipart/form-data" },
		body: formData,
	};
	let response = await fetch(url, requestOptions);
	// console.log(await response.text())
	return await response.json();
};

export const getServiceTypes = async (accessToken) => {
	let url = Configs.BASE_URL + "service_types";
	let requestOptions = {
		method: "GET",
		headers: {
			Authorization: "Bearer " + accessToken,
		},
	};

	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const setupAccount = async (accessToken, reqObj = {}) => {
	let url = Configs.BASE_URL + "setup_account";
	let formData = new FormData();
	for (const [key, value] of Object.entries(reqObj)) {
		formData.append(key, value);
	}

	let requestHeaders = new Headers();
	requestHeaders.append("Authorization", "Bearer " + accessToken);
	requestHeaders.append("Content-Type", "multipart/form-data");

	let requestOptions = {
		method: "POST",
		headers: requestHeaders,
		body: formData,
	};
	console.log(url, requestOptions)
	let response = await fetch(url, requestOptions);
	// console.log(await response.text());
	return await response.json();
};

export const uploadDocument = async (requestObj) => {
	let url = getRequestUrl("upload_document");
	let requestOptions = await getRequestOptions("POST", requestObj);
	let response = await fetch(url, requestOptions);
	// console.log(url, requestOptions);return;
	// console.log("Response",await response.text());
	return await response.json();
};

export const getUploadedDocumentRecords = async (requestObj) => {
	let url = getRequestUrl("upload_document_records");
	let requestOptions = await getRequestOptions("POST", requestObj);
	let response = await fetch(url, requestOptions);
	// console.log(await response.text())
	return await response.json();
};



export const setProfileImage = async (requestObj) => {
	let url = getRequestUrl("upload_profile_image");
	let requestOptions = await getRequestOptions("POST", requestObj);
	let response = await fetch(url, requestOptions);
	// console.log(url, requestOptions);return;
	return await response.json();
};

export const getDriverProfile = async (id) => {
	let url = getRequestUrl("driver_profile", { provider_id: id });
	let options = await getRequestOptions();
	let response = await fetch(url, options);
	// console.log(await response.text())
	return await response.json();
};


export const updateProfile = async (requestObj) => {
	let url = getRequestUrl("update_profile");
	let requestOptions = await getRequestOptions("POST", requestObj);
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const updatePass = async (requestObj) => {
	let url = getRequestUrl("update_password");
	let requestOptions = await getRequestOptions("POST", requestObj);
	let response = await fetch(url, requestOptions);
	// console.log( await response.text())
	return await response.json();	
}; 

export const getIDCard = async (id) => {
	let url = getRequestUrl("my_id_card", { provider_id: id });
	let options = await getRequestOptions();
	let response = await fetch(url, options);
	return await response.json();
};



export const postLocationData = async (reqObj = {}) => {
	let url = Configs.BASE_URL + "update_driver_location";
	const data = JSON.stringify({ reqObj })
	let formData = new FormData();
	for (const [key, value] of Object.entries(reqObj)) {
		formData.append('data', data);
	}
	let requestOptions = {
		method: "POST",
		body: formData,
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const fetchSettings = async (reqObj = {}) => {
	let url = getRequestUrl2("fetch_settings");
	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};



	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const getCancelReasons = async (reqObj = {}) => {
	let url = getRequestUrl2("fetch_cancel_reasons");
	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(await response.text())
	return await response.json();
};


export const updateBookingRequest = async (reqObj = {}) => {
	let url = getRequestUrl2("update_booking_accept_request");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};




export const startTrip = async (reqObj = {}) => {
	let url = getRequestUrl2("start_trip");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(await response.text())
	return await response.json();
};

export const cancelTrip = async (reqObj = {}) => {
	let url = getRequestUrl2("cancel_trip");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const reachedLocation = async (reqObj = {}) => {
	let url = getRequestUrl2("reached_location");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	//console.log(await response.text());
	return await response.json();
};

export const compeleteTrip = async (reqObj = {}) => {
	let url = getRequestUrl2("complete_trip");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	return await response.json();
};


export const handlePaymentRequest = async (reqObj = {}) => {
	let url = getRequestUrl2("handle_payment_request");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url, requestOptions)
	// console.log(await response.text());
	return await response.json();
};

export const fetchRideHistory = async (reqObj = {}) => {
	let url = getRequestUrl2("get_ride_history");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	console.log(url, requestOptions)
	let response = await fetch(url, requestOptions);
	return await response.json();
};

export const handleWalletRechargeSuccess = async (reqObj = {}) => {
	let url = getRequestUrl2("handle_wallet_recharge_success");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url, requestOptions);
	// console.log(await response.text());return;
	return await response.json();
};

export const getWalletTransaction  = async (reqObj = {}) => {
	let url = getRequestUrl2("get_wallet_transaction");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url, requestOptions);
	// console.log(await response.text());return;
	return await response.json();
};

export const handleClearCredit = async (reqObj = {}) => {
	let url = getRequestUrl2("handle_credit_clear");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url, requestOptions);
	// console.log(await response.text());return;
	return await response.json();
};

export const getStates = async (reqObj = {}) => {
	let url = getRequestUrl2("getStates");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url,await response.text())
	return await response.json();
};

export const changeOutstation = async (reqObj = {}) => {
	let url = getRequestUrl2("change_outstation");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url,await response.text())
	return await response.json();
};

export const changeServiceStatus = async (reqObj = {}) => {
	let url = getRequestUrl2("change_service_status");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url,await response.text())
	return await response.json();
};


export const updateServiceName = async (reqObj = {}) => {
	let url = getRequestUrl2("change_service_type");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url,await response.text())
	return await response.json();
};

export const handleCredit = async (reqObj = {}) => {
	let url = getRequestUrl2("handle_credit");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url,await response.text())
	return await response.json();
};

export const getCreditAmounts = async (reqObj = {}) => {
	let url = getRequestUrl2("get_credit_amounts");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url,await response.text())
	return await response.json();
};

export const getRideStatistic = async (reqObj = {}) => {
	let url = getRequestUrl2("get_rider_statistic");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	console.log(url)
	// console.log(url,await response.text())
	return await response.json();
};

export const getMonthStatistic  = async (reqObj = {}) => {
	let url = getRequestUrl2("get_month_statistic");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	console.log(url)
	// console.log(url,await response.text())
	return await response.json();
};


export const sendOTP = async (reqObj = {}) => {
	let url = getRequestUrl2("sendOTP");

	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url,await response.text())
	return await response.json();
};

export const getNotifications = async (reqObj = {}) => {
	let url = getRequestUrl2("get_notifications");
	console.log("Calling*******************")
	let requestHeaders = new Headers();
	requestHeaders.append("Content-Type", "application/json");
	requestHeaders.append("Accept", "application/json");

	let requestOptions = {
		method: "POST",
		headers: {
			Accept: 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(reqObj),
	};
	let response = await fetch(url, requestOptions);
	// console.log(url,await response.text())
	return await response.json();
};
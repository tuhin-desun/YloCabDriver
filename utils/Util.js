import AsyncStorage from "@react-native-async-storage/async-storage";
import * as mime from "react-native-mime-types";
import moment from 'moment';


const storageKey = "@ylo_cab_driver_data";
const signup_key = "driver_signup";

export const readSignupData = async () => {
	try {
		let rawData = await AsyncStorage.getItem(signup_key);
		return rawData !== null ? JSON.parse(rawData) : null;
	} catch (e) {
		throw new Error("failed data retrieve from device");
	}
};

export const readDriverData = async () => {
	try {
		let rawData = await AsyncStorage.getItem(storageKey);
		return rawData !== null ? JSON.parse(rawData) : null;
	} catch (e) {
		throw new Error("failed data retrieve from device");
	}
};

export const getAccessToken = async () => {
	try {
		let rawData = await AsyncStorage.getItem(storageKey);
		return rawData !== null ? JSON.parse(rawData).access_token : null;
	} catch (e) {
		throw new Error("failed to retrieve access token");
	}
};

export const writeDriverData = async (value) => {
	try {
		await AsyncStorage.setItem(storageKey, JSON.stringify(value));
	} catch (e) {
		throw new Error("failed data save to device");
	}
};

export const writeSignupData = async (value) => {
	try {
		await AsyncStorage.setItem(signup_key, JSON.stringify(value));
	} catch (e) {
		throw new Error("failed data save to device");
	}
};

export const removeDriverData = async () => {
	try {
		await AsyncStorage.removeItem(storageKey);
	} catch (e) {
		throw new Error("failed to remove data from device");
	}
};

export const removeSignupData = async () => {
	try {
		await AsyncStorage.removeItem(signup_key);
	} catch (e) {
		throw new Error("failed to remove data from device");
	}
};

export const getFileData = (obj = {}) => {
	let uri = obj.uri;
	let arr = uri.split("/");
	let fileName = arr[arr.length - 1];

	return {
		uri: uri,
		name: fileName,
		type: mime.lookup(fileName),
	};
};

export const getFormattedDate = (dateStr, formatType = "YYYY-MM-DD") => {
	var d = new Date(dateStr);

	//prepare day
	let day = d.getDate();
	day = day < 10 ? "0" + day : day;

	//prepare month
	let month = d.getMonth() + 1;
	month = month < 10 ? "0" + month : month;

	//prepare year
	let year = d.getFullYear();

	let date = undefined;
	switch (formatType) {
		case "DD/MM/YYYY":
			date = day + "/" + month + "/" + year;
			break;
		default:
			date = year + "-" + month + "-" + day;
	}

	return date;
};

export const isMobile = (no) => {
	let regx = /^\d{10}$/;
	return regx.test(no);
};

export const isEmail = (email) => {
	let regx = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
	return regx.test(email);
};

export const isNumeric = (n) => {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

export const getTimeStamp = () => {
	return moment().format('X');
}


export const namedDateTime = (timestamp) => {
	return moment(timestamp, 'X').format('lll');
}

//array and keyword then returns the array which matches
export const getValueOfSetting = (arrys, keywrd) => {
	return arrys.filter(function(item){ return item.key == keywrd;});
}

export const validateEmail = (email) => {
    const emailCheck=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
        if(emailCheck.test(email)){
            return true;
        }
        return false;
}

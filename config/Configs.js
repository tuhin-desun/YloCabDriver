const PRODUCTION = true;

export default {
	BASE_URL: PRODUCTION
		? "https://ylocabs.com/ycab/ylocab2/api/driver/"
		: "https://ylocabs.com/devlopment/ycab/ylocab2/api/driver/",
		BASE_URL2: PRODUCTION
		? "https://ylocabs.com/ycab/ylocab3/driver/"
		: "https://ylocabs.com/devlopment/ycab/ylocab3/driver/",	
	SUCCESS_TYPE: "success",
	FAILURE_TYPE: "failure",
	TIMER_VALUE: 60,
	PHONE_NUMBER_COUNTRY_CODE: "+91",
	GENDERS: ["Male", "Female", "Others"],
	STATUS_ONBOARDING: "onboarding",
	STATUS_APPROVED: "approved",
	STATUS_BANNED: "banned",
	GOOGLE_MAPS_API_KEY: "AIzaSyC2Fs7x6pczpiXikw0sLRapWHNbl1Ys3k0",
	RELATIVES: [
		{
			id: 1,
			label: 'Father',
			value: 'father'
		},
		{
			id: 2,
			label: 'Mother',
			value: 'mother'
		},
		{
			id: 3,
			label: 'Son',
			value: 'son'
		},
		{
			id: 4,
			label: 'Daughter',
			value: 'daughter'
		},
		{
			id: 5,
			label: 'Brother',
			value: 'brother'
		},
		{
			id: 6,
			label: 'Sister',
			value: 'sister'
		},
		{
			id: 7,
			label: 'Friend',
			value: 'friend'
		},
		{
			id: 8,
			label: 'Other',
			value: 'other'
		}
	]
};

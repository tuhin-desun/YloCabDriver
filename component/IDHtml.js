import * as React from 'react';
import { View, StyleSheet, TouchableOpacity, Platform, Text } from 'react-native';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import Colors from "../config/colors";
import Configs from '../config/Configs';

const LOGO = require("../assets/logo.png");

export default function IDHtml({profileData}) {
    const html = `
    <!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta http-equiv="x-ua-compatible" content="ie=edge">
<meta name="description" content="xxxxx">
<meta name="keywords" content="xxx xxx xxx">
<meta name="author" content="xxxx xxx">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>YLO ID CARD</title>
</head>
<body>

<section style="width:100%;height:420px;background: #efefef;margin:0 auto;border-radius:5px;">
    <div style="display:flex;justify-content: space-between;padding: 25px 36px 0px 36px;align-items: center;">
        <img src="${
            profileData && profileData.picture !== null
                ?  profileData.picture  
                : 'https://ylocabs.com/ycab/ylocab3/uploads/profilePic.png'
            }" style="width:100px;height: 100px;margin-right: 50px;">
        <img src="https://ylocabs.com/ycab/ylocab3/uploads/logo.png" style="width:80px;height: 80px;">
    </div>

    <div style="font-family: Arial, Helvetica, sans-serif;padding:0 25px;">
        <h3>${profileData !== null
            ? profileData.first_name + " " + profileData.last_name
            : null}</h3>

        <div style="display: flex; margin-bottom: 25px;font-family: Arial, Helvetica, sans-serif;">
            <div style="width: 50%;">
                <span style="font-size: 13px;color:gray;">Mobile</span>
                <p style="font-size: 15px;margin: 3px 0;">${profileData && profileData.mobile !== null
                    ? Configs.PHONE_NUMBER_COUNTRY_CODE + profileData.mobile
                    : "N/A"}</p>
            </div>
            <div style="width: 50%;text-align: right;">
                <span style="font-size: 13px;color:gray;">Vehicle Number</span>
                <p style="font-size: 15px;margin: 3px 0;">${profileData && profileData.vehicle_number !== null
                    ? profileData.vehicle_number
                    : "N/A"}</p>
            </div>
        </div>

        <div style="display: flex;font-family: Arial, Helvetica, sans-serif;margin-bottom: 25px;">
            <div style="width: 50%;">
                <span style="font-size: 13px;color:gray;">Driving License</span>
                <p style="font-size: 15px;margin: 3px 0;">${profileData && profileData.dlno !== null
                    ? profileData.dlno
                    : "N/A"}</p>
            </div>
            <div style="width: 50%;text-align: right;">
                <span style="font-size: 13px;color:gray;">Blood Group</span>
                <p style="font-size: 15px;margin: 3px 0;">${profileData && profileData.bloodgroup !== null
                    ? profileData.bloodgroup
                    : "N/A"}</p>
            </div>
        </div>
    </div>
    <img src="https://ylocabs.com/ycab/ylocab3/uploads/approved.png" style="height: 80px;float: right;transform: rotate(331deg);margin-right: 25px;">
</section>
</body>
</html>
`;

    const printToFile = async () => {
        // On iOS/android prints the given html. On web prints the HTML from the current page.
        const { uri } = await Print.printToFileAsync({
            html
        });
        await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    }


    return (
        <TouchableOpacity
            onPress={printToFile}
            activeOpacity={0.7} style={styles.button}>
            <Text style={styles.buttonText}>Share Id</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#ecf0f1',
        flexDirection: 'column',
        padding: 8,
    },
    spacer: {
        height: 8
    },
    printer: {
        textAlign: 'center',
    },
    button: {
        paddingHorizontal: 20,
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
        fontSize: 15,
        fontWeight: "bold",
        textAlign: "center",
    },
});

import React  from 'react';
import { Text, StyleSheet, View } from 'react-native';  
import { Ionicons } from "@expo/vector-icons";


export default function NoConnection({networkinfo}) {
    return (
        <View style={styles.container}>
            <View style={styles.offlineView}>
                <Ionicons name="cloud-offline" size={50} color={"#000"} />
                <Text style={styles.offlineText}>You are offline</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    offlineView: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		backgroundColor: "#f5f5f5",
	},
	offlineText: {
		fontSize: 14,
		color: "#000",
	},
    container: {
        flex: 1
    }
});
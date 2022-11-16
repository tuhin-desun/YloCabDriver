import React from "react";
import { View, StyleSheet } from "react-native";
import SkeletonPlaceholder from "react-native-skeleton-placeholder";

const styles = StyleSheet.create({
	card: {
		padding: 20,
		borderRadius: 10,
		backgroundColor: "white",
		shadowColor: "#000",
		shadowOffset: {
			width: 0,
			height: 2,
		},
		shadowOpacity: 0.25,
		shadowRadius: 3.84,
		elevation: 5,
	},
	prfileImg: {
		height: 160,
		width: 140,
		borderRadius: 10,
	},
	profileName: {
		height: 12,
		width: 250,
		marginVertical: 12,
		borderRadius: 3,
	},
	detailsRow: {
		flexDirection: "row",
		justifyContent: "space-between",
		marginVertical: 15,
	},
	label: {
		height: 10,
		width: 150,
		marginBottom: 8,
		borderRadius: 3,
	},
	title: {
		height: 10,
		width: 150,
		borderRadius: 3,
	},
});

const IDCardSkeleton = (props) => (
	<View style={styles.card}>
		<SkeletonPlaceholder>
			<View style={styles.prfileImg} />
			<View style={styles.profileName} />
			<View style={styles.detailsRow}>
				<View>
					<View style={styles.label} />
					<View style={styles.title} />
				</View>
				<View>
					<View style={styles.label} />
					<View style={styles.title} />
				</View>
			</View>
			<View style={styles.detailsRow}>
				<View>
					<View style={styles.label} />
					<View style={styles.title} />
				</View>
				<View>
					<View style={styles.label} />
					<View style={styles.title} />
				</View>
			</View>
		</SkeletonPlaceholder>
	</View>
);

export default IDCardSkeleton;

import React, { useState, useContext } from "react";
import { Text, StyleSheet, View, useWindowDimensions, ScrollView } from "react-native";
import Colors from "../config/colors";
import { Header } from "../component";
import AppContext from "../context/AppContext";
import RenderHtml from 'react-native-render-html';

const Settings = (props) => {

    const context = useContext(AppContext);
    const { width } = useWindowDimensions();
    const [content, setContent] = useState(props.route.params?.content ?? '');
    const [screenName, setScreenName] = useState(props.route.params?.name ?? '');

    const source = {
        html: content
    };

    return (
        <View style={styles.container}>
            <Header
                leftIconName={"ios-arrow-back"}
                leftButtonFunc={() => props.navigation.goBack()}
                title={screenName}
                rightIconName={"name"}
                walletBalance={context.driverData.wallet}
            />
            <ScrollView style={{flex: 1, backgroundColor: 'transparent', paddingHorizontal: 10}}>
                <RenderHtml
                    contentWidth={width}
                    source={source}
                />
            </ScrollView>

        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.white,
    },
    section: {
        flex: 1,
    },
    detailsSection: {
        paddingVertical: 10,
        flexDirection: "row",
        alignItems: "center",
        borderBottomWidth: 1,
        borderColor: Colors.textInputBorder,
    }
});

export default Settings;

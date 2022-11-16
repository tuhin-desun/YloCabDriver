import React from "react";
import { Button } from "react-native-elements";
import { TouchableOpacity } from "react-native";
import _ from "lodash";

const ThrottleButton = ({onPress, throttleTime, throttleOption}, ...props) => {

    onPress = _.throttle(
        onPress,
        throttleTime,
        throttleOption
    )

        return(
            <TouchableOpacity
                onPress={onPress}
                {...props}
            >
                {props.children}
            </TouchableOpacity>
        )
}

export default ThrottleButton;
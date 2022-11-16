import React from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity } from 'react-native'

const ImageComponent = (props) => {
    const getImageURI = () => {
        let imageURI;
        if (typeof props.image == 'undefined') {
            imageURI = "https://media.istockphoto.com/vectors/thumbnail-image-vector-graphic-vector-id1147544807?k=20&m=1147544807&s=612x612&w=0&h=pBhz1dkwsCMq37Udtp9sfxbjaMl27JUapoyYpQm0anc="
        } else {
            imageURI = props.image
        }
        return imageURI;
    }
    

    return (
        <View>
            <Text> {props.label} </Text>
            <View style={[styles.textInput, props.style]} >
                <TouchableOpacity
                    onPress={props.toggle}
                >
                    <Image
                        style={{
                            width: 66,
                            height: 58,
                        }}
                        source={{
                            uri: getImageURI(),
                        }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    textInput: {
        borderWidth: 2,
        width: "90%",
        padding: 6,
        borderRadius: 5,
    }
})

export default ImageComponent;
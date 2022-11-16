import React, { useState } from 'react';
import ReactNative from 'react-native';
import { Entypo, Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { BottomSheet } from 'react-native-btr';
import { getFileData } from "../utils/Util";
const {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Linking,
} = ReactNative;
import { MaterialIcons } from "@expo/vector-icons";
import Colors from "../config/colors";

const ImageHandler = ({ toggleFunction, visible, image, docUploadHandler, queryField, type }) => {
  const pickImage = async () => {
    toggleFunction();
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      let obj = {
        data: getFileData(result),
        queryField: queryField,
        type: type
      }
      docUploadHandler(obj);
      image(result);

    }
  };

  const cameraHandle = async () => {
    toggleFunction();
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (permissionResult.granted === false) {
      Alert.alert(
        "You've refused to allow this appp to access your camera!",
        "Grant camera access?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel"
          },
          { text: "OK", onPress: () => Linking.openSettings() }
        ]
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });

    if (!result.cancelled) {
      let obj = {
        data: getFileData(result),
        queryField: queryField,
        type: type
      }
      docUploadHandler(obj);
      image(result);
    }


  }

  return (
    <BottomSheet
      visible={visible}
      onBackButtonPress={toggleFunction}
      onBackdropPress={toggleFunction}
    >
      <View style={styles.panel}>
        <View style={{ alignItems: "center" }}>
          <Text style={styles.panelTitle}>Upload Photo</Text>
        </View>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={cameraHandle}
        >
          <MaterialIcons
            name="photo-camera"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.panelButtonTitle}>Take Photo</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.panelButton}
          onPress={pickImage}
        >
          <MaterialIcons
            name="photo-library"
            size={18}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.panelButtonTitle}>Choose From Library</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.panelButton} onPress={toggleFunction}>
          <MaterialIcons
            name="cancel"
            size={20}
            color="white"
            style={{ marginRight: 5 }}
          />
          <Text style={styles.panelButtonTitle}>Cancel</Text>
        </TouchableOpacity>
      </View>
      {/* <View style={styles.sheetContainer}>
        <View style={styles.sheetHeader}>
          <TouchableOpacity
            onPress={toggleFunction}
            activeOpacity={1}
          >
            <Entypo name="circle-with-cross" size={24} color="black" />
          </TouchableOpacity>
        </View>
        <View style={styles.sheetBody}>
          <TouchableOpacity style={styles.btn} onPress={cameraHandle}>
            <Ionicons name="camera-outline" size={22} color="black" />
            <Text>Camera</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btn}
            onPress={pickImage}
          >
            <Ionicons name="document-outline" size={22} color="black" />
            <Text>Gallery</Text>
          </TouchableOpacity>
        </View>
      </View> */}
    </BottomSheet>
  );
}


var styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    marginTop: 66
  },
  button: {
    padding: 8,
  },
  buttonText: {
    fontSize: 17,
    color: "#007AFF"
  },
  subView: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#FFFFFF",
    height: 200,
  },
  sheetContainer: {
    height: 200,
    backgroundColor: '#dcdcdc'
  },
  sheetHeader: {
    alignItems: 'flex-end',
    padding: 5
  },
  sheetBody: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },
  btn: {
    width: "80%",
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    flexDirection: "row",
  },
  logo: {
    width: 66,
    height: 58,
  },
  bsheader: {
    backgroundColor: Colors.primary,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  panelHeader: {
    alignItems: "center",
  },
  panelHandle: {
    width: 40,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginBottom: 10,
  },
  panelTitle: {
    fontSize: 20,
    height: 30,
  },
  panelSubtitle: {
    fontSize: 14,
    color: "gray",
    height: 20,
    marginBottom: 10,
  },
  panel: {
    padding: 20,
    backgroundColor: Colors.white,
  },
  panelButton: {
    flexDirection: "row",
    padding: 10,
    borderRadius: 10,
    backgroundColor: Colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 7,
  },
  panelButtonTitle: {
    fontSize: 15,
    fontWeight: "bold",
    color: "white",
  },
});

export default ImageHandler;


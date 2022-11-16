import React from "react";
import {
    Text,
    StyleSheet,
    View,
    TextInput,
    TouchableOpacity,
    ScrollView,
    BackHandler,
    Platform
} from "react-native";
import Constants from "expo-constants";
import Colors from "../config/colors";
import { ImageHandler, ImageComponent } from "../component";
import { getFileData } from "../utils/Util";
import { uploadDocument } from "../services/APIServices";
import * as Updates from 'expo-updates';
import { successToast } from "../utils/Alerts";
import { Root } from 'react-native-alert-notification';

export default class DocUpload extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            imageLoader: false,
            nextStep: 5,
            services: [],
            id: typeof props.route.params !== "undefined" ? props.route.params.id : 0,
            accessToken:
                typeof props.route.params !== "undefined"
                    ? props.route.params.accessToken
                    : null,

            ownerPhoto: undefined,
            ownerAdharCardFront: undefined,
            ownerAdharCardBack: undefined,
            ownerPanCardFront: undefined,
            ownerPanCardBack: undefined,
            ownerVoterCardFront: undefined,
            ownerVoterCardBack: undefined,
            driverPhoto: undefined,
            driverPanCardFront: undefined,
            driverPanCardBack: undefined,
            driverVoterCardFront: undefined,
            driverVoterCardBack: undefined,
            driverAdharCardFront: undefined,
            driverAdharCardBack: undefined,
            driverDrivingLicenceFront: undefined,
            driverDrivingLicenceBack: undefined,
            ownerAgreementCopy1: undefined,
            ownerAgreementCopy2: undefined,
            ownerAgreementCopy3: undefined,
            ownerAgreementCopy4: undefined,
            ownerAgreementCopy5: undefined,
            nocCopy1: undefined,
            nocCopy2: undefined,
            nocCopy3: undefined,
            nocCopy4: undefined,
            nocCopy5: undefined,
            vehiclePaper: undefined,
            insuranceCopy: undefined,
            registrationCopy: undefined,
            carFrontPhoto: undefined,
            cfCopy: undefined,
            permitCopy: undefined,
            vehicleTaxPaper: undefined,

            ownerPhotoURI: undefined,
            ownerAdharCardFrontURI: undefined,
            ownerAdharCardBackURI: undefined,
            ownerPanCardFrontURI: undefined,
            ownerPanCardBackURI: undefined,
            ownerVoterCardFrontURI: undefined,
            ownerVoterCardBackURI: undefined,
            driverPhotoURI: undefined,
            driverPanCardFrontURI: undefined,
            driverPanCardBackURI: undefined,
            driverVoterCardFrontURI: undefined,
            driverVoterCardBackURI: undefined,
            driverAdharCardFrontURI: undefined,
            driverAdharCardBackURI: undefined,
            driverDrivingLicenseFrontURI: undefined,
            driverDrivingLicenseBackURI: undefined,
            ownerAgreementCopy1URI: undefined,
            ownerAgreementCopy2URI: undefined,
            ownerAgreementCopy3URI: undefined,
            ownerAgreementCopy4URI: undefined,
            ownerAgreementCopy5URI: undefined,
            nocCopy1URI: undefined,
            nocCopy2URI: undefined,
            nocCopy3URI: undefined,
            nocCopy4URI: undefined,
            nocCopy5URI: undefined,
            vehiclePaperURI: undefined,
            insuranceCopyURI: undefined,
            registrationCopyURI: undefined,
            carFrontPhotoURI: undefined,
            cfCopyURI: undefined,
            permitCopyURI: undefined,
            vehicleTaxPaperURI: undefined,

            ownerPhotoVisible: false,
            ownerAdharCardFrontVisible: false,
            ownerAdharCardBackVisible: false,
            ownerPanCardFrontVisible: false,
            ownerPanCardBackVisible: false,
            ownerVoterCardFrontVisible: false,
            ownerVoterCardBackVisible: false,
            driverPhotoVisible: false,
            driverPanCardFrontVisible: false,
            driverPanCardBackVisible: false,
            driverVoterCardFrontVisible: false,
            driverVoterCardBackVisible: false,
            driverAdharCardFrontVisible: false,
            driverAdharCardBackVisible: false,
            driverDrivingLicenseFrontVisible: false,
            driverDrivingLicenseBackVisible: false,
            ownerAgreementCopy1Visible: false,
            ownerAgreementCopy2Visible: false,
            ownerAgreementCopy3Visible: false,
            ownerAgreementCopy4Visible: false,
            ownerAgreementCopy5Visible: false,
            nocCopy1Visible: false,
            nocCopy2Visible: false,
            nocCopy3Visible: false,
            nocCopy4Visible: false,
            nocCopy5Visible: false,
            vehiclePaperVisible: false,
            insuranceCopyVisible: false,
            registrationCopyVisible: false,
            carFrontPhotoVisible: false,
            cfCopyVisible: false,
            permitCopyVisible: false,
            vehicleTaxPaperVisible: false,

        };

    }

    componentDidMount() {
        console.log("On this scrren")
    }

    toggleOwnerPhotoSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerPhotoVisible: !this.state.ownerPhotoVisible
        })
    };

    toggleOwnerAadharCardFrontSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerAdharCardFrontVisible: !this.state.ownerAdharCardFrontVisible
        })
    };

    toggleOwnerAadharCardBackSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerAdharCardBackVisible: !this.state.ownerAdharCardBackVisible
        })
    };

    toggleOwnerPanCardFrontSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerPanCardFrontVisible: !this.state.ownerPanCardFrontVisible
        })
    };

    toggleOwnerPanCardBackSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerPanCardBackVisible: !this.state.ownerPanCardBackVisible
        })
    };

    toggleOwnerVoterCardFrontSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerVoterCardFrontVisible: !this.state.ownerVoterCardFrontVisible
        })
    };

    toggleOwnerVoterCardBackSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerVoterCardBackVisible: !this.state.ownerVoterCardBackVisible
        })
    };

    toggleDriverPhotoSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            driverPhotoVisible: !this.state.driverPhotoVisible
        })
    };

    toggleDriverPanCardFrontSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            driverPanCardFrontVisible: !this.state.driverPanCardFrontVisible
        })
    };

    toggleDriverPanCardBackSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            driverPanCardBackVisible: !this.state.driverPanCardBackVisible
        })
    };

    toggleDriverVoterCardFrontSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            driverVoterCardFrontVisible: !this.state.driverVoterCardFrontVisible
        })
    };

    toggleDriverVoterCardBackSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            driverVoterCardBackVisible: !this.state.driverVoterCardBackVisible
        })
    };

    toggleDriverAdharCardFrontSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            driverAdharCardFrontVisible: !this.state.driverAdharCardFrontVisible
        })
    };

    toggleDriverAdharCardBackSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            driverAdharCardBackVisible: !this.state.driverAdharCardBackVisible
        })
    };

    toggleDriverDrivingLicenseFrontSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            driverDrivingLicenseFrontVisible: !this.state.driverDrivingLicenseFrontVisible
        })
    };

    toggleDriverDrivingLicenseBackSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            driverDrivingLicenseBackVisible: !this.state.driverDrivingLicenseBackVisible
        })
    };

    toggleownerAgreementCopy1Selection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerAgreementCopy1Visible: !this.state.ownerAgreementCopy1Visible
        })
    };

    toggleownerAgreementCopy2Selection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerAgreementCopy2Visible: !this.state.ownerAgreementCopy2Visible
        })
    };

    toggleownerAgreementCopy3Selection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerAgreementCopy3Visible: !this.state.ownerAgreementCopy3Visible
        })
    };

    toggleownerAgreementCopy4Selection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerAgreementCopy4Visible: !this.state.ownerAgreementCopy4Visible
        })
    };

    toggleownerAgreementCopy5Selection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            ownerAgreementCopy5Visible: !this.state.ownerAgreementCopy5Visible
        })
    };

    togglenocCopy1Selection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            nocCopy1Visible: !this.state.nocCopy1Visible
        })
    };

    togglenocCopy2Selection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            nocCopy2Visible: !this.state.nocCopy2Visible
        })
    };

    togglenocCopy3Selection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            nocCopy3Visible: !this.state.nocCopy3Visible
        })
    };

    togglenocCopy4Selection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            nocCopy4Visible: !this.state.nocCopy4Visible
        })
    };

    togglenocCopy5Selection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            nocCopy5Visible: !this.state.nocCopy5Visible
        })
    };

    toggleVehiclePaperSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            vehiclePaperVisible: !this.state.vehiclePaperVisible
        })
    };

    toggleInsuranceCopySelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            insuranceCopyVisible: !this.state.insuranceCopyVisible
        })
    };

    toggleRegistrationCopySelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            registrationCopyVisible: !this.state.registrationCopyVisible
        })
    };

    toggleCarFrontPhotoSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            carFrontPhotoVisible: !this.state.carFrontPhotoVisible
        })
    };

    toggleCFSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            cfCopyVisible: !this.state.cfCopyVisible
        })
    };

    togglePermitCopySelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            permitCopyVisible: !this.state.permitCopyVisible
        })
    };

    toggleVehicleTaxPaperSelection = () => {
        //Toggling the visibility state of the bottom sheet
        this.setState({
            vehicleTaxPaperVisible: !this.state.vehicleTaxPaperVisible
        })
    };

    closeApp = () => {
        successToast("Success", "Document Submitted");
        this.restart()
    };

    restart = () => {
        if (Platform.OS == "web") {
            window.location.reload()
        }
        else {
            setTimeout(() => {
                Updates.reloadAsync();
            }, 200);
        }
    }

    docUploadHandler = (data) => {
        data.provider_id = this.state.id;
        uploadDocument(data)
            .then((res) => {
                if (res.check == 'success') {
                    this.setState({ imageLoader: false, showLoader: false });
                } else {
                    this.setState({ imageLoader: false, showLoader: false });
                    alert("Please reupload the last image")
                }
            })
            .catch((err) => { console.log(err) })
    }

    render() {
        return (
            <Root>
                <View style={styles.container}>
                    <ScrollView>
                        <View style={styles.section}>
                            {/* <Text style={styles.h1}>What's your name ? </Text>
                        <Text style={styles.h3}>
                            users will confirm it's you when they book ride
                        </Text> */}
                            <View style={styles.heading}>
                                <Text style={styles.h2}>Upload Document</Text>
                            </View>
                            <ImageComponent
                                toggle={this.toggleOwnerPhotoSelection}
                                label={"Please select OWNER Photo"}
                                image={this.state.ownerPhotoURI}
                            />
                            <ImageComponent
                                toggle={this.toggleOwnerAadharCardFrontSelection}
                                label={"Please select OWNER Aadhar Card Front"}
                                image={this.state.ownerAdharCardFrontURI}
                            />
                            <ImageComponent
                                toggle={this.toggleOwnerAadharCardBackSelection}
                                label={"Please select OWNER Aadhar Card Back"}
                                image={this.state.ownerAdharCardBackURI}
                            />
                            <ImageComponent
                                toggle={this.toggleOwnerPanCardFrontSelection}
                                label={"Please select OWNER PAN Card Front"}
                                image={this.state.ownerPanCardFrontURI}
                            />
                            <ImageComponent
                                toggle={this.toggleOwnerPanCardBackSelection}
                                label={"Please select OWNER PAN Card Back"}
                                image={this.state.ownerPanCardBackURI}
                            />

                            <ImageComponent
                                toggle={this.toggleOwnerVoterCardFrontSelection}
                                label={"Please select OWNER VOTER Card Front"}
                                image={this.state.ownerVoterCardFrontURI}
                            />
                            <ImageComponent
                                toggle={this.toggleOwnerVoterCardBackSelection}
                                label={"Please select OWNER VOTER Card Back"}
                                image={this.state.ownerVoterCardBackURI}
                            />

                            <ImageComponent
                                toggle={this.toggleDriverPhotoSelection}
                                label={"Please select DRIVER Photo"}
                                image={this.state.driverPhotoURI}
                            />

                            <ImageComponent
                                toggle={this.toggleDriverPanCardFrontSelection}
                                label={"Please select DRIVER PAN Card Front"}
                                image={this.state.driverPanCardFrontURI}
                            />
                            <ImageComponent
                                toggle={this.toggleDriverPanCardBackSelection}
                                label={"Please select DRIVER PAN Card Back"}
                                image={this.state.driverPanCardBackURI}
                            />

                            <ImageComponent
                                toggle={this.toggleDriverVoterCardFrontSelection}
                                label={"Please select DRIVER VOTER Card Front"}
                                image={this.state.driverVoterCardFrontURI}
                            />
                            <ImageComponent
                                toggle={this.toggleDriverVoterCardBackSelection}
                                label={"Please select DRIVER VOTER Card Back"}
                                image={this.state.driverVoterCardBackURI}
                            />

                            <ImageComponent
                                toggle={this.toggleDriverAdharCardFrontSelection}
                                label={"Please select DRIVER Aadhar Card Front"}
                                image={this.state.driverAdharCardFrontURI}
                            />
                            <ImageComponent
                                toggle={this.toggleDriverAdharCardBackSelection}
                                label={"Please select DRIVER Aadhar Card Back"}
                                image={this.state.driverAdharCardBackURI}
                            />

                            <ImageComponent
                                toggle={this.toggleDriverDrivingLicenseFrontSelection}
                                label={"Please select DRIVER DRIVING LICENSE Front"}
                                image={this.state.driverDrivingLicenseFrontURI}
                            />
                            <ImageComponent
                                toggle={this.toggleDriverDrivingLicenseBackSelection}
                                label={"Please select DRIVER DRIVING LICENSE Back"}
                                image={this.state.driverDrivingLicenseBackURI}
                            />
                            <ImageComponent
                                toggle={this.toggleownerAgreementCopy1Selection}
                                label={"Please select OWNER AGREEMENT COPY 1"}
                                image={this.state.ownerAgreementCopy1URI}
                            />
                            <ImageComponent
                                toggle={this.toggleownerAgreementCopy2Selection}
                                label={"Please select OWNER AGREEMENT COPY 2"}
                                image={this.state.ownerAgreementCopy2URI}
                            />
                            <ImageComponent
                                toggle={this.toggleownerAgreementCopy3Selection}
                                label={"Please select OWNER AGREEMENT COPY 3"}
                                image={this.state.ownerAgreementCopy3URI}
                            />
                            <ImageComponent
                                toggle={this.toggleownerAgreementCopy4Selection}
                                label={"Please select OWNER AGREEMENT COPY 4"}
                                image={this.state.ownerAgreementCopy4URI}
                            />
                            <ImageComponent
                                toggle={this.toggleownerAgreementCopy5Selection}
                                label={"Please select OWNER AGREEMENT COPY 5"}
                                image={this.state.ownerAgreementCopy5URI}
                            />
                            <ImageComponent
                                toggle={this.togglenocCopy1Selection}
                                label={"Please select NOC COPY 1"}
                                image={this.state.nocCopy1URI}
                            />
                            <ImageComponent
                                toggle={this.togglenocCopy2Selection}
                                label={"Please select NOC COPY 2"}
                                image={this.state.nocCopy2URI}
                            />
                            <ImageComponent
                                toggle={this.togglenocCopy3Selection}
                                label={"Please select NOC COPY 3"}
                                image={this.state.nocCopy3URI}
                            />
                            <ImageComponent
                                toggle={this.togglenocCopy4Selection}
                                label={"Please select NOC COPY 4"}
                                image={this.state.nocCopy4URI}
                            />
                            <ImageComponent
                                toggle={this.togglenocCopy5Selection}
                                label={"Please select NOC COPY 5"}
                                image={this.state.nocCopy5URI}
                            />
                            <ImageComponent
                                toggle={this.toggleVehiclePaperSelection}
                                label={"Please select VEHICLE Paper"}
                                image={this.state.vehiclePaperURI}
                            />
                            <ImageComponent
                                toggle={this.toggleInsuranceCopySelection}
                                label={"Please select Insurance Copy"}
                                image={this.state.insuranceCopyURI}
                            />
                            <ImageComponent
                                toggle={this.toggleRegistrationCopySelection}
                                label={"Please select Registration Copy"}
                                image={this.state.registrationCopyURI}
                            />
                            <ImageComponent
                                toggle={this.toggleCarFrontPhotoSelection}
                                label={"Please select CAR FRONT Photo"}
                                image={this.state.carFrontPhotoURI}
                            />
                            <ImageComponent
                                toggle={this.toggleCFSelection}
                                label={"Please select C/F Copy"}
                                image={this.state.cfCopyURI}
                            />
                            <ImageComponent
                                toggle={this.togglePermitCopySelection}
                                label={"Please select PERMIT Copy"}
                                image={this.state.permitCopyURI}
                            />
                            <ImageComponent
                                toggle={this.toggleVehicleTaxPaperSelection}
                                label={"Please select VEHICLE Tax Paper"}
                                image={this.state.vehicleTaxPaperURI}
                            />

                            <TouchableOpacity
                                activeOpacity={0.8}
                                style={styles.exitBtn}
                                onPress={this.closeApp}
                            >
                                <Text style={styles.exitBtnText}>Submit </Text>
                            </TouchableOpacity>

                        </View>

                    </ScrollView>


                    {/** DOCUMENTS */}
                    <ImageHandler
                        toggleFunction={this.toggleOwnerPhotoSelection}
                        visible={this.state.ownerPhotoVisible}
                        image={(val) => { this.setState({ ownerPhotoURI: val.uri, ownerPhoto: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Photo"
                        type="OWNER"

                    />

                    <ImageHandler
                        toggleFunction={this.toggleOwnerAadharCardFrontSelection}
                        visible={this.state.ownerAdharCardFrontVisible}
                        image={(val) => { this.setState({ ownerAdharCardFrontURI: val.uri, ownerAdharCardFront: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Aadhar Card Front"
                        type="OWNER"

                    />

                    <ImageHandler
                        toggleFunction={this.toggleOwnerAadharCardBackSelection}
                        visible={this.state.ownerAdharCardBackVisible}
                        image={(val) => { this.setState({ ownerAdharCardBackURI: val.uri, ownerAdharCardBack: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Aadhar Card Back"
                        type="OWNER"
                    />

                    <ImageHandler
                        toggleFunction={this.toggleOwnerPanCardFrontSelection}
                        visible={this.state.ownerPanCardFrontVisible}
                        image={(val) => { this.setState({ ownerPanCardFrontURI: val.uri, ownerPanCardFront: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="PAN Card Front"
                        type="OWNER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleOwnerPanCardBackSelection}
                        visible={this.state.ownerPanCardBackVisible}
                        image={(val) => { this.setState({ ownerPanCardBackURI: val.uri, ownerPanCardBack: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="PAN Card Back"
                        type="OWNER"
                    />

                    <ImageHandler
                        toggleFunction={this.toggleOwnerVoterCardFrontSelection}
                        visible={this.state.ownerVoterCardFrontVisible}
                        image={(val) => { this.setState({ ownerVoterCardFrontURI: val.uri, ownerVoterCardFront: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Voter Card Front"
                        type="OWNER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleOwnerVoterCardBackSelection}
                        visible={this.state.ownerVoterCardBackVisible}
                        image={(val) => { this.setState({ ownerVoterCardBackURI: val.uri, ownerVoterCardBack: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Voter Card Back"
                        type="OWNER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleDriverPhotoSelection}
                        visible={this.state.driverPhotoVisible}
                        image={(val) => { this.setState({ driverPhotoURI: val.uri, driverPhoto: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Photo"
                        type="DRIVER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleDriverPanCardFrontSelection}
                        visible={this.state.driverPanCardFrontVisible}
                        image={(val) => { this.setState({ driverPanCardFrontURI: val.uri, driverPanCardFront: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="PAN Card Front"
                        type="DRIVER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleDriverPanCardBackSelection}
                        visible={this.state.driverPanCardBackVisible}
                        image={(val) => { this.setState({ driverPanCardBackURI: val.uri, driverPanCardBack: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="PAN Card Back"
                        type="DRIVER"
                    />

                    <ImageHandler
                        toggleFunction={this.toggleDriverVoterCardFrontSelection}
                        visible={this.state.driverVoterCardFrontVisible}
                        image={(val) => { this.setState({ driverVoterCardFrontURI: val.uri, driverVoterCardFront: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Voter Card Front"
                        type="DRIVER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleDriverVoterCardBackSelection}
                        visible={this.state.driverVoterCardBackVisible}
                        image={(val) => { this.setState({ driverVoterCardBackURI: val.uri, driverVoterCardBack: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Voter Card Back"
                        type="DRIVER"
                    />

                    <ImageHandler
                        toggleFunction={this.toggleDriverAdharCardFrontSelection}
                        visible={this.state.driverAdharCardFrontVisible}
                        image={(val) => { this.setState({ driverAdharCardFrontURI: val.uri, driverAdharCardFront: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Aadhar Card Front"
                        type="DRIVER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleDriverAdharCardBackSelection}
                        visible={this.state.driverAdharCardBackVisible}
                        image={(val) => { this.setState({ driverAdharCardBackURI: val.uri, driverAdharCardBack: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Aadhar Card Back"
                        type="DRIVER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleDriverDrivingLicenseFrontSelection}
                        visible={this.state.driverDrivingLicenseFrontVisible}
                        image={(val) => { this.setState({ driverDrivingLicenseFrontURI: val.uri, driverDrivingLicenseFront: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Driving License Front"
                        type="DRIVER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleDriverDrivingLicenseBackSelection}
                        visible={this.state.driverDrivingLicenseBackVisible}
                        image={(val) => { this.setState({ driverDrivingLicenseBackURI: val.uri, driverDrivingLicenseBack: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Driving License Back"
                        type="DRIVER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleownerAgreementCopy1Selection}
                        visible={this.state.ownerAgreementCopy1Visible}
                        image={(val) => { this.setState({ ownerAgreementCopy1URI: val.uri, ownerAgreementCopy1: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Owner Agreement copy 1"
                        type="OWNER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleownerAgreementCopy2Selection}
                        visible={this.state.ownerAgreementCopy2Visible}
                        image={(val) => { this.setState({ ownerAgreementCopy2URI: val.uri, ownerAgreementCopy2: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Owner Agreement copy 2"
                        type="OWNER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleownerAgreementCopy3Selection}
                        visible={this.state.ownerAgreementCopy3Visible}
                        image={(val) => { this.setState({ ownerAgreementCopy3URI: val.uri, ownerAgreementCopy3: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Owner Agreement copy 3"
                        type="OWNER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleownerAgreementCopy4Selection}
                        visible={this.state.ownerAgreementCopy4Visible}
                        image={(val) => { this.setState({ ownerAgreementCopy4URI: val.uri, ownerAgreementCopy4: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Owner Agreement copy 4"
                        type="OWNER"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleownerAgreementCopy5Selection}
                        visible={this.state.ownerAgreementCopy5Visible}
                        image={(val) => { this.setState({ ownerAgreementCopy5URI: val.uri, ownerAgreementCopy5: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Owner Agreement copy 5"
                        type="OWNER"
                    />
                    <ImageHandler
                        toggleFunction={this.togglenocCopy1Selection}
                        visible={this.state.nocCopy1Visible}
                        image={(val) => { this.setState({ nocCopy1URI: val.uri, nocCopy1: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="NOC COPY 1"
                        type="VEHICLE"
                    />
                    <ImageHandler
                        toggleFunction={this.togglenocCopy2Selection}
                        visible={this.state.nocCopy2Visible}
                        image={(val) => { this.setState({ nocCopy2URI: val.uri, nocCopy2: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="NOC COPY 2"
                        type="VEHICLE"
                    />
                    <ImageHandler
                        toggleFunction={this.togglenocCopy3Selection}
                        visible={this.state.nocCopy3Visible}
                        image={(val) => { this.setState({ nocCopy3URI: val.uri, nocCopy3: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="NOC COPY 3"
                        type="VEHICLE"
                    />
                    <ImageHandler
                        toggleFunction={this.togglenocCopy4Selection}
                        visible={this.state.nocCopy4Visible}
                        image={(val) => { this.setState({ nocCopy4URI: val.uri, nocCopy4: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="NOC COPY 4"
                        type="VEHICLE"
                    />
                    <ImageHandler
                        toggleFunction={this.togglenocCopy5Selection}
                        visible={this.state.nocCopy5Visible}
                        image={(val) => { this.setState({ nocCopy5URI: val.uri, nocCopy5: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="NOC COPY 5"
                        type="VEHICLE"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleVehiclePaperSelection}
                        visible={this.state.vehiclePaperVisible}
                        image={(val) => { this.setState({ vehiclePaperURI: val.uri, vehiclePaper: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Vehicle Paper"
                        type="VEHICLE"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleInsuranceCopySelection}
                        visible={this.state.insuranceCopyVisible}
                        image={(val) => { this.setState({ insuranceCopyURI: val.uri, insuranceCopy: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Insurance Copy"
                        type="VEHICLE"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleRegistrationCopySelection}
                        visible={this.state.registrationCopyVisible}
                        image={(val) => { this.setState({ registrationCopyURI: val.uri, registrationCopy: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Registration Copy"
                        type="VEHICLE"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleCarFrontPhotoSelection}
                        visible={this.state.carFrontPhotoVisible}
                        image={(val) => { this.setState({ carFrontPhotoURI: val.uri, carFrontPhoto: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="CAR FRONT PHOTO"
                        type="VEHICLE"
                    />
                    <ImageHandler
                        toggleFunction={this.toggleCFSelection}
                        visible={this.state.cfCopyVisible}
                        image={(val) => { this.setState({ cfCopyURI: val.uri, cfCopy: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="C/F Copy"
                        type="VEHICLE"
                    />
                    <ImageHandler
                        toggleFunction={this.togglePermitCopySelection}
                        visible={this.state.permitCopyVisible}
                        image={(val) => { this.setState({ permitCopyURI: val.uri, permitCopy: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Permit Copy"
                        type="VEHICLE"
                    />

                    <ImageHandler
                        toggleFunction={this.toggleVehicleTaxPaperSelection}
                        visible={this.state.vehicleTaxPaperVisible}
                        image={(val) => { this.setState({ vehicleTaxPaperURI: val.uri, vehicleTaxPaper: getFileData(val) }) }}
                        docUploadHandler={this.docUploadHandler}
                        queryField="Vehicle Tax paper"
                        type="VEHICLE"
                    />



                </View>
            </Root>

        );
    }
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
        paddingTop: Constants.statusBarHeight,
    },
    section: {
        padding: 10,
    },
    h1: {
        fontSize: 25,
        lineHeight: 40,
        fontWeight: "bold",
    },
    h3: {
        fontSize: 15,
        lineHeight: 30,
    },
    heading: {
        paddingTop: 10,
        paddingBottom: 5,
    },
    h2: {
        fontSize: 20,
        fontWeight: "bold",
    },
    label: {
        fontSize: 18,
    },
    form: {
        marginTop: 5,
    },
    fieldRow: {
        paddingVertical: 10,
        paddingHorizontal: 5,
    },
    paymentRow: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 10,
        marginHorizontal: 5,
    },
    textInput: {
        borderWidth: 2,
        width: "90%",
        padding: 6,
        borderRadius: 5,
        borderColor: Colors.textInputBorder,
    },
    radioButton: {
        width: "90%",
        padding: 6,
        borderRadius: 5,
        flexDirection: "row",
    },
    radioItem: {
        flexDirection: "row",
        width: "30%",
        paddingVertical: 10,
        paddingHorizontal: 2,
    },
    centeredView: {
        flex: 1,
        justifyContent: "flex-end",
        backgroundColor: "rgba(0,0,0,0.5)",
    },

    modalView: {
        backgroundColor: "white",
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        padding: 35,
    },
    button: {
        borderRadius: 20,
        padding: 10,
        elevation: 2,
    },
    buttonOpen: {
        backgroundColor: "#F194FF",
    },
    buttonClose: {
        backgroundColor: "#2196F3",
    },
    textStyle: {
        color: "white",
        fontWeight: "bold",
        textAlign: "center",
    },
    modalText: {
        marginBottom: 15,
        textAlign: "center",
    },
    nextButton: {
        borderRadius: 10,
        height: 45,
        backgroundColor: Colors.primary,
        justifyContent: "center",
        alignItems: "center",
    },
    nextButtonText: {
        textAlign: "center",
        fontSize: 20,
        color: "#fff",
    },
    inputError: {
        borderWidth: 2,
        borderColor: Colors.danger,
    },
    exitBtn: {
        marginTop: 10,
        width: "100%",
        height: 50,
        backgroundColor: Colors.primary,
        borderRadius: 4,
        alignItems: "center",
        justifyContent: "center",
    },
    exitBtnText: {
        fontSize: 18,
        color: "#444",
        letterSpacing: 0.5,
        fontWeight: "bold",
    },

});

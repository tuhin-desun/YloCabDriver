import React from "react";
import {
    View,
    StyleSheet,
    Text,
    TextInput,
    Image,
    Dimensions,
    TouchableOpacity,
    Animated,
    ScrollView,
    SafeAreaView,
    Platform
} from "react-native";
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import _ from 'lodash';
import Colors from "../config/colors";
import Configs from "../config/Configs";
import firebase from "../config/firebase";
import { OverlayLoader } from "../component";
import * as Notifications from "expo-notifications";
import { writeDriverData } from "../utils/Util";
import { writeUserDataToFirebase } from '../utils/helper';
import { errorToast } from "../utils/Alerts";
import { Root } from 'react-native-alert-notification';
import ProgressLoader from 'rn-progress-loader';
import { Ionicons } from '@expo/vector-icons';
import { loginEmail } from "../services/APIServices";
import AppContext from "../context/AppContext";

const windowheight = Dimensions.get("screen").height;
const windowwidth = Dimensions.get("window").width;

export default class MobileVerification extends React.Component {
    static contextType = AppContext;

    constructor(props) {
        super(props);

        this.state = {
            coverHeight: new Animated.Value(windowheight),
            formOpacity: new Animated.Value(0),
            welcomeOpacity: new Animated.Value(1),
            captainOpacity: new Animated.Value(0),
            bottonelavation: new Animated.Value(0),
            logoImageSize: new Animated.Value(windowwidth / 2),
            backImageHeight: new Animated.Value(windowheight / 6),
            email: "",
            password: '',
            emailValidationFailed: false,
            passwordValidationFailed: false,
            showLoader: false,
            passwordHidden: true,
            tokenData: '',
        };

        this.recaptchaVerifier = React.createRef();
    }

    componentDidMount() {
        setTimeout(() => {
            this.startrAnimation();
        }, 100);
        Promise.all([Notifications.getExpoPushTokenAsync({ experienceId: '@ylocab/YloCabDriver' })])
            .then((res) => {
                let tokenData = res[0];
                this.setState({
                    tokenData: tokenData,
                })
            })
            .catch((err) => {
                console.log(err)
            })
    }

    startrAnimation = () => {
        Animated.timing(this.state.coverHeight, {
            toValue: windowheight / 3,
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.logoImageSize, {
            toValue: windowwidth / 3,
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.backImageHeight, {
            toValue: windowheight / 7,
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.welcomeOpacity, {
            toValue: 0,
            duration: 800,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.captainOpacity, {
            toValue: 1,
            duration: 1000,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.formOpacity, {
            delay: 1000,
            toValue: 1,
            duration: 500,
            useNativeDriver: false,
        }).start();
        Animated.timing(this.state.bottonelavation, {
            delay: 1500,
            toValue: 5,
            duration: 200,
            useNativeDriver: false,
        }).start();
    };

    // onChangeEmail = (email) => {
    //     const emailCheck=/^[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i;
    //     if(emailCheck.test(email)){
    //         this.setState({ email });
    //     }else{
    //         alert("Wrong")
    //     }

    // };

    onChangeEmail = (email) => {
        this.setState({ email });
    };

    onChangePassword = (password) => {
        this.setState({ password: password, passwordValidationFailed: false });
    }

    handlePasswordVisibility = () => {
        this.setState({
            passwordHidden: !this.state.passwordHidden
        })
    }

    onPressContinue = _.throttle(
        () => {
            let { email, password, tokenData } = this.state;

            if (email.trim().length == 0) {
                this.setState({
                    emailValidationFailed: true
                })
            }

            if (password.trim().length < 6) {
                this.setState({
                    passwordValidationFailed: true
                })
            }




            let reqObj = {
                email: email,
                password: password,
                device_token: tokenData.data,
                device_type: Platform.OS,
            };
            this.setState({ showLoader: true });
            loginEmail(reqObj)
                .then((response) => {
                    this.setState({ showLoader: false, })

                    if (response.check == 'Invalid') {
                        errorToast('Error', 'No user found with this email')
                    }

                    if (response.check == 'failure') {
                        errorToast('Error', 'Invalid email/password')
                    }

                    if (response.check === Configs.SUCCESS_TYPE) {
                        let data = response.data;
                        if (data.status === Configs.STATUS_ONBOARDING) {
                            if (data.first_name === null || data.last_name === null || data.owner_name === null || data.vehicle_number == null || data.vehicle_number == "") {
                                this.props.navigation.navigate("SetupAccount", {
                                    id: data.id,
                                    mobile: data.mobile,
                                    accessToken: data.access_token,
                                });
                            } else {
                                this.props.navigation.navigate("OnboardingStatus", { id: data.id });
                            }
                        } else if (data.status === Configs.STATUS_BANNED) {
                            this.props.navigation.navigate("BannedStatus");
                        } else {
                            writeDriverData(data);
                            writeUserDataToFirebase(data, data.id)
                            this.context.setDriverData(data);
                        }
                    }
                })
                .catch((error) => {
                    console.log(error)
                    this.setState({
                        showLoader: false
                    }, () => { errorToast('Error', 'Sorry! There is some issue try again') })
                });
        },
        2000,
        { 'leading': true, 'trailing': false }
    )

    render = () => {
        const {
            coverHeight,
            formOpacity,
            bottonelavation,
            welcomeOpacity,
            captainOpacity,
            backImageHeight,
            logoImageSize,
        } = this.state;

        return (
            <Root colors={[{ card: Colors.black, label: Colors.white }]} >
                <SafeAreaView style={{ flex: 1, backgroundColor: 'transparent' }}>
                    <View style={styles.container}>
                        <FirebaseRecaptchaVerifierModal
                            ref={this.recaptchaVerifier}
                            firebaseConfig={firebase.app().options}
                            attemptInvisibleVerification={true}
                        />
                        <ScrollView>
                            <Animated.View style={[styles.section, { height: coverHeight }]}>
                                <Animated.View
                                    style={[
                                        styles.profileImageContainer,
                                        {
                                            height: logoImageSize,
                                            width: logoImageSize,
                                        },
                                    ]}
                                >
                                    <Animated.Image
                                        source={require("../assets/logo.png")}
                                        resizeMode={"cover"}
                                        style={{
                                            height: logoImageSize,
                                            width: logoImageSize,
                                        }}
                                    />
                                    <Animated.Text
                                        style={{
                                            opacity: captainOpacity,
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            textAlign: "center",
                                        }}
                                    >
                                        Hello Captain
                                    </Animated.Text>
                                </Animated.View>
                                <View style={styles.backImageContainer}>
                                    <Animated.Image
                                        source={require("../assets/mobile_verification.png")}
                                        resizeMode={"cover"}
                                        style={{
                                            height: backImageHeight,
                                            width: windowwidth,
                                        }}
                                    />
                                </View>
                                <Animated.Text
                                    style={{
                                        opacity: welcomeOpacity,
                                        fontSize: 30,
                                        fontWeight: "bold",
                                        textAlign: "center",
                                    }}
                                >
                                    Welcome to YLO Cab
                                </Animated.Text>
                            </Animated.View>
                            <View
                                style={{
                                    backgroundColor: Colors.white,
                                    flex: 1,
                                    padding: 25,
                                }}
                            >
                                <Animated.View style={{ opacity: formOpacity }}>
                                    <Text
                                        style={{
                                            fontSize: 20,
                                            fontWeight: "bold",
                                            marginBottom: 10,
                                        }}
                                    >
                                        Provide email and password
                                    </Text>
                                    {/* <Text
										style={{
											fontSize: 12,
											marginBottom: 10,
										}}
									>
										We'll text a code to verify your number
									</Text> */}
                                </Animated.View>
                                <Animated.View style={{ opacity: formOpacity }}>
                                    <View>
                                    <View
                                        style={[
                                            styles.inputContainer,
                                            this.state.emailValidationFailed
                                                ? styles.inputError
                                                : null,
                                        ]}
                                    >
                                        <TextInput
                                            placeholder="Email ID"
                                            keyboardType="email-address"
                                            autoCompleteType="off"
                                            autoCapitalize="none"
                                            style={styles.textInput}
                                            value={this.state.email}
                                            onChangeText={this.onChangeEmail}
                                        />
                                       
                                    </View>
                                    {this.state.emailValidationFailed ? (
                                            <Text style={{ fontSize: 14, color: Colors.danger }}>{"Email can not be empty"}</Text>
                                        ) : null}
                                    </View>
                                    <View>
                                        <View
                                            style={[
                                                styles.inputContainer,
                                                { flexDirection: 'row' },
                                                this.state.passwordValidationFailed
                                                    ? styles.inputError
                                                    : null,
                                            ]}
                                        >
                                            <TextInput
                                                secureTextEntry={this.state.passwordHidden}
                                                placeholder="Password"
                                                autoCompleteType="off"
                                                autoCapitalize="none"
                                                style={[styles.textInput, { width: '90%' }]}
                                                value={this.state.password}
                                                autoComplete={'password'}
                                                onChangeText={this.onChangePassword}
                                            />

                                            <TouchableOpacity
                                                activeOpacity={0.7}
                                                onPress={this.handlePasswordVisibility}
                                            >
                                                {this.state.passwordHidden ? (
                                                    <Ionicons name="eye-off-outline" size={24} color="black" />
                                                ) : (
                                                    <Ionicons name="eye-outline" size={24} color="black" />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                        {this.state.passwordValidationFailed ? (
                                            <Text style={{ fontSize: 14, color: Colors.danger }}>{"Password can not be empty or less than 6 characters"}</Text>
                                        ) : null}
                                    </View>
                                    <TouchableOpacity
                                        activeOpacity={0.7}
                                        style={[styles.button, { elevation: bottonelavation }]}
                                        onPress={this.onPressContinue}
                                    >
                                        <Text style={styles.buttonText}>CONTINUE</Text>
                                    </TouchableOpacity>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('MobileVerification');
                                            }}
                                            style={{ marginTop: 10 }}
                                        >
                                            <Text>Create Account </Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            onPress={() => {
                                                this.props.navigation.navigate('LoginWithMobile');
                                            }}
                                            style={{ marginTop: 10 }}
                                        >
                                            <Text>Login with OTP</Text>
                                        </TouchableOpacity>
                                    </View>
                                </Animated.View>
                            </View>
                        </ScrollView>
                        <ProgressLoader
                            visible={this.state.showLoader}
                            color={Colors.primary} />
                    </View>
                </SafeAreaView>

            </Root>
        );
    };
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white",
    },
    section: {
        position: "relative",
        backgroundColor: Colors.primary,
        alignItems: "center",
        justifyContent: "center",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.5,
        shadowRadius: 3.84,
        elevation: 5,
    },
    heading: {
        fontSize: 36,
        color: Colors.white,
        textAlign: "center",
    },
    inputContainer: {
        overflow: "hidden",
        flexDirection: "column",
        alignItems: "center",
        borderRadius: 5,
        paddingHorizontal: 5,
        borderWidth: 1,
        borderColor: "#e5e5e5",
        marginVertical: 10,
        paddingVertical: 5,
        width: "100%",
    },
    flagImageStyle: {
        marginHorizontal: 5,
        height: 25,
        width: 25,
        resizeMode: "cover",
        alignItems: "center",
    },
    textInput: {
        borderColor: Colors.textInputBorder,
        marginLeft: 10,
        paddingVertical: 5,
        fontSize: 17,
        width: "100%",
    },
    button: {
        marginTop: 20,
        paddingHorizontal: 10,
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
        fontSize: 18,
        textAlign: "center",
    },
    profileImageContainer: {
        position: "absolute",
        top: 20,
        alignItems: "center",
    },
    backImageContainer: {
        position: "absolute",
        bottom: 0,
        alignItems: "center",
        width: windowwidth,
    },
    backImageStyle: {
        height: windowheight / 6,
        width: windowwidth,
    },
    inputError: {
        borderWidth: 1,
        borderColor: Colors.danger,
    },
});

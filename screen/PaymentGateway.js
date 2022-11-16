import React, { Component } from 'react';
import { Button, View, Text, Image, TouchableOpacity, ActivityIndicator } from 'react-native';
import RNPgReactNativeSdk from 'react-native-pg-react-native-sdk';
import styles from '../App.style';
import { startPayment } from '../WEBCHECKOUT';
import AppContext from '../context/AppContext';
import { tempBooking } from "../utils/helper";
import { Header } from "../component";
import { handleWalletRechargeSuccess, handleClearCredit } from "../services/APIServices";
import LottieView from 'lottie-react-native';

const WEB = 'WEB';
const UPI = 'UPI';
const BASE_RESPONSE_TEXT = 'Please wait...';
const HEADER_TEXT = 'Don\'t close this page';

// const apiKey = '12507327dab59a6312c7632b72370521'; // put your apiKey here
// const apiSecret = '5d098510d96dba5016accb1eaee093efba728bae'; // put your apiSecret here

// const env = 'TEST'; // use 'TEST or 'PROD'

export default class Payment extends Component {
    static contextType = AppContext;
    constructor(props) {
        super(props);
        this.state = {
            responseText: BASE_RESPONSE_TEXT,
            upiAppArray: [],
            orderData: [],
            headerText: HEADER_TEXT,
            tryAgain: false,
            actualAmount: props.route.params.actualAmount,
            prevCreditDue: props.route.params?.prvDue ?? 0,
            apiKey: props.route.params?.apiKey[0].value,
            apiSecret: props.route.params?.apiSecret[0].value,
            paymentEnv: props.route.params?.paymentEnv[0].value ?? 'PROD',
            rechargeType: props.route.params?.type ?? 'wallet',
            transComplete: false,
            lottieLoad: 0,
        };
    }

    componentDidMount() {
        this.setState({
            orderData: this.props.route.params.data
        }, () => {
            this._startCheckout(WEB, null);
        })
        // console.log("Context Text", this.context)
        // this._startCheckout(WEB, null);
    }

    changeResponseText = (message) => {
        this.setState({
            responseText: message,
        });
    };

    changeUPIArray = (array) => {
        this.setState({
            upiAppArray: array,
        });
    };

    getFormattedIcon(appName, icon, id) {
        return (
            <TouchableOpacity
                key={id}
                style={styles.round_icon_buttons}
                onPress={() => this._startCheckout(UPI, id)}>
                <Image style={styles.upi_image} source={{ uri: icon }} />
                <Text style={styles.upi_icons_text}> {appName} </Text>
            </TouchableOpacity>
        );
    }

    setApps(obj) {
        let array = [];
        obj.forEach(function (item) {
            console.log(item.id);
            let iconString = item.icon;
            let icon = RNPgReactNativeSdk.getIconString(iconString);
            let button = this.getFormattedIcon(item.displayName, icon, item.id);
            array.push(button);
        }, this);
        this.changeUPIArray(array);
    }

    _getApps() {
        RNPgReactNativeSdk.getUPIApps()
            .then((result) => {
                let obj = JSON.parse(result);
                this.setApps(obj);
            })
            .catch((error) => {
                this.changeUPIArray([
                    <Text key="no_upi_error" style={styles.upi_app_not_found}>
                        {' '}
                        {error.message}{' '}
                    </Text>,
                ]);
            });
    }

    async _createOrderWithToken() {
        let orderId;
        let tokenUrl;

        const { amount, name, mobile, email, driver_id } = this.state.orderData;

        if (this.state.paymentEnv === 'TEST') {
            tokenUrl = 'https://test.cashfree.com/api/v2/cftoken/order'; //for TEST
        } else {
            tokenUrl = 'https://api.cashfree.com/api/v2/cftoken/order'; //for PROD
        }

        orderId = 'Order' + parseInt(100000000 * Math.random(), 10);
        orderId += 'mo' + mobile;
        let orderApiMap = {
            orderId: orderId,
            orderAmount: amount,
            orderCurrency: 'INR',
        };
        console.log(orderApiMap)
        const postParams = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-client-id': this.state.apiKey,
                'x-client-secret': this.state.apiSecret,
            },
            body: JSON.stringify(orderApiMap),
        };
        return new Promise((resolve, reject) => {
            let cfToken;
            fetch(tokenUrl, postParams)
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    //  console.log("data" + data.cftoken);
                    if (data.status === 'ERROR') {
                        console.log(
                            `Error (code: ${data.subCode}, message: ${data.message})`,
                        );
                        console.log(
                            'Please check the apiKey and apiSecret credentials and the environment',
                        );
                        return;
                    }
                    try {
                        cfToken = data.cftoken;
                        //console.log('Token is : ' + data.cftoken);
                        // console.log('data is : ' + JSON.stringify(data));
                        let map = {
                            orderId: orderId,
                            orderAmount: amount.toString(),
                            tokenData: cfToken,
                            orderCurrency: 'INR',
                            customerName: name,
                            customerPhone: mobile,
                        };
                        return resolve(map);
                    } catch (error) {
                        console.log('THE ERROR IS ' + data);
                        return reject(data);
                    }
                });
        });
    }

    validateCreds() {
        if (this.state.apiKey.includes('app id here')) {
            console.log('please set the apiKey variable');
        }
        if (this.state.apiSecret.includes('app secret here')) {
            console.log('please set the apiSecret variable');
        }
    }

    walletRecharge = (obj) => {
        handleWalletRechargeSuccess(obj)
            .then((response) => {
                if (response.type == 'success') {
                    this.changeResponseText("Your transaction is successfull");
                    this.setState({
                        lottieLoad: 2,
                        headerText: "You can close this page",
                        transComplete: true,
                        tryAgain: false,
                    })
                } else {
                    this.changeResponseText("Sorry but the transaction is failed. If amount is deducted from your account. Please contact us with booking id #" + this.state.orderData.bookingID);
                    this.setState({
                        lottieLoad: 1,
                        transComplete: true,
                        headerText: "You can close this page",
                        tryAgain: false,
                    })
                }
            })
            .catch((err) => { console.log(err) })
    }

    creditClear = (obj) => {
        handleClearCredit(obj).then((response) => {
            if (response.type == 'success') {
                this.changeResponseText("Your transaction is successfull");
                this.setState({
                    lottieLoad: 2,
                    transComplete: true,
                    headerText: "You can close this page"
                })
            } else {
                this.changeResponseText("Sorry the transaction is failed. If amount is deducted from your account. Please contact us with booking id #" + this.state.orderData.bookingID);
                this.setState({
                    lottieLoad: 1,
                    transComplete: true,
                    headerText: "You can close this page"
                })
            }
        }).catch((err) => {
            console.log(err)
        })
    }

    async _startCheckout(mode, appId) {
        this.setState({ transComplete: false, lottieLoad: 0 })
        this.validateCreds();
        // console.log('_startCheckout invoked ' + mode + '  ' + appId);

        let responseHandler = (result) => {
            this.changeResponseText(result);

            try {
                let output = '';
                let response = JSON.parse(result);

                //Handle cancel state
                if (response.txStatus == "CANCELLED") {
                    this.changeResponseText("Transaction is cancelled.");
                    this.setState({
                        lottieLoad: 1,
                        transComplete: true,
                        headerText: "You can close this page",
                        tryAgain: true,
                    })
                }

                //Handle Success State
                if (response.txStatus == "SUCCESS") {
                    this.state.orderData.status = "PAID";
                    // tempBooking(this.state.orderData, 95);
                    let obj = {
                        "orderData": this.state.orderData,
                        "transaction": response,
                        "actualAmount": this.state.actualAmount,
                        "prevCreditDue": this.state.prevCreditDue
                    }
                    this.changeResponseText("Please wait we are processing your transaction..");
                    this.setState({
                        headerText: "Don\'t close this page"
                    })
                    // console.log(obj);
                    if (this.state.rechargeType == 'wallet') {
                        this.walletRecharge(obj)
                    } else {
                        this.creditClear(obj);
                    }

                }

                //Handle Failed state
                if (response.txStatus == "FAILED") {
                    this.changeResponseText("Your transaction is failed");
                    this.setState({
                        lottieLoad: 1,
                        transComplete: true,
                        tryAgain: true,
                        headerText: "You can close this page"
                    })
                }


            } catch (error) {
                //
            }
        };

        try {
            this.changeResponseText(BASE_RESPONSE_TEXT);
            let map = await this._createOrderWithToken();
            startPayment(this.state.apiKey, map, mode, appId, this.state.paymentEnv, responseHandler);
        } catch (error) {
            this.changeResponseText(error);
        }
    }



    navigate = () => {
        this.props.navigation.goBack();
    }

    render() {
        return (
            <View style={styles.container}>
                <Header
                    leftIconName={"ios-menu-sharp"}
                    leftButtonFunc={this.navigate}
                    leftIconType="Entype"
                    title={this.state.headerText}
                />
                <View style={styles.body}>
                    <View style={{height: 75, width: 75}}>
                        {
                            this.state.lottieLoad == 1 ? (<LottieView source={require('../assets/transaction-failed.json')} autoPlay loop />)
                                : this.state.lottieLoad == 2 ? (<LottieView source={require('../assets/success.json')} autoPlay loop />)
                                    : null
                        }
                    </View>
                    {!this.state.transComplete ? (
                        <ActivityIndicator size="large" color="#0000ff" />
                    ) : null}
                    <View style={styles.upi_icon_containers}>{this.state.upiAppArray}</View>
                    <Text style={styles.response_text}> {this.state.responseText} </Text>
                    {this.state.tryAgain ? (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this._startCheckout.bind(this)}
                        >
                            <Text>Retry</Text>
                        </TouchableOpacity>
                    ) : null}
                    {this.state.lottieLoad == 2 ? (
                        <TouchableOpacity
                            style={styles.button}
                            onPress={this.navigate.bind(this)}
                        >
                            <Text>Back</Text>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>
        );
    }
}
import * as React from "react";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    ActivityIndicator,
} from "react-native";
import { Ionicons, Entypo } from "@expo/vector-icons";
import moment from "moment";
import Colors from "../config/colors";
import Header from "../component/Header";
import Loader from "../component/Loader";
import ListEmpty from "../component/ListEmpty";
import { getWalletTransaction } from "../services/APIServices";
import AppContext from "../context/AppContext";

export default class Transactions extends React.Component {
    static contextType = AppContext;

    state = {
        page: 1,
        transactions: [],
        isLoading: true,
        isLoadMore: false,
    };

    componentDidMount = () => {
        this.focusListen = this.props.navigation.addListener('focus', () => {
            this.setState({
                isLoading: true,
            })
            this.loadTransactions();
        });
    };

    componentWillUnmount = () => {
        this.focusListen()
    }

    loadTransactions = () => {
        const { id } = this.context.driverData
        let { page, transactions } = this.state;

        getWalletTransaction({ driveId: id }).then((response) => {
            this.setState({
                isLoading: false,
                transactions: response
            });
        }).catch((error) => console.log(error));
    };

    handelRefresh = () => {
        this.setState(
            {
                page: 1,
                transactions: [],
                isLoading: true,
                isLoadMore: false,
            },
            () => {
                this.loadTransactions();
            }
        );
    };

    gotoBack = () => this.props.navigation.goBack();

    renderNewBox = ({ item }) => {
        let amountTextColor = item.status === "CREDITED" ? Colors.success : Colors.danger;
        let amount = parseInt(item.amount);
        amount = item.type === "CREDITED" ? "+ ₹" + amount : "- ₹" + amount;

        return (
            <View style={styles.itemContainer}>
                <View style={styles.purposeConatiner}>
                    <Text style={styles.purposeText}>{item.description}</Text>
                    <Text style={styles.dateTimeText}>
                        {moment(item.created_at, "YYYY-MM-DD HH:mm:ss").format(
                            "DD MMM YYYY, hh:mm A"
                        )}
                    </Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.drcrAmount}>{item.amount}</Text>
                    {/* <Text style={{ color: amountTextColor }}>{amount}</Text> */}
                </View>
                <View style={styles.balanceContainer}>
                    <Text style={styles.currentAmount}>{item.status}</Text>
                    {/* <Text style={{ color: amountTextColor }}>{amount}</Text> */}
                </View>
            </View>
        );
    };

    listFooterComponent = () => {
        let { isLoadMore } = this.state;
        return (
            <View
                style={[
                    styles.listFooterContainer,
                    isLoadMore ? { height: 70, paddingTop: 6 } : null,
                ]}
            >
                {isLoadMore ? (
                    <>
                        <Text style={styles.loadingText}>Hang on, loading content...</Text>
                        <ActivityIndicator size="small" color={Colors.primary} />
                    </>
                ) : null}
            </View>
        );
    };

    listEmptyComponent = () => <ListEmpty />;

    render = () => (
        <View style={styles.container}>
            <Header
                leftIconName={"ios-menu-sharp"}
                leftButtonFunc={() => this.props.navigation.toggleDrawer()}
                title={"Transactions"}
                rightIconName={"name"}
                walletBalance={this.context.driverData.wallet}
            />
            {this.state.transactions.length > 0 ? (
                <View style={styles.heading}>
                    <View style={styles.desContainer}>
                        <Text>Description</Text>
                        {/* <Text style={{ color: amountTextColor }}>{amount}</Text> */}
                    </View>
                    <View style={styles.drcrContainer}>
                        <Text>Amount</Text>
                        {/* <Text style={{ color: amountTextColor }}>{amount}</Text> */}
                    </View>
                    <View style={styles.totbalanceContainer}>
                        <Text>Status</Text>
                        {/* <Text style={{ color: amountTextColor }}>{amount}</Text> */}
                    </View>
                </View>
            ) : null}

            {this.state.isLoading ? (
                <Loader />
            ) : (
                <FlatList
                    ListEmptyComponent={this.listEmptyComponent.bind(this)}
                    data={this.state.transactions}
                    keyExtractor={(item, index) => item.id.toString()}
                    renderItem={this.renderNewBox}
                    refreshing={this.state.isLoading}
                    onRefresh={this.handelRefresh}
                    showsVerticalScrollIndicator={false}
                    ListFooterComponent={this.listFooterComponent.bind(this)}
                    onEndReachedThreshold={0}
                    onEndReached={
                        this.state.isLoadMore ? this.loadTransactions : undefined
                    }
                    contentContainerStyle={
                        this.state.transactions.length === 0 ? styles.container : null
                    }
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.lightGrey,
    },
    heading: {
        width: "100%",
        backgroundColor: Colors.lightGrey,
        paddingVertical: 0,
        flexDirection: "row",
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
        height: 40,
    },
    headingTitle: {
        color: "#444",
        fontSize: 20,
        letterSpacing: 0.5,
    },
    itemContainer: {
        width: "100%",
        flexDirection: "row",
        paddingVertical: 7,
        paddingHorizontal: 7,
        backgroundColor: Colors.white,
        borderBottomWidth: 1,
        borderBottomColor: "#ddd",
    },
    iconContainer: {
        width: "11%",
        alignItems: "flex-start",
        justifyContent: "center",
    },
    purposeConatiner: {
        width: "64%",
    },
    purposeText: {
        color: "#000",
        fontSize: 13,
        marginBottom: 3,
    },
    dateTimeText: {
        color: "#444",
        opacity: 0.9,
        fontSize: 12,
    },
    amountContainer: {
        width: "18%",
        justifyContent: "center",
        borderColor: "#ddd",
        paddingRight: 2,
        borderLeftWidth: 1,
        alignItems: "center",
    },
    balanceContainer: {
        width: "18%",
        justifyContent: "center",
        alignItems: "flex-end",
        borderColor: "#ddd",
        paddingRight: 2,
        borderLeftWidth: 1,
    },
    desContainer: {
        width: "64.54%",
        justifyContent: "center",
        alignItems: "center",
        paddingRight: 2,
    },
    drcrContainer: {
        width: "18%",
        justifyContent: "center",
        alignItems: "center",
        borderColor: "#ddd",
        paddingRight: 2,
        borderLeftWidth: 1,
    },
    totbalanceContainer: {
        width: "18%",
        justifyContent: 'center',
        alignItems: "flex-end",
        borderColor: "#ddd",
        paddingRight: 0,
        borderLeftWidth: 1,
    },
    currentAmount: {
        fontSize: 12,
    },
    drcrAmount: {
        fontSize: 12,
    },
    listFooterContainer: {
        width: "100%",
        height: 5,
        backgroundColor: Colors.lightGrey,
    },
    loadingText: {
        textAlign: "center",
        lineHeight: 20,
        fontSize: 14,
        color: "#444",
        opacity: 0.8,
    },
});

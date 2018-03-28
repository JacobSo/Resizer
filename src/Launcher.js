"use strict";
import React, {Component} from 'react';
import Color from './const/Color';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Linking

} from 'react-native';
import App from './Application';
import Toolbar from "./component/Toolbar";
import ApiService from "./api/ApiService";
import Toast from 'react-native-root-toast';
import {NavigationActions,} from 'react-navigation';

const {width, height} = Dimensions.get('window');


export default class Launcher extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false
        };
    }


    componentDidMount() {
        Linking.getInitialURL().then(url => {
            console.log("login:" + url);
            if (url) {
                const resetAction =
                    NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({
                                routeName: 'installHelper',
                                params: {param: url.substring(url.lastIndexOf("/") + 1, url.length)}
                            },),
                        ]
                    });
                this.props.nav.dispatch(resetAction)

            } else {
                if(!this.props.isLogin){
                    console.log("init:"+App.phone);
                    App.initAccount(() => {

                        if (App.phone && App.token) {
                            this.setState({isLoading: true});
                            Toast.show("second login");

                            ApiService.login(App.phone, App.token)
                                .then((responseJson) => {
                                    this.setState({isLoading: false});
                                    if (!responseJson.err) {
                                        App.saveAccount(
                                            App.token,
                                            responseJson.listData[0].phone,
                                            responseJson.listData[0].userName,
                                            responseJson.listData[0].activeStatus,
                                            responseJson.listData[0].serviceArea,
                                            responseJson.listData[0].userType,
                                            responseJson.listData[0].serviceType,
                                            responseJson.listData[0].registerTime,
                                        );
                                        this.setState({})
                                    } else {
                                        Toast.show(responseJson.errMsg + "，请重新登陆");
                                        this.resetLogin();
                                    }
                                })
                                .catch((error) => {
                                    console.log(error);
                                    Toast.show("请重新登陆");
                                    this.setState({isLoading: false});
                                    this.resetLogin();
                                }).done();
                        } else {
                            this.resetLogin();
                        }
                    });
                }else console.log("be login")

            }
        });
    }

    resetLogin() {
        //   this.props.nav.navigate('launcher');
        const resetAction = NavigationActions.reset({
            index: 0,
            actions: [
                NavigationActions.navigate({routeName: 'login'})
            ]
        });
        this.props.nav.dispatch(resetAction)
    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={[App.userName]}
                    color={"white"}
                    isHomeUp={false}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require('./drawable/setting_black.png')]}
                    functionArray={[
                        () => {
                        },
                        () => {
                            this.props.nav.navigate('preferences')
                        }
                    ]}
                />
                <View style={styles.iconRowContainer}>
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={
                            () => {
                                this.props.nav.navigate("commonList", {listType: 0})
                            }
                        }>
                        <Image style={styles.icon} resizeMode="contain"
                               source={require('./drawable/main_measure_icon.png')}/>
                        <Text>测量任务</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={
                        () => {
                            this.props.nav.navigate("commonList", {listType: 1})
                        }
                    }>
                        <Image style={styles.icon} resizeMode="contain"
                               source={require('./drawable/main_install_icon.png')}/>
                        <Text>安装任务</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconRowContainer}>
                    <TouchableOpacity style={styles.iconContainer} onPress={
                        () => {
                     //       this.props.nav.navigate("commonList", {listType: 2})
                            this.props.nav.navigate("installHelper")
                        }}>
                        <Image style={styles.icon} resizeMode="contain"
                               source={require('./drawable/main_exception_icon.png')}/>
                        <Text>上报异常</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={
                        () => {
                            this.props.nav.navigate("commonList", {listType: 3})
                        }}>
                        <Image style={styles.icon} resizeMode="contain"
                               source={require('./drawable/main_repair_icon.png')}/>
                        <Text>维修任务</Text>
                    </TouchableOpacity>
                </View>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Color.background,
    },
    icon: {
        flex: 1,
        width: 65,
        height: 65
    },
    iconRowContainer: {
        flexDirection: 'row',
        width: width,
        justifyContent: "space-around"
    },
    iconContainer: {
        width: 128,
        height: 128,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 16,
        margin: 16,
        elevation: 2,
    }

});

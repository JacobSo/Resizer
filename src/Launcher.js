"use strict";
/**
 * android
 ┌────────────┬───────────────────────────────────────┬─────────────────────┬──────────────────────┐
 │ Name       │ Deployment Key                        │ Update Metadata     │ Install Metrics      │
 ├────────────┼───────────────────────────────────────┼─────────────────────┼──────────────────────┤
 │ Production │ RiS59Iznc9qpG3qm0RI8bwLp3CSm4ksvOXqog │ No updates released │ No installs recorded │
 ├────────────┼───────────────────────────────────────┼─────────────────────┼──────────────────────┤
 │ Staging    │ EIWkMAoHf6eiXQ42QnvAp4vq8Yrq4ksvOXqog │ No updates released │ No installs recorded │
 └────────────┴───────────────────────────────────────┴─────────────────────┴──────────────────────┘

 ┌────────────┬───────────────────────────────────────┬─────────────────────┬──────────────────────┐
 │ Name       │ Deployment Key                        │ Update Metadata     │ Install Metrics      │
 ├────────────┼───────────────────────────────────────┼─────────────────────┼──────────────────────┤
 │ Production │ 8AefURg2136tbvgOxYWBgqNZTkdS4ksvOXqog │ No updates released │ No installs recorded │
 ├────────────┼───────────────────────────────────────┼─────────────────────┼──────────────────────┤
 │ Staging    │ xOUhXlS9lHs2UDTabv5TCCMWnmB94ksvOXqog │ No updates released │ No installs recorded │
 └────────────┴───────────────────────────────────────┴─────────────────────┴──────────────────────┘


 */
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
    Linking, Alert

} from 'react-native';
import App from './Application';
import Toolbar from "./component/Toolbar";
import ApiService from "./api/ApiService";
import Toast from 'react-native-root-toast';
import {NavigationActions,} from 'react-navigation';
import AndroidModule from './module/AndoridCommontModule'
import IosModule from './module/IosCommontModule'
import codePush from 'react-native-code-push'
import UpdateService from "./api/UpdateService";
const {width, height} = Dimensions.get('window');
const code_push_production_key_android = "RiS59Iznc9qpG3qm0RI8bwLp3CSm4ksvOXqog";
const code_push_production_key_ios = "8AefURg2136tbvgOxYWBgqNZTkdS4ksvOXqog";

export default class Launcher extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            isHelperOpen: false
        };
    }

    initApp() {
        codePush.sync({
            updateDialog: {
                appendReleaseDescription: true,
                descriptionPrefix: '\n\n更新内容：\n',
                title: '更新',
                mandatoryUpdateMessage: '',
                mandatoryContinueButtonLabel: '执行更新',
            },
            mandatoryInstallMode: codePush.InstallMode.IMMEDIATE,
            deploymentKey: Platform.OS === 'ios' ? code_push_production_key_ios : code_push_production_key_android,
        });
        UpdateService.update(false);
        if (Platform.OS === "ios") {
            IosModule.bindPushAccount(App.phone);
        } else {
            AndroidModule.bindPushAccount(App.phone);
        }


    }

//url 成立，直接进入安装辅助，否则走app自身登陆流程
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
                                params: {code: url.substring(url.lastIndexOf("/") + 1, url.length)}
                            },),
                        ]
                    });
                this.props.nav.dispatch(resetAction)
            } else {
                if (!this.props.isLogin) {
                    console.log("init:" + App.phone);
                    App.initAccount(() => {
                        if (App.phone && App.phone !== '' && App.token) {
                            console.log('init login')
                            this.setState({isLoading: true});
                            // Toast.show("second login");
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
                                        this.initApp()
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
                            console.log('reset login')
                            this.resetLogin();
                        }
                    });
                } else console.log("be login")

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
                            this.state.isHelperOpen = false
                            //this.props.nav.navigate("commonList", {listType: 1})
                            this.props.nav.navigate("qr", {
                                    finishFunc: (result) => {
                                        if (!this.state.isHelperOpen) {
                                            this.state.isHelperOpen = true;
                                            Alert.alert(
                                                '进入安装辅助',
                                                '当前产品规格编码是' + result,
                                                [
                                                    {
                                                        text: '取消', onPress: () => {
                                                    }
                                                    },
                                                    {
                                                        text: '确定', onPress: () => {
                                                        this.props.nav.navigate("installHelper", {
                                                            code: result
                                                        })
                                                    }
                                                    },
                                                ]
                                            )

                                        }

                                    }
                                }
                            )
                        }
                    }>
                        <Image style={styles.icon} resizeMode="contain"
                               source={require('./drawable/main_install_icon.png')}/>
                        <Text>安装辅助</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconRowContainer}>
                    <TouchableOpacity style={styles.iconContainer} onPress={
                        () => {
                            this.props.nav.navigate("commonList", {listType: 2})
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

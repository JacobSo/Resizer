/**
 * Created by Administrator on 2017/3/13.
 *TyDRSG24552pclAAS5TSY1IDwXQslpDe
 * loading usage
 */
'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Platform,
    DeviceEventEmitter,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView, Switch, Alert, AsyncStorage
} from 'react-native';
import {MenuProvider} from 'react-native-popup-menu';
import Loading from 'react-native-loading-spinner-overlay';
import App from '../Application';
import {NavigationActions,} from 'react-navigation';

import {
    Menu,
    MenuOptions,
    MenuOption,
    MenuTrigger,
} from 'react-native-popup-menu';
import Toast from 'react-native-root-toast';
import Color from '../const/Color';
import Hoshi from "react-native-textinput-effects/lib/Hoshi";
import {SceneMap, TabBar, TabViewAnimated} from "react-native-tab-view";
import ApiService from '../api/ApiService';
import Utils from '../Utils';
import ScrollableTabView, {DefaultTabBar,} from 'react-native-scrollable-tab-view';
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');
export default class LoginPager extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            phone: '18680006907',
            codeCheck: '',
            check: false,
            index: 0,

            //register params
            registerPhone: "",
            registerUser: "",
            registerServiceType: Utils.serviceType[0],
            registerServiceValue: 0,
            registerUserType: true,
            registerProvider: [],

            //  providerCount:0
            textTemp: '123',

            smsSpeed: 60
        };
    }

    componentDidMount() {
        if (Platform.OS === 'ios') {

        } else {
            console.log("DeviceEventEmitter:add")
            DeviceEventEmitter.addListener('codeResult', this.codeResult);
        }
    }

    componentWillUnmount() {
        if (Platform.OS === 'ios') {

        } else {
            console.log("DeviceEventEmitter:remove")
            DeviceEventEmitter.removeListener('codeResult', this.codeResult);
        }
    }

    codeResult = (e) => {
        console.log(e);
        if (e.type === 0)
            Toast.show(e.result === -1 ? "发送成功" : ("发送验证码失败：" + e.result))
        else {
            if (e.result === -1) {
                this.login()
            } else {
                this.setState({isLoading: false});
                Toast.show("验证失败：" + e.result)
            }
        }
    };

    getProviderCount() {
        let i = 0;
        this.state.registerProvider.map((data) => {
            if (data.isSelect) i++
        });
        return i;
    }

    getProviderStr() {
        let str = "";
        this.state.registerProvider.map((data) => {
            if (data.isSelect) {
                str = str + data.account + ","
            }
        });
        return str.substring(0, str.length - 1);
    }

    countDown() {
        let t1 = setInterval(() => {
            this.state.smsSpeed--;
            if (this.state.smsSpeed < 1) {
                this.state.smsSpeed = 60;
                this.setState({});

                clearInterval(t1);
            } else {
                this.setState({})
            }
        }, 1000);
    }

    register() {
        if (!this.state.registerUser || !this.state.registerPhone) {
            Toast.show("信息不完整");
            return
        }

        Alert.alert(
            '注册',
            '确认填写无误，进行注册',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});

                    ApiService.register(
                        this.state.registerUser,
                        this.state.registerPhone,
                        this.state.registerServiceValue,
                        this.state.registerUserType ? 1 : 0,
                        this.getProviderStr(),
                        0)
                        .then((responseJson) => {
                            this.setState({isLoading: false,});
                            if (!responseJson.err) {
                                this.setState({index: 0});
                                Toast.show("注册成功");
                            } else {
                                Toast.show(responseJson.errMsg);
                            }
                        })
                        .catch((error) => {
                            this.setState({isLoading: false,});
                            Toast.show("出错了，请稍后再试");
                        }).done();
                }
                },
            ]
        );

    }


    smsSend() {
        if (!this.state.phone) {
            Toast.show("请填写手机号码");
            return
        }
        this.countDown();
        if (Platform.OS === 'android') {
            AndroidModule.sendCode("86", this.state.phone)
        } else {
            IosModule.sendCode(this.state.phone, (result) => {
                Toast.show(result)
            });
        }
    }

    smsLogin() {
        if (!this.state.phone || !this.state.codeCheck) {
            Toast.show("信息不完整");
            return
        }
        this.setState({isLoading: true});
        if (Platform.OS === 'android') {
            AndroidModule.submitCode("86", this.state.phone, this.state.codeCheck)
        } else {
            IosModule.submitCode(this.state.phone, this.state.codeCheck, (result) => {
                if (result === "-1") {
                    this.login()
                } else {
                    this.setState({isLoading: false});
                    Toast.show("验证失败：" + result)
                }
            })
        }

    }

// java.lang.RuntimeException: Illegal callback invocation from native module. This callback type only permits a single invocation from native code.
    login() {
        ApiService.login(this.state.phone)
            .then((responseJson) => {
                this.setState({isLoading: false,});
                if (!responseJson.err) {
                    App.saveAccount(
                        responseJson.listData[0].token,
                        responseJson.listData[0].phone,
                        responseJson.listData[0].userName,
                        responseJson.listData[0].activeStatus,
                        responseJson.listData[0].serviceArea,
                        responseJson.listData[0].userType,
                        responseJson.listData[0].serviceType,
                        responseJson.listData[0].registerTime,
                    );
                 //   this.props.nav.navigate('launcher');
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({routeName: 'launcher'})
                        ]
                    });
                    this.props.nav.dispatch(resetAction)
                } else {
                    Toast.show(responseJson.errMsg);
                }
            })
            .catch((error) => {
            console.log(error)
                this.setState({isLoading: false,});
                Toast.show("出错了，请稍后再试");
            }).done();

    }


    topView() {
        return <View style={{flexDirection: 'row', justifyContent: 'space-between', width: width}}>
            <TouchableOpacity onPress={() => this.setState({index: 0})}>
                <Text style={[styles.titleTab, {
                    borderBottomColor: this.state.index === 0 ? Color.colorBlue : Color.line,
                    color: this.state.index === 0 ? Color.content : Color.line,
                }]}>欢迎登陆</Text></TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({index: 1})}>
                <Text style={[styles.titleTab, {
                    borderBottomColor: this.state.index === 0 ? Color.line : Color.colorBlue,
                    color: this.state.index === 0 ? Color.line : Color.content,
                }]}>新账号</Text></TouchableOpacity>
        </View>
    }

    loginView() {
        return <View style={{width: width, flex: 1}}>
            <Hoshi
                style={{margin: 16}}
                label={"手机号码"}
                borderColor={Color.colorBlue}
                keyboardType={"numeric"}
                value={this.state.phone}
                onChangeText={(text) => this.setState({phone: text})}/>
            <View style={{flexDirection: 'row'}}>
                <Hoshi
                    style={{marginLeft: 16, marginRight: 16, width: width / 2}}
                    label={'验证码'}
                    keyboardType={"numeric"}
                    borderColor={Color.colorBlue}
                    value={this.state.codeCheck}
                    onChangeText={(text) => this.setState({codeCheck: text})}/>
                <TouchableOpacity
                    disabled={this.state.smsSpeed !== 60}
                    style={{width: width / 2, alignItems: 'center', justifyContent: 'center'}}
                    onPress={() => this.smsSend()}>
                    <Text style={{color: this.state.smsSpeed === 60 ? Color.colorBlue : Color.content}}>
                        { this.state.smsSpeed === 60 ? '获取验证码' : this.state.smsSpeed + "秒"}
                    </Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: Color.colorBlue,}]}
                onPress={() => this.login()}>
                <Text style={{color: 'white'}}>登录</Text>
            </TouchableOpacity>
        </View>
    }

    registerView() {
        return <View style={{width: width,}}>
            <Text style={{color: Color.colorBlue, marginLeft: 16}}>基本信息</Text>
            <Hoshi
                style={{margin: 16}}
                label={'用户名'}
                value={this.state.registerUser}
                borderColor={Color.colorBlue}
                onChangeText={(text) => this.setState({registerUser: text})}
            />
            <Hoshi
                style={{marginLeft: 16, marginRight: 16}}
                label={'电话号码'}
                keyboardType={"numeric"}
                value={this.state.registerPhone}
                borderColor={Color.colorBlue}
                onChangeText={(text) => this.setState({registerPhone: text})}
            />

            <Text
                style={{color: Color.colorBlue, marginLeft: 16, marginTop: 16}}>服务信息</Text>
            <View style={[styles.textStyle, {width: width - 16}]}>
                <Text style={{fontSize: 15}}>三包服务</Text>
                <Switch
                    style={{marginRight: 32}}
                    onValueChange={(value) => {
                        this.setState({registerUserType: value});
                    }}
                    onTintColor={Color.colorBlue}
                    tintColor={Color.colorBlueGrey}
                    thumbTintColor={"white"}
                    value={this.state.registerUserType}/>
            </View>
            <Menu onSelect={value => this.setState({registerServiceType: Utils.serviceType[value]})}>
                <MenuTrigger>
                    <View style={styles.textStyle}>
                        <Text style={styles.textSubStyle}>{"服务类型"}</Text>
                        <Text
                            style={[styles.textSubStyle, {color: Color.colorBlue}]}>{this.state.registerServiceType}</Text>
                    </View>
                </MenuTrigger>
                <MenuOptions>
                    <MenuOption value={0}>
                        <View style={styles.textStyle}>
                            <Text style={styles.textSubStyle}>{Utils.serviceType[0]}</Text>
                        </View>
                    </MenuOption>
                    <MenuOption value={1}>
                        <View style={styles.textStyle}>
                            <Text style={styles.textSubStyle}>{Utils.serviceType[1]}</Text>
                        </View>
                    </MenuOption>
                    <MenuOption value={2}>
                        <View style={styles.textStyle}>
                            <Text style={styles.textSubStyle}>{Utils.serviceType[2]}</Text>
                        </View>
                    </MenuOption>
                </MenuOptions>
            </Menu>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: 'white',}]}
                onPress={() => {
                    this.props.nav.navigate("provider", {
                        providerData: this.state.registerProvider,
                        finishFunc: (data) => {
                            this.setState({registerProvider: data})
                        }
                    })
                }}>
                <Text
                    style={{color: Color.colorBlue}}>{this.state.registerProvider.length === 0 ? '选择服务商' : '已选择' + this.getProviderCount() + '个服务商'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: Color.colorBlue,}]}
                onPress={() => this.register() }>
                <Text style={{color: 'white'}}>注册</Text>
            </TouchableOpacity>
        </View>
    }


    render() {
        // console.log("login:render");
        return (
            <ScrollView>
                <KeyboardAvoidingView behavior={'padding'}>
                    <MenuProvider>
                        <View style={styles.container}>
                            <View >
                                {
                                    this.topView()
                                }
                                <ScrollableTabView
                                    initialPage={0}
                                    page={this.state.index}
                                    tabBarBackgroundColor={Color.colorCyan}
                                    tabBarActiveTextColor='white'
                                    renderTabBar={() => <View/>}
                                    locked={false}
                                    tabBarInactiveTextColor={Color.background}
                                    tabBarUnderlineStyle={{backgroundColor: 'white',}}
                                    onChangeTab={({i}) => this.setState({index: i,}) }>
                                    {
                                        this.loginView()
                                    }
                                    {
                                        this.registerView()
                                    }

                                </ScrollableTabView>

                            </View>
                            <Loading visible={this.state.isLoading}/>

                        </View>
                    </MenuProvider>
                </KeyboardAvoidingView>
            </ScrollView>


        );
    }
}
//样式
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "white",
        width: width,
        height: height + 55,
    },
    button: {
        width: width - 32,
        height: 55,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10,
        elevation: 2

    },
    titleTab: {
        marginRight: 25,
        marginLeft: 25,
        marginTop: 45,
        marginBottom: 25,
        fontSize: 25,
        fontWeight: 'bold',
        borderBottomWidth: 2,
    },
    bottomDesc: {
        position: 'absolute',
        bottom: 32,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    textStyle: {
        flexDirection: 'row',
        width: width - 64,
        justifyContent: 'space-between',
        height: 55,
        alignItems: 'center',
        marginLeft: 28,
        marginTop: 16
    },
    textSubStyle: {height: 55, alignItems: 'center', alignContent: 'center', fontSize: 15}

});

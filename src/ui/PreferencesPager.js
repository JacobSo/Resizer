/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Alert, Dimensions,
    Platform,
    Text,
    StyleSheet,
    Linking, TouchableOpacity

} from 'react-native';
import Color from '../const/Color';
import Toolbar from '../component/Toolbar'
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'
import PreferencesTextItem from '../component/PreferencesTextItem'
import {NavigationActions} from "react-navigation";
import ApiService from "../api/ApiService";
import Toast from 'react-native-root-toast';

import App from '../Application';
import Utils from '../Utils';

const {width, height} = Dimensions.get('window');

export default class PreferencesPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            version: this._getVersion(),
            phone: App.phone,
            userName: App.userName,
            active: App.active,
            serviceArea: App.serviceArea,
            userType: App.userType,
            serviceType: App.serviceType,
            callbackProvider: [],
        };
    }

    componentDidMount() {

    }

    _getVersion() {
        if (Platform.OS === 'ios') {
            IosModule.getVersionName((str) => {
                this.setState({version: str})
            })
        } else {
            AndroidModule.getVersionName((str) => this.setState({version: str}));
        }
    }

    getProviderStr(callbackData) {
        let str = "";
        callbackData.map((data) => {
            if (data.isSelect) {
                str = str + data.account + ","
            }
        });
        return str.substring(0, str.length - 1);
    }

    modifyInfo() {
        ApiService.register(
            this.state.userName,
            this.state.phone,
            this.state.serviceType,
            this.state.userType,
            this.state.serviceArea,
            1)
            .then((responseJson) => {
                if (!responseJson.err) {
                    this.setState({});
                    App.saveAccount(App.token,App.phone,App.userName,App.active,this.state.serviceArea,this.state.userType,this.state.serviceType,App.createTime);
                    Toast.show("修改成功");
                } else {
                    Toast.show(responseJson.errMsg);
                }
            })
            .catch((error) => {
                console.log(error);
                Toast.show("修改信息出错，请稍后再试");
            }).done();
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar title={['设置']}
                         color={'white'}
                         elevation={2}
                         isHomeUp={true}
                         isAction={false}
                         isActionByText={false}
                         actionArray={[]}
                         functionArray={[() => this.props.nav.goBack(null)]}/>
                <ScrollView>
                    <View>
                        <PreferencesTextItem
                            group="常规"
                            items={[
                                [App.userName, '注销登录'],
                                ['服务类型', Utils.serviceType[this.state.serviceType]],
                                ['服务区域', this.state.serviceArea],
                                ['用户类型', Utils.userType[this.state.userType]],
                                //    ['账号状态', Utils.activeStatus[this.state.active]],
                            ]}
                            functions={[
                                () => {
                                    Alert.alert(
                                        '注销',
                                        '注销当前账号，返回登录页面',
                                        [
                                            {
                                                text: '取消', onPress: () => {
                                            }
                                            },
                                            {
                                                text: '确定', onPress: () => {
                                                App.saveAccount('', '', '', '', '','','','');
                                                const resetAction = NavigationActions.reset({
                                                    index: 0,
                                                    actions: [
                                                        NavigationActions.navigate({routeName: 'login'})
                                                    ]
                                                });
                                                this.props.nav.dispatch(resetAction)

                                            }
                                            },
                                        ]
                                    )
                                },
                                () => {
                                    this.props.nav.navigate('param', {
                                        items: Utils.serviceType,
                                        title: '更改服务类型',
                                        finishFunc: (data) => {
                                            this.state.serviceType = data;
                                            this.modifyInfo()
                                        }
                                    })
                                },
                                () => {
                                    this.props.nav.navigate('provider', {
                                        items: Utils.serviceType,
                                        finishFunc: (data) => {
                                            this.state.serviceArea=this.getProviderStr(data)
                                            this.modifyInfo()
                                        }
                                    })
                                },
                                () => {
                                    this.props.nav.navigate('param', {
                                        items: Utils.userType,
                                        title: '更改用户类型',
                                        finishFunc: (data) => {
                                            this.state.userType = data;
                                            this.modifyInfo()
                                        }
                                    })
                                },
                                /* () => {
                                 this.props.nav.navigate('param', {
                                 items: Utils.activeStatus,
                                 finishFunc: (data) => {
                                 this.state.activeStatus = data;
                                 this.modifyInfo()
                                 }
                                 })
                                 },*/
                            ]}/>
                        <PreferencesTextItem
                            group="应用"
                            items={[
                                ['清理图片缓存', '所有图片将重新下载'],
                                ['检查更新', '当前版本：' + this.state.version],
                                ['此版本更新记录', 'v1'],
                            ]}
                            functions={[
                                () => {
                                },
                                () => {
                                },
                                () => {
                                }]}/>
                    </View>
                </ScrollView>

            </View>
        )
    }
}
const styles = StyleSheet.create({});
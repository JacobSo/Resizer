/**
 * Created by Administrator on 2017/3/13.
 *
 * loading usage
 */
'use strict';

import React, {Component} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Image,
    TextInput,
    TouchableOpacity,
    KeyboardAvoidingView,
    ScrollView,
} from 'react-native';
import Color from '../const/Color';
import Hoshi from "react-native-textinput-effects/lib/Hoshi";
import {SceneMap, TabBar, TabViewAnimated} from "react-native-tab-view";
const Dimensions = require('Dimensions');
const {width, height} = Dimensions.get('window');

export default class LoginPager extends Component {
    //构造方法
    constructor(props) {
        super(props);
        this.state = {
            account: '',
            pwd: '',
            isLoading: false,
            check: false,
            index: 0,
            routes: [
                {key: 'first', title: '欢迎登陆'},
                {key: 'second', title: '注册'},
            ],
        };
    }

    componentDidMount() {
    }

    _handleIndexChange = index => this.setState({index});

    _renderHeader = props => <TabBar {...props} />;

    _renderScene = SceneMap({
        first: () => <View>
            <Hoshi
                style={{margin: 16}}
                label={'用户名'}
                borderColor={Color.colorBlue}/>
            <Hoshi
                style={{marginLeft: 16, marginRight: 16}}
                label={'密码'}
                borderColor={Color.colorBlue}/>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: Color.colorBlue,}]}
                onPress={() => this.props.nav.navigate('launcher') }>
                <Text style={{color: 'white'}}>登录</Text>
            </TouchableOpacity>
        </View>,
        second: () => <View>
            <Hoshi
                style={{margin: 16}}
                label={'用户名'}
                borderColor={Color.colorBlue}/>
            <Hoshi
                style={{marginLeft: 16, marginRight: 16}}
                label={'密码'}
                borderColor={Color.colorBlue}/>
            <Hoshi
                style={{margin: 16}}
                label={'电话号码'}
                borderColor={Color.colorBlue}/>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: 'white',}]}
                onPress={() => {
                }}>
                <Text style={{color: Color.colorBlue}}>选择服务商</Text>
            </TouchableOpacity>
            <TouchableOpacity
                style={[styles.button, {backgroundColor: Color.colorBlue,}]}
                onPress={() => this.props.nav.navigate('launcher') }>
                <Text style={{color: 'white'}}>注册</Text>
            </TouchableOpacity>
        </View>,
    });

    render() {
        // console.log("login:render");
        return (
            <KeyboardAvoidingView behavior={'padding'}>
                <ScrollView>
                    <View style={styles.container}>
                        <View >
                            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                <TouchableOpacity onPress={() => {
                                    this.setState({index: 0});
                                }}>
                                    <Text style={[styles.titleTab, {
                                        borderBottomColor: this.state.index === 0 ? Color.colorBlue : Color.line,
                                        color: this.state.index === 0 ? Color.content : Color.line,

                                    }]}>欢迎登陆</Text></TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    this.setState({index: 1});
                                }}>
                                    <Text style={[styles.titleTab, {
                                        borderBottomColor: this.state.index === 0 ? Color.line : Color.colorBlue,
                                        color: this.state.index === 0 ? Color.line : Color.content,
                                    }
                                    ]}>新账号</Text></TouchableOpacity>

                            </View>
                            <TabViewAnimated
                                style={{width: width, height: height - 200}}
                                navigationState={this.state}
                                renderScene={this._renderScene}
                                onIndexChange={this._handleIndexChange}
                                initialLayout={{
                                    width: width,
                                    height: height - 200
                                }}
                            />
                        </View>

                        <View style={styles.bottomDesc}>
                            <Image style={{width: 35, height: 35,}}
                                   source={ require('../drawable/company_logo.png')}/>
                            <Text style={{color: Color.line, margin: 16}}>林氏木业定制平台</Text>
                        </View>

                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

        );
    }
}
//样式
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: "white",
        height: height,
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
    }


});

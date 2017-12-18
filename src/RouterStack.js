/**
 * Created by Administrator on 2017/11/27.
 */
/**
 * @flow
 */

import React from 'react';
import {StackNavigator,} from 'react-navigation';
import {Platform, Dimensions, View, StatusBar} from 'react-native';
import App from "react-native/local-cli/templates/HelloWorld/App";
import Launcher from "./Launcher";
import Color from './const/Color';
import MeasureListPager from "./ui/MeasureListPager";
import MeasureDetailPager from "./ui/MeasureDetailPager";
import InstallListPager from "./ui/InstallListPager";
import InstallDetailPager from "./ui/InstallDetailPager";
import FixListPager from "./ui/FixListPager";
import ExceptionListPager from "./ui/ExceptionListPager";
import ExceptionDetailPager from "./ui/ExceptionDetailPager";
import ExceptionAddPager from "./ui/ExceptionAddPager";
import PreferencesPager from "./ui/PreferencesPager";
import LoginPager from "./ui/LoginPager";

const {width, height} = Dimensions.get('window');

_renderScreen = (pager) => {
    //  console.log("screen1");

    return (
        <View
            style={{
                width: width,
                height: height,
            }}>
            {pager}
        </View>
    )
};

_statusBar = (color,barSet) => {
    return (
        <View>
            { (() => {
                if (Platform.OS === 'ios')
                    return <View style={{width: width, height: 20, backgroundColor: color}}/>
            })()}
            <StatusBar
                backgroundColor={color}
                barStyle={barSet?barSet:"dark-content"}
                networkActivityIndicatorVisible={true}
                hidden={false}/></View>)
};


const LauncherScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<Launcher {...navigation.state.params}
                                       nav={navigation}/></View>);
const LoginScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<LoginPager {...navigation.state.params}
                                                                     nav={navigation}/></View>);
const MeasureListScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<MeasureListPager {...navigation.state.params}
                                       nav={navigation}/></View>);
const MeasureDetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<MeasureDetailPager {...navigation.state.params}
                                               nav={navigation}/></View>);
const InstallListScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<InstallListPager {...navigation.state.params}
                                                 nav={navigation}/></View>);
const InstallDetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar('black','light-content')}<InstallDetailPager {...navigation.state.params}
                                               nav={navigation}/></View>);
const FixListScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<FixListPager {...navigation.state.params}
                                                                             nav={navigation}/></View>);
const  ExceptionListScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<ExceptionListPager {...navigation.state.params}
                                                                         nav={navigation}/></View>);
const  ExceptionDetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<ExceptionDetailPager {...navigation.state.params}
                                                                               nav={navigation}/></View>);
const  ExceptionAddScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<ExceptionAddPager {...navigation.state.params}
                                                                               nav={navigation}/></View>);
const  PreferencesScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<PreferencesPager {...navigation.state.params}
                                                                              nav={navigation}/></View>);

const RouterStack = StackNavigator({
        launcher: {
            screen: LauncherScreen,
        },
        measureList: {
            screen: MeasureListScreen,
        },
        measureDetail: {
            screen: MeasureDetailScreen,
        },
        installList: {
            screen: InstallListScreen,
        },
        installDetail: {
            screen: InstallDetailScreen,
        },
        fixList: {
            screen: FixListScreen,
        },
        exceptionList: {
            screen: ExceptionListScreen,
        },
        exceptionDetail: {
            screen: ExceptionDetailScreen,
        },
        exceptionAdd: {
            screen: ExceptionAddScreen,
        },
        preferences: {
            screen: PreferencesScreen,
        },
        login: {
            screen: LoginScreen,
        },

    },
    {
        initialRouteName: 'installDetail',
        headerMode: 'none',
    });

export default RouterStack;
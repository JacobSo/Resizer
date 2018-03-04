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
import CommonListPager from "./ui/CommonListPager";
import MeasureDetailPager from "./ui/MeasureDetailPager";
import ExceptionDetailPager from "./ui/ExceptionDetailPager";
import ExceptionAddPager from "./ui/ExceptionAddPager";
import PreferencesPager from "./ui/PreferencesPager";
import LoginPager from "./ui/LoginPager";
import ProviderListPager from "./ui/ProviderListPager";
import InstallHelperPager from "./ui/InstallHelperPager";
import ProductDetailPager from "./ui/ProductDetailPager";
import GalleryPager from "./component/GalleryPager";
import ParamListPager from "./ui/ParamListPager";

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

_statusBar = (color, barSet) => {
    return (
        <View>
            { (() => {
                if (Platform.OS === 'ios')
                    return <View style={{width: width, height: 20, backgroundColor: color}}/>
            })()}
            <StatusBar
                backgroundColor={color}
                barStyle={barSet ? barSet : "dark-content"}
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
const CommonListScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<CommonListPager {...navigation.state.params}
                                                                            nav={navigation}/></View>);
const InstallHelperScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar('black', 'light-content')}<InstallHelperPager {...navigation.state.params}
                                                                                       nav={navigation}/></View>);
const ExceptionDetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<ExceptionDetailPager {...navigation.state.params}
                                                                                 nav={navigation}/></View>);
const ExceptionAddScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<ExceptionAddPager {...navigation.state.params}
                                                                              nav={navigation}/></View>);
const PreferencesScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<PreferencesPager {...navigation.state.params}
                                                                             nav={navigation}/></View>);
const ProviderListScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<ProviderListPager {...navigation.state.params}
                                                                              nav={navigation}/></View>);
const ProductDetailScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<ProductDetailPager {...navigation.state.params}
                                                                               nav={navigation}/></View>);
const GalleryScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<GalleryPager {...navigation.state.params}
                                                                         nav={navigation}/></View>);
const ParamScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}>{_statusBar(Color.background)}<ParamListPager {...navigation.state.params}
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
        commonList: {
            screen: CommonListScreen,
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
        provider: {
            screen: ProviderListScreen,
        },
        installHelper: {
            screen: InstallHelperScreen,
        },
        productDetail: {
            screen: ProductDetailScreen,
        },
        gallery: {
            screen: GalleryScreen
        },
        param: {
            screen: ParamScreen
        }

    },
    {
        initialRouteName: 'login',
        headerMode: 'none',
    });

export default RouterStack;
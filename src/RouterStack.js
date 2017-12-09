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

const {width, height} = Dimensions.get('window');

_renderScreen = (pager) => {
    //  console.log("screen1");

    return (
        <View
            style={{
                width: width,
                height: height,
            }}>
            <View>
                {
                    (() => {
                        if (Platform.OS === 'ios')
                            return <View style={{width: width, height: 20, backgroundColor: Color.background}}/>
                    })()
                }
                <StatusBar
                    backgroundColor={Color.background}
                    barStyle="dark-content"
                    networkActivityIndicatorVisible={true}
                    hidden={false}/>
            </View>
            {pager}
        </View>
    )
};

const LauncherScreen = ({navigation}) => _renderScreen(<View
    style={{height: height}}><Launcher {...navigation.state.params}
                                       nav={navigation}/></View>);

const RouterStack = StackNavigator({
        launcher: {
            screen: LauncherScreen,
        },
    },
    {
        initialRouteName: 'launcher',
        headerMode: 'none',
    });

export default RouterStack;
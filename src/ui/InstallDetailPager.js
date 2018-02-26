"use strict";
import React, {Component} from 'react';
import Color from '../const/Color';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ListView, FlatList, ScrollView, WebView
} from 'react-native';
import Drawer from 'react-native-drawer'
const {width, height} = Dimensions.get('window');
//http://kh.linshimuye.cn:8022/materializes/

export default class InstallDetailPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            html:null
        };
    }

    componentDidMount() {

    }

    render() {
        return (
                <View ref="webview" style={styles.container}>
                    <WebView
                        source={{uri: 'http://192.168.1.113:889'}}
                        automaticallyAdjustContentInsets={true}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        style={{width: width, height: height}}
                        scrollEnabled={false}
                    />

                </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },

    itemIconContainer: {
        width: 25,
        height: 25,
    },
    searchContainer: {
        backgroundColor: 'white',
        width: width - 32,
        height: 55,
        position: 'absolute',
        top: 15,
        borderRadius: 10,
        elevation: 2,
        flexDirection: 'row',
        alignItems: 'center',
    },
    bottomContainer: {
        height: 250,
        width: width,
        position: 'absolute',
        bottom: 0,
    },
    titleContainer: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Color.line,

    },
    detailContainer: {
        backgroundColor: 'white',
        width: width,
        height: 150,
        position: 'absolute',
        bottom: 0,
        elevation: 2
    },
    btnContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        borderRadius: 50,
        elevation: 5,
        margin: 10,
        width: 55,
        height: 55
    }

});

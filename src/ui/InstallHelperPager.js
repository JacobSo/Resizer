"use strict";
import React, {Component} from 'react';
import Color from '../const/Color';
import {
    Image,
    TextInput,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    ListView, FlatList, ScrollView, WebView
} from 'react-native';
import Drawer from 'react-native-drawer'
import ApiService from "../api/ApiService";
import Toast from 'react-native-root-toast';
import Loading from 'react-native-loading-spinner-overlay';

const {width, height} = Dimensions.get('window');
//http://kh.linshimuye.cn:8022/materializes/

export default class InstallHelperPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            html: null,
            nodes: []
        };
    }

    componentDidMount() {
        this.getModelNodes();
    }

    initItems(items) {
        let list = [];
        items.map((item, index) => {
            list.push({
                name: item,
                key: Math.random(),
                value: index
            })
        });
        return list
    }

    getModelNodes() {
        this.setState({isLoading: true});
        ApiService.getModelNodes()
            .then((responseJson) => {
                this.setState({isLoading: false});
                if (!responseJson.err) {
                    this.setState({
                        nodes: this.initItems(responseJson.errMsg.split(',')),
                    });
                } else {
                    Toast.show(responseJson.errMsg);
                }
            })
            .catch((error) => {
                this.setState({isLoading: false});
                console.log(error);
                Toast.show("出错了，请稍后再试");
            }).done();
    }

    drawerLayout() {
        return (
            <View style={{flex: 1, backgroundColor: 'white',}}>
                <FlatList
                    data={this.state.nodes}
                    extraData={this.state}
                    ListFooterComponent={<View style={{height: 75}}/>}
                    renderItem={({item, index}) => <TouchableOpacity
                        style={{padding: 16}}
                        onPress={() => {

                        }}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                    }
                />

            </View>)
    }

    render() {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                content={this.drawerLayout()}
                type="overlay"
                tapToClose={true}
                side="right"
                openDrawerOffset={0.2}
                panCloseMask={0.2}>
                <View style={{flex: 1, backgroundColor: Color.colorBlueGrey}}>
                    <View style={styles.searchContainer}>
                        <TouchableOpacity>
                            <Image style={styles.home}
                                   source={ require('../drawable/back_black.png')}/>
                        </TouchableOpacity>
                        <TextInput style={styles.textInput}
                                   placeholder="搜索组件"
                                   returnKeyType={'done'}
                                   blurOnSubmit={true}
                                   selectionColor={'white'}
                                   underlineColorAndroid="transparent"
                                   onChangeText={(text) => {
                                   }}/>
                        <TouchableOpacity onPress={() => {
                            this._drawer.open()
                        }}>
                            <Image style={styles.menu}
                                   source={ require('../drawable/menu_black.png')}/>
                        </TouchableOpacity>
                    </View>
                    {/*  <WebView
                     source={{uri: 'http://192.168.1.113:888/'}}
                     automaticallyAdjustContentInsets={true}
                     scalesPageToFit={true}
                     javaScriptEnabled={true}
                     domStorageEnabled={true}
                     style={{width: width, height: height}}
                     scrollEnabled={false}
                     />*/}
                    <View style={styles.bottomContainer}>
                        <Text style={{color: 'black', fontSize: 18}}>组件名称</Text>
                        <Text>组件详情</Text>
                    </View>
                    <TouchableOpacity style={styles.btnTopContainer}
                    onPress={()=>{
                        this.props.nav.navigate("qr")
                    }}>
                        <Image style={styles.floatBtn}
                               source={ require('../drawable/scan_white.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnContainer}>
                        <Image style={styles.floatBtn}
                               source={ require('../drawable/repair_icon.png')}/>
                    </TouchableOpacity>
                    <Loading visible={this.state.isLoading}/>

                </View>
            </Drawer>
        );
    }
}

const styles = StyleSheet.create({
    itemIconContainer: {
        width: 25,
        height: 25,
    },
    searchContainer: {
        backgroundColor: 'white',
        width: width - 32,
        height: 55,
        position: 'absolute',
        borderRadius: 10,
        elevation: 5,
        flexDirection: 'row',
        alignItems: 'center',
        margin: 16
    },
    bottomContainer: {
        height: 125,
        width: width,
        position: 'absolute',
        backgroundColor: 'white',
        elevation: 5,
        bottom: 0,
        padding: 16
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
        bottom: 85,
        borderRadius: 50,
        elevation: 5,
        margin: 10,
        width: 55,
        height: 55,
        backgroundColor: Color.colorBlue
    },
    btnTopContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        bottom: 160,
        borderRadius: 50,
        elevation: 5,
        margin: 10,
        width: 55,
        height: 55,
        backgroundColor: 'white'
    },
    home: {
        marginLeft: 16,
        marginRight: 16,
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    menu: {
        width: 20,
        height: 20,
        resizeMode: 'contain',
    },
    textInput: {
        width: width - 20 - 32 - 32 - 55 - 16,
        height: 45,
        marginLeft: 16,
        marginRight: 16,
        color: Color.content
    },
    floatBtn: {
        width: 30,
        height: 30,
        resizeMode: 'contain',
    },
});

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
import Toolbar from "../component/Toolbar";
import Drawer from 'react-native-drawer'
const {width, height} = Dimensions.get('window');


export default class InstallDetailPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
    }

    closeControlPanel = () => {
        this._drawer.close()
    };

    openControlPanel = () => {
        this._drawer.open()
    };
    drawerLayout() {
        return <View style={{backgroundColor:Color.content,height:height,width:width}}/>
    }

    render() {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                content={this.drawerLayout()}
                type="overlay"
                side="right"
                tapToClose={true}
                openDrawerOffset={0.2}
                panCloseMask={0.2}>
                <View style={styles.container}>
                    <WebView
                        source={{uri: 'http://192.168.1.113:889'}}
                        automaticallyAdjustContentInsets={true}
                        scalesPageToFit={true}
                        style={{width: width, height: height}}
                        scrollEnabled={false}
                    />
                    <View
                        style={styles.searchContainer}>
                        <TouchableOpacity onPress={() => {
                            this.props.nav.goBack(null)
                        }}>
                            <Image style={{width: 25, height: 25, marginLeft: 16}}
                                   source={ require('../drawable/back_black.png')}/>
                        </TouchableOpacity>
                        <Text style={{marginLeft: 16}}>搜索组件清单</Text>
                        <TouchableOpacity style={{right: 16, position: 'absolute'}}
                        onPress={()=>this.openControlPanel()}>
                            <Image style={{width: 20, height: 20, marginLeft: 16,}}
                                   source={ require('../drawable/menu_black.png')}/>
                        </TouchableOpacity>

                    </View>

                    <View style={styles.bottomContainer}>
                        <View
                            style={styles.detailContainer}>
                            <View style={styles.titleContainer}>
                            <Text style={{color: 'black'}}>组件详情</Text>
                            </View>
                            <Text style={{
                                padding: 16,
                            }}>孔位/重量/尺寸/位置</Text>
                        </View>
                        <TouchableOpacity
                            onPress={() => {
                            }}
                            style={[styles.btnContainer, {bottom: 115, backgroundColor: Color.colorBlue,}]}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/scan_white.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => {
                                this.props.nav.navigate("exceptionDetail")
                            }}
                            style={[styles.btnContainer, {bottom: 185, backgroundColor: 'white',}]}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/navigate_blue.png')}/>
                        </TouchableOpacity>
                    </View>

                </View>
            </Drawer>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: 'white',
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

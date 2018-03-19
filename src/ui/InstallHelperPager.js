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
    ListView, FlatList, ScrollView, WebView, SectionList
} from 'react-native';
import Drawer from 'react-native-drawer'
import ApiService from "../api/ApiService";
import Toast from 'react-native-root-toast';
import Loading from 'react-native-loading-spinner-overlay';
import Utils from '../Utils';
const {width, height} = Dimensions.get('window');
//http://kh.linshimuye.cn:8022/materializes/

let testLink = "http://designanddsc.oss-cn-shenzhen.aliyuncs.com/ModelFiles/model_1520819795252.dae";
let modelRenderUrl = 'http://kh.linshimuye.cn:8022/3/#';

export default class InstallHelperPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            html: null,
            nodes: [],
            searchResult: [],
            editText: "",
            selectItem: "",
            modelLink: ""
        };
    }

    componentDidMount() {
        console.log(this.props.param);

        //       Toast.show("参数："+this.props.param);
        //getModel
        this.getModelNodes();
    }

    getModelNodes() {
        this.setState({isLoading: true});
        ApiService.getModel("LS02LSBS0308CP1M01-00000001")
            .then((responseJson) => {
                this.setState({isLoading: false});
                if (!responseJson.err) {
                    this.setState({
                        modelLink: responseJson.listData.daeUrl,
                        nodes: responseJson.listData.node
                    });
                } else {
                    Toast.show(responseJson.errMsg);
                    this.props.nav.goBack(null);
                }
            })
            .catch((error) => {
                this.setState({isLoading: false});
                Toast.show("出错了，请稍后再试");
                console.log(error);
                this.props.nav.goBack(null)
            }).done();
    }

    drawerLayout() {
        return (
            <View style={{flex: 1, backgroundColor: 'white', elevation: 5}}>
                <SectionList
                    ListHeaderComponent={() => <Text style={{
                        color: 'black',
                        padding: 16,
                        height: 65,
                        fontSize: 18,
                        backgroundColor: Color.background,
                        borderBottomColor: Color.line,
                        borderBottomWidth: 1
                    }}>组件列表</Text>}
                    keyExtractor={(item) => item.id}
                    renderSectionHeader={(parent) => <TouchableOpacity
                        onPress={() => {
                            this.setState({selectItem: parent.section.id});
                            this.componentSelectAction(parent.section.id);
                            this._drawer.close()
                        }}>
                        <Text style={{
                            color: Color.colorBlue,
                            padding: 16,
                            fontSize: 15,
                            borderTopWidth: 1,
                            borderTopColor: Color.line
                        }}>{parent.section.name}</Text>
                    </TouchableOpacity>}
                    renderItem={(child) => <TouchableOpacity onPress={
                        () => {
                            this.setState({selectItem: child.item.id});
                            this.componentSelectAction(child.item.id);
                            this._drawer.close()
                        }
                    }>
                        <Text style={{
                            color: Color.content,
                            padding: 16
                        }}>{child.item.name}</Text>
                    </TouchableOpacity>}
                    sections={this.state.nodes}
                />

            </View>)
    }

    componentSelectAction(itemName) {
        let msg = {
            component: itemName,
            command: [
                Utils.modelCommand.select,
                Utils.modelCommand.highlight,
                Utils.modelCommand.transform,
            ]
        };
        this.refs.webView.postMessage(JSON.stringify(msg));
    }

    //from web
    onMessage = (data) => {
        //console.log(data);
    }

    async  search(text) {
        //console.log("key:" + text)
        return this.state.nodes.filter((item) => {
            //console.log("result:" + item);
            return item ? (item.name.toLowerCase().indexOf(text.toLowerCase()) > -1) : ("无");
        });
    }

    render() {
        return (
            <Drawer
                ref={(ref) => this._drawer = ref}
                content={this.drawerLayout()}
                type="static"
                tapToClose={true}
                side="right"
                openDrawerOffset={0.2}
                panCloseMask={0.2}>

                <View style={{flex: 1, backgroundColor: Color.colorBlueGrey}}>
                    <WebView
                        ref='webView'
                        onMessage={this.onMessage.bind(this)}
                        source={{uri: modelRenderUrl + testLink}}
                        automaticallyAdjustContentInsets={true}
                        scalesPageToFit={true}
                        javaScriptEnabled={true}
                        domStorageEnabled={true}
                        style={{width: width, height: height, backgroundColor: Color.content}}
                        scrollEnabled={false}
                    />
                    {
                        (() => {
                            if (this.state.searchResult.length !== 0) {
                                return <View style={{
                                    backgroundColor: 'white',
                                    width: width - 32,
                                    top: 70,
                                    position: 'absolute',
                                    borderRadius: 10,
                                    elevation: 5,
                                    flexDirection: 'row',
                                    margin: 16
                                }}>
                                    <FlatList
                                        data={this.state.searchResult}
                                        extraData={this.state}
                                        renderItem={({item, index}) => <TouchableOpacity
                                            style={{
                                                padding: 16,
                                                borderBottomWidth: 1,
                                                borderRadius: 10,
                                                borderBottomColor: Color.line
                                            }}
                                            onPress={() => {
                                                this.setState({
                                                    selectItem: item.name,
                                                    editText: item.name,
                                                    searchResult: []
                                                });
                                                this.componentSelectAction(item.name);
                                            }}>
                                            <Text>{item.name}</Text>
                                        </TouchableOpacity>
                                        }
                                    />
                                </View>
                            }
                        })()
                    }

                    <View style={styles.searchContainer}>
                        <TouchableOpacity onPress={() => this.props.nav.goBack(null)}>
                            <Image style={styles.home}
                                   source={ require('../drawable/back_black.png')}/>
                        </TouchableOpacity>
                        <TextInput style={styles.textInput}
                                   placeholder="搜索组件"
                                   returnKeyType={'done'}
                                   maxLength={15}
                                   value={this.state.editText}
                                   blurOnSubmit={true}
                                   selectionColor={Color.colorBlue}
                                   underlineColorAndroid="transparent"
                                   onChangeText={(text) => {
                                       this.setState({editText: text});
                                       this.search(text).then((array) => {
                                           this.setState({searchResult: array.slice(0, 4)})
                                       })
                                   }}/>
                        {
                            (() => {
                                if (this.state.editText) {
                                    return <TouchableOpacity
                                        style={{position: 'absolute', right: 55}}
                                        onPress={() => {
                                            this.setState({editText: ""});
                                        }}>
                                        <Image style={styles.menu}
                                               source={ require('../drawable/close_gray.png')}/>
                                    </TouchableOpacity>
                                }
                            })()
                        }

                        <TouchableOpacity onPress={() => {
                            this._drawer.open()
                        }}>
                            <Image style={styles.menu}
                                   source={ require('../drawable/menu_black.png')}/>
                        </TouchableOpacity>
                    </View>


                    <View style={styles.bottomContainer}>
                        <Text style={{
                            color: 'black',
                            fontSize: 18
                        }}>{this.state.selectItem ? this.state.selectItem : '组件名称'}</Text>
                        <View style={{flexDirection: 'row'}}>
                            <TouchableOpacity onPress={() => {
                                let msg = {
                                    component: this.state.selectItem,
                                    command: [
                                        Utils.modelCommand.highlight,
                                    ]
                                };
                                this.refs.webView.postMessage(JSON.stringify(msg));
                            }}><Text style={{color: Color.colorBlue, marginRight: 16, marginBottom: 16, marginTop: 16}}>高亮</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                let msg = {
                                    component: this.state.selectItem,
                                    command: [
                                        Utils.modelCommand.transform,
                                    ]
                                };
                                this.refs.webView.postMessage(JSON.stringify(msg));
                            }}><Text style={{color: Color.colorBlue, margin: 16}}>移动</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                let msg = {
                                    component: this.state.selectItem,
                                    command: [
                                        Utils.modelCommand.hide,
                                    ]
                                };
                                this.refs.webView.postMessage(JSON.stringify(msg));

                            }}><Text style={{color: Color.colorBlue, margin: 16}}>隐藏</Text></TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity
                        style={styles.btnTopContainer}
                        onPress={() => {
                            this.props.nav.navigate("qr", {
                                    finishFunc: (result) => {
                                        this.componentSelectAction(result)
                                        this.setState({selectItem: result})
                                    }
                                }
                            )
                        }}>
                        <Image style={styles.floatBtn}
                               source={ require('../drawable/scan_white.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.btnContainer}
                                      onPress={() => {
                                          this.props.nav.navigate("exceptionAdd")
                                      }}>
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

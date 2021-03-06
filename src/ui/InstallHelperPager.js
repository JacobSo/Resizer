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
    FlatList, WebView, SectionList, Platform
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
//let modelRenderUrl = 'http://192.168.1.113:889/#';

export default class InstallHelperPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            html: null,
            nodes: [],
            searchResult: [],
            editText: "",
            selectItem: "",
            modelLink: "",
            isFullScreen: false,
        };
    }

    componentDidMount() {
        console.log(this.props.code);

        //       Toast.show("参数："+this.props.param);
        //getModel
        this.getModelNodes();
    }

    hideDoor() {
        let temp = '';

        this.state.nodes.map((section) => {
            if (section.name.indexOf('A1框') > -1) {
                temp += (section.id + ',');
                section.data.map((ch) => {
                    temp += (ch.id + ',');
                });
            }
        })
        console.log(temp);
        let msg = {
            component: temp.substring(0, temp.length - 1),
            command: [
                Utils.modelCommand.all,
                Utils.modelCommand.hide,
            ]
        };
        this.refs.webView.postMessage(JSON.stringify(msg));
    }

    getModelNodes() {
        this.setState({isLoading: true});
        //  ApiService.getModel("LS02LSBS0308CP1M01-00000001")
        ApiService.getModel(this.props.code)
            .then((responseJson) => {
                this.setState({isLoading: false});

                if (!responseJson.err) {
                    console.log(JSON.stringify(responseJson.listData.node))
                    responseJson.listData.node.map((data) => {
                        if (data.data === null)
                            data.data = []
                    });
                    console.log(typeof responseJson.listData.node)
                    this.setState({
                        modelLink: responseJson.listData.daeUrl,
                        nodes: responseJson.listData.node
                    });


                } else {
                    Toast.show(responseJson.errMsg);
                    // this.props.nav.goBack(null);
                }
            })
            .catch((error) => {
                this.setState({isLoading: false});
                Toast.show("出错了，请稍后再试");
                console.log(error);
                // this.props.nav.goBack(null)
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
                            console.log(parent)
                            this.setState({selectItem: parent.section});

                            let temp = '';
                            temp += (parent.section.id + ',');
                            parent.section.data.map((ch) => {
                                temp += (ch.id + ',');
                            });
                            let msg = {
                                component: temp.substring(0, temp.length - 1),
                                command: [
                                    Utils.modelCommand.all,
                                    // Utils.modelCommand.highlight,
                                ]
                            };
                            this.refs.webView.postMessage(JSON.stringify(msg));
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
                            this.setState({selectItem: child.item});
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


    //usage: search list--drawer list--drawer title--qr code callback
    componentSelectAction(itemName) {
        console.log(itemName);
        let msg = {
            component: itemName,
            command: [
                Utils.modelCommand.select,
                Utils.modelCommand.highlight,
            ]
        };
        this.refs.webView.postMessage(JSON.stringify(msg));
    }

    //from web
    onMessage = (data) => {

        console.log(data.nativeEvent.data);
        let temp = JSON.parse(data.nativeEvent.data);
        let result = null
        this.state.nodes.map((data) => {
            if (data.data && data.data.length !== 0) {
                data.data.map((sub) => {
                    if (temp.id === sub.id) {
                        result = sub;
                    }
                })
            } else {
                if (data.id === temp.id) {
                    result = data;
                }
            }
        })
        this.setState({selectItem: result})
    };

    async  search(text) {
        console.log("key:" + text)
        return this.state.nodes.filter((item) => {
            //console.log("result:" + JSON.stringify(item));
            if (item.data && item.data.length !== 0) {
                item.data.filter((itemSub) => {
                    console.log((itemSub.name.toLowerCase().indexOf(text.toLowerCase()) > -1)
                        || (itemSub.id.toLowerCase().indexOf(text.toLowerCase()) > -1)
                        || (itemSub.extraValue && (itemSub.extraValue.toLowerCase().indexOf(text.toLowerCase()) > -1))
                    );
                    return itemSub ? (itemSub.name.toLowerCase().indexOf(text.toLowerCase()) > -1)
                        || (itemSub.id.toLowerCase().indexOf(text.toLowerCase()) > -1)
                        || (itemSub.extraValue && (itemSub.extraValue.toLowerCase().indexOf(text.toLowerCase()) > -1))
                        : ("无");
                })
            }
            return item ? (item.name.toLowerCase().indexOf(text.toLowerCase()) > -1)
                || (item.id.toLowerCase().indexOf(text.toLowerCase()) > -1)
                || (item.extraValue && (item.extraValue.toLowerCase().indexOf(text.toLowerCase()) > -1))
                : ("无");


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
                    {
                        (() => {
                            if (this.state.modelLink) {
                                return <WebView
                                    ref='webView'
                                    onMessage={this.onMessage.bind(this)}
                                    source={{uri: modelRenderUrl + this.state.modelLink}}
                                    automaticallyAdjustContentInsets={true}
                                    scalesPageToFit={true}
                                    javaScriptEnabled={true}
                                    domStorageEnabled={true}
                                    style={{width: width, height: height, backgroundColor: Color.content}}
                                    scrollEnabled={false}
                                />
                            } else return null;
                        })()
                    }

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
                                                    selectItem: item,
                                                    editText: item.name,
                                                    searchResult: []
                                                });
                                                this.componentSelectAction(item.id);
                                            }}>
                                            <Text>{item.name}</Text>
                                        </TouchableOpacity>
                                        }
                                    />
                                </View>
                            }
                        })()
                    }

                    {
                        (() => {
                            if (!this.state.isFullScreen) {
                                return <View style={styles.searchContainer}>
                                    <TouchableOpacity
                                        style={{height: 55, justifyContent: 'center', alignItems: 'center'}}
                                        onPress={() => {
                                            this.props.nav.goBack(null)
                                        }}>
                                        <Image style={styles.home}
                                               source={ require('../drawable/back_black.png')}/>
                                    </TouchableOpacity>
                                    <TextInput
                                        style={styles.textInput}
                                        placeholder="搜索组件"
                                        returnKeyType={'done'}
                                        maxLength={15}
                                        value={this.state.editText}
                                        blurOnSubmit={true}
                                        selectionColor={Color.colorBlue}
                                        underlineColorAndroid="transparent"
                                        onChangeText={(text) => {
                                            this.setState({editText: text});

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

                                    <TouchableOpacity
                                        onPress={() => {
                                            this._drawer.open()
                                        }}
                                        style={{
                                            padding: 16,
                                            width: 65,
                                            height: 55,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            position:'absolute',
                                            right:0
                                        }}>
                                        <Image style={styles.menu}
                                               source={ require('../drawable/menu_black.png')}/>
                                    </TouchableOpacity>


                                </View>
                            }
                        })()
                    }


                    <TouchableOpacity style={{
                        backgroundColor: 'white',
                        elevation: 5,
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: this.state.isFullScreen ? 40 + 45 : 165 + 40,
                        width: 100,
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: 35
                    }}
                                      onPress={() => {
                                          this.hideDoor();
                                      }}>
                        <Text>隐藏A1框</Text>

                    </TouchableOpacity>
                    <View style={{
                        backgroundColor: 'white',
                        elevation: 5,
                        flexDirection: 'row',
                        position: 'absolute',
                        bottom: this.state.isFullScreen ? 40 : 165,
                        width: 100,
                        justifyContent: 'space-around',
                        height: 35
                    }}>

                        <TouchableOpacity onPress={() => {
                            let msg = {
                                component: null,
                                command: [
                                    Utils.modelCommand.zoom,
                                ]
                            };
                            this.refs.webView.postMessage(JSON.stringify(msg));

                        }}>
                            <Text style={{height: 35, width: 50, fontSize: 25, textAlign: 'center'}}>+</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            let msg = {
                                component: null,
                                command: [
                                    Utils.modelCommand.sorrow,
                                ]
                            };
                            this.refs.webView.postMessage(JSON.stringify(msg));
                        }}>
                            <Text style={{height: 35, width: 50, fontSize: 25, textAlign: 'center'}}>-</Text>
                        </TouchableOpacity>
                    </View>


                    {
                        (() => {
                            if (!this.state.isFullScreen) {
                                return <View style={styles.bottomContainer}>
                                    <Text style={{
                                        color: 'black',
                                        fontSize: 18,
                                    }}>{this.state.selectItem ? this.state.selectItem.name : '组件名称'}</Text>
                                    <Text>{this.state.selectItem ? ("模型节点：" + this.state.selectItem.id) : '详情'}</Text>
                                    <Text>{this.state.selectItem && this.state.selectItem.extraValue ? ("板件编码：" + this.state.selectItem.extraValue) : ''}</Text>
                                    <View style={{
                                        height: 1,
                                        width: width - 32,
                                        backgroundColor: Color.line,
                                        marginTop: 10
                                    }}/>


                                    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                                        <TouchableOpacity onPress={() => {
                                            let msg = {
                                                component: this.state.selectItem.id,
                                                command: [
                                                    Utils.modelCommand.back,
                                                ]
                                            };
                                            this.refs.webView.postMessage(JSON.stringify(msg));
                                        }}><Text style={{
                                            color: Color.colorBlue,
                                            marginRight: 16,
                                            marginBottom: 16,
                                            marginTop: 16
                                        }}>还原</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            let msg = {
                                                component: this.state.selectItem.id,
                                                command: [
                                                    Utils.modelCommand.transform,
                                                ]
                                            };
                                            this.refs.webView.postMessage(JSON.stringify(msg));
                                        }}><Text
                                            style={{color: Color.colorBlue, margin: 16}}>移动</Text></TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            let msg = {
                                                component: this.state.selectItem.id,
                                                command: [
                                                    Utils.modelCommand.hide,
                                                ]
                                            };
                                            this.refs.webView.postMessage(JSON.stringify(msg));

                                        }}><Text
                                            style={{color: Color.colorBlue, margin: 16}}>隐藏</Text></TouchableOpacity>
                                        <TouchableOpacity onPress={() => {
                                            let msg = {
                                                component: null,
                                                command: [
                                                    Utils.modelCommand.recovery,
                                                ]
                                            };
                                            this.refs.webView.postMessage(JSON.stringify(msg));

                                        }}><Text
                                            style={{color: Color.colorBlue, margin: 16}}>全部还原</Text></TouchableOpacity>
                                    </View>
                                </View>
                            }
                        })()
                    }

                    <TouchableOpacity
                        style={[styles.btnTopContainer, {bottom: this.state.isFullScreen ? 100 : (Platform.OS === "ios" ? 160 : 195)}]}
                        onPress={() => {

                            this.props.nav.navigate("qr", {
                                    finishFunc: (result) => {
                                        // Toast.show(result);
                                        let tempId = null;
                                        this.state.nodes.map((data) => {
                                            if (tempId === null) {
                                                if (data.extraValue === result) {
                                                    tempId = data.id;
                                                    this.setState({selectItem: data})
                                                } else {
                                                    if (data.data && data.data.length !== 0) {
                                                        data.data.map((sub) => {
                                                            if (sub.extraValue === result) {
                                                                tempId = sub.id;
                                                                this.setState({selectItem: sub})
                                                            }
                                                        })
                                                    }
                                                }
                                            }

                                        });
                                        if (tempId !== null) {
                                            this.componentSelectAction(tempId);
                                        } else {
                                            Toast.show('没找到对应板件')
                                        }

                                    }
                                }
                            )
                        }}>
                        <Image style={styles.floatBtn}
                               source={ require('../drawable/scan_white.png')}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.btnContainer, {
                        bottom: this.state.isFullScreen ? 25 : (Platform.OS === "ios" ? 85 : 120)
                    }]}
                                      onPress={() => {
                                          //this.props.nav.navigate("exceptionAdd")
                                          this.setState({isFullScreen: !this.state.isFullScreen})
                                      }}>
                        <Image style={styles.floatBtn}
                               source={ require('../drawable/full_screen_ico.png')}/>
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
        height: Platform.OS === "ios" ? 125 : 160,
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
        width: width / 2,
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

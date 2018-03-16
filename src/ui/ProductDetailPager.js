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
    ListView, Alert, ScrollView
} from 'react-native';
import Toolbar from "../component/Toolbar";
import {MapView, MapTypes, MapModule, Geolocation} from 'react-native-baidu-map';
import Utils from "../Utils";
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'
import InputDialog from "../component/InputDialog";
import * as ImageOptions from "../const/ImagePickerOptions"
import ImageList from "../component/ImageList";
import ApiService from "../api/ApiService";
import Loading from 'react-native-loading-spinner-overlay';
import Toast from 'react-native-root-toast';

const ImagePicker = require('react-native-image-picker');

const {width, height} = Dimensions.get('window');


export default class ProductDetailPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            postProcess: 0,
            editContent: '',
            pics: [],
            dataSourcePic: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
            finishPicUrl: this.props.data.imageList ? this.props.data.imageList : "",
            picFromServer: [],
            dataSourcePicServer: new ListView.DataSource({
                rowHasChanged: (row1, row2) => true,
            }),
        };
    }

    componentDidMount() {
        this.picSwitch();
    }

    picSwitch() {
        if (this.props.data.imageList)
            this.props.data.imageList.split(',').map((data) => {
                this.state.picFromServer.push({uri: data})
            });
        this.setState({dataSourcePicServer: this.state.dataSourcePicServer.cloneWithRows(this.state.picFromServer),});
    }

    postImage() {
        if (this.state.pics.length === 0) {
            Toast.show('没有添加图片');
            return
        }
        Alert.alert(
            "确认上传", "图片共" + this.state.pics.length + "张",
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '上传', onPress: () => {
                    this.postImageFunc();
                }
                }
            ]
        );
    }

    postImageFunc() {
        if (Platform.OS === 'android') {
            AndroidModule.getImageBase64(this.state.pics[this.state.postProcess].path, (callBackData) => {
                console.log(callBackData);
                this.postImgReq(callBackData);
            });
        } else {
            this.state.pics.map((data, index) => {
                IosModule.getImageBase64(this.state.pics[this.state.postProcess].uri.replace('file://', ''), (callBackData) => {
                    this.postImgReq(callBackData, index);
                })
            });
        }
    }

    postImgReq(data) {
        this.setState({isLoading: true});
        ApiService.uploadImage(data)
            .then((responseJson) => {
                if (!responseJson.err) {
                    this.state.finishPicUrl = this.state.finishPicUrl + "," + responseJson.message;
                    if (this.state.postProcess === this.state.pics.length - 1)
                        this.submitPicAddress();
                    else {
                        this.state.postProcess++;
                        this.postImageFunc()
                    }
                } else {
                    setTimeout(() => {
                        this.setState({isLoading: false})
                    }, 100);
                    Toast.show(responseJson.errMsg);
                }
            })
            .catch((error) => {
                setTimeout(() => {
                    this.setState({isLoading: false})
                }, 100);
                console.log(error);
                Toast.show("出错了，请稍后再试");
            }).done();
    }

    submitPicAddress() {
        ApiService.uploadFile(this.props.data.workOrder, this.props.data.skuCode, this.state.finishPicUrl)
            .then((responseJson) => {
                this.setState({isLoading: false});
                Toast.show(responseJson.errMsg);
                if (!responseJson.err) {
                    this.props.data.imageList = this.state.finishPicUrl;
                    this.props.nav.goBack(null);
                }
            })
            .catch((error) => {
                this.setState({isLoading: false});
                console.log(error);
                Toast.show("出错了，请稍后再试");
            }).done();
    }

    setRoom() {
        if (!this.state.editContent) {
            Toast.show('请填写房间');
            return
        }
        this.setState({isLoading: true});

        ApiService.roomDesc(this.props.data.workOrder, this.props.data.skuCode, this.state.editContent)
            .then((responseJson) => {
                this.setState({isLoading: false});
                Toast.show(responseJson.errMsg);
                if (!responseJson.err) {
                    this.props.data.roomDesc = this.state.editContent
                    this.props.nav.goBack(null);
                }
            })
            .catch((error) => {
                this.setState({isLoading: false});
                console.log(error);
                Toast.show("出错了，请稍后再试");
            }).done();
    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={["产品详细"]}
                    color={"white"}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={this.props.listType===0?["上传"]:[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        () => {
                            if (this.props.enable)
                                this.postImage();
                            else
                                Toast.show("接受任务后才可操作")
                        },
                    ]}
                />
                <ScrollView>
                    <View style={{marginBottom: 55}}>
                        <TouchableOpacity
                            onPress={() => this.props.nav.navigate('gallery', {
                                pics: this.props.data.picPath.split(',')
                            })}>
                            <Image style={{
                                width: width,
                                height: 200,
                                backgroundColor: Color.colorGrey
                            }} resizeMode="cover"
                                   source={{uri: this.props.data.picPath ? this.props.data.picPath : Utils.blankUri}}/>
                        </TouchableOpacity>
                        <Text style={{color: Color.colorBlue, margin: 16}}>基本信息</Text>
                        <View style={[styles.itemText, {paddingBottom: 10}]}>
                            <Text>{'产品名称'}</Text>
                            <Text style={{
                                color: Color.black_semi_transparent,
                                width: 200,
                                textAlign: 'right'
                            }}>{this.props.data.productName ? this.props.data.productName : '-'}</Text>
                        </View>
                        <View style={[styles.itemText, {paddingBottom: 10}]}>
                            <Text>{'规格编码'}</Text>
                            <Text style={{
                                color: Color.black_semi_transparent,
                                width: 200,
                                textAlign: 'right'
                            }}>{this.props.data.skuCode ? this.props.data.skuCode : '-'}</Text>
                        </View>
                        <View style={[styles.itemText, {paddingBottom: 10}]}>
                            <Text>{'规格描述'}</Text>
                            <Text style={{
                                color: Color.black_semi_transparent,
                                width: 200,
                                textAlign: 'right'
                            }}>{this.props.data.skuDescription ? this.props.rowData.skuDescription : '-'}</Text>
                        </View>
                        <View style={[styles.itemText, {paddingBottom: 10}]}>
                            <Text>{'备注'}</Text>
                            <Text style={{
                                color: Color.black_semi_transparent,
                                width: 200,
                                textAlign: 'right'
                            }}>{this.props.data.remark ? this.props.data.remark : '-'}</Text>
                        </View>

                        <Text style={{color: Color.colorBlue, margin: 16}}>安装测量信息</Text>
                        <View style={[styles.itemText, {paddingBottom: 10}]}>
                            <Text>{'包件数'}</Text>
                            <Text
                                style={{color: Color.black_semi_transparent}}>{this.props.data.packageCount ? this.props.data.packageCount : '-'}</Text>

                        </View>
                        <View style={[styles.itemText, {paddingBottom: 10}]}>
                            <Text>{'测量文件'}</Text>
                            <Text
                                style={{color: Color.black_semi_transparent}}>{this.props.data.modelLink ? '完成' : '未上传'}</Text>
                        </View>
                        <View style={[styles.itemText, {paddingBottom: 10}]}>
                            <Text>{'所属房间'}</Text>
                            <Text
                                style={{color: Color.black_semi_transparent}}>{this.props.data.roomDesc ? this.props.data.roomDesc : '-'}</Text>
                        </View>
                        {
                            (() => {
                                if (this.props.data.imageList)
                                    return <View>
                                        <Text style={{color: Color.colorBlue, margin: 16}}>已上传图片</Text>
                                        <ImageList isCloseDisable={true} dataSourcePic={this.state.dataSourcePicServer}
                                                   mainActoin={() => this.props.nav.navigate('gallery',
                                                       {
                                                           pics: this.props.data.imageList.split(',')
                                                       })}
                                        />
                                    </View>
                            })()
                        }
                        {
                            (() => {
                                if (this.state.pics.length !== 0) {
                                    return <View>
                                        <Text style={{color: Color.colorBlue, margin: 16}}>待上传图片</Text>
                                        <ImageList dataSourcePic={this.state.dataSourcePic} action={(sectionID) => {
                                            this.state.pics.splice(sectionID, 1);
                                            this.setState({
                                                dataSourcePic: this.state.dataSourcePic.cloneWithRows(JSON.parse(JSON.stringify(this.state.pics))),
                                            });
                                        }}/>
                                    </View>
                                }
                            })()
                        }

                        {
                            (() => {
                                if (this.props.listType === 0) {
                                    return <View>
                                        <TouchableOpacity
                                            style={[styles.btnContainer, {backgroundColor: Color.colorBlue}]}
                                            onPress={() => {
                                                if (this.props.enable)
                                                    ImagePicker.showImagePicker(ImageOptions.options, (response) => {
                                                        if (!response.didCancel) {
                                                            this.state.pics.push(response);
                                                            this.setState({dataSourcePic: this.state.dataSourcePic.cloneWithRows(this.state.pics),});
                                                        }
                                                    });
                                                else
                                                    Toast.show("接受任务后才可操作")
                                            }}>
                                            <Text style={{color: 'white'}}>添加图片</Text>

                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={[styles.btnContainer, {backgroundColor: 'white'}]}
                                            onPress={() => {
                                                if (this.props.enable)
                                                    this.popupDialog.show();
                                                else
                                                    Toast.show("接受任务后才可操作")
                                            }}>
                                            <Text>设置房间</Text>

                                        </TouchableOpacity>
                                    </View>

                                } else if (this.props.listType === 1) {
                                    return <TouchableOpacity
                                        style={[styles.btnContainer, {backgroundColor: Color.colorBlue}]}
                                        onPress={() => {
                                            if (this.props.enable)
                                                this.props.nav.navigate("installHelper", {
                                                    data: this.props.data
                                                });
                                            else
                                                Toast.show("接受任务后才可操作")
                                        }}>
                                        <Text style={{color: 'white'}}>安装辅助</Text>

                                    </TouchableOpacity>
                                }
                            })()
                        }

                        <Loading visible={this.state.isLoading}/>
                    </View>
                </ScrollView>
                <InputDialog
                    isMulti={false}
                    action={[
                        (popupDialog) => {
                            this.popupDialog = popupDialog;
                        },
                        (text) => {
                            this.setState({editContent: text})
                        },
                        () => {
                            this.setState({editContent: ''});
                            this.popupDialog.dismiss();
                        },
                        () => {
                            this.setRoom();
                            this.popupDialog.dismiss();
                        }
                    ]} str={['设置房间', '家具放置的房间']}/>

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.background,

    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Color.line,
        backgroundColor: 'white'
    },
    btnContainer: {
        flex: 1,
        height: 55,
        borderRadius: 10,
        margin: 16,
        elevation: 2,
        alignItems: 'center',
        justifyContent: 'center'

    },
    itemIconContainer: {
        width: 25,
        height: 25,
    },
    navigateIcon: {
        alignItems: 'center',
        justifyContent: 'center',
        position: 'absolute',
        right: 0,
        bottom: 65,
        backgroundColor: 'white',
        borderRadius: 50,
        elevation: 5,
        margin: 16,
        width: 55,
        height: 55
    },
    iconContainer: {
        width: width - 32,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 16,
        elevation: 2,
    },
    itemText: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        width: width,
        paddingTop: 10,
        paddingLeft: 16,
        paddingRight: 16
    },

});

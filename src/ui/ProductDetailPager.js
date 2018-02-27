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
    ListView, FlatList, ScrollView
} from 'react-native';
import Toolbar from "../component/Toolbar";
import {MapView, MapTypes, MapModule, Geolocation} from 'react-native-baidu-map';
import Utils from "../Utils";
import InputDialog from "../component/InputDialog";
import * as ImageOptions from "../const/ImagePickerOptions"

const ImagePicker = require('react-native-image-picker');

const {width, height} = Dimensions.get('window');


export default class ProductDetailPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            editContent:''
        };
    }

    componentDidMount() {
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
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                    ]}
                />
                <ScrollView>
                    <View style={{marginBottom: 55}}>
                        <Image style={{
                            width: width,
                            height: 200,
                            backgroundColor: Color.colorGrey
                        }} resizeMode="cover"
                               source={{uri: this.props.data.picPath ? this.props.data.picPath : ''}}/>
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
                        {
                            (() => {
                                if (this.props.data.imageList) {
                                    return <Image style={{
                                        width: width,
                                        height: 200,
                                        backgroundColor: Color.colorGrey
                                    }}
                                                  resizeMode="cover"
                                                  source={{uri: this.props.data.picPath ? this.props.data.picPath : ''}}/>
                                }
                            })()
                        }

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
                        <TouchableOpacity
                            style={[styles.btnContainer, {backgroundColor: Color.colorBlue}]}
                            onPress={() => {
                                ImagePicker.showImagePicker(ImageOptions.options, (response) => {
                                    if (!response.didCancel) {
                                     //   this.state.pics.push(response);
                                     //   this.setState({dataSourcePic: this.state.dataSourcePic.cloneWithRows(this.state.pics),});
                                    }
                                });
                            }}>
                            <Text style={{color: 'white'}}>上传图片</Text>

                        </TouchableOpacity>
                        {
                            (() => {
                                if (this.props.listType === 0) {
                                    return <TouchableOpacity
                                        style={[styles.btnContainer, {backgroundColor: 'white'}]}
                                        onPress={() => {
                                            this.popupDialog.show()
                                        }}>
                                        <Text>设置房间</Text>

                                    </TouchableOpacity>
                                } else if (this.props.listType === 1) {
                                    return <TouchableOpacity
                                        style={[styles.btnContainer, {backgroundColor: 'white'}]}
                                        onPress={() => {
                                            this.props.nav.navigate("measureDetail")
                                        }}>
                                        <Text>安装辅助</Text>

                                    </TouchableOpacity>
                                }
                            })()
                        }


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

"use strict";
import React, {Component} from 'react';
import Color from '../const/Color';
import {
    Image,
    Alert,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,
    Linking, FlatList, ScrollView, Platform, Clipboard
} from 'react-native';
import Toolbar from "../component/Toolbar";
import {MapView, MapTypes,  Geolocation} from 'react-native-baidu-map';
import Utils from "../Utils";
import ApiService from '../api/ApiService';
import Toast from 'react-native-root-toast';
import Loading from 'react-native-loading-spinner-overlay';
import AndroidModule from '../module/AndoridCommontModule'
import IosModule from '../module/IosCommontModule'

const {width, height} = Dimensions.get('window');


export default class MeasureDetailPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            locationEnable: false,
            mayType: MapTypes.NONE,
            zoom: 15,
            center: {
                longitude: 113.981718,
                latitude: 22.542449
            },
            trafficEnabled: false,
            baiduHeatMapEnabled: false,
            mLocation: {
                longitude: 0.0,
                latitude: 0.0
            }

        };
    }

    componentDidMount() {
        //console.log(this.props.data.listData)
        Geolocation.getCurrentPosition().then((result) => {
            console.log(result);
            this.setState({
                mLocation: {
                    longitude: result.longitude,
                    latitude: result.latitude
                }
            })
        });
        Geolocation.geocode(this.props.data.province, this.props.data.customerCity + this.props.data.area + this.props.data.address)
            .then((data) => {
                console.log(data.longitude + "," + data.latitude);
//Toast.show(data.longitude + "," + data.latitude)
                if (data.longitude) {

                    this.setState({
                        locationEnable: true,
                        center: {
                            longitude: data.longitude,
                            latitude: data.latitude
                        }
                    })
                }
            })
            .catch((err)=>{
            console.log(err)
            }).done()

    }

    confirmTask(flag) {
        Alert.alert(
            flag === 0 ? '拒绝任务' : '接受任务',
            flag === 0 ? '确认拒绝任务？' : '确认接受任务？',
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '确定', onPress: () => {
                    this.setState({isLoading: true});

                    ApiService.confirmTask(
                        this.props.listType,
                        flag,
                        this.props.data.workOrder)
                        .then((responseJson) => {
                            this.setState({isLoading: false,});
                            Toast.show(responseJson.errMsg);
                            if (!responseJson.err) {
                                this.props.confirmFunc(flag);
                                this.props.nav.goBack(null);
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                            this.setState({isLoading: false,});
                            Toast.show("出错了，请稍后再试");
                        }).done();
                }
                },
            ]
        );
    }

    readme(title, content) {
        Alert.alert(
            title, content,
            [
                {
                    text: '取消', onPress: () => {
                }
                }
            ]
        );
    }

    phoneCall(title, content) {
        Alert.alert(
            title, content,
            [
                {
                    text: '取消', onPress: () => {
                }
                },
                {
                    text: '拨打', onPress: () => {
                    let url = 'tel:' + content;

                    Linking.canOpenURL(url).then(supported => {
                        if (!supported) {
                            Toast.show("无法拨打")
                        } else {
                            return Linking.openURL(url);
                        }
                    }).catch(err => Toast.show("无法拨打"));

                }
                }
            ]
        );
    }


    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={[Utils.taskTitle[this.props.listType] + "详细"]}
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
                        <View style={{backgroundColor: Color.colorBlue, elevation: 5}}>
                            <MapView
                                trafficEnabled={this.state.trafficEnabled}
                                baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                                zoom={this.state.zoom}
                                mapType={this.state.mapType}
                                center={this.state.center}
                                style={{height: 200, width: width, backgroundColor: Color.colorBlue, elevation: 5}}
                            />
                            <Text style={{paddingTop: 16, marginLeft: 16, color: 'white'}}>工单号</Text>
                            <TouchableOpacity onPress={() => {
                                Clipboard.setString(this.props.data.workOrder);
                                Toast.show("工单号已复制")
                            }}>
                            <Text style={{
                                marginLeft: 16,
                                color: 'white',
                                fontSize: 18
                            }}>{this.props.data.workOrder}</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Clipboard.setString(this.props.data.province + this.props.data.customerCity + this.props.data.area + this.props.data.address)
                                Toast.show("地址已复制")
                            }}>
                                <Text style={{margin: 16, color: 'white'}}>
                                    {this.props.data.province + this.props.data.customerCity + this.props.data.area + this.props.data.address}
                                </Text>
                            </TouchableOpacity>
                            {
                                (() => {
                                    if (!this.state.locationEnable)
                                        return <View style={{
                                            flexDirection: "row",
                                            marginLeft: 16,
                                            marginBottom: 16,
                                            alignItems: 'center'
                                        }}>
                                            <Image style={{
                                                width: 20, height: 20,
                                            }}
                                                   source={ require('../drawable/warning_ico.png')}/>
                                            <Text style={{color: 'white', fontSize: 12}}>警告:地址无法转换准确位置!</Text>
                                        </View>

                                })()
                            }


                            <TouchableOpacity
                                onPress={() => {
                                    if (Platform.OS === 'ios') {
IosModule.doNavigationWithEndLocation(this.state.mLocation.latitude+"",this.state.mLocation.longitude+"")
                                    } else {
                                        console.log(this.state.mLocation.latitude + "," +
                                            this.state.mLocation.longitude + "," +
                                            this.state.center.latitude + "," +
                                            this.state.center.longitude)
                                        AndroidModule.startNav(
                                            this.state.mLocation.latitude,
                                            this.state.mLocation.longitude,
                                            this.state.center.latitude,
                                            this.state.center.longitude)
                                    }
                                }}
                                style={styles.navigateIcon}>
                                <Image style={styles.itemIconContainer}
                                       source={ require('../drawable/navigate_blue.png')}/>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity style={styles.item}
                                          onPress={() => this.readme('预约上门时间', Utils.formatDate(this.props.data.bookTime))}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_clock.png')}/>
                            <Text style={{marginLeft: 16}}>{Utils.formatDate(this.props.data.bookTime)}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item}
                                          onPress={() => this.readme('客户ID', this.props.data.consumerName)}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_user.png')}/>
                            <Text style={{marginLeft: 16}}>{this.props.data.consumerName}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.item}
                                          onPress={() => this.phoneCall('客户联系方式', this.props.data.consumerPhone)}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_call.png')}/>
                            <Text style={{marginLeft: 16}}>{this.props.data.consumerPhone}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.item}
                                          onPress={() => this.readme('客户备注', this.props.data.remark)}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_remark.png')}/>
                            <Text style={{marginLeft: 16}}>{this.props.data.remark}</Text>
                        </TouchableOpacity>

                        <FlatList
                            data={this.props.data.list}
                            keyExtractor={(item, index) => item.skuCode}
                            renderItem={({item}) => <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() => {
                                    if (this.props.listType === 0) {
                                        this.props.nav.navigate("productDetail", {
                                            data: item,
                                            listType: this.props.listType,
                                            enable: this.props.data.measureStatus === 1
                                        })
                                    } else {
                                        this.props.nav.navigate("productDetail", {
                                            data: item,
                                            listType: this.props.listType,
                                            enable: this.props.data.installStatus === 1
                                        })
                                    }
                                }}>
                                <Image style={{
                                    width: width - 32,
                                    height: 100,
                                    backgroundColor: Color.colorGrey
                                }} resizeMode="cover"
                                       source={{uri: item.picPath ? item.picPath : Utils.blankUri}}/>
                                <Text
                                    style={{
                                        color: Color.colorBlue,
                                        marginLeft: 16,
                                        marginTop: 16
                                    }}>{'商品名称：' + (item.itemName ? item.itemName : "-")}</Text>
                                <View style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: Color.line, paddingBottom: 16
                                }}>
                                    <Text style={{
                                        marginLeft: 16,
                                        color: Color.colorGreen,
                                    }}>{item.skuCode}</Text>
                                </View>
                                <Text
                                    style={{
                                        marginTop: 16,
                                        marginLeft: 16
                                    }}>{'sku描述：' + (item.skuDescription ? tem.skuDescription : "-")}</Text>
                                <Text
                                    style={{marginLeft: 16}}>{'测量图片：' + (item.imageList ? item.imageList.split(',').length + "张" : "无")}</Text>
                                <Text style={{marginLeft: 16}}>{'备注：' + (item.remark ? item.remark : "-")}</Text>
                                {
                                    (() => {
                                        if (this.props.listType === 0) {
                                            return <Text style={{
                                                marginLeft: 16,
                                                marginBottom: 16
                                            }}>{'房间：' + (item.roomDesc ? item.roomDesc : "未填写")}</Text>

                                        } else {
                                            return <Text style={{
                                                marginLeft: 16,
                                                marginBottom: 16
                                            }}>{'包件数：' + (item.packageCount ? item.packageCount : "-")}</Text>
                                        }
                                    })()
                                }

                            </TouchableOpacity>
                            }
                        />
                        {
                            (() => {
                                if ((this.props.listType === 0 && this.props.data.measureStatus === 0) || (this.props.listType === 1 && this.props.data.installStatus === 0)) {
                                    return <View>
                                        <TouchableOpacity
                                            style={[styles.btnContainer, {backgroundColor: Color.colorBlue}]}
                                            onPress={() => {
                                                this.confirmTask(1)
                                            }}>
                                            <Text style={{color: 'white'}}>接受任务</Text>

                                        </TouchableOpacity>

                                        <TouchableOpacity
                                            style={[styles.btnContainer, {backgroundColor: 'white'}]}
                                            onPress={() => {
                                                this.confirmTask(0)
                                            }}>
                                            <Text>拒绝任务</Text>
                                        </TouchableOpacity>
                                    </View>
                                }
                            })()
                        }

                        <Loading visible={this.state.isLoading}/>
                    </View>
                </ScrollView>
            </View>

        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
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
        top: 150,
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


});

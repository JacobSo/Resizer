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
import { MapView, MapTypes, MapModule, Geolocation } from 'react-native-baidu-map';

const {width, height} = Dimensions.get('window');


export default class MeasureDetailPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            mayType: MapTypes.NORMAL,
            zoom: 15,
            center: {
                longitude: 113.981718,
                latitude: 22.542449
            },
            trafficEnabled: false,
            baiduHeatMapEnabled: false,

        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={["测量任务详细"]}
                    color={"white"}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[]}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                    ]}
                />
                <ScrollView>
                    <View style={{marginBottom: 55}}>
                        <View style={{height: 250, backgroundColor: Color.colorBlue, elevation: 5}}>


                            <MapView
                                trafficEnabled={this.state.trafficEnabled}
                                baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                                zoom={this.state.zoom}
                                mapType={this.state.mapType}
                                center={this.state.center}
                                style={{height: 150,width:width, backgroundColor: Color.colorBlue, elevation: 5}}
                            />


                            <Text style={{paddingTop: 16, marginLeft: 16, color: 'white', fontSize: 18}}>工单号</Text>
                            <Text style={{marginLeft: 16, color: 'white'}}>订单号</Text>
                            <Text style={{margin: 16, color: 'white'}}>广东省佛山市顺德区均安镇南沙别墅</Text>
                            <TouchableOpacity
                                onPress={() => {
                                }}
                                style={styles.navigateIcon}>
                                <Image style={styles.itemIconContainer}
                                       source={ require('../drawable/navigate_blue.png')}/>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.item}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_clock.png')}/>
                            <Text style={{marginLeft: 16}}>2017-5-5 16:44</Text>
                        </View>
                        <View style={styles.item}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_user.png')}/>
                            <Text style={{marginLeft: 16}}>陈小姐</Text>
                        </View>
                        <View style={styles.item}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_call.png')}/>
                            <Text style={{marginLeft: 16}}>18680006907</Text>
                        </View>

                        <View style={styles.item}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_remark.png')}/>
                            <Text style={{marginLeft: 16}}>备注信息</Text>
                        </View>
                        <View style={styles.item}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_home.png')}/>
                            <Text style={{marginLeft: 16}}>碧桂园楼盘</Text>
                        </View>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
                            <TouchableOpacity
                                style={[styles.btnContainer,{backgroundColor: 'white'}]}
                                onPress={() => {
                                    this.props.nav.navigate("measureDetail")
                                }}>
                                <Text>上报异常</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={[styles.btnContainer, {backgroundColor: Color.colorBlue}]}
                                onPress={() => {
                                    this.props.nav.navigate("measureDetail")
                                }}>
                                <Text style={{color: 'white'}}>完成安装</Text>

                            </TouchableOpacity>

                        </View>

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

    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: Color.line,
        backgroundColor:'white'
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
    }

});

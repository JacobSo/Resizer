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
import Utils from "../Utils";

const {width, height} = Dimensions.get('window');


export default class MeasureDetailPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            mayType: MapTypes.NONE,
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
        console.log(this.props.data.listData)
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
                    isActionByText={true}
                    actionArray={['完成']}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                    ]}
                />
                <ScrollView>
                    <View style={{marginBottom: 55}}>
                        <View style={{ backgroundColor: Color.colorBlue, elevation: 5}}>
                            <MapView
                                trafficEnabled={this.state.trafficEnabled}
                                baiduHeatMapEnabled={this.state.baiduHeatMapEnabled}
                                zoom={this.state.zoom}
                                mapType={this.state.mapType}
                                center={this.state.center}
                                style={{height: 150,width:width, backgroundColor: Color.colorBlue, elevation: 5}}
                            />
                            <Text style={{paddingTop: 16, marginLeft: 16, color: 'white'}}>测量工单号</Text>
                            <Text style={{marginLeft: 16, color: 'white', fontSize: 18}}>{this.props.data.workOrder}</Text>
                            <Text style={{margin: 16, color: 'white'}}>
                                {this.props.data.province+this.props.data.customerCity+this.props.data.area+this.props.data.address}
                                </Text>
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
                            <Text style={{marginLeft: 16}}>{Utils.formatDate(this.props.data.bookTime)}</Text>
                        </View>
                        <View style={styles.item}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_user.png')}/>
                            <Text style={{marginLeft: 16}}>{this.props.data.consumerName}</Text>
                        </View>
                        <View style={styles.item}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_call.png')}/>
                            <Text style={{marginLeft: 16}}>{this.props.data.consumerPhone}</Text>
                        </View>

                        <View style={styles.item}>
                            <Image style={styles.itemIconContainer}
                                   source={ require('../drawable/detail_remark.png')}/>
                            <Text style={{marginLeft: 16}}>{this.props.data.remark}</Text>
                        </View>

                        <FlatList
                            data={this.props.data.list}
                            keyExtractor={(item, index) => item.skuCode}
                            renderItem={({item}) => <TouchableOpacity
                                style={styles.iconContainer}
                                onPress={() => {

                                }}>
                                <Image style={{  width: width-32,
                                    height: 65}} resizeMode="contain"
                                       source={require('../drawable/company_logo.png')}/>
                                <Text style={{color: Color.colorBlue}}>{'商品名称：'+(item.itemName?item.itemName:"-")}</Text>
                                <View style={{
                                    borderBottomWidth: 1,
                                    borderBottomColor: Color.line, paddingBottom: 16
                                }}>
                                    <Text style={{
                                        color: Color.colorGreen,
                                    }}>{item.skuCode}</Text>
                                </View>
                                <Text style={{marginTop: 16,}}>{'sku描述：' + item.serviceHost}</Text>
                                <Text>{'测量图片：' + (item.imageList?item.imageList.length+"张":"无")}</Text>
                                <Text>{'备注：' + (item.remark?item.remark:"-")}</Text>
                                <Text>{'房间：' + (item.roomDesc?item.roomDesc:"未填写")}</Text>
                            </TouchableOpacity>
                            }
                        />
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
    },
    iconContainer: {
        width: width - 32,
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 16,
        margin: 16,
        elevation: 2,
    }

});

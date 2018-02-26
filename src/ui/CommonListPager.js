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
    ListView, FlatList, SectionList, RefreshControl
} from 'react-native';
import Toolbar from "../component/Toolbar";
import Toast from 'react-native-root-toast';
import Utils from '../Utils';

import ApiService from '../api/ApiService';
import RefreshEmptyView from "../component/RefreshEmptyView";
const {width, height} = Dimensions.get('window');


export default class CommonListPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            items: [],

        };
    }

    componentDidMount() {
        this.get()
    }

    get() {
        this.setState({isRefreshing: true});
        ApiService.getData(this.props.listType)
            .then((responseJson) => {
                this.setState({isRefreshing: false});
                if (!responseJson.err) {
                    this.setState({
                        items: responseJson.listData,
                        isRefreshing: false,
                    });
                } else {
                    this.setState({isRefreshing: false,});
                    Toast.show(responseJson.errMsg);
                }
            })
            .catch((error) => {
                this.setState({isRefreshing: false});
                console.log(error);
                Toast.show("出错了，请稍后再试");
            }).done();
    }

    getStatus(item){
        if(this.props.listType===0){
            return  item.measureStatus;
        }else if(this.props.listType===1){
            return item.installStatus;
        }else if(this.props.listType===3){
            return item.FixStatus;
        }else{
            return null//exception
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={[this.props.listType === 0 ? "测量任务" : this.props.listType === 1 ? "安装任务" : this.props.listType === 2 ? "上报异常" : "维修任务"]}
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

                {
                    (() => {
                        if (this.state.items.length === 0) {
                            return <RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                                this.get()
                            } }/>
                        } else {
                            return <FlatList
                                data={this.state.items}
                                ListFooterComponent={<View style={{height: 75}}/>}
                                keyExtractor={(item, index) => item.workOrder}
                                refreshControl={
                                    <RefreshControl
                                        refreshing={this.state.isRefreshing}
                                        onRefresh={() => this.get()}
                                        tintColor={Color.colorBlue}//ios
                                        title="刷新中..."//ios
                                        titleColor='white'
                                        colors={[Color.colorBlue]}
                                        progressBackgroundColor="white"
                                    />}
                                renderItem={({item}) =>
                                    <TouchableOpacity
                                        style={styles.iconContainer}
                                        onPress={() => {
                                            if(this.props.listType===0){
                                                this.props.nav.navigate("measureDetail",{
                                                    data:item,
                                                })

                                            }else if(this.props.listType===1){
                                                this.props.nav.navigate("installDetail",{
                                                    data:item,
                                                })
                                            }
                                        }}>
                                        <View style={{
                                            justifyContent: 'space-between',
                                            flexDirection: 'row',
                                            width: width - 64
                                        }}>
                                            <Text style={{color: 'black',}}>{'工单号：\n' + item.workOrder}</Text>
                                            <Text style={{
                                                backgroundColor: this.getStatus(item) === 0 ? Color.colorOrange : Color.colorCyanDark,
                                                padding: 5,
                                                color: 'white',
                                                borderRadius: 10,
                                                height: 31
                                            }}>{this.getStatus(item) === 0 ? '待接收' : Utils.taskStatus[this.props.listType]}</Text>
                                        </View>
                                        <View style={{
                                            borderBottomWidth: 1,
                                            borderBottomColor: Color.line,
                                            paddingBottom: 16
                                        }}/>
                                        <Text
                                            style={{marginTop: 16,}}>{"测量地址：" + item.province + item.customerCity + item.area}</Text>
                                        <Text>{"购入产品：" + item.list.length + "件"}</Text>
                                        <Text>{"预约测量时间：" + Utils.formatDate(item.bookTime)}</Text>
                                    </TouchableOpacity>}
                            />
                        }
                    })()

                }
                {
                    (() => {
                        if (this.props.listType === 2) {
                            return <TouchableOpacity
                                onPress={() => {
                                    this.props.nav.navigate("exceptionAdd")
                                }}
                                style={styles.floatBtn}>
                                <Image style={{width: 25, height: 25}}
                                       source={ require('../drawable/add_white.png')}/>
                            </TouchableOpacity>
                        }
                    })()
                }

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Color.background,
    },
    icon: {
        flex: 1,
        width: 65,
        height: 65
    },

    iconContainer: {
        width: width - 32,
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 16,
        margin: 16,
        elevation: 2,
    },
    floatBtn:{
        position: 'absolute',
        bottom: 25,
        right: 0,
        borderRadius: 50,
        elevation: 5,
        margin: 16,
        backgroundColor: Color.colorBlue,
        width: 55,
        height: 55,
        alignItems: 'center',
        justifyContent: 'center'
    },

});

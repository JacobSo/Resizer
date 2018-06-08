/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    TouchableOpacity, Dimensions, FlatList, StyleSheet, Text
} from 'react-native';
import Toolbar from '../component/Toolbar';
import ApiService from '../api/ApiService';
import Color from '../const/Color';
import RefreshEmptyView from "../component/RefreshEmptyView";
import Toast from 'react-native-root-toast';

const {width, height} = Dimensions.get('window');
export default class ProviderListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefreshing: false,
            items: [],
      //      itemsBackup: [],
        }
    }

    componentDidMount() {
        if (this.props.providerData&&this.props.providerData.length !== 0) {
            console.log(this.props.providerData)
            this.setState({
                items: this.props.providerData,
            });
        } else
            this._onRefresh();
    }

    initItems(items) {
        let list = [];
        items.map((item, index) => {
            item.isSelect = false;
            item.key = Math.random()
            list.push(item)
        });
        return list
    }

    _onRefresh() {
        this.setState({isRefreshing: true,});
        ApiService.getProvider()
            .then((responseJson) => {
                if (!responseJson.err) {
                    this.setState({
                        items: this.initItems(responseJson.listData),
                       // itemsBackup: this.initItems(responseJson.listData),
                        isRefreshing: false,
                    });
                } else {
                    this.setState({isRefreshing: false,});
                    Toast.show(responseJson.errMsg);
                }
            })
            .catch((error) => {
                this.setState({isRefreshing: false,});
                console.log(error);
                Toast.show("出错了，请稍后再试");
            }).done();
    }

    _getView() {
        if (this.state.items && this.state.items.length === 0) {
            return (<RefreshEmptyView isRefreshing={this.state.isRefreshing} onRefreshFunc={() => {
                this._onRefresh()
            } }/>)
        } else {
            return (
                <FlatList
                    data={this.state.items}
                    extraData={this.state}
                    ListFooterComponent={<View style={{height: 75}}/>}
                    renderItem={({item}) => <TouchableOpacity
                        style={[styles.iconContainer, {backgroundColor: item.isSelect ? Color.line : 'white',}]}
                        onPress={() => {
                            console.log(item);
                            item.isSelect = !item.isSelect;
                            this.setState({items: this.state.items});
                        }}>
                        <Text style={{color: Color.colorBlue}}>{item.account}</Text>
                        <View style={{
                            borderBottomWidth: 1,
                            borderBottomColor: Color.line, paddingBottom: 16
                        }}>
                            <Text style={{
                                color: Color.colorGreen,
                            }}>{'服务区域：' + item.serviceArea}</Text>
                        </View>
                        <Text style={{marginTop: 16,}}>{'负责人：' + item.serviceHost}</Text>
                        <Text>{'电话：' + item.phone}</Text>
                        <Text>{'地址：' + item.province + item.area + item.customerCity + item.address}</Text>
                    </TouchableOpacity>
                    }
                />
            )
        }
    }

    /*


     async  _search(text) {
     console.log(text)
     return this.state.itemsBackup.filter((item) => {
     console.log(item);
     return item ? (item.name.toLowerCase().indexOf(text.toLowerCase()) > -1) : ("无");
     });
     }*/

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>

                <Toolbar
                    elevation={2}
                    title={["服务商列表"]}
                    color={'white'}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['完成']}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        () => {
                            this.props.finishFunc(this.state.items);
                            this.props.nav.goBack(null);
                        }

                    ]}/>
                {/*                <TextInput style={{
                 width: width,
                 height: 55,
                 paddingLeft: 16,
                 paddingRight: 16,
                 // textAlign:'center',
                 borderColor: Color.line,
                 borderBottomWidth: 1,
                 }}
                 placeholder="搜索"
                 returnKeyType={'done'}
                 blurOnSubmit={true}
                 underlineColorAndroid="transparent"
                 onChangeText={(text) => {
                 this._search(text).then((array) => {
                 //       console.log(array);
                 this.setState({items: array})
                 })
                 }}/>*/}
                {this._getView()}


            </View>
        )
    }
}

const styles = StyleSheet.create({


    iconContainer: {
        width: width - 32,
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 16,
        margin: 16,
        elevation: 2,
    }

});
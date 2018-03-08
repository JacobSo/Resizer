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
import * as ColorGroup from "../const/ColorGroup";
import Toast from 'react-native-root-toast';
import {QRScannerView} from "ac-qrcode";

const {width, height} = Dimensions.get('window');
export default class QrCodePager extends Component {
    render() {
        return (

            <QRScannerView
                onScanResultReceived={this.barcodeReceived.bind(this)}
                renderTopBarView={() => this._renderTitleBar()}
                renderBottomMenuView={() => this._renderMenu()}
                hintText={"扫描家具组件以获取家具信息，辅助安装和上报异常"}
            />
        )
    }

    _renderTitleBar(){
        return(
            <Toolbar
                elevation={2}
                title={["扫描组件"]}
                color={'white'}
                isHomeUp={true}
                isAction={true}
                isActionByText={true}
                actionArray={[]}
                functionArray={[
                    () => {
                        this.props.nav.goBack(null)
                    },
                ]}/>
        );
    }

    _renderMenu() {
        return (
            <Text
                style={{color:'white',textAlignVertical:'center', textAlign:'center',font:20,padding:12}}
            >-</Text>
        )
    }

    barcodeReceived(e) {
        if(e.data){
            Toast.show('Type: ' + e.type + '\nData: ' + e.data);
            this.props.finishFunc(e.data)
            this.props.nav.goBack();
        }
        //console.log(e)
    }
}


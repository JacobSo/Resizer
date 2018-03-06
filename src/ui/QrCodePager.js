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
            />
        )
    }

    _renderTitleBar(){
        return(
            <Text
                style={{color:'white',textAlignVertical:'center', textAlign:'center',font:20,padding:12}}
            >Here is title bar</Text>
        );
    }

    _renderMenu() {
        return (
            <Text
                style={{color:'white',textAlignVertical:'center', textAlign:'center',font:20,padding:12}}
            >Here is bottom menu</Text>
        )
    }

    barcodeReceived(e) {
        Toast.show('Type: ' + e.type + '\nData: ' + e.data);
        //console.log(e)
    }
}


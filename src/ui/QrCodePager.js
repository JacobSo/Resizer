/**
 * Created by Administrator on 2017/3/13.
 */
'user strict';

import React, {Component} from 'react';
import {
    View,
    Dimensions,
} from 'react-native';
import Toolbar from '../component/Toolbar';
import {QRScannerView} from "ac-qrcode";

export default class QrCodePager extends Component {
    render() {
        return (
            <View style={{flex:1}}>
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
            <QRScannerView
                onScanResultReceived={this.barcodeReceived.bind(this)}
                renderTopBarView={() => this._renderTitleBar()}
               renderBottomMenuView={() => this._renderMenu()}
            />
            </View>
        )
    }

    _renderTitleBar(){
        return<View/>
    }

    _renderMenu() {
        return (
            <View/>)
    }

    barcodeReceived(e) {
        if(e.data){
         //   Toast.show('Type: ' + e.type + '\nData: ' + e.data);
            this.props.finishFunc(e.data)
            this.props.nav.goBack();
        }
        //console.log(e)
    }
}


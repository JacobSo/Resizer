/**
 * Created by Administrator on 2017/6/2.
 */
import React, {Component} from 'react';

import Gallery from 'react-native-gallery';
import {Text, Dimensions, TouchableOpacity, View} from "react-native";
import Color from '../const/Color';

const {width, height} = Dimensions.get('window');
export default class GalleryPager extends Component {
    constructor(props) {
        super(props);
        console.log(JSON.stringify(this.props.pics))
    }

    render() {
        return (
            <View style={{width: width, height: height}}>
                <Gallery
                    style={{flex: 1, backgroundColor: 'black'}}
                    images={this.props.pics}
                />
                <TouchableOpacity style={{position: 'absolute', left: 0}} onPress={() => this.props.nav.goBack(null)}>
                    <Text style={{margin: 16, color: 'white',backgroundColor:Color.trans}}>返回</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

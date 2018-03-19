/**
 * Created by Administrator on 2017/3/17.
 */
/**
 * Created by Administrator on 2017/3/15.
 */
'use strict';
import React, {Component,} from 'react';
import PropTypes from 'prop-types';
import Utils from '../Utils.js';
import {View, Image, TouchableOpacity, ListView, Dimensions} from 'react-native';
const {width, height} = Dimensions.get('window');

export default class ImageList extends Component {
    static propTypes = {
        dataSourcePic: PropTypes.any.isRequired,
        //     action: PropTypes.func.isRequired
//mainActoin
        //isCloseDisable
    };


    render() {
        return (
            <ListView
                dataSource={this.props.dataSourcePic}
                removeClippedSubviews={false}
                enableEmptySections={true}
                renderRow={(rowData, rowID, sectionID) =>
                    <View>
                        <TouchableOpacity onPress={  rowData.uri?this.props.mainActoin:console.log("empty image")}>
                            <Image
                                resizeMode="contain"
                                style={{
                                    height: 200,
                                    marginTop: 16,
                                    marginBottom: 16,
                                    width: width - 32
                                }}
                                source={{uri: rowData.uri?rowData.uri:Utils.blankUri}}/>
                        </TouchableOpacity>

                        {
                            (() => {
                                if (!this.props.isCloseDisable) {
                                    return <TouchableOpacity
                                        style={{position: 'absolute', right: 16,}}
                                        onPress={() => this.props.action(sectionID)}>
                                        <Image
                                            resizeMode="contain"
                                            style={{height: 30, width: 30,}}
                                            source={require('../drawable/close_post_label.png')}/>
                                    </TouchableOpacity>
                                }
                            })()

                        }

                    </View>
                }/>

        )
    }
}

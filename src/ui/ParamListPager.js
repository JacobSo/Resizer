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

const {width, height} = Dimensions.get('window');
export default class ParamListPager extends Component {
    constructor(props) {
        super(props);
        this.state = {
            items: this.initItems(this.props.items),
        }
    }

    componentDidMount() {
        console.log(this.state.items)
    }

    initItems(items) {
        let list = [];
        items.map((item, index) => {
            item.key = list.push({
                name: item,
                key: Math.random(),
                value: index
            })
        });
        return list
    }

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background,
            }}>
                <Toolbar
                    elevation={2}
                    title={[this.props.title]}
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
                <FlatList
                    data={this.state.items}
                    extraData={this.state}
                    ListFooterComponent={<View style={{height: 75}}/>}
                    renderItem={({item,index}) => <TouchableOpacity
                        style={{padding: 16}}
                        onPress={() => {
                            this.props.finishFunc(index);
                            this.props.nav.goBack(null);
                        }}>
                        <Text>{item.name}</Text>
                    </TouchableOpacity>
                    }
                />


            </View>
        )
    }
}


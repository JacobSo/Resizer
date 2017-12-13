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
    ListView, FlatList, SectionList
} from 'react-native';
import Toolbar from "../component/Toolbar";
const {width, height} = Dimensions.get('window');


export default class FixListPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            items: [{key: "a"}, {key: "b"}],
            dataSource: new ListView.DataSource({
                rowHasChanged: (row1, row2) => row1 !== row2,
            }),
        };
    }

    componentDidMount() {
        this.setState({dataSource: this.state.dataSource.cloneWithRows(this.state.items)})
    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={["维修任务"]}
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
                <FlatList
                    data={this.state.items}
                    renderItem={({item}) =>
                        <TouchableOpacity
                            style={styles.iconContainer}
                            onPress={()=>{
                                this.props.nav.navigate("installDetail")
                            }}>
                            <Text style={{color:Color.colorBlue}}>工单A</Text>
                            <Text style={{
                                color:Color.colorGreen,
                                borderBottomStartRadius:20,
                                borderBottomEndRadius:20,
                                borderBottomWidth:1,
                                borderBottomColor:Color.line,paddingBottom:16}}>订单号：xxxxxxxx</Text>

                            <Text style={{marginTop:16}}>测量地址：佛山市顺德区。。。。</Text>
                            <Text>楼盘：龙江碧桂园</Text>
                            <Text>预约测量时间：YYYY-mm-dd hh-MM到-</Text>
                        </TouchableOpacity>}
                />

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Color.backgroundColor,
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
    }

});

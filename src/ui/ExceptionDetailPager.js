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
import {SceneMap, TabBar, TabViewAnimated} from "react-native-tab-view";
const {width, height} = Dimensions.get('window');

const initialLayout = {
    width: width,
    height: height - 200
};
const FirstRoute = () => <View>
    <View style={{
        flexDirection: 'row', justifyContent: "space-between", padding: 16,
    }}><Text>审核状态</Text><Text>未审核</Text></View>

    <Text style={{paddingLeft: 16}}>异常描述</Text>
    <Text style={{padding: 16}}>The following code is almost there. It's bit I've cobbled together from here and there
        and my own bits. The problem is that I am just not able to get spin him around his y-axis, one that would be
        running right through his core, right in the middle.</Text>
    <Text style={{paddingLeft: 16}}>组件列表/替换/维修</Text>
    <Text style={{padding: 16}}>责任信息</Text>
    <Text style={{paddingLeft: 16}}>无</Text>

    <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>

        <TouchableOpacity
            style={styles.btnContainer}
            onPress={() => {
                this.props.nav.navigate("measureDetail")
            }}>
            <Text>撤销</Text>
        </TouchableOpacity>
        <TouchableOpacity
            style={[styles.btnContainer, {backgroundColor: Color.colorBlue}]}
            onPress={() => {
                this.props.nav.navigate("measureDetail")
            }}>
            <Text style={{color: 'white'}}>修改</Text>

        </TouchableOpacity>

    </View>
</View>;
const SecondRoute = () => <View>
    {/*    <View style={styles.item}>
     <Image style={styles.itemIconContainer}
     source={ require('../drawable/detail_clock.png')}/>
     <Text style={{marginLeft: 16}}>2017-5-5 16:44</Text>
     </View>*/}
    <View style={styles.item}>
        <Image style={styles.itemIconContainer}
               source={ require('../drawable/detail_user.png')}/>
        <Text style={{marginLeft: 16}}>陈小姐</Text>
    </View>
    <View style={styles.item}>
        <Image style={styles.itemIconContainer}
               source={ require('../drawable/detail_call.png')}/>
        <Text style={{marginLeft: 16}}>18680006907</Text>
    </View>

    <View style={styles.item}>
        <Image style={styles.itemIconContainer}
               source={ require('../drawable/detail_remark.png')}/>
        <Text style={{marginLeft: 16}}>备注信息</Text>
    </View>
    <View style={styles.item}>
        <Image style={styles.itemIconContainer}
               source={ require('../drawable/detail_home.png')}/>
        <Text style={{marginLeft: 16}}>碧桂园楼盘</Text>
    </View>

</View>;
export default class ExceptionDetailPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            index: 0,
            routes: [
                {key: 'first', title: '异常情况'},
                {key: 'second', title: '业主信息'},
            ],
        };
    }

    componentDidMount() {
    }

    _handleIndexChange = index => this.setState({index});

    _renderHeader = props => <TabBar {...props} />;

    _renderScene = SceneMap({
        first: FirstRoute,
        second: SecondRoute,
    });

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={["异常工单详细"]}
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
                <ScrollView>
                    <View style={{marginBottom: 55}}>
                        <View style={{height: 250, backgroundColor: Color.colorBlue, elevation: 1}}>
                            <View style={{backgroundColor: 'black', width: width, height: 150}}/>
                            <Text style={{marginTop: 16, marginLeft: 16, color: 'white', fontSize: 18}}>工单号</Text>
                            <Text style={{marginLeft: 16, color: 'white'}}>订单号</Text>
                            <Text style={{margin: 16, color: 'white'}}>广东省佛山市顺德区均安镇南沙别墅</Text>

                        </View>
                        <TabViewAnimated
                            style={{width: width, height: height - 200}}
                            navigationState={this.state}
                            renderScene={this._renderScene}
                            renderHeader={this._renderHeader}
                            onIndexChange={this._handleIndexChange}
                            initialLayout={initialLayout}

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
        backgroundColor: 'white',
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomEndRadius: 20,
        borderBottomStartRadius: 20,
        borderBottomColor: Color.line
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
    }

});

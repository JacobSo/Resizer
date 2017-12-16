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
    ListView, FlatList, SectionList, TextInput, ScrollView
} from 'react-native';
import Toolbar from "../component/Toolbar";
import Sae from "react-native-textinput-effects/lib/Sae";
import {Akira, Hoshi, Jiro, Kaede, Madoka} from "react-native-textinput-effects";
const {width, height} = Dimensions.get('window');


export default class ExceptionAddPager extends Component<{}> {

    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            remark:''
        };
    }

    componentDidMount() {
    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={["新建异常"]}
                    color={"white"}
                    isHomeUp={true}
                    isAction={true}
                    isActionByText={true}
                    actionArray={['提交']}
                    functionArray={[
                        () => {
                            this.props.nav.goBack(null)
                        },
                        ()=>{

                        }
                    ]}
                />
                <ScrollView>
                <View style={{marginBottom:55}}>

                <View style={styles.cardContainer}>

                    <Text style={{margin:16,color:'black',}}>业主信息</Text>
                    <View style={{width:width-64}}>

                        <Madoka
                            label={'姓名'}
                            borderColor={Color.line}
                            labelStyle={{ color: Color.content }}
                        />
                        <Madoka
                            label={'电话'}
                            borderColor={Color.line}
                            labelStyle={{ color: Color.content }}
                        />
                    </View>
                </View>
                <View style={styles.cardContainer}>
                    <Text style={{margin:16,color:'black'}}>异常描述</Text>
                    <TextInput
                        style={{  width: width - 64,
                            height: 100,
                            marginRight: 10,
                            textAlign:'center',
                        borderTopWidth:1,
                        borderTopColor:Color.line}}
                        multiline={true}
                        placeholder="在这里填写"
                        returnKeyType={'done'}
                        underlineColorAndroid="transparent"

                        blurOnSubmit={true}
                        onChangeText={(text) => this.setState({remark: text})}/>
                </View>

                <View style={styles.cardContainer}>
                    <Text style={{margin:16,color:'black'}}>组件异常照片</Text>
                    <TouchableOpacity onPress={()=>{}}
                                      style={{backgroundColor:Color.colorBlue,alignItems:'center',justifyContent:'center',borderBottomRightRadius:10,borderBottomLeftRadius:10,width:width-32}}>
                        <Text style={{color:'white',margin:16}}>拍照</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.cardContainer}>
                    <Text style={{margin:16,color:'black'}}>维修组件</Text>
                    <TouchableOpacity onPress={()=>{}}
                    style={{backgroundColor:Color.colorBlue,alignItems:'center',justifyContent:'center',borderBottomRightRadius:10,borderBottomLeftRadius:10,width:width-32}}>
                        <Text style={{color:'white',margin:16}}>添加</Text>
                    </TouchableOpacity>
                </View>
                    <View style={styles.cardContainer}>
                        <Text style={{margin:16,color:'black'}}>责任信息</Text>
                        <TextInput
                            style={{  width: width - 64,
                                height: 100,
                                marginRight: 10,
                                textAlign:'center',
                                borderTopWidth:1,
                                borderTopColor:Color.line}}
                            multiline={true}
                            placeholder="在这里填写"
                            returnKeyType={'done'}
                            underlineColorAndroid="transparent"

                            blurOnSubmit={true}
                            onChangeText={(text) => this.setState({remark: text})}/>
                    </View>
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
        backgroundColor: Color.backgroundColor,
    },

    cardContainer:{
        backgroundColor:'white',
        borderRadius:10,
        elevation:2,
        margin:16,
        width:width-32,
        alignItems:'center',
        justifyContent:'center'
    }

});

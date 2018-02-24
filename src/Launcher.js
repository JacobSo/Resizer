"use strict";
import React, {Component} from 'react';
import Color from './const/Color';
import {
    Image,
    Platform,
    StyleSheet,
    Text,
    View,
    Dimensions,
    TouchableOpacity,

} from 'react-native';
import App from './Application';
import Toolbar from "./component/Toolbar";
const {width, height} = Dimensions.get('window');


export default class Launcher extends Component<{}> {
    constructor(props) {
        super(props);
        this.state = {
            textTemp: '123',
        };
    }

    componentDidMount() {
    /*    App.initAccount(() => {
            console.log(App.token)
        })
        console.log(App.getSingle("token"))*/

    }

    render() {
        return (
            <View style={styles.container}>
                <Toolbar
                    elevation={2}
                    title={[App.userName]}
                    color={"white"}
                    isHomeUp={false}
                    isAction={true}
                    isActionByText={false}
                    actionArray={[require('./drawable/setting_black.png')]}
                    functionArray={[
                        () => {
                        },
                        () => {
                            this.props.nav.navigate('preferences')
                        }
                    ]}
                />
                <View style={styles.iconRowContainer}>
                    <TouchableOpacity
                        style={styles.iconContainer}
                        onPress={
                            () => {
                                       this.props.nav.navigate("commonList",{listType:0})
                            }
                        }>
                        <Image style={styles.icon} resizeMode="contain"
                               source={require('./drawable/main_measure_icon.png')}/>
                        <Text>测量任务</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={
                        () => {
                            this.props.nav.navigate("commonList",{listType:1})
                        }
                    }>
                        <Image style={styles.icon} resizeMode="contain"
                               source={require('./drawable/main_install_icon.png')}/>
                        <Text>安装任务</Text>
                    </TouchableOpacity>
                </View>
                <View style={styles.iconRowContainer}>
                    <TouchableOpacity style={styles.iconContainer} onPress={
                        () => {
                            this.props.nav.navigate("commonList",{listType:2})
                        }}>
                        <Image style={styles.icon} resizeMode="contain"
                               source={require('./drawable/main_exception_icon.png')}/>
                        <Text>上报异常</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconContainer} onPress={
                        () => {
                            this.props.nav.navigate("commonList",{listType:3})
                        }}>
                        <Image style={styles.icon} resizeMode="contain"
                               source={require('./drawable/main_repair_icon.png')}/>
                        <Text>维修任务</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Color.background,
    },
    icon: {
        flex: 1,
        width: 65,
        height: 65
    },
    iconRowContainer: {
        flexDirection: 'row',
        width: width,
        justifyContent: "space-around"
    },
    iconContainer: {
        width: 128,
        height: 128,
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 16,
        margin: 16,
        elevation: 2,
    }

});

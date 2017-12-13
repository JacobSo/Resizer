/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import React, {Component} from 'react';
import {
    View,
    ScrollView,
    Alert, Dimensions,
    Platform,
    Text,
    StyleSheet,
    Linking, TouchableOpacity

} from 'react-native';
import Color from '../const/Color';
import Toolbar from '../component/Toolbar'
import PreferencesTextItem from '../component/PreferencesTextItem'
import {NavigationActions} from "react-navigation";
const {width, height} = Dimensions.get('window');

export default class PreferencesPager extends Component {

    constructor(props) {
        super(props);
        this.state = {
            version: '0.1',
            department: ''
        };
    }

    componentDidMount() {

    }

/*    _getVersion() {
        if (Platform.OS === 'ios') {
            IosModule.getVersionName((str) => {
                this.setState({version: str})
            })
        } else {
            AndroidModule.getVersionName((str) => this.setState({version: str}));
        }
    }*/

    render() {
        return (
            <View style={{
                flex: 1,
                backgroundColor: Color.background
            }}>
                <Toolbar title={['设置']}
                         color={'white'}
                         elevation={2}
                         isHomeUp={true}
                         isAction={false}
                         isActionByText={false}
                         actionArray={[]}
                         functionArray={[() => this.props.nav.goBack(null)]}/>
                <ScrollView>
                    <View>
                        <PreferencesTextItem
                            group="常规"
                            items={[
                                ['test', '注销登录'],
                                ['dpt', this.state.department],
                                ['修改密码', '点击修改密码'],
                            ]}
                            functions={[
                                () => {
                                    Alert.alert(
                                        '注销',
                                        '注销当前账号，返回登录页面',
                                        [
                                            {
                                                text: '取消', onPress: () => {
                                            }
                                            },
                                            {
                                                text: '确定', onPress: () => {

                                            }
                                            },
                                        ]
                                    )
                                },
                                () => {
                                },
                                () => {},
                            ]}/>
                        <PreferencesTextItem
                            group="应用"
                            items={[
                                ['清理图片缓存', '所有图片将重新下载'],
                                ['检查更新', '当前版本：' + '0.1'],
                                ['此版本更新记录', 'v5'],
                                ['手动更新', 'http://pgyer.com/lsout']
                            ]}
                            functions={[
                                () => {

                                },
                                () => {},
                                () => {},
                                () => {}]}/>
                    </View>
                </ScrollView>

            </View>
        )
    }
}
const styles = StyleSheet.create({
});
/**
 * Created by Administrator on 2017/6/1.
 */
'use strict';
import React, {Component} from 'react';
import {Alert, Linking, Platform} from 'react-native';
import Toast from 'react-native-root-toast';
export  default  class UpdateService {

    static update(isNotice) {
        let iosKey = "1470e07914005a27f6cb92bdeecae405";
        let androidKey = "aa68c5264f914d6e9c9686adeeeb9457";
        let iosCode = 3;//
        let androidCode = 9;//
        if(isNotice)
            Toast.show("检查中...");
        UpdateService.pgyerApiCheck(Platform.OS === 'ios' ? iosKey : androidKey)
            .then((responseJson) => {
                if (responseJson.code === 0) {
                    if (Number(responseJson.data[responseJson.data.length-1].appBuildVersion) <= (Platform.OS === "ios" ? iosCode : androidCode)) {
                        console.log('pgyerApiCheck:up to date:'+responseJson.data[responseJson.data.length-1].appBuildVersion);
                        if (isNotice)
                            Toast.show("已经是最新版本")
                    } else {
                        Alert.alert(
                            '发现新版本-' + responseJson.data[responseJson.data.length - 1].appVersion,
                            "新版本：" + responseJson.data[responseJson.data.length - 1].appUpdateDescription,
                            [
                                {
                                    text: '取消', onPress: () => {
                                }
                                },
                                {
                                    text: '前往更新', onPress: () => {
                                        Linking.openURL("http://www.pgyer.com/apiv1/app/install?_api_key=6dadcbe3be5652aec70a3d56f153bfb4&aKey=" +
                                            responseJson.data[responseJson.data.length - 1].appKey);
                  /*                      Linking.openURL("itms-services://?action=download-manifest&url=https://www.pgyer.com/app/plist/" +
                                            responseJson.data[responseJson.data.length - 1].appKey);*/
                                }
                                },


                                {
                                    cancelable: false
                                }
                            ]
                        )
                    }
                } else {
                    console.log('pgyerApiCheck:failed');
                    if (isNotice)
                        Toast.show("检查更新服务错误，请稍后再试")
                }
            })
            .catch((error) => {
                console.log('pgyerApiCheck:error');
                console.log(error);
                if (isNotice)
                    Toast.show("检查更新失败，请稍后再试")
            }).done();
    }

    static pgyerApiCheck(key) {
        //   console.log("pgyerApiCheck");
        return fetch("http://www.pgyer.com/apiv1/app/viewGroup", {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded;',
            },
            body: "aId=" + key + "&_api_key=6dadcbe3be5652aec70a3d56f153bfb4"
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                return responseJson;

            })
    }

    static pgyerApiInstall(akey) {
        console.log("pgyerApiInstall");
        return fetch("http://www.pgyer.com/apiv1/app/install?_api_key=6dadcbe3be5652aec70a3d56f153bfb4&aKey=" + akey, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
        })
            .then((response) => {
                console.log(response);
                return response;
            })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                return responseJson;

            })
    }

}
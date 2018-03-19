/**
 * Created by Administrator on 2017/3/16.
 */

import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';

export  default  class Application extends Component {
    static token = '';//
    static phone = '';//
    static userName = '';//
    static active = '';//
    static serviceArea = "";//
    static userType;
    static serviceType = "";//
    static createTime = '';

    static saveSingleToken(value) {
        console.log("save:")
        this.token = value
        return AsyncStorage.setItem("token", JSON.stringify(value));
    }

    static getSingle(key) {
        return AsyncStorage.getItem(key).then((value) => {
            const jsonValue = JSON.parse(value);
            console.log("value:" + jsonValue);
            return jsonValue;
        });
    }

    static initAccount(callback) {
        AsyncStorage.getAllKeys((err, keys) => {
            console.log(keys)
            AsyncStorage.multiGet(keys, (err, stores) => {
                stores.map((result, i, store) => {
                    let key = store[i][0];
                    let value = store[i][1];
                    console.log("-**--" + key + "-**--" + value);

                    if (key === "token") this.token = value;
                    if (key === "phone") this.phone = value;
                    if (key === "userName") this.userName = value;
                    if (key === "active") this.active = value;
                    if (key === "serviceArea") this.serviceArea = value;
                    if (key === "userType") this.userType = value;
                    if (key === "serviceType") this.serviceType = value;
                    if (key === "createTime") this.createTime = value;

                });
            }).then(callback).catch((err) => {
                console.log(err);
            }).done();
        });
    }

    static saveAccount(token, phone, userName, active, serviceArea, userType, serviceType, createTime) {
        this.token = token;
        this.phone = phone;
        this.userName = userName;
        this.active = active;
        this.serviceArea = serviceArea;
        this.userType = userType;
        this.serviceType = serviceType;
        this.createTime = createTime;

        console.log("---" + token + "---" + phone + "---" + userName + "---" + active + '---' + serviceArea + '---' + userType + "---" + serviceType + "---" + createTime);
        AsyncStorage.multiSet(
            [
                ['token', token+""],
                ['phone', phone+""],
                ['userName', userName+""],
                ['active', active + ""],
                ['serviceArea', serviceArea+""],
                ['userType', userType + ""],
                ['serviceType', serviceType + ""],
                ['createTime', createTime + ""],
            ])
            .then((err) => {
            console.log(err);
                    console.log("save success!");
                },
            ).catch(() => {
            console.log("save failed!");
        });
    }
}
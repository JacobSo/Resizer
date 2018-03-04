/**
 * Created by Administrator on 2017/3/16.
 */

import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';

export  default  class Utils extends Component {

    static taskTitle = ["测量任务","安装任务","上报异常","维修任务"];
    static serviceType = ["测量","安装","测量与安装"];
    static userType = ["非三包","三包"];
    static activeStatus = ["注销","活跃"];
    static taskStatus = ["待测量","待安装","-","待维修"];
    static blankUri = "http://127.0.0.1";

    static formatDate(timeStr) {
        let now = new Date(timeStr);
        let year = (now.getYear() + 1900);
        let month = now.getMonth() + 1;
        let date = now.getDate();
        let hour = now.getHours();
        let minute = now.getMinutes();
        let second = now.getSeconds();
        return year + "-" + month + "-" + date + " " + hour + ":" + minute;
    }

}
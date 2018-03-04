/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import App from '../Application';

let BASE_URL = 'http://192.168.1.113:8088/';
//let BASE_URL = 'http://kh.linshimuye.cn:8022/ServiceCenter/';
let newFetch = function (input, opts) {
    return new Promise((resolve, reject) => {
        setTimeout(reject, opts.timeout);
        fetch(input, opts).then(resolve, reject);
    });
};
export  default  class ApiService {


    static postRequest(method, param) {
        let temp = BASE_URL + method;
        console.log('method:' + temp + '\nparam:' + param);

        return newFetch(temp, {
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: param,
            timeout: 30000
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

    static getRequest(method, param) {
        let temp = BASE_URL + method;
        console.log('method:' + temp + '\nparam:' + param);

        return newFetch(temp, {
            method: 'GET',
            timeout: 30000,
            //   body: param
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

    static register(name, phone, serviceType, userType, provider, operation) {
        let method = 'ServiceApp/register';
        let param = 'UserName=' + name + '&' +
            'PhoneNumber=' + phone + '&' +
            'ServiceType=' + serviceType + '&' +
            'UserType=' + userType + '&' +
            'Provider=' + provider + '&' +
            'Operation=' + operation;

        return this.postRequest(method, param);
    }

    static login(phone) {
        let method = 'ServiceApp/login';
        let param = 'Phone=' + phone;
        return this.postRequest(method, param);
    }

    static getData(type) {
        let method = 'ServiceApp/getData?OrderType=' + type + '&User=' + App.userName + '&Phone=' + App.phone;

        return this.getRequest(method, null);
    }

    static submitException(order, component, abnormalDesc, user, phone, imageList, solution) {
        let method = 'ServiceApp/submitException';
        let param = JSON.stringify({
            WorkOrder: order,
            ComponentCode: component,
            AbnormalDesc: abnormalDesc,
            User: user,
            Phone: phone,
            ImageList: imageList,
            AbnormalSolution: solution,
        });
        return this.postRequest(method, param);
    }

    static deleteException(order, component) {
        let method = 'ServiceApp/deleteException';
        let param = JSON.stringify({
            WorkOrder: order,
            ComponentCode: component,
        });
        return this.postRequest(method, param);
    }

    static confirmTask(type, status, order) {
        let method = 'ServiceApp/confirmTask';
        let param = 'User=' + App.userName + '&' + 'WorkOrder=' + order + '&' + 'OrderType=' + type + '&' + "OrderStatus=" + status;
        return this.postRequest(method, param);
    }

    static roomDesc(order, sku, room) {
        let method = 'ServiceApp/roomDesc';
        let param = 'User=' + App.userName + '&' + 'WorkOrder=' + order + '&' + 'SkuCode=' + sku + '&' + "RoomDesc=" + room;
        return this.postRequest(method, param);
    }

    static uploadFile(order, sku, images) {
        let method = 'ServiceApp/uploadImageList';
        let param = 'User=' + App.userName + '&' + 'WorkOrder=' + order + '&' + 'SkuCode=' + sku + '&' + "ImageList=" + images;
        return this.postRequest(method, param);
    }

    static getProvider() {
        let method = 'ServiceGenerate/getProviderList?Token=' + App.token;
        return this.getRequest(method);
    }

    static uploadImage(str, name) {
        let method = 'http://192.168.1.113:8089/uploadStr';
        let param = JSON.stringify({
            file: str,
            name: name
        });
        //  'file=' + str + '&' + 'name=' + name;
        return newFetch(method, {
            method: 'POST',
            headers: {
                // 'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json',
            },
            body: param,
            timeout: 30000
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
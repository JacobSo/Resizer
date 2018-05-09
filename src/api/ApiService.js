/**
 * Created by Administrator on 2017/3/13.
 */
'use strict';
import App from '../Application';

//let BASE_URL = 'http://192.168.1.113:8881/';
 let BASE_URL = 'http://113.105.237.98:8023/ServiceCenter/';
//let BASE_URL = 'http://192.168.3.98:8022/ServiceCenter/';
let DAE_URL = 'http://113.105.237.98:8888/DesignPlanCode/Get?skuCode=';
let UPLOAD_URL = 'http://kh.linshimuye.cn:8022/LinsyFileService/uploadImageString';
let SSO_URL = 'http://113.105.237.98:9001/Login/toLogin';
let SSO_USER = 'servicecenterapp';
let SSO_PWD = '#@!qweQWE123';

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
            timeout: 60000
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
    static ssoRequest() {
        return newFetch(SSO_URL, {
            method: 'POST',
            headers: {
                // 'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body:  'username=' + SSO_USER+"&pwd="+SSO_PWD,
            timeout: 60000
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
            timeout: 60000,
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
    static getModel(sku) {
        return newFetch( DAE_URL + sku, {
            method: 'GET',
            timeout: 60000,
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
            'Operation=' + operation
            + "&SessionKey=" + App.token;

        return this.postRequest(method, param);
    }



    static login(phone,token) {
        let method = 'ServiceApp/login';
        let param = 'Phone=' + phone+ "&SessionKey=" + token;
        return this.postRequest(method, param);
    }

    static getData(type) {
        let method = 'ServiceApp/getData?OrderType=' + type + '&User=' + App.userName + '&Phone=' + App.phone   + "&SessionKey=" + App.token;
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
        let param = 'User=' + App.userName + '&' + 'WorkOrder=' + order + '&' + 'OrderType=' + type + '&' + "OrderStatus=" + status
            + "&SessionKey=" + App.token;
        return this.postRequest(method, param);
    }

    static roomDesc(order, sku, room) {
        let method = 'ServiceApp/roomDesc';
        let param = 'User=' + App.userName + '&' + 'WorkOrder=' + order + '&' + 'SkuCode=' + sku + '&' + "RoomDesc=" + room
            + "&SessionKey=" + App.token;
        return this.postRequest(method, param);
    }

    static uploadFile(order, sku, images) {
        let method = 'ServiceApp/uploadImageList';
        let param = 'User=' + App.userName + '&' + 'WorkOrder=' + order + '&' + 'SkuCode=' + sku + '&' + "ImageList=" + images
            + "&SessionKey=" + App.token;
        return this.postRequest(method, param);
    }

    static getProvider() {
        let method = 'ServiceGenerate/getProviderList?SessionKey=' + App.token;
        return this.getRequest(method);
    }

    static getModelNodes(model) {
        let method = 'ServiceApp/getModelNodes?ModelLink=' + model + "&SessionKey=" + App.token;
        return this.getRequest(method);
    }



    static uploadImage(str, name) {
        console.log(UPLOAD_URL);
        let param = JSON.stringify({
            file: str,
            name: name
        });
        //  'file=' + str + '&' + 'name=' + name;
        return newFetch(UPLOAD_URL, {
            method: 'POST',
            headers: {
                // 'Accept': 'application/x-www-form-urlencoded',
                'Content-Type': 'application/json',
            },
            body: param,
            timeout: 60000
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
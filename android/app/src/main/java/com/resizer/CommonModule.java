package com.resizer;

import android.app.AlertDialog;
import android.app.Dialog;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.Environment;
import android.widget.Toast;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.resizer.utils.BitmapUtil;
import com.resizer.utils.CommonUtil;


import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.util.HashMap;
import java.util.Map;

import javax.annotation.Nullable;

import cn.smssdk.EventHandler;
import cn.smssdk.SMSSDK;

/**
 * Created by Administrator on 2017/3/28.
 */

public class CommonModule extends ReactContextBaseJavaModule {
    /**
     * 百度地图包名
     */
    public static final String PACKAGE_NAME_BD_MAP = "com.baidu.BaiduMap";

    /**
     * 高德地图包名
     */
    public static final String PACKAGE_NAME_MINI_MAP = "com.autonavi.minimap";
    AlertDialog dialog;

    public CommonModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "CommonModule";
    }

    @Nullable
    @Override
    public Map<String, Object> getConstants() {
        Map<String, Object> constants = new HashMap<>();
        return constants;
    }
    @ReactMethod
    public void bindPushAccount(String account) {
        System.out.println("bind push:"+account);
        MainApplication.get(getReactApplicationContext()).initCloudAccount(account);
    }

    @ReactMethod
    public void unbindPushAccount() {
        System.out.println("unbind push");
        MainApplication.get(getReactApplicationContext()).unbindCloudAccount();
    }

    @ReactMethod
    public void getVersionName(Callback callback) {
        try {
            PackageManager packageManager = getCurrentActivity().getPackageManager();
            PackageInfo packageInfo = packageManager.getPackageInfo(getCurrentActivity().getPackageName(), 0);
            callback.invoke(packageInfo.versionName);
        } catch (Exception e) {
            e.printStackTrace();
            callback.invoke("获取错误");
        }
    }


    @ReactMethod
    public void sendCode(String country, String phone) {
        System.out.println(phone);
        SMSSDK.registerEventHandler(new EventHandler() {
            public void afterEvent(int event, int result, Object data) {
                codeResult(result, 0);//-1 success
                SMSSDK.unregisterAllEventHandler();
            }
        });
        SMSSDK.getVerificationCode(country, phone);
    }

    @ReactMethod
    public void submitCode(String country, String phone, String code) {
        System.out.println(phone + ":" + code);
        SMSSDK.registerEventHandler(new EventHandler() {
            public void afterEvent(int event, int result, Object data) {
                codeResult(result, 1);//-1 success
                SMSSDK.unregisterAllEventHandler();
            }
        });
        SMSSDK.submitVerificationCode(country, phone, code);
    }

    public void codeResult(int result, int type) {
        WritableMap params = Arguments.createMap();
        params.putInt("result", result);
        params.putInt("type", type);
        getReactApplicationContext().getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                .emit("codeResult", params);
    }

    @ReactMethod
    public void startNav(final double mLat, final double mLng, final double lat, final double lng) {

        String[] titleArray = {"百度地图", "高德地图"};
        final String[] packageArray = {PACKAGE_NAME_BD_MAP, PACKAGE_NAME_MINI_MAP};
        if (!CommonUtil.isAvailable(this.getCurrentActivity(), PACKAGE_NAME_BD_MAP)) {
            //  params.putString(PACKAGE_NAME_BD_MAP, "百度地图");
            packageArray[0] = "";
        }
        if (!CommonUtil.isAvailable(this.getCurrentActivity(), PACKAGE_NAME_MINI_MAP)) {
            //params.putString(PACKAGE_NAME_MINI_MAP, "高德地图");
            packageArray[1] = "";
        }
        AlertDialog.Builder builder = new AlertDialog.Builder(this.getCurrentActivity());
        builder.setTitle("选择地图");
        builder.setItems(titleArray, new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialogInterface, int i) {
                openNavMap(packageArray[i], mLat, mLng, lat, lng);
                if(dialog.isShowing())
                    dialog.dismiss();
            }
        });
        builder.setCancelable(true);
        dialog = builder.create();
        dialog.show();
    }


    public void openNavMap(String pkgName, double originLat, double originLng, double destLat, double destLng) {
        if (pkgName == null || pkgName.equals("")) {
            Toast.makeText(getCurrentActivity(),"没有安装该地图",Toast.LENGTH_LONG).show();
            // http://lbsyun.baidu.com/index.php?title=uri/api/web
            String url = "http://api.map.baidu.com/direction?origin=%s,%s&destination=%s,%s&region=%s&mode=driving&output=html&src=%s";
            Intent intent = new Intent();
            intent.setAction("android.intent.action.VIEW");
            Uri contentUrl = Uri.parse(String.format(url, originLat, originLng, destLat, destLng, this.getName(),
                    this.getName()));
            intent.setData(contentUrl);
            this.getCurrentActivity().startActivity(intent);
            return;
        }


        String tmpName = pkgName.trim();
        if (tmpName.equals(PACKAGE_NAME_BD_MAP)) {
            Intent i1 = new Intent();
            // 驾车导航
            i1.setData(Uri.parse(String.format("baidumap://map/navi?location=%s,%s", destLat, destLng)));
            this.getCurrentActivity().startActivity(i1);
        } else if (tmpName.equals(PACKAGE_NAME_MINI_MAP)) {
            // http://lbs.amap.com/api/amap-mobile/guide/android/navigation
            StringBuffer scheme = new StringBuffer("androidamap://navi?sourceApplication=").append(this.getName());

            // dev 必填 是否偏移(0:lat 和 lon 是已经加密后的,不需要国测加密; 1:需要国测加密)
            // style 必填 导航方式(0 速度快; 1 费用少; 2 路程短; 3 不走高速；4 躲避拥堵；5
            // 不走高速且避免收费；6 不走高速且躲避拥堵；7 躲避收费和拥堵；8 不走高速躲避收费和拥堵))
            scheme.append("&lat=").append(destLat).append("&lon=").append(destLng).append("&dev=").append(0)
                    .append("&style=").append(0);

            Intent intent = new Intent("android.intent.action.VIEW", Uri.parse(scheme.toString()));
            intent.setPackage("com.autonavi.minimap");
            this.getCurrentActivity().startActivity(intent);
        }

    }

    @ReactMethod
    public void getImageBase64(String path, Callback callback) {
        callback.invoke(BitmapUtil.bitmapToString(path, 30));
    }


    private void putImgToStorage(String path, String title) throws Exception {
        byte[] buffer = new byte[512];
        int numberRead;
        File outputFile = new File(path);
        FileOutputStream os = new FileOutputStream(outputFile);
        InputStream is = getCurrentActivity().getResources().getAssets().open(title);
        while ((numberRead = is.read(buffer)) != -1) {
            os.write(buffer, 0, numberRead);
        }
        os.close();
        is.close();
    }

    private void createDir() {
        File dPath = new File(Environment.getExternalStorageDirectory(), Const.DOWNLOAD_FILE_PATH);
        File iPath = new File(Environment.getExternalStorageDirectory(), Const.DOWNLOAD_IMG_PATH);
        File sPath = new File(Environment.getExternalStorageDirectory(), Const.IMAGE_SOURCE_PATH);
        if (!dPath.exists()) {
            dPath.mkdirs();
        }
        if (!iPath.exists()) {
            iPath.mkdirs();
        }
        if (!sPath.exists()) {
            sPath.mkdirs();
        }
    }


    @ReactMethod
    public void openOfficeFile(String path) {
        Uri uri = Uri.fromFile(new File(path));
        String extension = android.webkit.MimeTypeMap.getFileExtensionFromUrl(uri.toString());
        String mimetype = android.webkit.MimeTypeMap.getSingleton().getMimeTypeFromExtension(extension);
        Intent intent = new Intent("android.intent.action.VIEW");
        intent.addCategory("android.intent.category.DEFAULT");
        intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK);
        if (extension.equalsIgnoreCase("") || mimetype == null) {
            intent.setDataAndType(uri, "text/*");
        } else {
            intent.setDataAndType(uri, mimetype);
        }
        getCurrentActivity().startActivity(Intent.createChooser(intent, "打开方式"));
    }

    @ReactMethod
    public void shereFile(String path) {
        Uri uri = Uri.fromFile(new File(path));
        Intent share = new Intent(Intent.ACTION_SEND);
        share.putExtra(Intent.EXTRA_STREAM, uri);
        share.setType("*/*");
        getCurrentActivity().startActivity(Intent.createChooser(share, path));
    }


    //demo
    @ReactMethod
    public void show() {
        Toast.makeText(getCurrentActivity(), "test", Toast.LENGTH_SHORT).show();
    }
}

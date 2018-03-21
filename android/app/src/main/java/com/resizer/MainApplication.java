package com.resizer;

import android.app.Application;
import android.content.Context;
import android.util.Log;

import com.alibaba.sdk.android.push.CloudPushService;
import com.alibaba.sdk.android.push.CommonCallback;
import com.alibaba.sdk.android.push.noonesdk.PushServiceFactory;
import com.facebook.react.ReactApplication;
import com.lwansbrough.RCTCamera.RCTCameraPackage;
import com.microsoft.codepush.react.CodePush;

import org.lovebing.reactnative.baidumap.BaiduMapPackage;

import com.imagepicker.ImagePickerPackage;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;
import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;

import java.util.Arrays;
import java.util.List;

public class MainApplication extends Application implements ReactApplication {
    private static final ReactModulePackage reactModulePackage = new ReactModulePackage();
    private String TAG = getClass().getName();
    private CloudPushService pushService;
    public static MainApplication get(Context context) {
        return (MainApplication) context.getApplicationContext();
    }

    private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {

        @Override
        protected String getJSBundleFile() {
            return CodePush.getJSBundleFile();
        }

        @Override
        public boolean getUseDeveloperSupport() {
            return BuildConfig.DEBUG;
        }

        @Override
        protected List<ReactPackage> getPackages() {
            return Arrays.<ReactPackage>asList(
                    new MainReactPackage(),
                    new RCTCameraPackage(),
                    new CodePush(null, getApplicationContext(), BuildConfig.DEBUG),
                    new BaiduMapPackage(getApplicationContext()),
                    new ImagePickerPackage(),
                    new RNGestureHandlerPackage(),
                    reactModulePackage
            );
        }

        @Override
        protected String getJSMainModuleName() {
            return "index";
        }
    };

    public static ReactModulePackage getReactPackage() {
        return reactModulePackage;
    }

    @Override
    public ReactNativeHost getReactNativeHost() {
        return mReactNativeHost;
    }

    @Override
    public void onCreate() {
        super.onCreate();
        SoLoader.init(this, /* native exopackage */ false);
        initCloudChannel(this);

    }

    /**
     * 初始化云推送通道
     *
     * @param applicationContext
     */
    private void initCloudChannel(Context applicationContext) {
        PushServiceFactory.init(applicationContext);
        pushService = PushServiceFactory.getCloudPushService();
        pushService.register(applicationContext, new CommonCallback() {
            @Override
            public void onSuccess(String response) {
                Log.d(TAG, "init cloudchannel success");
            }

            @Override
            public void onFailed(String errorCode, String errorMessage) {
                Log.d(TAG, "init cloudchannel failed -- errorcode:" + errorCode + " -- errorMessage:" + errorMessage);
            }
        });
    }

    public void initCloudAccount(String platform) {
        if (pushService != null) {
            pushService.bindAccount(platform, new CommonCallback() {
                @Override
                public void onSuccess(String s) {
                    Log.d(TAG, "bindAccount success：" + s);
                }

                @Override
                public void onFailed(String s, String s1) {
                    Log.d(TAG, "bindAccount onFailed" + s + s1);
                }
            });
        }
    }

    public void unbindCloudAccount() {
        if (pushService != null) {
            pushService.unbindAccount(new CommonCallback() {
                @Override
                public void onSuccess(String s) {
                    Log.d(TAG, "onSuccess: unbind");
                }

                @Override
                public void onFailed(String s, String s1) {
                    Log.d(TAG, "onFailed: unbind");
                }
            });
        }
    }
}

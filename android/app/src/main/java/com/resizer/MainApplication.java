package com.resizer;

import android.app.Application;

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
    }
}

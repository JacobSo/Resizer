//
//  ReactCommonModule.m
//  Resizer
//
//  Created by ls on 2018/3/5.
//  Copyright © 2018年 Facebook. All rights reserved.
//
#import "ReactCommonModule.h"
#import "AppDelegate.h"
#import <SMS_SDK/SMSSDK.h>
#import <Foundation/Foundation.h>
#import <MapKit/MapKit.h>
#import <UIKit/UIAlertController.h>

@implementation ReactCommonModule
RCT_EXPORT_MODULE();
RCT_EXPORT_METHOD(getVersionName:(RCTResponseSenderBlock)callback)
{
  NSString *appCurVersion = [[[NSBundle mainBundle] infoDictionary] objectForKey:@"CFBundleShortVersionString"];
  
  NSLog(@"当前应用软件版本:%@",appCurVersion);
  callback(@[appCurVersion]);
}

RCT_EXPORT_METHOD(sendCode:(NSString *)phone:(RCTResponseSenderBlock)callback)
{
  [SMSSDK getVerificationCodeByMethod:SMSGetCodeMethodSMS phoneNumber:phone zone:@"86" template:@"" result:^(NSError *error) {
    
    if (!error){
   callback(@[@"发送成功"]);
    }
    else{
      callback(@[@"发送验证码失败"]);
    }
  }];
}
   

RCT_EXPORT_METHOD(submitCode:(NSString *)phone:(NSString *)code:(RCTResponseSenderBlock)callback)
{
  [SMSSDK commitVerificationCode:code phoneNumber:phone zone:@"86" result:^(NSError *error) {
    
    if (!error)
    {
      callback(@[@"-1"]);
    }
    else
    {
      callback(@[@"0"]);
    }
  }];
  
}
   
   
//导航只需要目的地经纬度，endLocation为纬度、经度的数组
RCT_EXPORT_METHOD(doNavigationWithEndLocation:(NSString *)lat:(NSString *)lng)
{
  
  //NSArray * endLocation = [NSArray arrayWithObjects:@"26.08",@"119.28", nil];
  
  NSMutableArray *maps = [NSMutableArray array];
  
  //苹果原生地图-苹果原生地图方法和其他不一样
  NSMutableDictionary *iosMapDic = [NSMutableDictionary dictionary];
  iosMapDic[@"title"] = @"苹果地图";
  [maps addObject:iosMapDic];
  
  
  //百度地图
  if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"baidumap://"]]) {
    NSMutableDictionary *baiduMapDic = [NSMutableDictionary dictionary];
    baiduMapDic[@"title"] = @"百度地图";
    NSString *urlString = [[NSString stringWithFormat:@"baidumap://map/direction?origin={{我的位置}}&destination=latlng:%@,%@|name=北京&mode=driving&coord_type=gcj02",lat,lng] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    baiduMapDic[@"url"] = urlString;
    [maps addObject:baiduMapDic];
  }
  
  //高德地图
  if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"iosamap://"]]) {
    NSMutableDictionary *gaodeMapDic = [NSMutableDictionary dictionary];
    gaodeMapDic[@"title"] = @"高德地图";
    NSString *urlString = [[NSString stringWithFormat:@"iosamap://navi?sourceApplication=%@&backScheme=%@&lat=%@&lon=%@&dev=0&style=2",@"导航功能",@"nav123456",lat,lng] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    gaodeMapDic[@"url"] = urlString;
    [maps addObject:gaodeMapDic];
  }
  

  //腾讯地图
  if ([[UIApplication sharedApplication] canOpenURL:[NSURL URLWithString:@"qqmap://"]]) {
    NSMutableDictionary *qqMapDic = [NSMutableDictionary dictionary];
    qqMapDic[@"title"] = @"腾讯地图";
    NSString *urlString = [[NSString stringWithFormat:@"qqmap://map/routeplan?from=我的位置&type=drive&tocoord=%@,%@&to=终点&coord_type=1&policy=0",lat,lng] stringByAddingPercentEscapesUsingEncoding:NSUTF8StringEncoding];
    qqMapDic[@"url"] = urlString;
    [maps addObject:qqMapDic];
  }
  
  
  //选择
  UIAlertController * alert = [UIAlertController alertControllerWithTitle:@"选择地图" message:nil preferredStyle:UIAlertControllerStyleActionSheet];
  
  NSInteger index = maps.count;
  
  for (int i = 0; i < index; i++) {
    
    NSString * title = maps[i][@"title"];
    
    //苹果原生地图方法
    if (i == 0) {
      
      UIAlertAction * action = [UIAlertAction actionWithTitle:title style:(UIAlertActionStyleDefault) handler:^(UIAlertAction * _Nonnull action) {
        [self navAppleMap];
      }];
      [alert addAction:action];
      
      continue;
    }
    
    
    UIAlertAction * action = [UIAlertAction actionWithTitle:title style:UIAlertActionStyleDefault handler:^(UIAlertAction * _Nonnull action) {
      
      NSString *urlString = maps[i][@"url"];
      [[UIApplication sharedApplication] openURL:[NSURL URLWithString:urlString]];//开始调取
    }];
    
    [alert addAction:action];
    
  }
  UIViewController *root = RCTPresentedViewController();
  alert.popoverPresentationController.sourceView = root.view;
  alert.popoverPresentationController.sourceRect = CGRectMake(root.view.bounds.size.width / 2.0, root.view.bounds.size.height, 1.0, 1.0);
 //[(UIWebView*)self presentViewController:alert animated:YES completion:nil];
 [root presentViewController:alert animated:YES completion:nil];
  
}





//苹果地图
- (void)navAppleMap
{
  //    CLLocationCoordinate2D gps = [JZLocationConverter bd09ToWgs84:self.destinationCoordinate2D];
  
  //终点坐标
  CLLocationCoordinate2D loc = CLLocationCoordinate2DMake(26.08, 119.28);
  
  
  //用户位置
  MKMapItem *currentLoc = [MKMapItem mapItemForCurrentLocation];
  //终点位置
  MKMapItem *toLocation = [[MKMapItem alloc]initWithPlacemark:[[MKPlacemark alloc]initWithCoordinate:loc addressDictionary:nil] ];
  
  
  NSArray *items = @[currentLoc,toLocation];
  //第一个
  NSDictionary *dic = @{
                        MKLaunchOptionsDirectionsModeKey : MKLaunchOptionsDirectionsModeDriving,
                        MKLaunchOptionsMapTypeKey : @(MKMapTypeStandard),
                        MKLaunchOptionsShowsTrafficKey : @(YES)
                        };
  //第二个，都可以用
  //    NSDictionary * dic = @{MKLaunchOptionsDirectionsModeKey: MKLaunchOptionsDirectionsModeDriving,
  //                           MKLaunchOptionsShowsTrafficKey: [NSNumber numberWithBool:YES]};
  
  [MKMapItem openMapsWithItems:items launchOptions:dic];
  
  
  
}









   
@end

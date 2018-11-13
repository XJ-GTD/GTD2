/********* BaiduSpeechAndTTS.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import "BDSWakeupDefines.h"
#import "BDSWakeupParameters.h"
#import "BDSEventManager.h"

#define STR_EVENT @"event"
#define STR_MESSAGE @"message"
#define STR_RESULTS @"results"

@interface XjBaiduWakeUp : CDVPlugin <BDSClientWakeupDelegate>{
  // Member variables go here.
}

@property (nonatomic, strong) NSString* callbackId;
@property (strong, nonatomic) BDSEventManager *wakeupEventManager;

- (void)start:(CDVInvokedUrlCommand*)command;

- (void)stop:(CDVInvokedUrlCommand*)command;

- (void)release:(CDVInvokedUrlCommand*)command;

@end



@implementation XjBaiduWakeUp

NSString* APP_ID_2 = @"14502702";
//NSString* API_KEY_2 = @"6YvlNRGZ5I4CkA715XnVyoSm";
//NSString* SECRET_KEY_2 = @"9oHZPMLgc0BM9a4m3DhpHUhGSqYvsrAF";

#pragma mark Initialization functions

- (void) pluginInitialize {
    [self configWakeup];
}

- (void)configWakeup {

    [self.wakeupEventManager setParameter:APP_ID_2 forKey:BDS_WAKEUP_APP_CODE];
    [self.wakeupEventManager setParameter:nil forKey:BDS_WAKEUP_AUDIO_FILE_PATH];
    [self.wakeupEventManager setParameter:nil forKey:BDS_WAKEUP_AUDIO_INPUT_STREAM];

     NSString* dat = [[NSBundle mainBundle] pathForResource:@"bds_easr_basic_model" ofType:@"dat"];

    // 默认的唤醒词为"百度一下"，如需自定义唤醒词，请在 http://ai.baidu.com/tech/speech/wake 中评估并下载唤醒词，替换此参数
    NSString* words = [[NSBundle mainBundle] pathForResource:@"WakeUp" ofType:@"bin"];
    [self.wakeupEventManager setParameter:dat forKey:BDS_WAKEUP_DAT_FILE_PATH];
    [self.wakeupEventManager setParameter:words forKey:BDS_WAKEUP_WORDS_FILE_PATH];

    [self.wakeupEventManager setDelegate:self];

}

- (void)start:(CDVInvokedUrlCommand*)command
{
    self.callbackId = command.callbackId;
    [self.wakeupEventManager sendCommand:BDS_WP_CMD_LOAD_ENGINE];
    [self.wakeupEventManager sendCommand:BDS_WP_CMD_START];
}

- (void)stop:(CDVInvokedUrlCommand*)command
{
    self.callbackId = command.callbackId;
    [self.wakeupEventManager sendCommand:BDS_WP_CMD_STOP];
    [self.wakeupEventManager sendCommand:BDS_WP_CMD_UNLOAD_ENGINE];
}

- (void)release:(CDVInvokedUrlCommand*)command
{
    self.callbackId = command.callbackId;
    [self.wakeupEventManager sendCommand:BDS_WP_CMD_STOP];
    [self.wakeupEventManager sendCommand:BDS_WP_CMD_UNLOAD_ENGINE];
}

- (void)WakeupClientWorkStatus:(int)workStatus obj:(id)aObj
{
    switch (workStatus) {
        case EWakeupEngineWorkStatusStarted: {
             NSLog(@"Did EWakeupEngineWorkStatusStarted");
            break;
        }
        case EWakeupEngineWorkStatusStopped: {
             NSLog(@"Did EWakeupEngineWorkStatusStopped");
            break;
        }
        case EWakeupEngineWorkStatusLoaded: {
             NSLog(@"Did EWakeupEngineWorkStatusLoaded");
            break;
        }
        case EWakeupEngineWorkStatusUnLoaded: {
             NSLog(@"Did EWakeupEngineWorkStatusUnLoaded");
            break;
        }
        case EWakeupEngineWorkStatusTriggered: {
             NSLog(@"Did EWakeupEngineWorkStatusTriggered");
             if (self.callbackId) {
                CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:(NSString *)aObj];
                [result setKeepCallbackAsBool:YES];
                [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
             }
            break;
        }
        case EWakeupEngineWorkStatusError: {
             NSLog(@"Did EWakeupEngineWorkStatusError");
             if (self.callbackId) {
                   CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                   [result setKeepCallbackAsBool:YES];
                   [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
             }
            break;
        }

        default:
            break;
    }
}

@end

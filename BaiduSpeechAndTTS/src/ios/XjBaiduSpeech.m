/********* BaiduSpeechAndTTS.m Cordova Plugin Implementation *******/

#import <Cordova/CDV.h>
#import "BDSEventManager.h"
#import "BDSASRDefines.h"
#import "BDSASRParameters.h"

@interface XjBaiduSpeech : CDVPlugin<BDSClientASRDelegate> {
  // Member variables go here.
}

@property (nonatomic, strong) NSString* callbackId;
@property (strong, nonatomic) BDSEventManager *asrEventManager;
@property(nonatomic, strong) NSFileHandle *fileHandler;

- (void)start:(CDVInvokedUrlCommand*)command;

- (void)stop:(CDVInvokedUrlCommand*)command;

- (void)cancel:(CDVInvokedUrlCommand*)command;

- (void)release:(CDVInvokedUrlCommand*)command;

@end

@implementation XjBaiduSpeech

- (void) pluginInitialize {
    self.asrEventManager = [BDSEventManager createEventManagerWithName:BDS_ASR_NAME];
    [self configVoiceRecognitionClient];
}



- (void)start:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)stop:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)cancel:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

- (void)release:(CDVInvokedUrlCommand*)command
{
    CDVPluginResult* pluginResult = nil;
    NSString* echo = [command.arguments objectAtIndex:0];

    if (echo != nil && [echo length] > 0) {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:echo];
    } else {
        pluginResult = [CDVPluginResult resultWithStatus:CDVCommandStatus_ERROR];
    }

    [self.commandDelegate sendPluginResult:pluginResult callbackId:command.callbackId];
}

#pragma mark - Private: Configuration
- (void)configVoiceRecognitionClient {
    //设置DEBUG_LOG的级别
    [self.asrEventManager setParameter:@(EVRDebugLogLevelTrace) forKey:BDS_ASR_DEBUG_LOG_LEVEL];
    //配置API_KEY 和 SECRET_KEY 和 APP_ID
    [self.asrEventManager setParameter:@[API_KEY, SECRET_KEY] forKey:BDS_ASR_API_SECRET_KEYS];
    [self.asrEventManager setParameter:APP_ID forKey:BDS_ASR_OFFLINE_APP_CODE];
    //配置端点检测（二选一）
    [self configModelVAD];
//      [self configDNNMFE];

    //     [self.asrEventManager setParameter:@"15361" forKey:BDS_ASR_PRODUCT_ID];
    // ---- 语义与标点 -----
    [self enableNLU];
    //    [self enablePunctuation];
    // ------------------------

    //离线配置
   [self configOfflineClient];

   //开启声音
    [self.asrEventManager setParameter:@(EVRPlayToneAll) forKey:BDS_ASR_PLAY_TONE];

}


- (void) enableNLU {
    // ---- 开启语义理解 -----
    [self.asrEventManager setParameter:@(YES) forKey:BDS_ASR_ENABLE_NLU];
    [self.asrEventManager setParameter:@"15372" forKey:BDS_ASR_PRODUCT_ID];
}

- (void) enablePunctuation {
    // ---- 开启标点输出 -----
    [self.asrEventManager setParameter:@(NO) forKey:BDS_ASR_DISABLE_PUNCTUATION];
    // 普通话标点
    //    [self.asrEventManager setParameter:@"1537" forKey:BDS_ASR_PRODUCT_ID];
    // 英文标点
    [self.asrEventManager setParameter:@"1737" forKey:BDS_ASR_PRODUCT_ID];

}


- (void)configModelVAD {
    NSString *modelVAD_filepath = [[NSBundle mainBundle] pathForResource:@"bds_easr_basic_model" ofType:@"dat"];
    [self.asrEventManager setParameter:modelVAD_filepath forKey:BDS_ASR_MODEL_VAD_DAT_FILE];
    [self.asrEventManager setParameter:@(YES) forKey:BDS_ASR_ENABLE_MODEL_VAD];
}

- (void)configDNNMFE {
    NSString *mfe_dnn_filepath = [[NSBundle mainBundle] pathForResource:@"bds_easr_mfe_dnn" ofType:@"dat"];
    [self.asrEventManager setParameter:mfe_dnn_filepath forKey:BDS_ASR_MFE_DNN_DAT_FILE];
    NSString *cmvn_dnn_filepath = [[NSBundle mainBundle] pathForResource:@"bds_easr_mfe_cmvn" ofType:@"dat"];
    [self.asrEventManager setParameter:cmvn_dnn_filepath forKey:BDS_ASR_MFE_CMVN_DAT_FILE];

    [self.asrEventManager setParameter:@(NO) forKey:BDS_ASR_ENABLE_MODEL_VAD];
    // MFE支持自定义静音时长
//    [self.asrEventManager setParameter:@(500.f) forKey:BDS_ASR_MFE_MAX_SPEECH_PAUSE];
//    [self.asrEventManager setParameter:@(500.f) forKey:BDS_ASR_MFE_MAX_WAIT_DURATION];
}

- (void)configOfflineClient {

    // 离线仅可识别自定义语法规则下的词
    [self.asrEventManager setParameter:@(EVR_STRATEGY_BOTH) forKey:BDS_ASR_STRATEGY];
    NSString* gramm_filepath = [[NSBundle mainBundle] pathForResource:@"bds_easr_gramm" ofType:@"dat"];
    NSString* lm_filepath = [[NSBundle mainBundle] pathForResource:@"bds_easr_basic_model" ofType:@"dat"];
    [self.asrEventManager setDelegate:self];
    [self.asrEventManager setParameter:APP_ID forKey:BDS_ASR_OFFLINE_APP_CODE];
    [self.asrEventManager setParameter:lm_filepath forKey:BDS_ASR_OFFLINE_ENGINE_DAT_FILE_PATH];
    // 请在 (官网)[http://speech.baidu.com/asr] 参考模板定义语法，下载语法文件后，替换BDS_ASR_OFFLINE_ENGINE_GRAMMER_FILE_PATH参数
    [self.asrEventManager setParameter:gramm_filepath forKey:BDS_ASR_OFFLINE_ENGINE_GRAMMER_FILE_PATH];
}


#pragma mark - MVoiceRecognitionClientDelegate

- (void)VoiceRecognitionClientWorkStatus:(int)workStatus obj:(id)aObj {
    switch (workStatus) {
        case EVoiceRecognitionClientWorkStatusNewRecordData: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusNewRecordData");
            [self.fileHandler writeData:(NSData *)aObj];
            break;
        }

        case EVoiceRecognitionClientWorkStatusStartWorkIng: {

            NSLog(@"Did EVoiceRecognitionClientWorkStatusStartWorkIng");
            break;
        }
        case EVoiceRecognitionClientWorkStatusStart: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusStart");
            break;
        }
        case EVoiceRecognitionClientWorkStatusEnd: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusEnd");
            break;
        }
        case EVoiceRecognitionClientWorkStatusFlushData: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusFlushData");
            break;
        }
        case EVoiceRecognitionClientWorkStatusFinish: {
            if (aObj) {
             if (self.callbackId) {
                CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK messageAsString:[self getDescriptionForDic:aObj]];
                [result setKeepCallbackAsBool:YES];
                [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];

                   CDVPluginResult* result = [CDVPluginResult resultWithStatus:CDVCommandStatus_OK];
                   [result setKeepCallbackAsBool:YES];
                   [self.commandDelegate sendPluginResult:result callbackId:self.callbackId];
               }
            }
            break;
        }
        case EVoiceRecognitionClientWorkStatusMeterLevel: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusMeterLevel");
            break;
        }
        case EVoiceRecognitionClientWorkStatusCancel: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusCancel");
            break;
        }
        case EVoiceRecognitionClientWorkStatusError: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusError");
            break;
        }
        case EVoiceRecognitionClientWorkStatusLoaded: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusLoaded");
            break;
        }
        case EVoiceRecognitionClientWorkStatusUnLoaded: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusUnLoaded");
            break;
        }
        case EVoiceRecognitionClientWorkStatusChunkThirdData: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusChunkThirdData");
            break;
        }
        case EVoiceRecognitionClientWorkStatusChunkNlu: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusChunkNlu");
            break;
        }
        case EVoiceRecognitionClientWorkStatusChunkEnd: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusChunkEnd");
            break;
        }
        case EVoiceRecognitionClientWorkStatusFeedback: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusFeedback");
            break;
        }
        case EVoiceRecognitionClientWorkStatusRecorderEnd: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusRecorderEnd");
            break;
        }
        case EVoiceRecognitionClientWorkStatusLongSpeechEnd: {
            NSLog(@"Did EVoiceRecognitionClientWorkStatusLongSpeechEnd");
            break;
        }
        default:
            break;
    }
}


- (void)configFileHandler {
    self.fileHandler = [self createFileHandleWithName:@"iat.pcm" isAppend:NO];
}

- (NSFileHandle *)createFileHandleWithName:(NSString *)aFileName isAppend:(BOOL)isAppend {
    NSFileHandle *fileHandle = nil;
    NSString *fileName = [self getFilePath:aFileName];

    int fd = -1;
    if (fileName) {
        if ([[NSFileManager defaultManager] fileExistsAtPath:fileName]&& !isAppend) {
            [[NSFileManager defaultManager] removeItemAtPath:fileName error:nil];
        }

        int flags = O_WRONLY | O_APPEND | O_CREAT;
        fd = open([fileName fileSystemRepresentation], flags, 0644);
    }

    if (fd != -1) {
        fileHandle = [[NSFileHandle alloc] initWithFileDescriptor:fd closeOnDealloc:YES];
    }

    return fileHandle;
}

#pragma mark - Private: File
- (NSString *)getFilePath:(NSString *)fileName {
    NSArray *paths = NSSearchPathForDirectoriesInDomains(NSDocumentDirectory, NSUserDomainMask, YES);
    if (paths && [paths count]) {
        return [[paths objectAtIndex:0] stringByAppendingPathComponent:fileName];
    } else {
        return nil;
    }
}

- (NSString *)getDescriptionForDic:(NSDictionary *)dic {
    if (dic) {
        return [[NSString alloc] initWithData:[NSJSONSerialization dataWithJSONObject:dic
                                                                              options:NSJSONWritingPrettyPrinted
                                                                                error:nil] encoding:NSUTF8StringEncoding];
    }
    return nil;
}
@end

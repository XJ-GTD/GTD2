package com.baidu.tts;

import android.content.Context;
import android.media.AudioManager;
import android.os.Handler;
import android.os.Message;
import android.util.Log;
import com.baidu.tts.auth.AuthInfo;
import com.baidu.tts.chainofresponsibility.logger.LoggerProxy;
import com.baidu.tts.client.SpeechSynthesizer;
import com.baidu.tts.client.SpeechSynthesizerListener;
import com.baidu.tts.client.TtsMode;
import com.baidu.tts.sample.control.InitConfig;
import com.baidu.tts.sample.control.MySyntherizer;
import com.baidu.tts.sample.control.NonBlockSyntherizer;
import com.baidu.tts.sample.listener.MessageListener;
import com.baidu.tts.sample.util.AutoCheck;
import com.baidu.tts.sample.util.OfflineResource;

import java.io.File;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

/**
 * 除了SDK，该类没有任何依赖，可以直接复制进你的项目
 * <p>
 * 默认TEMP_DIR = "/sdcard/baiduTTS"; // 重要！请手动将assets目录下的3个dat 文件复制到该目录
 * 确保 TEXT_FILENAME 和 MODEL_FILENAME 存在
 * Created by fujiayi on 2017/9/14.
 */

public class MyTts {

    // ================== 初始化参数设置开始 ==========================
    /**
     * 发布时请替换成自己申请的appId appKey 和 secretKey。注意如果需要离线合成功能,请在您申请的应用中填写包名。
     * 本demo的包名是com.baidu.tts.sample，定义在build.gradle中。
     */
    protected String appId = "14502702";

    protected String appKey = "6YvlNRGZ5I4CkA715XnVyoSm";

    protected String secretKey = "9oHZPMLgc0BM9a4m3DhpHUhGSqYvsrAF";

    // TtsMode.MIX; 离在线融合，在线优先； TtsMode.ONLINE 纯在线； 没有纯离线
    private TtsMode ttsMode = TtsMode.ONLINE;

    protected MySyntherizer mSpeechSynthesizer;

    private Context context;

    protected String offlineVoice = OfflineResource.VOICE_FEMALE;



    private static final String TAG = "MyTts";

    public MyTts(Context context, MessageListener messageListener,String appId,String appKey,String secretKey){
//         this.appId = appId;
//        this.appKey = appKey;
//        this.secretKey = secretKey;

        initTTs(context,messageListener);
    }

    /**
     * 注意此处为了说明流程，故意在UI线程中调用。
     * 实际集成中，该方法一定在新线程中调用，并且该线程不能结束。具体可以参考NonBlockSyntherizer的写法
     */
    private void initTTs(Context context, MessageListener messageListener) {
        LoggerProxy.printable(true); // 日志打印在logcat中
        this.context = context;

        // 日志更新在UI中，可以换成MessageListener，在logcat中查看日志
        SpeechSynthesizerListener listener = messageListener;

        // appId appKey secretKey 网站上您申请的应用获取。注意使用离线合成功能的话，需要应用中填写您app的包名。包名在build.gradle中获取。
        InitConfig initConfig = new InitConfig(appId, appKey, secretKey, ttsMode, getParams(), listener);


        // 1. 获取实例
       // mSpeechSynthesizer =  new NonBlockSyntherizer(context, initConfig, null);
        mSpeechSynthesizer =  new MySyntherizer(context, initConfig, null);



    }

    public void setListener(SpeechSynthesizerListener listener){
        mSpeechSynthesizer.setListener(listener);
    }



    public void speak(String Text) {

        new Thread(new Runnable(){
            @Override
            public void run() {
        if (mSpeechSynthesizer == null) {
            print("[ERROR], 初始化失败");
            return;
        }
        int result = mSpeechSynthesizer.speak(Text);

        print("合成并播放");
        checkResult(result, "speak");
    }
        }).start();

    }

    public void stop() {
        print("停止合成引擎");
        int result = mSpeechSynthesizer.stop();
        checkResult(result, "stop");
    }


    private void print(String message) {
        Log.i(TAG, message);
    }

    protected void onDestroy() {
        if (mSpeechSynthesizer != null) {
            mSpeechSynthesizer.stop();
            mSpeechSynthesizer.release();
            mSpeechSynthesizer = null;
            print("释放资源成功");
        }
    }

    private void checkResult(int result, String method) {
        if (result != 0) {
            print("error code :" + result + " method:" + method + ", 错误码文档:http://yuyin.baidu.com/docs/tts/122 ");
        }
    }

    /**
     * 合成的参数，可以初始化时填写，也可以在合成前设置。
     *
     * @return
     */
    protected Map<String, String> getParams() {
        Map<String, String> params = new HashMap<String, String>();
        // 以下参数均为选填
        // 设置在线发声音人： 0 普通女声（默认） 1 普通男声 2 特别男声 3 情感男声<度逍遥> 4 情感儿童声<度丫丫>
        params.put(SpeechSynthesizer.PARAM_SPEAKER, "0");
        // 设置合成的音量，0-9 ，默认 5
        params.put(SpeechSynthesizer.PARAM_VOLUME, "4");
        // 设置合成的语速，0-9 ，默认 5
        params.put(SpeechSynthesizer.PARAM_SPEED, "6");
        // 设置合成的语调，0-9 ，默认 5
        params.put(SpeechSynthesizer.PARAM_PITCH, "5");

        params.put(SpeechSynthesizer.PARAM_MIX_MODE, SpeechSynthesizer.MIX_MODE_HIGH_SPEED_SYNTHESIZE);
        // 该参数设置为TtsMode.MIX生效。即纯在线模式不生效。
        // MIX_MODE_DEFAULT 默认 ，wifi状态下使用在线，非wifi离线。在线状态下，请求超时6s自动转离线
        // MIX_MODE_HIGH_SPEED_SYNTHESIZE_WIFI wifi状态下使用在线，非wifi离线。在线状态下， 请求超时1.2s自动转离线
        // MIX_MODE_HIGH_SPEED_NETWORK ， 3G 4G wifi状态下使用在线，其它状态离线。在线状态下，请求超时1.2s自动转离线
        // MIX_MODE_HIGH_SPEED_SYNTHESIZE, 2G 3G 4G wifi状态下使用在线，其它状态离线。在线状态下，请求超时1.2s自动转离线

        // 离线资源文件， 从assets目录中复制到临时目录，需要在initTTs方法前完成
//        OfflineResource offlineResource = createOfflineResource(offlineVoice);
        // 声学模型文件路径 (离线引擎使用), 请确认下面两个文件存在
//        params.put(SpeechSynthesizer.PARAM_TTS_TEXT_MODEL_FILE, offlineResource.getTextFilename());
//        params.put(SpeechSynthesizer.PARAM_TTS_SPEECH_MODEL_FILE,
//                offlineResource.getModelFilename());
        return params;
    }

    protected OfflineResource createOfflineResource(String voiceType) {
        OfflineResource offlineResource = null;
        try {
            offlineResource = new OfflineResource(context, voiceType);
        } catch (IOException e) {
            // IO 错误自行处理
            e.printStackTrace();
            print("【error】:copy files from assets failed." + e.getMessage());
        }
        return offlineResource;
    }

}

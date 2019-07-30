package com.baidu.aip.asrwakeup3.core.recog;

import android.content.Context;
import cn.sh.com.xj.timeApp.R;
import com.baidu.aip.asrwakeup3.core.util.FileUtil;
import com.baidu.aip.asrwakeup3.core.util.MyLogger;
import com.baidu.speech.EventListener;
import com.baidu.speech.EventManager;
import com.baidu.speech.EventManagerFactory;
import com.baidu.speech.asr.SpeechConstant;
import org.json.JSONObject;
import com.baidu.aip.asrwakeup3.core.recog.listener.IRecogListener;
import com.baidu.aip.asrwakeup3.core.recog.listener.RecogEventAdapter;
import android.os.Environment;

import java.util.LinkedHashMap;
import java.util.Map;

/**
 * Created by fujiayi on 2017/6/13.
 * EventManager内的方法如send 都可以在主线程中进行，SDK中做过处理
 */

public class MyRecognizer {
    /**
     * SDK 内部核心 EventManager 类
     */
    private EventManager asr;

    // SDK 内部核心 事件回调类， 用于开发者写自己的识别回调逻辑
    private EventListener eventListener;

    // 是否加载离线资源
    private static boolean isOfflineEngineLoaded = false;

    // 未release前，只能new一个
    private static volatile boolean isInited = false;

    private static final String TAG = "MyRecognizer";

    //打开关闭音效
    private boolean isTs = true;

    private String samplePath;

    private Context context;

    /**
     * 初始化
     *
     */
    public MyRecognizer(Context context) {
        isInited = true;
        this.context = context;
        asr = EventManagerFactory.create(context, "asr",false);
        initSamplePath();
    }


//    /**
//     * 初始化
//     *
//     * @param context
//     * @param recogListener 将EventListener结果做解析的DEMO回调。使用RecogEventAdapter 适配EventListener
//     */
//    public MyRecognizer(Context context, IRecogListener recogListener) {
//        this(context, new RecogEventAdapter(recogListener));
//    }
//
//    /**
//     * 初始化 提供 EventManagerFactory需要的Context和EventListener
//     *
//     * @param context
//     * @param eventListener 识别状态和结果回调
//     */
//    public MyRecognizer(Context context, EventListener eventListener) {
//
//        isInited = true;
//        this.eventListener = eventListener;
//        // SDK集成步骤 1.1  初始化asr的EventManager示例，多次得到的类，只能选一个使用
//        asr = EventManagerFactory.create(context, "asr");
//        // SDK集成步骤 1.2 设置回调event， 识别引擎会回调这个类告知重要状态和识别结果
//        asr.registerListener(eventListener);
//    }

    /**
     * 离线命令词，在线不需要调用
     *
     * @param params 离线命令词加载参数，见文档“ASR_KWS_LOAD_ENGINE 输入事件参数”
     */
    public void loadOfflineEngine(Map<String, Object> params) {
        String json = new JSONObject(params).toString();
        MyLogger.info(TAG + ".Debug", "离线命令词初始化参数（反馈请带上此行日志）:" + json);
        // SDK集成步骤 1.3（可选）加载离线命令词
        asr.send(SpeechConstant.ASR_KWS_LOAD_ENGINE, json, null, 0, 0);
        isOfflineEngineLoaded = true;
        // 没有ASR_KWS_LOAD_ENGINE这个回调表试失败，如缺少第一次联网时下载的正式授权文件。
    }


    /**
     * @param
     */
    public void start() {
        // SDK集成步骤 2.1 拼接识别参数

        Map<String, Object> params = new LinkedHashMap<String, Object>();


        params.put(SpeechConstant.ACCEPT_AUDIO_VOLUME, false);
        params.put(SpeechConstant.NLU, "enable");
        params.put(SpeechConstant.PID, 15373);
        params.put(SpeechConstant.VAD, SpeechConstant.VAD_DNN);
        params.put(SpeechConstant.ASR_OFFLINE_ENGINE_GRAMMER_FILE_PATH, "assets://baidu_speech_grammar.bsg");
        params.put(SpeechConstant.OUT_FILE, samplePath + "/iat.pcm");
        params.put(SpeechConstant.ACCEPT_AUDIO_DATA, "true");
        //params.put(SpeechConstant.VAD_ENDPOINT_TIMEOUT, 1200); // 长语音

        if (isTs) {
            //params.put(SpeechConstant.SOUND_START, R.raw.bdspeech_recognition_start);
            //params.put(SpeechConstant.SOUND_END, R.raw.bdspeech_speech_end);
            params.put(SpeechConstant.SOUND_SUCCESS, R.raw.bdspeech_recognition_success);
            params.put(SpeechConstant.SOUND_ERROR, R.raw.bdspeech_recognition_error);
            params.put(SpeechConstant.SOUND_CANCEL, R.raw.bdspeech_recognition_cancel);
        }

        //params.put(SpeechConstant.OUT_FILE, "res://msc/iat.wav");
        // SpeechConstant.SOUND_START,
        //params.put(SpeechConstant.VAD_ENDPOINOUTT_TIMEOUT, 0); // 长语音
        // params.put(SpeechConstant.IN_FILE, "res:///com/baidu/android/voicedemo/16k_test.pcm");
        // params.put(SpeechConstant.PROP ,20000);
        // params.put(SpeechConstant.PID, 1537); // 中文输入法模型，有逗号
        String json = new JSONObject(params).toString();
        MyLogger.info(TAG + ".Debug", "识别参数（反馈请带上此行日志）" + json);
        asr.send(SpeechConstant.ASR_START, json, null, 0, 0);
    }

    /**
     * @param params
     */
    public void start(Map<String, Object> params) {
        String json = new JSONObject(params).toString();
        MyLogger.info(TAG + ".Debug", "识别参数（反馈请带上此行日志）" + json);
        asr.send(SpeechConstant.ASR_START, json, null, 0, 0);
    }


    /**
     * 提前结束录音等待识别结果。
     */
    public void stop() {
        MyLogger.info(TAG, "停止录音");
        // SDK 集成步骤4（可选）停止录音
        if (!isInited) {
            throw new RuntimeException("release() was called");
        }
        asr.send(SpeechConstant.ASR_STOP, "{}", null, 0, 0);
    }

    /**
     * 取消本次识别，取消后将立即停止不会返回识别结果。
     * cancel 与stop的区别是 cancel在stop的基础上，完全停止整个识别流程，
     */
    public void cancel() {
        MyLogger.info(TAG, "取消识别");
        if (!isInited) {
            throw new RuntimeException("release() was called");
        }
        // DEMO集成步骤5 (可选） 取消本次识别
        asr.send(SpeechConstant.ASR_CANCEL, "{}", null, 0, 0);
    }

    public void release() {
        if (asr == null) {
            return;
        }
        cancel();
        if (isOfflineEngineLoaded) {
            // SDK 集成步骤3.1，如果之前有调用过1.3加载离线命令词，这里要对应释放
            asr.send(SpeechConstant.ASR_KWS_UNLOAD_ENGINE, null, null, 0, 0);
            isOfflineEngineLoaded = false;
        }
        // SDK 集成步骤3.2（可选），卸载listener
        asr.unregisterListener(eventListener);
        asr = null;
        isInited = false;
    }

    public void setEventListener(IRecogListener recogListener) {
        if (!isInited) {
            throw new RuntimeException("release() was called");
        }
        this.eventListener = new RecogEventAdapter(recogListener);
        asr.registerListener(eventListener);
    }

    private void initSamplePath() {
        String sampleDir = "";
        samplePath = this.context.getCacheDir().getPath() + "/" + sampleDir;
        if (!FileUtil.makeDir(samplePath)) {
            throw new RuntimeException("创建临时目录失败 :" + samplePath);
        }
    }
}

package com.xj.ionic.speechandtts;

import android.Manifest;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import com.baidu.aip.asrwakeup3.core.recog.MyRecognizer;
import com.baidu.speech.asr.SpeechConstant;
import com.xj.ionic.speechandtts.listener.XjSpeechRecogListener;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.Map;
import cn.sh.com.xj.timeApp.R;



/**
 * This class echoes a string called from JavaScript.
 */
public class XjBaiduSpeech extends CordovaPlugin{

    boolean isTs = true;

    @Override
    protected void pluginInitialize() {

        super.pluginInitialize();

        initPermission();

    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        Map<String, Object> params = new LinkedHashMap<String, Object>();


        params.put(SpeechConstant.ACCEPT_AUDIO_VOLUME, false);
        params.put(SpeechConstant.NLU, "enable");
        params.put(SpeechConstant.PID, 15372);
        params.put(SpeechConstant.VAD, SpeechConstant.VAD_DNN);
        params.put(SpeechConstant.ASR_OFFLINE_ENGINE_GRAMMER_FILE_PATH, "assets://baidu_speech_grammar.bsg");
        params.put(SpeechConstant.OUT_FILE, "assets://msc/iat.pcm");
        params.put(SpeechConstant.ACCEPT_AUDIO_DATA, "true");

        if (isTs){
            params.put(SpeechConstant.SOUND_START, R.raw.bdspeech_recognition_start);
            params.put(SpeechConstant.SOUND_END, R.raw.bdspeech_speech_end);
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


        MyRecognizer recongnizer = new MyRecognizer(cordova.getActivity(),new XjSpeechRecogListener(callbackContext));


        if (action.equals("start")) {
            recongnizer.start(params);
            return true;
        }else if(action.equals("stop")){
            recongnizer.stop();

        }else if(action.equals("cancel")){
            recongnizer.cancel();
            return true;
        }else if(action.equals("release")){
            recongnizer.release();
            return true;
        }
        return false;
    }

    /**
     * android 6.0 以上需要动态申请权限
     */
    private void initPermission() {
        String permissions[] = {Manifest.permission.RECORD_AUDIO,
                Manifest.permission.ACCESS_NETWORK_STATE,
                Manifest.permission.INTERNET,
                Manifest.permission.READ_PHONE_STATE,
                Manifest.permission.WRITE_EXTERNAL_STORAGE
        };

        ArrayList<String> toApplyList = new ArrayList<String>();

        for (String perm : permissions) {
            if (PackageManager.PERMISSION_GRANTED != ContextCompat.checkSelfPermission(cordova.getActivity(), perm)) {
                toApplyList.add(perm);

            }
        }
        String tmpList[] = new String[toApplyList.size()];
        if (!toApplyList.isEmpty()) {
            ActivityCompat.requestPermissions(cordova.getActivity(), toApplyList.toArray(tmpList), 123);
        }

    }

}

package com.xj.ionic.speechandtts;

import com.baidu.aip.asrwakeup3.core.recog.MyRecognizer;
import com.baidu.aip.asrwakeup3.core.wakeup.MyWakeup;
import com.baidu.speech.asr.SpeechConstant;
import com.xj.ionic.speechandtts.listener.XjSpeechRecogListener;
import com.xj.ionic.speechandtts.listener.XjWakeupListener;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

import java.util.Map;
import java.util.TreeMap;

/**
 * This class echoes a string called from JavaScript.
 */
public class XjBaiduWakeUp extends CordovaPlugin{

    @Override
    protected void pluginInitialize() {

        super.pluginInitialize();

    }

    @Override
    public boolean execute(String action, JSONArray args, CallbackContext callbackContext) throws JSONException {

        Map<String, Object> params = new TreeMap<String, Object>();

        params.put(SpeechConstant.ACCEPT_AUDIO_VOLUME, false);
        params.put(SpeechConstant.WP_WORDS_FILE, "assets:///WakeUp.bin");


        MyWakeup wakeUp = new MyWakeup(cordova.getActivity(),new XjWakeupListener(callbackContext));
        if (action.equals("start")) {

            if (MyWakeup.isListenering){
                wakeUp.release();
                MyWakeup.isListenering = true;
            }else{
                wakeUp.start(params);
            }
            return true;
        }else if(action.equals("stop")){
            wakeUp.stop();
            return true;
        }else if(action.equals("release")){
            wakeUp.release();
            return true;
        }
        return false;
    }

}

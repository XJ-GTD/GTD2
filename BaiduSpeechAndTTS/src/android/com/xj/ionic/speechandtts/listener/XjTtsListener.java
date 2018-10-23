package com.xj.ionic.speechandtts.listener;

import com.baidu.tts.client.SpeechError;
import com.baidu.tts.sample.listener.MessageListener;
import org.apache.cordova.CallbackContext;



public class XjTtsListener extends MessageListener {

    private static final String TAG = "XjTtsListener";

    private CallbackContext callbackContext;

    public XjTtsListener(CallbackContext callbackContext) {
        this.callbackContext = callbackContext;
    }

    @Override
    protected void sendMessage(String message, boolean isError) {
        super.sendMessage(message,isError);

    }

    /**
     * 播放正常结束，每句播放正常结束都会回调，如果过程中出错，则回调onError,不再回调此接口
     *
     * @param utteranceId
     */
    @Override
    public void onSpeechFinish(String utteranceId) {

        super.onSpeechFinish(utteranceId);
        callbackContext.success(utteranceId);
    }

    /**
     * 当合成或者播放过程中出错时回调此接口
     *
     * @param utteranceId
     * @param speechError 包含错误码和错误信息
     */
    @Override
    public void onError(String utteranceId, SpeechError speechError) {

        super.onError(utteranceId,speechError);
        callbackContext.error(speechError.toString());
    }

}

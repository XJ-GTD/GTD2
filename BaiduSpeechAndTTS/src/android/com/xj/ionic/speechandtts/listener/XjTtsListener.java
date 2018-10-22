package com.xj.ionic.speechandtts.listener;

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
        callbackContext.success(Boolean.valueOf(isError).toString());

    }
}

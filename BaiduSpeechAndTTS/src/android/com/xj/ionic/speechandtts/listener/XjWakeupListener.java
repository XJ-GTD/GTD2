package com.xj.ionic.speechandtts.listener;

import com.baidu.aip.asrwakeup3.core.recog.IStatus;
import com.baidu.aip.asrwakeup3.core.wakeup.MyWakeup;
import com.baidu.aip.asrwakeup3.core.wakeup.SimpleWakeupListener;
import com.baidu.aip.asrwakeup3.core.wakeup.WakeUpResult;
import org.apache.cordova.CallbackContext;

/**
 * Created by fujiayi on 2017/9/21.
 */

public class XjWakeupListener extends SimpleWakeupListener implements IStatus {

    private static final String TAG = "XjWakeupListener";

    private CallbackContext callbackContext;

    public XjWakeupListener(CallbackContext callbackContext) {
        this.callbackContext = callbackContext;
    }

    @Override
    public void onSuccess(String word, WakeUpResult result) {
        super.onSuccess(word, result);
        callbackContext.success(word);
        MyWakeup.getWpEventManager().unregisterListener(this.listener);
    }
}

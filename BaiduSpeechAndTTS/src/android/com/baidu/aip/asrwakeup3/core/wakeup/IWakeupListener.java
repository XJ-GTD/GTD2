package com.baidu.aip.asrwakeup3.core.wakeup;

import com.baidu.speech.EventListener;
import com.baidu.speech.EventManager;
import com.baidu.speech.asr.EventManagerWp;

/**
 * Created by fujiayi on 2017/6/21.
 */

public interface IWakeupListener {


    void onSuccess(String word, WakeUpResult result);

    void onStop();

    void onError(int errorCode, String errorMessge, WakeUpResult result);

    void onASrAudio(byte[] data, int offset, int length);

    IWakeupListener setSelf4Relase(EventListener listener);
}

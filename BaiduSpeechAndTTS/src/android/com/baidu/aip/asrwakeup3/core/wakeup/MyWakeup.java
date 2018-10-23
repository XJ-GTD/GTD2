package com.baidu.aip.asrwakeup3.core.wakeup;

import android.content.Context;
import com.baidu.aip.asrwakeup3.core.util.MyLogger;
import com.baidu.speech.EventListener;
import com.baidu.speech.EventManager;
import com.baidu.speech.EventManagerFactory;
import com.baidu.speech.asr.SpeechConstant;
import org.json.JSONObject;

import java.util.Map;

/**
 * Created by fujiayi on 2017/6/20.
 */

public class MyWakeup {

    private static EventManager wppri;
    private  EventManager wp;
    private EventListener eventListener;

    public static boolean isListenering = false;


    private static final String TAG = "MyWakeup";

    public MyWakeup(Context context, EventListener eventListener) {

        this.eventListener = eventListener;
        wp = getWpEventManager(context);
        wp.registerListener(eventListener);
    }

    private static EventManager getWpEventManager(Context context){
        if (wppri == null){
            wppri =  EventManagerFactory.create(context, "wp");
        }
        return wppri;
    }

    public static EventManager getWpEventManager(){
        return wppri;
    }

    private static EventManager releaseWpEventManager(){
        if (wppri != null){
            wppri =  null;
        }
        return wppri;
    }

    public MyWakeup(Context context, IWakeupListener eventListener) {
        this(context, new WakeupEventAdapter(eventListener));
    }

    public void start(Map<String, Object> params) {
        String json = new JSONObject(params).toString();
        isListenering = true;
        MyLogger.info(TAG + ".Debug", "wakeup params(反馈请带上此行日志):" + json);
        wp.send(SpeechConstant.WAKEUP_START, json, null, 0, 0);
    }

    public void stop() {
        MyLogger.info(TAG, "唤醒结束");
        isListenering = false;
        wp.send(SpeechConstant.WAKEUP_STOP, null, null, 0, 0);
    }

    public void setEventListener(EventListener eventListener) {
        this.eventListener = eventListener;
    }

    public void setEventListener(IWakeupListener eventListener) {
        this.eventListener =  new WakeupEventAdapter(eventListener);
    }

    public void release() {
        stop();
        wp.unregisterListener(eventListener);
        wp = releaseWpEventManager();
    }
}

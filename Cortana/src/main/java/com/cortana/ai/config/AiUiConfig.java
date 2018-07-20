/*
package com.cortana.ai.config;

import com.iflytek.cloud.speech.SpeechRecognizer;
import com.iflytek.cloud.speech.SpeechSynthesizer;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Scanner;

*/
/**
 * 语音相关配置
 *//*

@Component
public class AiUiConfig {

    @Value("${aiui.url}")
    private String URL;

    @Value("${aiui.appid}")
    private String APPID;

    @Value("${aiui.apikey}")
    private String API_KEY;

    @Value("${aiui.datatype}")
    private String DATA_TYPE;

    @Value("${aiui.scene}")
    private String SCENE;

    @Value("${aiui.authid}")
    private String AUTH_ID;

    // 语音听写对象
    private static SpeechRecognizer mIat;
    private static AiUiConfig mObject;
    private boolean mIsLoop = true;

    private static StringBuffer mResult = new StringBuffer();
    private static String ask = "";

    // 语音合成对象
    private static SpeechSynthesizer mTts;



    private static AiUiConfig getMscObj() {
        if (mObject == null)
            mObject = new AiUiConfig();
        return mObject;
    }


    private boolean onLoop() {
        boolean isWait = true;
        DebugLog.Log("*********************************");
        DebugLog.Log("输入任意字符，开始你的问题，你只有3秒哦：）");

        Scanner in = new Scanner(System.in);
        String command = in.nextLine();

        DebugLog.Log("You input " + command);

        Recognize();

        return isWait;
    }

    public void loop() {
        while (mIsLoop) {
            try {
                if (onLoop()) {
                    synchronized(this){
                        this.wait();
                    }
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }
}
*/

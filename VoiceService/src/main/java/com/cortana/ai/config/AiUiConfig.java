
package com.cortana.ai.config;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;


/**
 * 语音相关配置
 */
public class AiUiConfig {

    private static final String URL = "http://openapi.xfyun.cn/v2/aiui";
    private static final String DATA_TYPE_TEXT = "text";
    private static final String DATA_TYPE_AUDIO = "text";
    private static final String SCENE = "main";
    //配置1
    private static final String APP_ID = "5b554446";
    private static final String API_KEY = "880d370a20234c95a33e961c70de3ed5";
    private static final String AUTH_ID = "acc4eef79429322f3083fb04ba52f4c3";

    public static String URL() {
        return URL;
    }

    public static String DATA_TYPE_TEXT() {
        return DATA_TYPE_TEXT;
    }

    public static String DATA_TYPE_AUDIO() {
        return DATA_TYPE_AUDIO;
    }

    public static String SCENE() {
        return SCENE;
    }

    public static String APP_ID() {
        return APP_ID;
    }

    public static String API_KEY() {
        return API_KEY;
    }

    public static String AUTH_ID() {
        return AUTH_ID;
    }
}


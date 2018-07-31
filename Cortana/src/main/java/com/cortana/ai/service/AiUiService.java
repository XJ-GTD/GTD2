package com.cortana.ai.service;

import com.cortana.ai.config.AiUiConfig;
import com.cortana.ai.util.AiUiUtil;
import com.cortana.ai.util.DebugLog;
import com.cortana.ai.util.JsonParser;
import com.cortana.ai.util.Version;
import com.iflytek.cloud.speech.*;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.tomcat.util.codec.binary.Base64;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.Scanner;

@Service
public class AiUiService {


    /**
     * 文本方法
     * @param data
     * @return
     */
    public String answerText(String data) {

        return AiUiUtil.readAudio(data, 1);

    }

    /**
     * 音频方法
     * @param data
     * @return
     */
    public String answerAudio(String data) {

        return AiUiUtil.readAudio(data, 0);

    }

}

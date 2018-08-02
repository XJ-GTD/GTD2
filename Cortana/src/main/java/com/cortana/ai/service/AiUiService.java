package com.cortana.ai.service;

import com.cortana.ai.config.AiUiConfig;
import com.cortana.ai.util.AiUiUtil;
import com.cortana.ai.util.DebugLog;
import com.cortana.ai.util.JsonParser;
import com.cortana.ai.util.Version;
import com.iflytek.cloud.speech.*;
import org.apache.catalina.servlet4preview.http.HttpServletRequest;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.apache.tomcat.util.codec.binary.Base64;

import com.alibaba.fastjson.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.multipart.MultipartHttpServletRequest;

import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.ParseException;
import java.util.*;

@Service
public class AiUiService {

    private Logger logger = LogManager.getLogger(this.getClass());

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

package com.cortana.ai.util;

import com.cortana.ai.config.AiUiConfig;
import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;
import sun.misc.BASE64Encoder;

import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLConnection;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

/**
 * HTTP请求工具类
 *
 * create by wzy on 2018/07/23
 */
public class AiUiUtil {

    /**
     * 请求头部
     * @return
     * @throws UnsupportedEncodingException
     * @throws ParseException
     */
    private static Map<String, String> buildHeader(int flag) throws UnsupportedEncodingException, ParseException {

        String DATA_TYPE = "";
        //flag为0，传音频文件，为1，传文本
        if (flag == 0) {
            DATA_TYPE = AiUiConfig.DATA_TYPE_AUDIO();
        } else if (flag == 1) {
            DATA_TYPE = AiUiConfig.DATA_TYPE_TEXT();
        }

        String curTime = System.currentTimeMillis() / 1000L + "";
        String param = "{\"auth_id\":\""+ AiUiConfig.AUTH_ID() +"\",\"data_type\":\""+ DATA_TYPE +"\",\"scene\":\""+ AiUiConfig.SCENE() +"\"}";
        //使用个性化参数时参数格式如下：
        //String param = "{\"aue\":\""+AUE+"\",\"sample_rate\":\""+SAMPLE_RATE+"\",\"auth_id\":\""+AUTH_ID+"\",\"data_type\":\""+DATA_TYPE+"\",\"scene\":\""+SCENE+"\",\"pers_param\":\""+PERS_PARAM+"\"}";
        String paramBase64 = new String(Base64.encodeBase64(param.getBytes("UTF-8")));
        String checkSum = DigestUtils.md5Hex(AiUiConfig.API_KEY() + curTime + paramBase64);

        Map<String, String> header = new HashMap<String, String>();
        header.put("X-Param", paramBase64);
        header.put("X-CurTime", curTime);
        header.put("X-CheckSum", checkSum);
        header.put("X-Appid", AiUiConfig.APP_ID());
        return header;
    }

    /**
     * 讯飞语音AIUI http请求 POST
     * @return
     */
    public static String httpPost(String body, int flag) {

        String result = "";
        BufferedReader in = null;
        OutputStreamWriter out = null;

        try {

            Map<String, String> header = buildHeader(flag);

            URL realUrl = new URL(AiUiConfig.URL());
            HttpURLConnection connection = (HttpURLConnection)realUrl.openConnection();
            for (String key : header.keySet()) {
                connection.setRequestProperty(key, header.get(key));
            }
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setDoInput(true);

            connection.setConnectTimeout(20000);
            connection.setReadTimeout(20000);
            try {
                out = new OutputStreamWriter(connection.getOutputStream());
                out.write(body);
                out.flush();
                out.close();
            } catch (Exception e) {
                e.printStackTrace();
            }

            try {
                in = new BufferedReader(new InputStreamReader(connection.getInputStream()));
                String line;
                while ((line = in.readLine()) != null) {
                    result += line;
                }
            } catch (Exception e) {
                e.printStackTrace();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return result;
    }

}

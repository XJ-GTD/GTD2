package com.cortana.ai.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.UnsupportedEncodingException;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

import org.apache.commons.codec.binary.Base64;
import org.apache.commons.codec.digest.DigestUtils;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONObject;

/**
 * 动态实体数据上传
 *
 * create by wzy on 20018/09/04
 */
public class DynamicEntityUtil {
    private static final String UPLOAD_URL = "https://openapi.xfyun.cn/v2/aiui/entity/upload-resource";
    private static final String CHECK_URL = "https://openapi.xfyun.cn/v2/aiui/entity/check-resource";
    private static final String X_NONCE = "616";
    private static final String APPID = "5b554446";
    private static final String X_NAMESPACE = "SCARECROW";
    private static final String ACCOUNTKEY = "e7e466235f9545ee93b8d82ece084415";
    private static final String RES_NAME = "SCARECROW.schedule_add";

    private static final String PERS_PARAM = "{\"auth_id\":\"2894c985bf8b1111c6728db79d3479ae\"}";

    public static String update() throws IOException,ParseException, InterruptedException{
        Map<String, String> header = buildHeader();
        String uploadBody = buildUploadBody();
        String result = httpPost(UPLOAD_URL, header, uploadBody);
        System.out.println(result);
        JSONObject uploadJo = JSON.parseObject(result);
        String code = uploadJo.getString("code");
        if("00000".equals(code)){
            //上传资源数据后至少间隔3秒后再进行查看上传资源是否成功
            Thread.sleep(3000);
            String sid = uploadJo.getJSONObject("data").getString("sid");
            String checkBody = buildCheckBody(sid);
            String checkResult = httpPost(CHECK_URL, header, checkBody);
            return checkResult;
        }
        return result;
    }


    private static Map<String, String> buildHeader() {
        String curTime = System.currentTimeMillis() / 1000L + "";
        String checkSum = DigestUtils.md5Hex(ACCOUNTKEY + X_NONCE + curTime);
        Map<String, String> header = new HashMap<String, String>();
        header.put("X-NameSpace", X_NAMESPACE);
        header.put("X-Nonce", X_NONCE);
        header.put("X-CurTime", curTime);
        header.put("X-CheckSum", checkSum);
        return header;
    }

    private static String buildUploadBody() throws UnsupportedEncodingException {
        String body = "";
        //每条数据之间用换行符隔开
//        String data = "{\"name\":\"张三\",\"phoneNumber\":\"13888888888\"}" + "\r\n"
//                + "{\"name\":\"李四\",\"phoneNumber\":\"13666666666\"}";
        String data = "{\"schedule_name\": \"开会\"}" + "\r\n" + "{\"schedule_name\": \"买材料\"}" + "\r\n"
                + "{\"schedule_name\": \"浇花\"}" + "\r\n" + "{\"schedule_name\": \"吃饭\"}" + "\r\n";
        Map<String, String> map = new HashMap<String, String>();
        map.put("appid", APPID);
        map.put("res_name", RES_NAME);
        map.put("pers_param", PERS_PARAM);
        map.put("data",  new String(Base64.encodeBase64(data.getBytes("UTF-8"))));
        for (String key : map.keySet()) {
            body += key + "=" + URLEncoder.encode(map.get(key),"utf-8")+"&";
        }
        return body;
    }

    private static String buildCheckBody(String sid) throws UnsupportedEncodingException {
        String body = "sid=" +URLEncoder.encode(sid,"utf-8");
        return body;
    }

    private static String httpPost(String url, Map<String, String> header, String body) {
        String result = "";
        BufferedReader in = null;
        OutputStreamWriter out = null;
        try {
            URL realUrl = new URL(url);
            HttpURLConnection connection = (HttpURLConnection)realUrl.openConnection();
            for (String key : header.keySet()) {
                connection.setRequestProperty(key, header.get(key));
            }
            connection.setRequestMethod("POST");
            connection.setDoOutput(true);
            connection.setDoInput(true);

            //connection.setConnectTimeout(20000);
            //connection.setReadTimeout(20000);
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

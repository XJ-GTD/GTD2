package com.xiaoji.util;

import com.alibaba.fastjson.JSONObject;
import com.xiaoji.config.exception.ServiceException;
import com.xiaoji.gtd.dto.code.TimerDto;
import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;

import java.io.IOException;
import java.util.Map;
import java.util.Random;
import java.util.TreeMap;

/**
 * 赛邮短信api请求工具类
 *
 * create by wzy on 2018/09/05
 */
public class SmsUtil {

    private static final String TIME = "一分钟";
    private static final String URL = "https://api.mysubmail.com/message/xsend";
    private static final String APPID = "28912";
    private static final String APPKEY = "b7b93968f2566a756ad47de9f6c32078";
    private static final String PROJECT = "SvPNp1";
    private static final String SIGNTYPE = "";

    public static void getAuthCode(String to) {

        TreeMap<String, Object> requestData = new TreeMap<String, Object>();
        JSONObject vars = new JSONObject();

        String code = String.valueOf(new Random().nextInt(10)) + String.valueOf((new Random().nextInt(89999)) + 10000);;
        vars.put("code", code);
        vars.put("time", TIME);

        requestData.put("appid", APPID);
        requestData.put("project", PROJECT);
        requestData.put("to", to);

        if(!vars.isEmpty()){
            requestData.put("vars",vars.toString());
        }
        MultipartEntityBuilder builder = MultipartEntityBuilder.create();
        @SuppressWarnings("deprecation")
        ContentType contentType = ContentType.create(HTTP.PLAIN_TEXT_TYPE,HTTP.UTF_8);
        for(Map.Entry<String, Object> entry: requestData.entrySet()){
            String key = entry.getKey();
            Object value = entry.getValue();
            if(value instanceof String){
                builder.addTextBody(key, String.valueOf(value),contentType);
            }
        }
        builder.addTextBody("signature", APPKEY, contentType);
        /*if(signtype.equals(TYPE_MD5) || signtype.equals(TYPE_SHA1)){
            String timestamp = getTimestamp();
            requestData.put("timestamp", timestamp);
            requestData.put("sign_type", signtype);
            String signStr = appid + appkey + RequestEncoder.formatRequest(requestData) + appid + appkey;

            builder.addTextBody("timestamp", timestamp);
            builder.addTextBody("sign_type", signtype);
            builder.addTextBody("signature", RequestEncoder.encode(signtype, signStr), contentType);
        }else{
            builder.addTextBody("signature", appkey, contentType);
        }*/


        HttpPost httpPost = new HttpPost(URL);
        httpPost.addHeader("charset", "UTF-8");
        httpPost.setEntity(builder.build());
        try{
            CloseableHttpClient closeableHttpClient = HttpClientBuilder.create().build();
            HttpResponse response = closeableHttpClient.execute(httpPost);
            HttpEntity httpEntity = response.getEntity();
            if(httpEntity != null){
                JSONObject jsonStr = JSONObject.parseObject(EntityUtils.toString(httpEntity, "UTF-8"));
                String status = jsonStr.getString("status");
                if ("success".equals(status)) {
                    TimerUtil.putCache(to, new TimerDto(to, code, System.currentTimeMillis() + 1000 * 60));
                } else {
                    throw new ServiceException();
                }
            }
        } catch(IOException e){
            throw new ServiceException();
        }

    }

}

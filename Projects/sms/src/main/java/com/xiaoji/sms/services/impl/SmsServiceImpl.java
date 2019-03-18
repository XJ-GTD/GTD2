package com.xiaoji.sms.services.impl;

import java.io.IOException;
import java.util.Map;
import java.util.TreeMap;

import org.apache.http.HttpEntity;
import org.apache.http.HttpResponse;
import org.apache.http.client.methods.HttpPost;
import org.apache.http.entity.ContentType;
import org.apache.http.entity.mime.MultipartEntityBuilder;
import org.apache.http.impl.client.CloseableHttpClient;
import org.apache.http.impl.client.HttpClientBuilder;
import org.apache.http.protocol.HTTP;
import org.apache.http.util.EntityUtils;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.alibaba.fastjson.JSONObject;
import com.xiaoji.sms.services.ISmsService;

/**
 * 短信接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
public class SmsServiceImpl implements ISmsService {

    private Logger logger = LoggerFactory.getLogger(SmsServiceImpl.class);

    @Value("${submail.messageXsend.business.time}")
    private String TIME;
    @Value("${submail.messageXsend.url}")
    private String URL;
    @Value("${submail.messageXsend.appid}")
    private String APPID;
    @Value("${submail.messageXsend.appkey}")
    private String APPKEY;
    @Value("${submail.messageXsend.project.authcode}")
    private String PROJECT_AUTH_CODE;
    @Value("${submail.messageXsend.project.pushschedule}")
    private String PROJECT_SCHEDULE;
    @Value("${submail.messageXsend.project.pushplayer}")
    private String PROJECT_PLAYER;
    @Value("${submail.messageXsend.signtype}")
    private String SIGNTYPE;
    @Value("${submail.messageXsend.business.url}")
    private String BUSINESS_URL;


    /**
     * 发送短信
     * @param mobile
     * @return
     */
    @Override
    public int sendSms(String mobile,String sendType,String content) {

        try {
            //JSONObject vars = new JSONObject();
        	JSONObject contentJson = JSONObject.parseObject(content);
        	JSONObject vars = contentJson;
//        	if(contentJson.containsKey("vars")){
//        		vars = contentJson.getJSONObject("vars");
//        	}
        	/*JSONObject links = null;
        	if(contentJson.containsKey("links")){
        		links = contentJson.getJSONObject("links");
        	}*/
//            String code = new Random().nextInt(10) + String.valueOf((new Random().nextInt(89999)) + 10000);;
//          vars.put("timeOut", timeOut);
            /*vars.put("code", code);
            vars.put("time", TIME);*/

            requestSubMail(mobile, sendType, vars , null);
            logger.info("======== 发送成功,发送内容 ：" + content + " 手机号：" + mobile + " =========");
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("短信验证接口请求失败");
        }

        return 0;
    }


    /**
     * 请求赛邮短信推送API
     * @param to
     * @throws Exception 
     */
    private boolean requestSubMail(String to, String project, JSONObject vars, JSONObject links) throws Exception {

        TreeMap<String, Object> requestData = new TreeMap<String, Object>();

        requestData.put("appid", APPID);
        requestData.put("project", project);
        requestData.put("to", to);

        if(vars != null && !vars.isEmpty()){
            requestData.put("vars",vars.toString());
            logger.info("======= vars: " + vars.toString());
        }
        
        if( links != null && ! links.isEmpty()){
            requestData.put(" links", links.toString());
            logger.info("======= links: " + links.toString());
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
        HttpPost httpPost = new HttpPost(URL);
        httpPost.addHeader("charset", "UTF-8");
        httpPost.setEntity(builder.build());
        try{
            CloseableHttpClient closeableHttpClient = HttpClientBuilder.create().build();
            HttpResponse response = closeableHttpClient.execute(httpPost);
            HttpEntity httpEntity = response.getEntity();
            if(httpEntity != null){
                JSONObject jsonStr = JSONObject.parseObject(EntityUtils.toString(httpEntity, "UTF-8"));
                logger.info("--------- 赛邮短信接口请求返回结果 ------------:"+jsonStr.toString());
                String status = jsonStr.getString("status");
                if ("success".equals(status)) {
                    logger.info("--------- 赛邮短信接口请求成功 ------------:"+jsonStr.toString());
//                    if (project.equals(PROJECT_AUTH_CODE)) {
//                    	//验证码超时时间
//                    	long timeOut = System.currentTimeMillis();
//                    	if(vars.getIntValue("timeOut") !=0){
//                    		timeOut+=vars.getIntValue("timeOut");
//                    	}else{
//                    		timeOut+=1 * 1000 * 60;
//                    	}
//                        TimerUtil.putCache(to, new TimerDto(to, vars.get("code"), timeOut));
//                    }
                    return true;
                } else {
                	logger.debug("DEBUG++ " + jsonStr);
                    logger.error("赛邮短信接口请求返回出错");
                }
            }else{
            	logger.error("httpEntity 赛邮短信接口请求报错");
            }
        } catch(IOException e){
            throw new Exception();
        }
        return false;
    }
}

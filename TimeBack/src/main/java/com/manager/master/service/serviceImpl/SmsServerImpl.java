package com.manager.master.service.serviceImpl;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.manager.config.SmsConfig;
import com.manager.master.entity.Sms;
import com.manager.master.service.ISmsServer;
import com.manager.util.SmsManager;
import com.submail.config.AppConfig;
import com.submail.lib.MESSAGEXsend;
import com.submail.lib.MessageMultiXSend;
import com.submail.lib.MessageSend;
import com.submail.utils.ConfigLoader;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

/**
 * 短信服务
 */
@Service
public class SmsServerImpl implements ISmsServer {

    private Logger logger = LogManager.getLogger(this.getClass());


    @Autowired
    private SmsConfig sms;


    /**
     * 发送短信验证码
     * @param tel       收件人手机号
     * @param type      消息类型        0注册，1登陆，2修改密码，3更换手机
     * @return          验证码
     */
    @Override
//    @CachePut(value="tel",key = "#tel")
    public String sendMessage(String tel, String type) {


        AppConfig appConfig = ConfigLoader.createConfig(sms.getAppid(),sms.getAppkey(),sms.getSigntype());
        //验证码生成
        String captcha = String.valueOf(new Random().nextInt(10)) + String.valueOf((new Random().nextInt(89999)) + 10000);
        MESSAGEXsend message = new MESSAGEXsend(appConfig);
//        //注册
//        if(type.equals(sms.getProject().get(0))){
//
//        }
//        //登录
//        if(type.equals(sms.getProject().get(1))){
//
//        }
//        //修改密码
//        if(type.equals(sms.getProject().get(2))){
//
//        }
//        //更换手机号
//        if(type.equals(sms.getProject().get(3))){
//
//        }



        //模板名称
        message.setProject("SvPNp1");
        //收件手机号
        message.addTo(tel);
        //模板中的参数
//        message.addVar("",captcha);
        message.addVar("code", captcha);
        message.addVar("time", "十分钟");
        try {
            //发送短信
            String response = message.xsend();
            //模拟返回数据
//            String response = "{\"status\":\"success\"}";
            JSONObject jo = JSON.parseObject(response);
            String status = jo.get("status").toString();
            //发送失败
            if("error".equals(status)){
                logger.info("返回结果:"+response);
                return null;
            }
            if("success".equals(status)){
                SmsManager.putCache(tel, new Sms(tel, captcha, System.currentTimeMillis() + 1000 * 60 * 10));
                logger.info("返回结果:"+response);
                logger.info("手机号:" + tel + " 验证码:" + captcha);
            }

        }catch(Exception e){
            logger.info("发送失败");
            return null;
        }
        return captcha;
    }

    /**
     *  对多个手机号发送一条短信
     * @param telList   收件手机号
     * @param sender    发件邀请人
     * @return  为null发送失败 size=0 发送成功 size>0一部分失败
     *
     */
    @Override
    public List<String> sendMessage(List<String> telList, String sender) {
        List<String> list = new ArrayList<String>();
        AppConfig appConfig = ConfigLoader.createConfig(sms.getAppid(),sms.getAppkey(),sms.getSigntype());
        MessageMultiXSend submail = new MessageMultiXSend(appConfig);
        //模板
        submail.addProject("g8crk1");
        for (String tel: telList) {
            net.sf.json.JSONObject json=new net.sf.json.JSONObject();
            //模板参数
            json.put("name", sender);
            json.put("content","");


            submail.addVars(json);
            submail.addMulti(tel);
        }

        try {
            //发送短信
            String response=submail.multixsend();
            logger.info("接口返回消息:"+response);
//            {"status":"error","code":109,"msg":"Invalid appkey"}
            if(response.contains("success")){

            }
            if(response.contains("error")){

            }
            //模拟数据
            response = "[{\t\"status\": \"success\",\t\"to\": \"15*********\",\t\"send_id\": \"093c0a7df143c087d6cba9cdf0cf3738\",\t\"fee\": 1,\t\"sms_credits\": 14197}, {\t\"status\": \"success\",\t\"to\": \"18*********\",\t\"send_id\": \"093c0a7df143c087d6cba9cdf0cf3738\",\t\"fee\": 1,\t\"sms_credits\": 14196}]";
            JSONArray ja = JSON.parseArray(response);
            for (int i = 0; i< ja.size();i ++){
                JSONObject jo = ja.getJSONObject(i);
                String status = jo.getString("status");
                if("success".equals(status)){

                }
                if("error".equals(status)){
                    String str = jo.getString("to");
                    list.add(str);
                }
            }
            logger.info("接口返回消息:"+response);
        }catch (Exception e){
            logger.info("发送失败");
            return null ;
        }
        return list;
    }

    @Override
    public String sendMessagec(String tel, String type) {
        AppConfig appConfig = ConfigLoader.createConfig(sms.getAppid(),sms.getAppkey(),sms.getSigntype());
        //验证码生成
        String captcha = String.valueOf(new Random().nextInt(10)) + String.valueOf((new Random().nextInt(89999)) + 10000);
        MessageSend message = new MessageSend(appConfig);
        if(type.equals(sms.getProject().get(0))){

        }
        //收件手机号
        message.addTo(tel);
        //模板中的参数
        message.addContent("您申请的验证码是" + captcha + "，如非本人操作请忽略");
        try {
            String response = message.send();

            JSONObject jo = JSON.parseObject(response);
            String status = jo.getString("status");
            if("error".equals(status)){
                logger.info("返回的数据："+response);
                return null;
            }
            if("success".equals(status)){
                SmsManager.putCache(tel, new Sms(tel, captcha, System.currentTimeMillis() + 1000 * 60 * 10));
                logger.info("返回的数据："+response);
            }
        }catch (Exception e){
            logger.info("短信发送失败！");
        }
        return captcha;
    }

    @Override
    public List<String> sendMessagec(List<String> telList, String sender) {


        return null;
    }


    @Override
//    @Cacheable(value = "tel" , key = "#tel")
    public String findCode(String tel) {
        return null;
    }

    @Override
//    @CacheEvict(value = "tel" , key = "#tel")
    public String removeCode(String tel) {
        return null;
    }


}

package com.manager.master.controller;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.alibaba.fastjson.JSONObject;
import com.manager.master.dto.BaseOutDto;
import com.manager.master.service.ISmsServer;
import com.manager.util.ResultCode;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 短信接口 调用
 *
 *
 */
@CrossOrigin
@Controller
@RequestMapping("/sms")
public class SubMailController {

    @Autowired
    private ISmsServer smsServer;

    /**
     * 发送验证码  单用户
     * @return
     */
    @RequestMapping(value = "/message_send" ,method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto sendMessage(@RequestBody String reqData ){
        BaseOutDto out = new BaseOutDto();
        Map<String,String> map = new HashMap<String,String>();
        JSONObject data = JSON.parseObject(reqData);
        //手机号
        String tel = data.getString("tel");
        //消息类型
        String type = data.getString("type");

        if(tel == null || "".equals(tel)){
            out.setMessage("手机号为空");
            out.setCode(ResultCode.FAIL);
            return out;
        }

//        smsServer.sendMessage(tel,type);

//        AppConfig appConfig = ConfigLoader.createConfig("","","");
//        //验证码生成
//        String captcha = String.valueOf(new Random().nextInt(10)) + String.valueOf((new Random().nextInt(89999)) + 10000);
//        MESSAGEXsend message = new MESSAGEXsend(appConfig);
//        //模板名称
//        message.setProject("");
//        //收件手机号
//        message.addTo(tel);
//        //模板中的参数
//        message.addVar("",captcha);

        try{
//            String result = message.xsend();
//            String result = "{\t\"status\": \"success\",\t\"send_id\": \"093c0a7df143c087d6cba9cdf0cf3738\",\t\"fee\": 1,\t\"sms_credits\": 14197}";
//            JSONObject jo = JSON.parseObject(result);
//            String status = jo.getString("status");
//            String send_id = jo.getString("send_id");
//            String fee = jo.getString("fee");
            String captcha = smsServer.sendMessage(tel,type);

            if(captcha != null ) {
                out.setMessage("发送成功！");
                out.setCode(ResultCode.SUCCESS);
                map.put("captcha", captcha);
                map.put("tel", tel);
                out.setData(map);
            }else{
                out.setMessage("发送失败！");
                out.setCode(ResultCode.FAIL);
            }

        }catch (Exception e){
            out.setMessage("发送失败！");
            out.setCode(ResultCode.FAIL);
        }
        return out;
    }

    @PostMapping("/messageMultiXsend")
    @ResponseBody
    public BaseOutDto sendList(@RequestBody String reqData){
        List<String> list = new ArrayList<String>();
        JSONObject jo = JSON.parseObject(reqData);
        JSONArray ja = jo.getJSONArray("tel");
        for(int i = 0;ja != null&& i<ja.size() ;i++){
            list.add((String)ja.get(i));
        }
        list.size();
        return null;
    }

}

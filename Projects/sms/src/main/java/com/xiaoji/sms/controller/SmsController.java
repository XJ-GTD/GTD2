package com.xiaoji.sms.controller;

import javax.servlet.http.HttpServletRequest;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.xiaoji.sms.dto.BaseOutDto;
import com.xiaoji.sms.dto.SmsDto;
import com.xiaoji.sms.services.ISmsService;
import com.xiaoji.sms.util.ReturnMessage;

/**
 * SmsController短信发送平台
 *
 */
@RestController
@CrossOrigin
@RequestMapping(value = "/")
public class SmsController {
	Logger logger = LoggerFactory.getLogger(SmsController.class);
    @Autowired
    ISmsService smsService;

    /**
     * 发送短信  /sms
     * @param map
     * @return
     */
    @RequestMapping(value="/send")
    @ResponseBody
    public BaseOutDto add(SmsDto dto,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
		out.setRc(ReturnMessage.ERROR_CODE);
		out.setRm(ReturnMessage.ERROR_MSG);
		logger.info("======== 发送类型：" + dto.getSendType() + " =========");
		logger.info("======== 发送手机号：" + dto.getMobile() + " =========");
		logger.info("======== 发送内容：" + dto.getSendContent() + " =========");
    	boolean isSuccess = false;
    	if(dto.getMobile() != null && !"".equals(dto.getMobile()) && dto.getSendType() != null 
    			&& !"".equals(dto.getSendType())){
			//发送短信验证码
			if(dto.getSendContent()!=null && !"".equals(dto.getSendContent())){
				smsService.sendSms(dto.getMobile(),dto.getSendType(),dto.getSendContent());
				isSuccess = true;
			}else{
				out.setRc(ReturnMessage.NULL_CODE);
				out.setRm(ReturnMessage.NULL_MSG);
			}
    	}
    	if(isSuccess){
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}

        return out;
    }
    
    
    /**
     * 获取短信验证码
     * @param map
     * @return
     */
/*  @GetMapping(value="/smsCode/{mobile}")
    @ResponseBody
    public BaseOutDto getSmsCode(@PathVariable String mobile,HttpServletRequest request) {
    	BaseOutDto out = new BaseOutDto();
		out.setRc(ReturnMessage.ERROR_CODE);
		out.setRm(ReturnMessage.ERROR_MSG);
    	boolean isSuccess = false;
    	if(mobile != null && !"".equals(mobile)){
    		TimerDto timerDto= TimerUtil.getCache(mobile);
    		if(timerDto != null && timerDto.getValue() != null 
    				&& !"".equals(timerDto.getValue())){
    			String smsCode = timerDto.getValue().toString();
    			long newTime = System.currentTimeMillis();
    			if(newTime>timerDto.getTimeOut()){
    				out.setD(smsCode);
    				isSuccess = true;
    			}else{
    				//短信超时
    				out.setRc(ReturnMessage.TIMEOUT_CODE);
    	    		out.setRm(ReturnMessage.TIMEOUT_MSG);
    			}
    		}
    	}
    	if(isSuccess){
    		out.setRc(ReturnMessage.SUCCESS_CODE);
    		out.setRm(ReturnMessage.SUCCESS_MSG);
    	}

        return out;
    }
*/
   
}

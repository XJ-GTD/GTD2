package com.xiaoji.sms.controller;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.xiaoji.sms.dto.BaseOutDto;
import com.xiaoji.sms.dto.SmsDto;
import com.xiaoji.sms.dto.TimerDto;
import com.xiaoji.sms.services.ISmsService;
import com.xiaoji.sms.util.ReturnMessage;
import com.xiaoji.sms.util.TimerUtil;

/**
 * SmsController短信发送平台
 *
 */
@RestController
@CrossOrigin
@RequestMapping(value = "/")
public class SmsController {

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
    	boolean isSuccess = false;
    	if(dto.getMobile() != null && !"".equals(dto.getMobile())){
    		if("0".equals(dto.getSendType())){
    			//发送短信验证码
        		if(dto.getSendContent()!=null && !"".equals(dto.getSendContent())){
        			smsService.getAuthCode(dto.getMobile(),dto.getSendContent());
        			isSuccess = true;
        		}else{
        			out.setRc(ReturnMessage.NULL_CODE);
        			out.setRm(ReturnMessage.NULL_MSG);
        		}
        		
        	}else if("1".equals(dto.getSendType())){
        		//发送下载链接验证码
        		smsService.pushSchedule(dto.getMobile());
        		isSuccess = true;
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

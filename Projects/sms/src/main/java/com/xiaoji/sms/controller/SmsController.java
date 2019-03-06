package com.xiaoji.sms.controller;

import javax.servlet.http.HttpServletRequest;

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
        		int timeOut = 0;		
        		if(dto.getSendContent()!=null && !"".equals(dto.getSendContent())){
        			timeOut = Integer.valueOf(dto.getSendContent());
        		}
        		smsService.getAuthCode(dto.getMobile(),timeOut);
        		isSuccess = true;
        	}else if("1".equals(dto.getSendType())){
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

   
}

package com.xiaoji.gtd.controller;

import com.xiaoji.gtd.dto.*;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.service.IPersonService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.TimerUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

/**
 * 用户类
 *
 * create by wzy on 2018/11/15.
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/person")
public class PersonController {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final IPersonService personService;

    @Autowired
    public PersonController(IPersonService personService) {
        this.personService = personService;
    }

    /**
     * 用户注册
     * @return
     */
    @RequestMapping(value = "/sign_up", method = RequestMethod.POST)
    @ResponseBody
    public Out signUp(@RequestBody SignUpInDto inDto) {
        Out outDto = new Out();
        SignUpOutDto user = new SignUpOutDto();

        //入参检测
        //必须项检测
        if(inDto.getAccountMobile() == null || "".equals(inDto.getAccountMobile())){
            outDto.setCode(ResultCode.FAIL);
            outDto.setMessage("[注册失败]：手机号不可为空");
            logger.info("[注册失败]：手机号不可为空");
            return outDto;
        }
        if(inDto.getPassword() == null || "".equals(inDto.getPassword())){
            outDto.setCode(ResultCode.FAIL);
            outDto.setMessage("[注册失败]：密码不可为空");
            logger.info("[注册失败]：密码不可为空");
            return outDto;
        }
        if(inDto.getAuthCode() == null || "".equals(inDto.getAuthCode())){
            outDto.setCode(ResultCode.FAIL);
            outDto.setMessage("[注册失败]：请输入验证码不可为空");
            logger.info("[注册失败]：请输入验证码不可为空");
            return outDto;
        }
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.FAIL);
            outDto.setMessage("[注册失败]：用户ID不可为空");
            logger.info("[注册失败]：用户ID不可为空");
            return outDto;
        }
        //入参正确性检测
        if(!BaseUtil.isInteger(inDto.getAccountMobile())){
            if(inDto.getAccountMobile().length()!=11){
                outDto.setCode(ResultCode.FAIL);
                outDto.setMessage("[注册失败]：请输入正确手机号");
                logger.info("[注册失败]：请输入正确手机号");
                return outDto;
            }
        }
//        try {
//            if(!Objects.requireNonNull(TimerUtil.getCache(inDto.getAccountMobile())).getValue().equals(inDto.getAuthCode())){
//                outDto.setCode(ResultCode.FAIL);
//                outDto.setMessage("[注册失败]：请输入正确短信验证码");
//                logger.info("[注册失败]：请输入正确短信验证码");
//                return outDto;
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            outDto.setCode(ResultCode.FAIL);
//            outDto.setMessage("[注册失败]：短信验证码已过期，请重新获取");
//            logger.info("[注册失败]：短信验证码已过期");
//            return outDto;
//        }

        //验证手机号码重复
        if(personService.isRepeatMobile(inDto.getAccountMobile())){
            outDto.setCode(ResultCode.REPEAT);
            outDto.setMessage("[注册失败]：手机号已被注册");
            logger.info("[注册失败]：手机号已被注册");
            return outDto;
        }

        //密码加密
        inDto.setPassword(BaseUtil.encryption(inDto.getPassword()));

        //业务逻辑
        try {
            int flag = personService.signUp(inDto);
            if (flag == 0) {
                outDto.setCode(ResultCode.REPEAT);
                outDto.setMessage("[恭喜您，注册成功]");
                logger.info("[恭喜您，注册成功]");
            } else {
                outDto.setCode(ResultCode.FAIL);
                outDto.setMessage("[注册失败]：请稍后再试");
                logger.info("[注册失败]：请稍后再试");
                return outDto;
            }


        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            outDto.setMessage("[注册失败]：服务器繁忙");
        }


        return outDto;
    }

    /**
     * 修改密码
     * @return
     */
    @RequestMapping(value = "/updatePassword", method = RequestMethod.POST)
    @ResponseBody
    public Out updatePassword(@RequestBody UpdatePWDInDto inDto) {
        Out outDto = new Out();
        //校验验证码

        //更新密码

        return outDto;
    }

    /**
     * 用户注销
     * @return
     */
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    @ResponseBody
    public Out logout(@RequestBody UpdatePWDInDto inDto) {
        Out outDto = new Out();


        return outDto;
    }

    /**
     * 用户搜索
     * @return
     */
    @RequestMapping(value = "/search_user", method = RequestMethod.POST)
    @ResponseBody
    public Out searchUser(@RequestBody SearchUserInDto inDto) {
        Out outDto = new Out();

        //检索用户

        //返回用户数据List

        return outDto;
    }

    /**
     * 修改用户信息
     * @return
     */
    @RequestMapping(value = "/update_info", method = RequestMethod.POST)
    @ResponseBody
    public Out updateUserInfo(@RequestBody BaseInDto inDto) {
        Out outDto = new Out();

        return outDto;
    }

}

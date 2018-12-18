package com.xiaoji.gtd.controller;

import com.xiaoji.gtd.dto.LoginInDto;
import com.xiaoji.gtd.dto.LoginOutDto;
import com.xiaoji.gtd.dto.Out;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.service.IAuthService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.CommonMethods;
import com.xiaoji.util.TimerUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

/**
 * 验证类
 *
 * create by wzy on 2018/11/15.
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/auth")
public class AuthController {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final IAuthService authService;

    @Autowired
    public AuthController(IAuthService authService) {
        this.authService = authService;
    }

    /**
     * 游客验证
     * @return
     */
    @RequestMapping(value = "/login_visitors", method = RequestMethod.POST)
    @ResponseBody
    public Out loginVisitors(@RequestBody LoginInDto inDto) {
        Out outDto = new Out();
        LoginOutDto data = new LoginOutDto();

        //入参检测
        //必须项检测
        if(inDto.getDeviceId() == null || "".equals(inDto.getDeviceId())){
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[验证失败]：设备ID不可为空");
            return outDto;
        }
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.NULL_UUID);
            logger.debug("[验证失败]：用户ID不可为空");
            return outDto;
        }
        //入参正确性检测
        if (CommonMethods.checkMySqlReservedWords(inDto.getUserId())) {
            outDto.setCode(ResultCode.NULL_UUID);
            logger.debug("[验证失败]：用户ID类型或格式错误");
            return outDto;
        }
        if (CommonMethods.checkMySqlReservedWords(inDto.getDeviceId())) {
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[验证失败]：设备ID类型或格式错误");
            return outDto;
        }

        //业务逻辑
        try {
            data = authService.visitorsLogin(inDto);

            if (data != null){
                outDto.setData(data);
                outDto.setCode(ResultCode.SUCCESS);
                logger.debug("[验证成功]");
            } else {
                outDto.setCode(ResultCode.FAIL_AUTH);
                logger.debug("[验证失败]");
            }
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            outDto.setMessage("[验证失败]：服务器繁忙");
        }

        return outDto;
    }

    /**
     * 用户验证（密码）
     * @return
     */
    @RequestMapping(value = "/login_password", method = RequestMethod.POST)
    @ResponseBody
    public Out loginPassword(@RequestBody LoginInDto inDto) {
        Out outDto = new Out();
        LoginOutDto data;

        //入参检测
        //必须项检测
        if(inDto.getAccount() == null || "".equals(inDto.getAccount())){
            outDto.setCode(ResultCode.NULL_ACCOUNT);
            logger.debug("[登陆失败]：登陆账户名不可为空");
            return outDto;
        }
        if(inDto.getPassword() == null || "".equals(inDto.getPassword())){
            outDto.setCode(ResultCode.NULL_PASSWORD);
            logger.debug("[登陆失败]：密码不可为空");
            return outDto;
        }
        if(inDto.getDeviceId() == null || "".equals(inDto.getDeviceId())){
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[password登陆失败]：设备ID不可为空");
            return outDto;
        }

        //入参正确性检测
        if (CommonMethods.checkMySqlReservedWords(inDto.getAccount())) {
            outDto.setCode(ResultCode.NULL_UUID);
            logger.debug("[登陆失败]：账户名类型或格式错误");
            return outDto;
        }
        if (CommonMethods.checkMySqlReservedWords(inDto.getDeviceId())) {
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[登陆失败]：设备ID类型或格式错误");
            return outDto;
        }

        String password = BaseUtil.encryption(inDto.getPassword());
        inDto.setPassword(password);

        //业务逻辑
        try {
            data = authService.passwordLogin(inDto);
            if (data != null) {
                outDto.setData(data);
                outDto.setCode(ResultCode.SUCCESS);
                logger.debug("[登陆成功]");
            } else {
                outDto.setCode(ResultCode.FAIL_AUTH);
                logger.debug("[登陆失败]：用户名或密码输入错误");
            }
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            outDto.setMessage("[登陆失败]：服务器繁忙");
        }

        return outDto;
    }

    /**
     * 用户验证（验证码）
     * @return
     */
    @RequestMapping(value = "/login_code", method = RequestMethod.POST)
    @ResponseBody
    public Out loginAuthCode(@RequestBody LoginInDto inDto) {
        Out outDto = new Out();
        LoginOutDto data = new LoginOutDto();

        //入参检测
        //必须项检测
        if(inDto.getAccount() == null || "".equals(inDto.getAccount())){
            outDto.setCode(ResultCode.NULL_MOBILE);
            logger.debug("[登陆失败]：手机号不可为空");
            return outDto;
        }
        if(inDto.getDeviceId() == null || "".equals(inDto.getDeviceId())){
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[code登陆失败]：设备ID不可为空");
            return outDto;
        }
        if(inDto.getAuthCode() == null || "".equals(inDto.getAuthCode())){
            outDto.setCode(ResultCode.NULL_AUTH_CODE);
            logger.debug("[登陆失败]：验证码不可为空");
            return outDto;
        }
        //入参正确性检测
        if(!CommonMethods.isInteger(inDto.getAccount())){
            if(inDto.getAccount().length()!=11){
                outDto.setCode(ResultCode.ERROR_MOBILE);
                logger.debug("[登陆失败]：请输入正确手机号");
                return outDto;
            }
        }
        if (CommonMethods.checkMySqlReservedWords(inDto.getDeviceId())) {
            outDto.setCode(ResultCode.NULL_DEVICE_ID);
            logger.debug("[登陆失败]：设备ID类型或格式错误");
            return outDto;
        }
        try {
            if(!Objects.requireNonNull(TimerUtil.getCache(inDto.getAccount())).getValue().equals(inDto.getAuthCode())){
                outDto.setCode(ResultCode.ERROR_AUTH_CODE);
                logger.debug("[登陆失败]：请输入正确短信验证码");
                return outDto;
            }
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.EXPIRE_AUTH_CODE);
            outDto.setMessage("[登陆失败]：短信验证码已过期，请重新获取");
            logger.debug("[登陆失败]：短信验证码已过期");
            return outDto;
        }

        //业务逻辑
        try {
            data = authService.smsLogin(inDto);
            if (data != null) {
                outDto.setData(data);
                outDto.setCode(ResultCode.SUCCESS);
                outDto.setMessage("[登陆成功]");
                logger.debug("[code登陆失败]");
            } else {
                outDto.setCode(ResultCode.FAIL_AUTH);
                outDto.setMessage("[登陆失败]：请稍后再试");
                logger.debug("[code登陆失败]：请稍后再试");
            }
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            outDto.setMessage("[登陆失败]：服务器繁忙");
        }

        return outDto;
    }

}

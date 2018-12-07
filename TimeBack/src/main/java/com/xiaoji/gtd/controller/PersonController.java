package com.xiaoji.gtd.controller;

import com.xiaoji.config.interceptor.AuthCheck;
import com.xiaoji.gtd.dto.*;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.service.IPersonService;
import com.xiaoji.util.BaseUtil;
import com.xiaoji.util.CommonMethods;
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
            outDto.setCode(ResultCode.NULL_MOBILE);
            logger.debug("[注册失败]：手机号不可为空");
            return outDto;
        }
        if(inDto.getPassword() == null || "".equals(inDto.getPassword())){
            outDto.setCode(ResultCode.NULL_PASSWORD);
            logger.debug("[注册失败]：密码不可为空");
            return outDto;
        }
        if(inDto.getAuthCode() == null || "".equals(inDto.getAuthCode())){
            outDto.setCode(ResultCode.NULL_AUTHCODE);
            logger.debug("[注册失败]：请输入验证码不可为空");
            return outDto;
        }
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.NULL_UUID);
            logger.debug("[注册失败]：用户ID不可为空");
            return outDto;
        }
        //入参正确性检测
        if(!CommonMethods.isInteger(inDto.getAccountMobile())){
            if(inDto.getAccountMobile().length()!=11){
                outDto.setCode(ResultCode.ERROR_MOBILE);
                logger.debug("[注册失败]：请输入正确手机号");
                return outDto;
            }
        }
        if (CommonMethods.checkMySqlReservedWords(inDto.getUserId())) {
            outDto.setCode(ResultCode.ERROR_UUID);
            logger.debug("[注册失败]：用户ID类型或格式错误");
            return outDto;
        }
//        try {
//            if(!Objects.requireNonNull(TimerUtil.getCache(inDto.getAccountMobile())).getValue().equals(inDto.getAuthCode())){
//                outDto.setCode(ResultCode.ERROR_AUTHCODE);
//                logger.debug("[注册失败]：请输入正确短信验证码");
//                return outDto;
//            }
//        } catch (Exception e) {
//            e.printStackTrace();
//            outDto.setCode(ResultCode.EXPIRE_AUTHCODE);
//            logger.debug("[注册失败]：短信验证码已过期");
//            return outDto;
//        }


        //数据重复性
        //验证用户uuid重复
        if(personService.isRepeatUuid(inDto.getUserId())){
            outDto.setCode(ResultCode.REPEAT_UUID);
            logger.debug("[注册失败]：用户ID已被注册");
            return outDto;
        }
        //验证手机号码重复
        if(personService.isRepeatMobile(inDto.getAccountMobile())){
            outDto.setCode(ResultCode.REPEAT_MOBILE);
            logger.debug("[注册失败]：手机号已被注册");
            return outDto;
        }

        //密码加密
        inDto.setPassword(BaseUtil.encryption(inDto.getPassword()));

        //业务逻辑
        try {
            int flag = personService.signUp(inDto);
            if (flag == 0) {
                outDto.setCode(ResultCode.SUCCESS);
                logger.debug("[恭喜您，注册成功]");
            } else {
                outDto.setCode(ResultCode.FAIL_SIGNUP);
                logger.debug("[注册失败]：请稍后再试");
            }

        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("[注册失败]：服务器繁忙");
        }


        return outDto;
    }

    /**
     * 修改密码
     * @return
     */
    @RequestMapping(value = "/update_password", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out updatePassword(@RequestBody UpdatePWDInDto inDto) {
        Out outDto = new Out();
        //入参检测
        //必须项检测
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.NULL_UUID);
            logger.debug("[修改失败]：用户ID不可为空");
            return outDto;
        }
        if(inDto.getOldPassword() == null || "".equals(inDto.getOldPassword())){
            outDto.setCode(ResultCode.NULL_OLD_PASSWORD);
            logger.debug("[修改失败]：请输入当前密码");
            return outDto;
        }
        if(inDto.getPassword() == null || "".equals(inDto.getPassword())){
            outDto.setCode(ResultCode.NULL_PASSWORD);
            logger.debug("[修改失败]：请输入新密码");
            return outDto;
        }
        //入参正确性检测
        if (CommonMethods.checkMySqlReservedWords(inDto.getUserId())) {
            outDto.setCode(ResultCode.ERROR_UUID);
            logger.debug("[修改失败]：用户ID类型或格式错误");
            return outDto;
        }
        if (personService.isPasswordTrue(inDto.getUserId(), inDto.getOldPassword())) {
            outDto.setCode(ResultCode.ERROR_PASSWORD);
            logger.debug("[修改失败]：输入密码错误");
            return outDto;
        }

        //业务操作
        try {
            personService.updatePassword(inDto);
            outDto.setCode(ResultCode.SUCCESS);
            logger.debug("[修改成功]");

        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("[修改失败]：服务器繁忙");
        }

        return outDto;
    }

    /**
     * 用户注销
     * (暂无)
     * @return
     */
    @RequestMapping(value = "/logout", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
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
    @AuthCheck
    public Out searchUser(@RequestBody SearchUserInDto inDto) {
        Out outDto = new Out();
        SearchUserOutDto data;

        //入参检测
        //必须项检测
        if(inDto.getAccountMobile() == null || "".equals(inDto.getAccountMobile())){
            outDto.setCode(ResultCode.NULL_MOBILE);
            logger.debug("[查询失败]：手机号不可为空");
            return outDto;
        }
        //入参正确性检测
        if(!CommonMethods.isInteger(inDto.getAccountMobile())){
            if(inDto.getAccountMobile().length()!=11){
                outDto.setCode(ResultCode.ERROR_MOBILE);
                logger.debug("[查询失败]：请输入正确手机号");
                return outDto;
            }
        }

        //业务逻辑
        try {

            data = personService.searchPlayer(inDto);
            if (data != null) {
                outDto.setData(data);
                outDto.setCode(ResultCode.SUCCESS);
                logger.debug("[查询成功]");
            } else {
                outDto.setCode(ResultCode.NULL_USER);
                logger.debug("[查询成功]：该手机号尚未注册");
            }
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("[查询失败]：服务器繁忙");
        }

        return outDto;
    }


    /**
     * 添加联系人
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/add_player", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out addPlayer(@RequestBody PlayerInDto inDto) {
        Out outDto = new Out();

        //入参检测
        //必须项检测
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.NULL_MOBILE);
            logger.debug("[添加失败]：用户ID不可为空");
            return outDto;
        }
        if(inDto.getTargetUserId() == null || "".equals(inDto.getTargetUserId())){
            outDto.setCode(ResultCode.NULL_MOBILE);
            logger.debug("[添加失败]：目标联系人ID不可为空");
            return outDto;
        }
        //入参正确性验证
        if (CommonMethods.checkMySqlReservedWords(inDto.getUserId())) {
            outDto.setCode(ResultCode.ERROR_UUID);
            logger.debug("[添加失败]：用户ID类型或格式错误");
            return outDto;
        }
        if (CommonMethods.checkMySqlReservedWords(inDto.getTargetUserId())) {
            outDto.setCode(ResultCode.ERROR_UUID);
            logger.debug("[添加失败]：目标联系人ID类型或格式错误");
            return outDto;
        }

        //业务逻辑
        try {

            int flag = personService.addPlayer(inDto);
            if (flag == 0) {
                outDto.setCode(ResultCode.SUCCESS);
                logger.debug("[添加成功]");
            } else {
                outDto.setCode(ResultCode.NULL_USER);
                logger.debug("[添加失败]：该手机号尚未注册");
            }
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("[添加失败]：服务器繁忙");
        }

        return outDto;
    }

    /**
     * 修改用户信息
     * @return
     */
    @RequestMapping(value = "/update_info", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out updateUserInfo(@RequestBody UserInfoInDto inDto) {
        Out outDto = new Out();

        //入参检测
        //必须项检测
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.NULL_MOBILE);
            logger.debug("[修改失败]：用户ID不可为空");
            return outDto;
        }


        return outDto;
    }

}

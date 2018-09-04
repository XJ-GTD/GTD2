package com.manager.master.controller;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.BaseOutDto;
import com.manager.master.dto.UserInDto;
import com.manager.master.dto.UserOutDto;
import com.manager.master.service.CreateQueueService;
import com.manager.master.service.IUserService;
import com.manager.util.BaseUtil;
import com.manager.util.CreateQueueUtil;
import com.manager.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.Map;
import java.util.TreeMap;

/**
 * 用户controller
 *
 * create by wzy on 2018/08/24
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/user")
public class UserController {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    IUserService userService;
    @Autowired
    RabbitTemplate rabbitTemplate;
    @Autowired
    CreateQueueService createQueueService;

    /**
     * 用户注册
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto register(@RequestBody UserInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();
        //获取入参
         String accountMobile = inDto.getAccountMobile();       //手机号
         String accountWechat=inDto.getAccountWechat();       //微信
         String accountQq=inDto.getAccountQq();            //QQ
         String accountPassword=inDto.getAccountPassword();     //登陆密码
//         String accountName=inDto.getAccountName();         //登陆名(登陆可输入手机号可为账户名)
//         String accountUuid=inDto.getAccountUuid();         //唯一标识码
         Integer loginType=inDto.getLoginType();           //登陆类型 0:手机或账户名登陆， 1：微信登陆， 2：QQ登陆
         String userName=inDto.getUserName();
        //入参检查
         //必填项检查
        if(accountMobile==null || "".equals(accountMobile)){
            if(accountWechat==null || "".equals(accountWechat)){
               if(accountQq==null || "".equals(accountQq)){
                   outBean.setCode(ResultCode.REPEAT);
                   outBean.setMessage("[注册失败]：手机号/微信/QQ不可都为空");
                   logger.info("[注册失败]：手机号/微信/QQ不可都为空");
                   return outBean;
               }
            }
        }
        if(accountPassword==null || "".equals(accountPassword)){
            outBean.setCode(ResultCode.REPEAT);
            outBean.setMessage("[注册失败]：密码不可为空");
            logger.info("[注册失败]：密码不可为空");
            return outBean;
        }
        if(loginType==null){
            outBean.setCode(ResultCode.REPEAT);
            outBean.setMessage("[注册失败]：登录类型不可为空");
            logger.info("[注册失败]：登录类型不可为空");
            return outBean;
        }
        //入参类型检查
        if(accountMobile!=null && !"".equals(accountMobile)){
            if(!BaseUtil.isInteger(accountMobile)){
                outBean.setCode(ResultCode.REPEAT);
                outBean.setMessage("[注册失败]：手机类型错误");
                logger.info("[注册失败]：手机类型错误");
                return outBean;
            }
        }
        if(loginType!=0 && loginType!=1 && loginType!=2){
            outBean.setCode(ResultCode.REPEAT);
            outBean.setMessage("[注册失败]：登录类型入参错误");
            logger.info("[注册失败]：登录类型入参错误");
            return outBean;
        }
        //入参长度检查
        if(accountMobile!=null && !"".equals(accountMobile)){
            if(accountMobile.length()!=11){
                outBean.setCode(ResultCode.REPEAT);
                outBean.setMessage("[注册失败]：手机号位数错误");
                logger.info("[注册失败]：手机号位数错误");
                return outBean;
            }
        }
        if(accountPassword.length()<6){
            outBean.setCode(ResultCode.REPEAT);
            outBean.setMessage("[注册失败]：密码位数请不小于6位");
            logger.info("[注册失败]：密码位数请不小于6位");
            return outBean;
        }
        //入参关联检查
        //业务逻辑
        try {
            int flag = userService.registerUser(inDto);

            if (flag == 0) {
                outBean.setCode(ResultCode.SUCCESS);
                outBean.setMessage("[注册成功]");
                logger.info("[注册成功]");
            } else if (flag == 1) {
                outBean.setCode(ResultCode.REPEAT);
                outBean.setMessage("[注册失败]：手机号已注册");
                logger.info("[注册失败]：手机号已注册");
            }
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return outBean;
    }

    /**
     * 用户登录
     * @param inDto
     * @return
     */
    @PostMapping(value = "/login")
    @ResponseBody
    public BaseOutDto login(@RequestBody UserInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();
        Map<String, UserOutDto> data = new TreeMap<>();
        UserOutDto userInfo = new UserOutDto();
        //获取入参
        String password =inDto.getAccountPassword();
        String accountName=inDto.getAccountName();
        String accountMobile=inDto.getAccountMobile();
        //入参判断是否为空
        if(password==null || "".equals(password)){
            outBean.setCode(ResultCode.FAIL);
            outBean.setMessage("[登陆失败]：请输入密码");
            logger.info("[登陆失败]：请输入密码");
            return outBean;
        }
        if(accountName==null || "".equals(accountName)){
            if(accountMobile==null || "".equals(accountMobile)){
                outBean.setCode(ResultCode.FAIL);
                outBean.setMessage("[登陆失败]：请输入用户名");
                logger.info("[登陆失败]：请输入用户名");
                return outBean;
            }
        }
        //业务逻辑
        try {

            userInfo = userService.login(inDto);
            data.put("userInfo", userInfo);
            outBean.setData(data);
            outBean.setCode(ResultCode.SUCCESS);
            outBean.setMessage("[登陆成功]");
            logger.info("[登陆成功]");
        } catch (Exception e){
            outBean.setCode(ResultCode.FAIL);
            outBean.setMessage("[登陆失败]：用户名或密码输入错误");
            logger.info(e.getMessage());
            throw new ServiceException("[登陆失败]：用户名或密码输入错误");
        }

        return outBean;
    }

    /**
     * 调用创建对列测试样式
     * @param
     * @return
     */
    @RequestMapping(value = "/test", method = RequestMethod.GET)
    @ResponseBody
    public BaseOutDto test() {
        BaseOutDto outBean = new BaseOutDto();
       System.out.print("开始创建对列");

        try {
            createQueueService.createQueue(189,"exchange");
        } catch (IOException e) {
            e.printStackTrace();
        }
        return outBean;
    }
}

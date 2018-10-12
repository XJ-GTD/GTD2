package com.manager.master.controller;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.*;
import com.manager.master.service.CreateQueueService;
import com.manager.master.service.IUserService;
import com.manager.util.BaseUtil;
import com.manager.util.CommonMethods;
import com.manager.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;
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

    private final IUserService userService;
    private final RabbitTemplate rabbitTemplate;
    private final CreateQueueService createQueueService;

    @Autowired
    public UserController(IUserService userService, RabbitTemplate rabbitTemplate, CreateQueueService createQueueService) {
        this.userService = userService;
        this.rabbitTemplate = rabbitTemplate;
        this.createQueueService = createQueueService;
    }

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
        //密码加密
        accountPassword=BaseUtil.encryption(accountPassword);
        inDto.setAccountPassword(accountPassword);
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
            } else {
                inDto.setAccountName(accountMobile);
            }
        }

        //密码加密
        password=BaseUtil.encryption(password);
        inDto.setAccountPassword(password);
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
     * 标签查询
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/find_label", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto findLabel(@RequestBody LabelInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        Map<String, List<LabelOutDto>> data = new TreeMap<>();
        try{
            List<LabelOutDto> labelList = userService.findLabel(inDto);
            if (labelList != null && labelList.size() != 0){
                data.put("labelList", labelList);
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("标签查询成功");
                baseOutDto.setData(data);
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("标签查询失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 用户密码修改（登陆后）
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/update_password", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updatePassword(@RequestBody UserPasswordInDto inDto){
        BaseOutDto baseOutDto = new BaseOutDto();
        // 获取入参
        Integer userId = inDto.getUserId();
        String oldPassword = inDto.getOldPassword();
        String newPassword = inDto.getNewPassword();
        // 入参必须项检查
        if(userId == null || "".equals(userId)){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("用户ID不能为空，请确认后重新请求");
            logger.error("用户ID不能为空");
            return baseOutDto;
        }
        if(oldPassword == null || "".equals(oldPassword)){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("旧密码不能为空，请确认后重新请求");
            logger.error("旧密码不能为空");
            return baseOutDto;
        }
        if(newPassword == null || "".equals(newPassword)){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("新密码不能为空，请确认后重新请求");
            logger.error("新密码不能为空");
            return baseOutDto;
        }
        // 入参长度检查
        if(newPassword.length()<6){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("[修改失败]：新密码长度不能小于6位");
            logger.error("[修改失败]：新密码长度不能小于6位");
            return baseOutDto;
        }

        // 业务处理
        // 查询原始密码
        String oldPasswordDB = null;
        try{
            oldPasswordDB = userService.findPassword(userId);
        } catch (Exception e){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("原始密码查询错误");
            logger.error("原始密码查询错误");
            return baseOutDto;
        }
        // 旧密码加密
        oldPassword = BaseUtil.encryption(oldPassword);
        // 新密码加密
        newPassword = BaseUtil.encryption(newPassword);
        // 判断 旧密码输入是否正确
        if(!oldPassword.equals(oldPasswordDB)){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("[修改失败]：原密码输入错误");
            logger.error("[修改失败]：原密码输入错误");
            return baseOutDto;
        }
        // 判断 新密码是否与旧密码相同
        if(newPassword.equals(oldPasswordDB)){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("[修改失败]：新密码不能与原密码相同");
            logger.error("[修改失败]：新密码不能与原密码相同");
            return baseOutDto;
        }
        try {
            userService.updatePassword(userId,newPassword);
            baseOutDto.setCode(ResultCode.SUCCESS);
            baseOutDto.setMessage("[密码修改成功]");
        } catch (Exception e){
            e.printStackTrace();
        }
        return baseOutDto;
    }

    /**
     * 用户资料编辑
     * @return
     */
    @RequestMapping(value = "/update_userinfo", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateUserInfo(@RequestBody UserInDto infoInDto){
        BaseOutDto baseOutDto = new BaseOutDto();
        UserOutDto user = new UserOutDto();
        Map<String, UserOutDto> data = new TreeMap<>();

        // 获取入参
        Integer userId = infoInDto.getUserId();          // 用户ID
        String userName = infoInDto.getUserName();       // 昵称
        String headImgUrl = infoInDto.getHeadImgUrl();   // 用户头像
        String birthday = infoInDto.getBirthday();       // 生日
        String userSex = infoInDto.getUserSex();         // 性别
        String userContact = infoInDto.getUserContact();    // 联系方式
        // 必须项检查
        if(userId == null || "".equals(userId)){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("[编辑失败]：用户ID不可为空");
            logger.error("[编辑失败]：用户ID不可为空");
            return baseOutDto;
        }
        // 入参类型检查
        if(userSex != null && !"".equals(userSex)){
            if(!CommonMethods.isInteger(userSex)){
                baseOutDto.setCode(ResultCode.FAIL);
                baseOutDto.setMessage("[编辑失败]：性别必须为指定整数");
                logger.error("[编辑失败]：性别必须为指定整数");
                return baseOutDto;
            }
            if(!"0".equals(userSex) && !"1".equals(userSex)){
                baseOutDto.setCode(ResultCode.FAIL);
                baseOutDto.setMessage("[编辑失败]：性别必须为指定整数");
                logger.error("[编辑失败]：性别必须为指定整数");
                return baseOutDto;
            }
        }
        if(!CommonMethods.checkIsPhoneNumber(userContact)){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("[编辑失败]：联系方式格式不正确");
            logger.error("[编辑失败]：联系方式格式不正确");
            return baseOutDto;
        }
        if(!CommonMethods.checkIsDate2(birthday)){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("[编辑失败]：生日格式不正确");
            logger.error("[编辑失败]：生日格式不正确");
            return baseOutDto;
        }
        if(CommonMethods.checkMySqlReservedWords(userName)){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("[编辑失败]：昵称不能包含非法字符");
            logger.error("[编辑失败]：昵称不能包含非法字符");
            return baseOutDto;
        }
        if(CommonMethods.checkMySqlReservedWords(headImgUrl)){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("[编辑失败]：用户头像不能包含非法字符");
            logger.error("[编辑失败]：用户头像不能包含非法字符");
            return baseOutDto;
        }

        try {
            user = userService.updateUserInfo(infoInDto);
        } catch (Exception e){
            e.printStackTrace();
        }
        if(user != null){
            data.put("userInfo", user);
            baseOutDto.setData(data);
            baseOutDto.setCode(ResultCode.SUCCESS);
            baseOutDto.setMessage("[编辑成功]");
            logger.info("[编辑成功]");
        } else {
            baseOutDto.setCode(ResultCode.REPEAT);
            baseOutDto.setMessage("[编辑失败]");
            logger.info("[编辑失败]");
        }
        return baseOutDto;
    }

}

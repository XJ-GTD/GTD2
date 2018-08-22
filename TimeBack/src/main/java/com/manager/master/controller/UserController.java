package com.manager.master.controller;

import com.manager.master.dto.BaseOutDto;
import com.manager.master.dto.UserInfoInDto;
import com.manager.master.dto.UserInfoOutDto;
import com.manager.master.service.IUserService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

/**
 * create by wzy on 2018/04/24.
 * 用户类
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/user")
public class UserController {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    IUserService userService;

    /**
     * 用户用户登录
     * @param
     * @return
     */
    @RequestMapping(value = "/login", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto login(@RequestBody UserInfoInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();
        Map<String, UserInfoOutDto> data = new HashMap<>();

        UserInfoOutDto userAccountBean = userService.loginUser(inDto.getAccountMobile(),inDto.getAccountPassword());

        if (userAccountBean != null) {
            data.put("userInfo", userAccountBean);
            outBean.setData(data);
            outBean.setCode("0");
            outBean.setMessage("[登录成功]");
            logger.info("[登录成功]"+ data);
        } else {
            data.put("userInfo", userAccountBean);
            outBean.setData(data);
            outBean.setCode("1");
            outBean.setMessage("[登录失败]:用户名或密码输入错误!");
            logger.info("[登录失败]" + data);
        }
        return outBean;
    }
    /**
     * 查询用户信息
     * @param mobile
     * @return
     */
    @RequestMapping(value = "/find/{mobile}", method = RequestMethod.GET)
    @ResponseBody
    public BaseOutDto findUser(@PathVariable String mobile) {
        BaseOutDto outBean = new BaseOutDto();
        Map<String, UserInfoOutDto> data = new HashMap<>();
        UserInfoOutDto userInfoBean = userService.findUser(mobile);

        if (userInfoBean != null) {
            data.put("user", userInfoBean);
            outBean.setData(data);
            outBean.setCode("0");
            outBean.setMessage("Find Success!");
            logger.info("[查询成功]"+ data);
        } else {
            data.put("user", userInfoBean);
            outBean.setData(data);
            outBean.setCode("1");
            outBean.setMessage("Find fail!");
            logger.info("[查询失败]" + data);
        }

        return outBean;
    }
    /**
     * 用户注册
     * @parame
     * @return
     */
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto create(@RequestBody UserInfoInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();

        int flag = userService.createUser(inDto);

        if(flag == 1){
            outBean.setCode("1");
            outBean.setMessage("[注册失败]:用户已存在！");
            logger.info("[用户已存在！]");
        }else if (flag == 0){
            outBean.setCode("0");
            outBean.setMessage("[注册成功]");
            logger.info("[注册成功]");
        }

        return outBean;
    }

}

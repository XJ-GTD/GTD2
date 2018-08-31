package com.manager.master.controller;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.BaseOutDto;
import com.manager.master.dto.UserInDto;
import com.manager.master.dto.UserOutDto;
import com.manager.master.service.IUserService;
import com.manager.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

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

    /**
     * 用户注册
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/register", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto register(@RequestBody UserInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();

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

}

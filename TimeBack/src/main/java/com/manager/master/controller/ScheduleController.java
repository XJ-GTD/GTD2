package com.manager.master.controller;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.BaseOutDto;
import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ScheduleOutDto;
import com.manager.master.entity.GtdScheduleEntity;
import com.manager.master.service.IScheduleService;
import com.manager.util.ProducerUtil;
import com.manager.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.jpa.JpaSystemException;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * 日程Controller
 *
 * create by wzy on 2018/08/24
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/schedule")
public class ScheduleController {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Autowired
    IScheduleService scheduleService;

    /**
     * 新增日程
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto addSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag;
        try{
            flag = scheduleService.addSchedule(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("成功");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("新增日程信息失败");
        }catch (Exception ex){
            if (ex instanceof JpaSystemException){
                baseOutDto.setCode(ResultCode.FAIL).setMessage("操作数据库异常");
                return baseOutDto;
            }
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 更新日程
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/editor", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag;
        try{
            flag = scheduleService.updateSchedule(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("成功");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("更新日程信息失败");
        }catch (Exception ex){
            if (ex instanceof JpaSystemException){
                baseOutDto.setCode(ResultCode.FAIL).setMessage("操作数据库异常");
                return baseOutDto;
            }
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 删除日程
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/delete", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto deleteSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag;
        try{
            flag = scheduleService.deleteSchedule(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("成功");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("删除日程信息失败");
        }catch (Exception ex){
            if (ex instanceof JpaSystemException){
                baseOutDto.setCode(ResultCode.FAIL).setMessage("操作数据库异常");
                return baseOutDto;
            }
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

}

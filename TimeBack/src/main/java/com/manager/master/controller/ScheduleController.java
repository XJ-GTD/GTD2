package com.manager.master.controller;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.*;
import com.manager.master.entity.GtdGroupEntity;
import com.manager.master.entity.GtdLabelEntity;
import com.manager.master.entity.GtdScheduleEntity;
import com.manager.master.entity.GtdUserEntity;
import com.manager.master.service.IScheduleService;
import com.manager.util.ResultCode;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;

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

    @RequestMapping(value = "/find",method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto findSchedule(@RequestBody FindScheduleInDto indto){
        BaseOutDto baseOutDto = new BaseOutDto();
        Map<String,List> map = new HashMap<>();
        try{
            // 查询自己创建的日程
            List<FindScheduleOutDto> scheduleCreateList = scheduleService.findCreateSchedule(indto);
            // 查询自己参与的日程
            List<FindScheduleOutDto> scheduleJoinList = scheduleService.findJoinSchedule(indto);

            map.put("scheduleCreateList",scheduleCreateList);
            map.put("scheduleJoinList",scheduleJoinList);

            baseOutDto.setData(map);
            baseOutDto.setCode(ResultCode.SUCCESS);
            baseOutDto.setMessage("[查询完成]");
        } catch (Exception e){
            baseOutDto.setCode(ResultCode.FAIL);
            baseOutDto.setMessage("[查询失败]：请联系技术人员");
            logger.info(e.getMessage());
            throw new ServiceException("[查询失败]：请联系技术人员");
        }



        return baseOutDto;
    }

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
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("创建日程成功");
                // TODO 创建日程发布
//        String dataMessage = inDto.toString();
//        String target = inDto.getTarget();
//        producerUtil.sendTheTarget(dataMessage, target);
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("新增日程信息失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 编辑日程
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
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("编辑日程成功");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("更新日程信息失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 日程发布撤回参与人
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/withdraw", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto releaseToWithdrawSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag;
        try{
            flag = scheduleService.releaseToWithdrawSchedule(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("成功撤回");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("日程发布撤回失败");
        }catch (Exception ex){
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
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("成功删除日程");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("删除日程信息失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }

    /**
     * 日程状态修改
     * @param inDto
     * @return
     */
    @RequestMapping(value = "/status", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto statusSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto baseOutDto = new BaseOutDto();
        int flag;
        try{
            flag = scheduleService.statusSchedule(inDto);
            if (flag == 0){
                baseOutDto.setCode(ResultCode.SUCCESS).setMessage("日程状态修改成功");
            }else baseOutDto.setCode(ResultCode.REPEAT).setMessage("日程状态修改失败");
        }catch (Exception ex){
            throw new ServiceException(ex.getMessage());
        }
        return baseOutDto;
    }


}

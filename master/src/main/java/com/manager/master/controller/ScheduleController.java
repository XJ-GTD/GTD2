package com.manager.master.controller;

import com.manager.master.dto.BaseOutDto;
import com.manager.master.dto.PersonScheduleDto;
import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ScheduleOutDto;
import com.manager.master.service.IScheduleService;
import com.manager.util.ProducerUtil;
import com.manager.util.UUIDUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * create by zy on 2018/05/04.
 * 日程类
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/schedule")
public class ScheduleController {

    private Logger logger = LogManager.getLogger(this.getClass());
    private final IScheduleService scheduleService;

    private final ProducerUtil producerUtil;

    @Autowired
    public ScheduleController(IScheduleService scheduleService, ProducerUtil producerUtil) {
        this.scheduleService = scheduleService;
        this.producerUtil = producerUtil;
    }

    /**
     * test 稍后删除
     */
    @RequestMapping(value = "/test", method = RequestMethod.POST)
    public void test(@RequestBody ScheduleInDto inDto) {

        producerUtil.send(inDto.getScheduleName());
    }

    /**
     * 日程创建
     * @parame
     * @return
     */
    @RequestMapping(value = "/create", method = RequestMethod.POST)
    public BaseOutDto create(@RequestBody ScheduleInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        //获取群编号
        String uuid =UUIDUtil.getUUID();
        inDto.setGroupId(uuid);//给群组id加上关联号

        if(inDto.getScheduleIssuer()==0 ){
            outDto.setCode("1");
            outDto.setMessage("[发布人为空]");
            logger.info("[发布人为空！]");
            return outDto;
        }

        int  scheduleFlag = scheduleService.createSchedule(inDto);
//        //添加日程关联
//        scheduleService.createExecutorSchedule(inDto);

        if(scheduleFlag == 0) {
            outDto.setCode("0");
            outDto.setMessage("[创建成功]");
            logger.info("[创建成功]");
        } else if (scheduleFlag == 1) {
            outDto.setCode("1");
            outDto.setMessage("[创建失败]：入库失败");
            logger.info("[创建失败]：入库失败");
        } else {
            outDto.setCode("-1");
            outDto.setMessage("[创建失败]：后台异常");
            logger.info("[创建失败]：后台异常");
        }

        return outDto;
    }
    /**
     * 个人日程编辑
     * @param
     * @return
     */
    @RequestMapping(value = "/updateSchedule", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateSchedule(@RequestBody ScheduleInDto inDto) {
        BaseOutDto outDto = new BaseOutDto();

        inDto.setScheduleState("-1");//事件状态(-1 未完成 1完成)
        int flag = scheduleService.updateSchedule(inDto);

        if(flag == 0) {
            outDto.setCode("0");
            outDto.setMessage("[编辑成功]");
            logger.info("[编辑成功]");
        } else if (flag == 1) {
            outDto.setCode("1");
            outDto.setMessage("[编辑失败]：入库失败");
            logger.info("[编辑失败]：入库失败");
        } else {
            outDto.setCode("-1");
            outDto.setMessage("[编辑失败]：后台异常");
            logger.info("[编辑失败]：后台异常");
        }

        return outDto;
    }
    /**
     * 日程查询
     * @param
     * @return
     */
    @RequestMapping(value = "/findAll", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto find(@RequestBody ScheduleInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();
        Map<String, List<ScheduleOutDto>> data = new HashMap<>();
        List<ScheduleOutDto> ScheduleDataList = scheduleService.findSchedule(Integer.parseInt(inDto.getUserId()));

        if(ScheduleDataList != null){
            data.put("scheduleInfoList", ScheduleDataList);
            outBean.setData(data);
            outBean.setCode("0");
            outBean.setMessage("[查询成功]");
            logger.info("[查询成功]"+ data);
        }else{
            data.put("scheduleInfoList", ScheduleDataList);
            outBean.setData(data);
            outBean.setCode("1");
            outBean.setMessage("[查询失败]");
            logger.info("[查询失败]" + data);
        }

        return outBean;
    }

    /**
     * 单条日程查询
     * @param scheduledId
     * @return
     */
    @RequestMapping(value = "/findScheduleByOne/{scheduledId}", method = RequestMethod.GET)
    @ResponseBody
    public BaseOutDto findByOne(@PathVariable int scheduledId) {
        BaseOutDto outBean = new BaseOutDto();
        Map<String, ScheduleOutDto> data = new HashMap<>();
        ScheduleOutDto ScheduleData = scheduleService.findScheduleByOne(scheduledId);

        if(ScheduleData != null){
            data.put("scheduleInfo", ScheduleData);
            outBean.setData(data);
            outBean.setCode("0");
            outBean.setMessage("[查询成功]");
            logger.info("[查询成功]"+ data);
        }else{
            data.put("scheduleInfo", ScheduleData);
            outBean.setData(data);
            outBean.setCode("1");
            outBean.setMessage("[查询失败]");
            logger.info("[查询失败]" + data);
        }

        return outBean;
    }
    /**
     * 一个群组下的所有日程查询
     * @param
     * @return
     */
    @RequestMapping(value = "/findSchByGroup/{groupId}", method = RequestMethod.GET)
    @ResponseBody
    public BaseOutDto findScheduleByGroupId(@PathVariable String groupId) {
        BaseOutDto outBean = new BaseOutDto();
        Map<String, List<ScheduleOutDto>> data = new HashMap<>();
        List<ScheduleOutDto> ScheduleDataList = scheduleService.findScheduleByGroup(groupId);

        if(ScheduleDataList != null){
            data.put("scheduleInfoList", ScheduleDataList);
            outBean.setData(data);
            outBean.setCode("0");
            outBean.setMessage("[查询成功]");
            logger.info("[查询成功]"+ data);
        }else{
            data.put("scheduleInfoList", ScheduleDataList);
            outBean.setData(data);
            outBean.setCode("1");
            outBean.setMessage("[查询失败]");
            logger.info("[查询失败]" + data);
        }

        return outBean;
    }
    /**
     * 根据事件ID和USERID查询时间表和执行表
     * @param
     * @return
     */
    @RequestMapping(value = "/findSchAndExcu/{scheduleId}/{userId}", method = RequestMethod.GET)
    @ResponseBody
    public BaseOutDto findSchAndExcuByScheduleIdAndUserId(@PathVariable int scheduleId,@PathVariable int userId) {
        BaseOutDto outBean = new BaseOutDto();
        Map<String, ScheduleOutDto> data = new HashMap<>();
        ScheduleOutDto ScheduleData = scheduleService.findScheduleAndExeBySchIdAndUserId(scheduleId,userId);

        if(ScheduleData != null){
            data.put("scheduleInfo", ScheduleData);
            outBean.setData(data);
            outBean.setCode("0");
            outBean.setMessage("[查询成功]");
            logger.info("[查询成功]"+ data);
        }else{
            data.put("scheduleInfo", ScheduleData);
            outBean.setCode("1");
            outBean.setData(data);
            outBean.setMessage("[查询失败]");
            logger.info("[查询失败]" + data);
        }

        return outBean;
    }
    /**
     * 新建群组下的事件,然后添加执行事件表的关联
     * @parame
     * @return
     */
    @RequestMapping(value = "/createII", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto createSchBy(@RequestBody ScheduleInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();
        //添加日程
        scheduleService.createSchByGroupId(inDto);
        outBean.setCode("0");
        outBean.setMessage("[创建成功]");
        logger.info("[创建成功]");
        return outBean;
    }

    /**
     * 个人日历日程查询
     * @parame
     * @return
     */
    @RequestMapping(value = "/createschbycalendar/{date}/{userId}", method = RequestMethod.GET)
    @ResponseBody
    public BaseOutDto createSchByCalendar(@PathVariable String date,@PathVariable int userId) {
        BaseOutDto outBean = new BaseOutDto();
        PersonScheduleDto PersonScheduleDto=new PersonScheduleDto();
//        PersonScheduleDto.setCalendarDate(date);

        outBean.setCode("0");
        outBean.setMessage("[创建成功]");
        logger.info("[创建成功]");
        return outBean;
    }
    /**
     * 个人日程编辑
     * @param
     * @return
     */
    @RequestMapping(value = "/updateExecutorSchedule", method = RequestMethod.POST)
    @ResponseBody
    public BaseOutDto updateScheduleByScheduleIdAndUserId(@RequestBody ScheduleInDto inDto) {
        BaseOutDto outBean = new BaseOutDto();
        Map<String, ScheduleOutDto> data = new HashMap<>();
        inDto.setScheduleState("-1");//事件状态(-1 未完成 1完成)
        scheduleService.updateScheduleByScheduleIdAndUserId(inDto);

        outBean.setData(data);
        outBean.setCode("0");
        outBean.setMessage("[修改成功]");
        logger.info("[修改成功]"+ data);

        return outBean;
    }

}

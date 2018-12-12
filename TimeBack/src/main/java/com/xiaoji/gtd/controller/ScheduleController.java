package com.xiaoji.gtd.controller;

import com.xiaoji.config.interceptor.AuthCheck;
import com.xiaoji.gtd.dto.*;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.service.IScheduleService;
import com.xiaoji.util.CommonMethods;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

/**
 * 日程类
 *
 * create by wzy on 2018/11/15.
 */
@CrossOrigin
@RestController
@RequestMapping(value = "/schedule")
public class ScheduleController {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final IScheduleService scheduleService;

    @Autowired
    public ScheduleController(IScheduleService scheduleService) {
        this.scheduleService = scheduleService;
    }

    /**
     * 推送日程消息
     * @return
     */
    @RequestMapping(value = "/deal", method = RequestMethod.POST)
    @ResponseBody
    @AuthCheck
    public Out dealWithSchedule(@RequestBody ScheduleInDto inDto) {
        Out outDto = new Out();

        //入参检测
        //非空检测
        if(inDto.getUserId() == null || "".equals(inDto.getUserId())){
            outDto.setCode(ResultCode.NULL_MOBILE);
            logger.debug("[推送日程失败]：用户ID不可为空");
            return outDto;
        }
        if(inDto.getScheduleId() == null || "".equals(inDto.getScheduleId())){
            outDto.setCode(ResultCode.NULL_SCHEDULE_ID);
            logger.debug("[推送日程失败]：技能类型不可为空");
            return outDto;
        }
        if(inDto.getScheduleName() == null || "".equals(inDto.getScheduleName())){
            outDto.setCode(ResultCode.NULL_SCHEDULE_NAME);
            logger.debug("[推送日程失败]：日程主题不可为空");
            return outDto;
        }
        if(inDto.getPlayers() == null || inDto.getPlayers().size() != 0){
            outDto.setCode(ResultCode.NULL_PLAYER);
            logger.debug("[推送日程失败]：参与人不可为空");
            return outDto;
        }
        if(inDto.getStartTime() == null || "".equals(inDto.getStartTime())){
            outDto.setCode(ResultCode.NULL_TIME);
            logger.debug("[推送日程失败]：日程时间不可为空");
            return outDto;
        }
        if(inDto.getSkillType() == null || "".equals(inDto.getSkillType())){
            outDto.setCode(ResultCode.NULL_SKILL_TYPE);
            logger.debug("[推送日程失败]：技能类型不可为空");
            return outDto;
        }
        //入参正确性验证
        if (CommonMethods.checkMySqlReservedWords(inDto.getUserId())) {
            outDto.setCode(ResultCode.ERROR_UUID);
            logger.debug("[推送日程失败]：用户ID类型或格式错误");
            return outDto;
        }
        if(!CommonMethods.isInteger(inDto.getSkillType())){
            outDto.setCode(ResultCode.ERROR_SKILL_TYPE);
            logger.debug("[推送日程失败]：请输入正确技能类型");
            return outDto;
        }

        //业务逻辑
        try {

            int flag = scheduleService.dealWithSchedule(inDto);
            if (flag == 0) {
                outDto.setCode(ResultCode.SUCCESS);
                logger.debug("dealWithSchedule 推送日程成功");
            } else {
                outDto.setCode(ResultCode.FAIL_SCHEDULE);
                logger.debug("dealWithSchedule 推送日程失败");
            }
        } catch (Exception e) {
            e.printStackTrace();
            outDto.setCode(ResultCode.INTERNAL_SERVER_ERROR);
            logger.error("日程推送失败：服务器错误");
        }

        return outDto;
    }

}

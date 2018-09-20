package com.manager.master.service.serviceImpl;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.*;
import com.manager.master.service.IAiUiService;
import com.manager.master.service.IGroupService;
import com.manager.master.service.IScheduleService;
import com.manager.util.AiUiUtil;
import com.manager.util.JsonParserUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 语义解析方法接口实现类
 *
 * create by wzy on 2018/09/14
 */
@Service
@Transactional
public class AiUiServiceImpl implements IAiUiService {

    private Logger logger = LogManager.getLogger(this.getClass());

    private final IScheduleService scheduleService;
    private final IGroupService groupService;

    @Autowired
    public AiUiServiceImpl(IScheduleService scheduleService, IGroupService groupService) {
        this.scheduleService = scheduleService;
        this.groupService = groupService;
    }

    /**
     * 文本方法
     * @param inDto
     * @return
     */
    @Override
    public AiUiDataOutDto answerText(AiUiInDto inDto) {

        AiUiDataOutDto aiuiData = null;
        //入参检测
        //非空检测
        if (inDto.getContent() == null || "".equals(inDto.getContent()))throw new ServiceException("缺少语音输入");
        if (inDto.getUserId() == null || "".equals(inDto.getUserId()))throw new ServiceException("缺少用户ID");

        //调用讯飞API
        String outData = AiUiUtil.readAudio(inDto.getContent(), 1);

        if ("".equals(outData) || outData == null) {
            logger.info("调用讯飞API失败");
            throw new ServiceException("语音交互失败");
        }

        //解析讯飞回传数据
        aiuiData = JsonParserUtil.parse(outData);

        if (aiuiData == null || "".equals(aiuiData)) {
            logger.info("语音数据解析失败");
            throw new ServiceException("服务器出错");
        }

        //时间格式规整
        String scheduleStartTime = aiuiData.getScheduleStartTime();
        String scheduleDeadline = aiuiData.getScheduleDeadline();
        if (scheduleStartTime != null && scheduleStartTime.length() < 11 && !"".equals(scheduleStartTime)) {
            scheduleStartTime += " 00:00";
        } else if (scheduleStartTime != null && scheduleStartTime.length() > 11){
            scheduleStartTime = scheduleStartTime.replace("T", " ");
        }
        if (scheduleDeadline != null && scheduleDeadline.length() < 11 && !"".equals(scheduleDeadline)) {
            scheduleDeadline += " 00:00";
        } else if (scheduleDeadline != null && scheduleDeadline.length() > 11){
            scheduleDeadline = scheduleDeadline.replace("T", " ");
        }

        //根据动作做出对应业务逻辑
        // 1:发布日程 2:查找日程
        if (aiuiData.getCode() == 1) {
            ScheduleInDto scheduleData = new ScheduleInDto();
            GroupInDto groupFind = new GroupInDto();

            //标签 默认 一般标签
            List<Integer> labelIds = new ArrayList<>();
            labelIds.add(4);

            //参与人ID list
            List<Integer> groupIds = new ArrayList<>();
            for (String str: aiuiData.getUserNameList()) {
                groupFind.setGroupName(str);
                List<GroupOutDto> groupList = groupService.getListGroupByMessage(groupFind);
                if (groupList != null && groupList.size() != 0) {
                    for (GroupOutDto god: groupList) {
                        groupIds.add(god.getGroupId());
                    }
                    logger.info("[找到参与人]");
                } else {
                    aiuiData.setSpeech("没有找到该参与人，请尝试添加参与人后重新发布");
                    aiuiData.setDataType("0");
                    logger.info("[数据库无数据]");
                    return aiuiData;
                }
            }

            scheduleData.setGroupIds(groupIds);
            scheduleData.setUserId(inDto.getUserId());
            scheduleData.setScheduleName(aiuiData.getScheduleName());
            scheduleData.setScheduleStartTime(scheduleStartTime);
            scheduleData.setScheduleDeadline(scheduleDeadline);
            scheduleData.setLabelIds(labelIds);


            List<Integer> flag = scheduleService.addSchedule(scheduleData);
            if (flag.get(0) == 1){
                aiuiData.setSpeech("参与人尚未注册，发布失败");
                aiuiData.setDataType("0");
                logger.info("创建成功");
                return aiuiData;
            } else if (flag.get(0) == 0) {
                logger.info("创建成功");
                FindScheduleInDto findSchedule = new FindScheduleInDto();
                findSchedule.setUserId(inDto.getUserId());
                findSchedule.setScheduleId(flag.get(1));
                List<FindScheduleOutDto> scheduleCreateList = scheduleService.findCreateSchedule(findSchedule);
                aiuiData.setScheduleCreateList(scheduleCreateList);
            }
            aiuiData.setDataType("1");

        } else if (aiuiData.getCode() == 2) {
            FindScheduleInDto findSchedule = new FindScheduleInDto();
            findSchedule.setScheduleStartTime(scheduleStartTime);
            findSchedule.setScheduleDeadline(scheduleDeadline);
            findSchedule.setUserId(inDto.getUserId());

            // 查询自己创建的日程
            List<FindScheduleOutDto> scheduleCreateList = scheduleService.findCreateSchedule(findSchedule);
            // 查询自己参与的日程
            List<FindScheduleOutDto> scheduleJoinList = scheduleService.findJoinSchedule(findSchedule);

            if (scheduleJoinList != null && scheduleJoinList.size() != 0) {
                aiuiData.setScheduleCreateList(scheduleCreateList);
                aiuiData.setScheduleJoinList(scheduleJoinList);
            } else {
                aiuiData.setSpeech(aiuiData.getSpeech() + ",暂没有日程安排");
            }
            logger.info("查询成功[scheduleCreateList]："+ scheduleCreateList.size() + " | [scheduleJoinList]：" + scheduleJoinList.size());

            aiuiData.setDataType("2");
        }

        return aiuiData;
    }

    /**
     * 音频方法
     * @param inDto
     * @return
     */
    @Override
    public AiUiDataOutDto answerAudio(AiUiInDto inDto) {

        AiUiDataOutDto aiuiData = null;
        //入参检测
        //非空检测
        if (inDto.getContent() == null || "".equals(inDto.getContent()))throw new ServiceException("缺少语音输入");
        if (inDto.getUserId() == null || "".equals(inDto.getUserId()))throw new ServiceException("缺少用户ID");

        //调用讯飞API
        String outData = AiUiUtil.readAudio(inDto.getContent(), 0);

        if ("".equals(outData) || outData == null) {
            logger.info("调用讯飞API失败");
            throw new ServiceException("语音交互失败");
        }

        //解析讯飞回传数据
        aiuiData = JsonParserUtil.parse(outData);

        if (aiuiData == null || "".equals(aiuiData)) {
            logger.info("语音数据解析失败");
            throw new ServiceException("服务器出错");
        }

        //时间格式规整
        String scheduleStartTime = aiuiData.getScheduleStartTime();
        String scheduleDeadline = aiuiData.getScheduleDeadline();
        if (scheduleStartTime != null && scheduleStartTime.length() < 11 && !"".equals(scheduleStartTime)) {
            scheduleStartTime += " 00:00";
        } else if (scheduleStartTime != null && scheduleStartTime.length() > 11){
            scheduleStartTime = scheduleStartTime.replace("T", " ");
        }
        if (scheduleDeadline != null && scheduleDeadline.length() < 11 && !"".equals(scheduleDeadline)) {
            scheduleDeadline += " 00:00";
        } else if (scheduleDeadline != null && scheduleDeadline.length() > 11){
            scheduleDeadline = scheduleDeadline.replace("T", " ");
        }

        //根据动作做出对应业务逻辑
        // 1:发布日程 2:查找日程
        if (aiuiData.getCode() == 1) {
            ScheduleInDto scheduleData = new ScheduleInDto();
            GroupInDto groupFind = new GroupInDto();

            //标签 默认 一般标签
            List<Integer> labelIds = new ArrayList<>();
            labelIds.add(4);

            //参与人ID list
            List<Integer> groupIds = new ArrayList<>();
            for (String str: aiuiData.getUserNameList()) {
                groupFind.setGroupName(str);
                List<GroupOutDto> groupList = groupService.getListGroupByMessage(groupFind);
                if (groupList != null && groupList.size() != 0) {
                    for (GroupOutDto god: groupList) {
                        groupIds.add(god.getGroupId());
                    }
                    logger.info("[找到参与人]");
                } else {
                    aiuiData.setSpeech("没有找到该参与人，请尝试添加参与人后重新发布");
                    aiuiData.setDataType("0");
                    logger.info("[数据库无数据]");
                    return aiuiData;
                }
            }

            scheduleData.setGroupIds(groupIds);
            scheduleData.setUserId(inDto.getUserId());
            scheduleData.setScheduleName(aiuiData.getScheduleName());
            scheduleData.setScheduleStartTime(scheduleStartTime);
            scheduleData.setScheduleDeadline(scheduleDeadline);
            scheduleData.setLabelIds(labelIds);


            List<Integer> flag = scheduleService.addSchedule(scheduleData);
            if (flag.get(0) == 1){
                aiuiData.setSpeech("参与人尚未注册，发布失败");
                aiuiData.setDataType("0");
                logger.info("创建成功");
                return aiuiData;
            } else if (flag.get(0) == 0) {
                logger.info("创建成功");
                FindScheduleInDto findSchedule = new FindScheduleInDto();
                findSchedule.setUserId(inDto.getUserId());
                findSchedule.setScheduleId(flag.get(1));
                List<FindScheduleOutDto> scheduleCreateList = scheduleService.findCreateSchedule(findSchedule);
                aiuiData.setScheduleCreateList(scheduleCreateList);
            }
            aiuiData.setDataType("1");

        } else if (aiuiData.getCode() == 2) {
            FindScheduleInDto findSchedule = new FindScheduleInDto();
            findSchedule.setScheduleStartTime(scheduleStartTime);
            findSchedule.setScheduleDeadline(scheduleDeadline);
            findSchedule.setUserId(inDto.getUserId());

            // 查询自己创建的日程
            List<FindScheduleOutDto> scheduleCreateList = scheduleService.findCreateSchedule(findSchedule);
            // 查询自己参与的日程
            List<FindScheduleOutDto> scheduleJoinList = scheduleService.findJoinSchedule(findSchedule);

            if (scheduleJoinList != null && scheduleJoinList.size() != 0) {
                aiuiData.setScheduleCreateList(scheduleCreateList);
                aiuiData.setScheduleJoinList(scheduleJoinList);
            } else {
                aiuiData.setSpeech(aiuiData.getSpeech() + ",暂没有日程安排");
            }

            logger.info("查询成功[scheduleCreateList]："+ scheduleCreateList.size() + " | [scheduleJoinList]：" + scheduleJoinList.size());

            aiuiData.setDataType("2");
        }

        return aiuiData;
    }

}

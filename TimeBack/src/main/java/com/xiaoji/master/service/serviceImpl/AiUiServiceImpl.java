//package com.xiaoji.master.service.serviceImpl;
//
//import com.xiaoji.config.exception.ServiceException;
//import com.xiaoji.master.dto.AiUiJsonDto;
//import com.xiaoji.master.dto.AiUiInDto;
//import com.xiaoji.master.dto.AiUiOutDto;
//import com.xiaoji.master.service.IAiUiService;
//import com.xiaoji.master.service.IGroupService;
//import com.xiaoji.master.service.IScheduleService;
//import com.xiaoji.util.AiUiUtil;
//import com.xiaoji.util.JsonParserUtil;
//import org.apache.logging.log4j.LogManager;
//import org.apache.logging.log4j.Logger;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import static com.xiaoji.configuration.XFSkillConfig.*;
//
///**
// * 语义解析方法接口实现类
// *
// * create by wzy on 2018/09/14
// */
//@Service
//@Transactional
//public class AiUiServiceImpl implements IAiUiService {
//
//    private Logger logger = LogManager.getLogger(this.getClass());
//
//    private static final Integer RC_SUCCESS = 0;
//    private static final Integer RC_INPUT_ERROR = 1;
//    private static final Integer RC_SYSTEM_ERROR = 2;
//    private static final Integer RC_FAIL = 3;
//    private static final Integer RC_NOT_DEAL = 4;
//
//    private final IScheduleService scheduleService;
//    private final IGroupService groupService;
//
//    @Autowired
//    public AiUiServiceImpl(IScheduleService scheduleService, IGroupService groupService) {
//        this.scheduleService = scheduleService;
//        this.groupService = groupService;
//    }
//
//    /**
//     * 语音方法
//     * @param inDto
//     * rc: 0:成功
//     * 1：输入异常 2：系统内部异常
//     * 3：
//     * @return
//     */
//    @Override
//    public AiUiOutDto aiuiAnswer(AiUiInDto inDto, int flag) {
//
//        AiUiJsonDto aiuiData = null;
//        AiUiOutDto outDto = new AiUiOutDto();
//
//        String userId = inDto.getUserId();
//        String content = inDto.getContent();
//        String deviceId = inDto.getDeviceId();
//
//        //入参检测
//        //非空检测
//        if (content == null || "".equals(content))throw new ServiceException("缺少语音输入");
//        if (userId == "0" || "".equals(userId))throw new ServiceException("缺少用户ID");
//        if (deviceId == null || "".equals(deviceId))throw new ServiceException("缺少设备ID");
//
//        //调用讯飞API
//        String outData = AiUiUtil.readAudio(content, flag);
//
//        if ("".equals(outData) || outData == null) {
//            logger.info("调用讯飞API失败");
//            throw new ServiceException("语音交互失败");
//        }
//
//        //解析讯飞回传数据
//        aiuiData = JsonParserUtil.parse(outData);
//
//        if (aiuiData == null) {
//            return null;
//        } else if (aiuiData.getRc() == RC_NOT_DEAL){
//
//            return outDto;
//        } else if (aiuiData.getRc() == RC_INPUT_ERROR || aiuiData.getRc() == RC_SYSTEM_ERROR) {
//
//            return outDto;
//        } else {
//            String service_user = aiuiData.getService().split(".")[0];
//            if (service_user.equals(USER_SERVICE)) {
//                return outDto;
//            } else {
//                aiuiData.setService(aiuiData.getService().split(".")[1]);
//            }
//        }
//
//
//        String service = aiuiData.getService();
//        switch (service) {
//            case SERVICE_SCHEDULE:
//                //outDto = scheduleMethod(aiuiData, userId, deviceId);
//                break;
//            case SERVICE_PLAYER:
//                outDto = playerMethod(aiuiData);
//                break;
//            default:
//
//                break;
//        }
//
//        return outDto;
//    }
//
//    /**
//     * 日程相关处理
//     * @return
//     */
//    private AiUiOutDto scheduleMethod(AiUiJsonDto aiuiData, Integer userId, String deviceId) {
//        AiUiOutDto outData = new AiUiOutDto();
//        /*//时间格式规整
//        String scheduleStartTime = aiuiData.getScheduleStartTime();
//        String scheduleDeadline = aiuiData.getScheduleDeadline();
//        if (scheduleStartTime != null && scheduleStartTime.length() < 11 && !"".equals(scheduleStartTime)) {
//            scheduleStartTime += " 00:00";
//        } else if (scheduleStartTime != null && scheduleStartTime.length() > 11){
//            scheduleStartTime = scheduleStartTime.replace("T", " ");
//        }
//        if (scheduleDeadline != null && scheduleDeadline.length() < 11 && !"".equals(scheduleDeadline)) {
//            scheduleDeadline += " 00:00";
//        } else if (scheduleDeadline != null && scheduleDeadline.length() > 11){
//            scheduleDeadline = scheduleDeadline.replace("T", " ");
//        } else {
//            scheduleDeadline = scheduleStartTime;
//        }
//
//        //根据动作做出对应业务逻辑
//        // 1:发布日程 2:查找日程
//        if (aiuiData.getCode() == 1) {
//            ScheduleInDto scheduleData = new ScheduleInDto();
//            GroupInDto groupFind = new GroupInDto();
//
//            //标签 默认 一般标签
//            List<Integer> labelIds = new ArrayList<>();
//            labelIds.add(4);
//
//            //参与人ID list
//            List<Integer> groupIds = new ArrayList<>();
//            for (String str: aiuiData.getUserNameList()) {
//                groupFind.setGroupName(str);
//                List<GroupOutDto> groupList = groupService.getListGroupByMessage(groupFind);
//                if (groupList != null && groupList.size() != 0) {
//                    for (GroupOutDto god: groupList) {
//                        groupIds.add(god.getGroupId());
//                    }
//                    logger.info("[找到参与人]");
//                } else {
//                    aiuiData.setSpeech("没有找到该参与人，请尝试添加参与人后重新发布");
//                    aiuiData.setDataType("0");
//                    logger.info("[数据库无数据]");
//                    return aiuiData;
//                }
//            }
//
//            scheduleData.setGroupIds(groupIds);
//            scheduleData.setUserId(userId);
//            scheduleData.setScheduleName(aiuiData.getScheduleName());
//            scheduleData.setScheduleStartTime(scheduleStartTime);
//            scheduleData.setScheduleDeadline(scheduleDeadline);
//            scheduleData.setLabelIds(labelIds);
//
//
//            List<Integer> flagList = scheduleService.addSchedule(scheduleData);
//            if (flagList.get(0) == 1){
//                aiuiData.setSpeech("参与人尚未注册，发布失败");
//                aiuiData.setDataType("0");
//                logger.info("创建成功");
//                return aiuiData;
//            } else if (flagList.get(0) == 0) {
//                logger.info("创建成功");
//                FindScheduleInDto findSchedule = new FindScheduleInDto();
//                findSchedule.setUserId(userId);
//                findSchedule.setScheduleId(flagList.get(1));
//                List<FindScheduleOutDto> scheduleCreateList = scheduleService.findCreateSchedule(findSchedule);
//                aiuiData.setScheduleCreateList(scheduleCreateList);
//            }
//            aiuiData.setDataType("1");
//
//        } else if (aiuiData.getCode() == 2) {        // 2:查找日程
//            FindScheduleInDto findSchedule = new FindScheduleInDto();
//            findSchedule.setScheduleStartTime(scheduleStartTime);
//            findSchedule.setScheduleDeadline(scheduleDeadline);
//            findSchedule.setUserId(userId);
//
//            // 查询自己创建的日程
//            List<FindScheduleOutDto> scheduleCreateList = scheduleService.findCreateSchedule(findSchedule);
//            // 查询自己参与的日程
//            List<FindScheduleOutDto> scheduleJoinList = scheduleService.findJoinSchedule(findSchedule);
//
//            if (scheduleJoinList != null && scheduleJoinList.size() != 0) {
//                aiuiData.setScheduleCreateList(scheduleCreateList);
//                aiuiData.setScheduleJoinList(scheduleJoinList);
//            } else {
//                aiuiData.setSpeech(aiuiData.getSpeech() + ",暂没有日程安排");
//            }
//
//            logger.info("查询成功[scheduleCreateList]："+ scheduleCreateList.size() + " | [scheduleJoinList]：" + scheduleJoinList.size());
//
//            aiuiData.setDataType("2");
//        }*/
//
//        return outData;
//    }
//
//    private AiUiOutDto playerMethod(AiUiJsonDto aiuiData) {
//        AiUiOutDto outData = new AiUiOutDto();
//
//        return outData;
//    }
//}

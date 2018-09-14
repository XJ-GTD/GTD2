package com.manager.master.service.serviceImpl;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.*;
import com.manager.master.entity.*;
import com.manager.master.repository.*;
import com.manager.master.service.IScheduleService;
import com.manager.util.CommonMethods;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import javax.persistence.criteria.CriteriaBuilder;
import java.sql.Timestamp;
import java.text.SimpleDateFormat;
import java.util.*;
import java.util.stream.Collectors;

/**
 * 日程Service实现类
 * @author cp
 * @since 2018/8/28
 */
@Service
@Transactional
public class ScheduleServiceImpl implements IScheduleService {

    private static final String PUSH_MESSAGE_SCHEDULE_CREATE = "接受要注意守约哦";       //创建日程/添加参与人 推送
    private static final String PUSH_MESSAGE_SCHEDULE_UPDATE = "日程内容已经改变，请注意查看";       //创建日程/添加参与人 推送
    private static final String PUSH_MESSAGE_SCHEDULE_DELETE = "参与人已删除日程";       //删除日常推送
    private Logger logger = LogManager.getLogger(this.getClass());

    @Resource
    ScheduleJpaRepository scheduleJpaRepository;

    @Resource
    ScheduleRepository scheduleRepository;

    @Resource
    CenterUserShceduleRepository userShceduleRepository;

    @Resource
    CenterScheduleLabelRepository scheduleLabelRepository;

    @Resource
    CenterGroupScheduleRepository groupScheduleRepository;

    @Resource
    GroupMemberRepository groupMemberRepository;

    @Resource
    SchedulePlayersRepository schedulePlayersRepository;

    @Resource
    CenterScheduleLabelRepository centerScheduleLabelRepository;

    @Resource
    private GroupRepository groupRepository;

    @Resource
    GroupJpaRepository groupJpaRepository;

    @Resource
    RemindJpaRepository remindJpaRepository;

    @Resource
    LabelRespository labelRespository;

    @Resource
    RemindRepository remindRepository;

    @Resource
    UserRepository userRepository;

    @Resource
    SchedulePlayersNewRepository schedulePlayersNewRepository;

    @Autowired
    WebSocketServiceImpl webSocketService;

    /**
     * 查询自己创建的日程
     *
     * @param inDto
     * @return
     */
    @Override
    public List<FindScheduleOutDto> findCreateSchedule(FindScheduleInDto inDto) {
        List<FindScheduleOutDto> resultList = new ArrayList<>();
        List<Object[]> selectList = new ArrayList<>();
        // 接受参数
        Integer userId = inDto.getUserId();
        Integer scheduleId = inDto.getScheduleId();
        String scheduleName = inDto.getScheduleName();
        String scheduleStarttime = inDto.getScheduleStartTime();
        String scheduleDeadline = inDto.getScheduleDeadline();
        Integer labelId = inDto.getLabelId();
        String groupName = inDto.getGroupName();
        Integer groupId = inDto.getGroupId();

        // 入参检查
        if(userId == null || userId ==0 || "".equals(userId)) throw new ServiceException("用户名ID不能为空");
        // 入参必须项检查

        // 入参类型检查
        if (scheduleStarttime != null && !"".equals(scheduleStarttime) && !CommonMethods.checkIsDate(scheduleStarttime)) throw new ServiceException("开始时间不是日期类型");
        if (scheduleDeadline != null && !"".equals(scheduleDeadline) && !CommonMethods.checkIsDate(scheduleDeadline)) throw new ServiceException("截止时间不是日期类型");
        // 入参长度检查
        // 入参关联检查
        if(scheduleStarttime != null && !"".equals(scheduleStarttime)
                && scheduleDeadline != null && !"".equals(scheduleDeadline)){
            if (!CommonMethods.compareDate(scheduleStarttime,scheduleDeadline)){
                throw new ServiceException("开始时间必须小于截止时间");
            }
        }
        if(scheduleName != null && !"".equals(scheduleName)){
            if (CommonMethods.checkMySqlReservedWords(scheduleName)){
                throw new ServiceException("日程主题包含关键字");
            }
        }
       if(groupName != null && !"".equals(groupName)){
           if (CommonMethods.checkMySqlReservedWords(groupName)){
               throw new ServiceException("参与人名称包含关键字");
           }
       }

        // 业务处理
        try{
            selectList = scheduleRepository.findSchedule(inDto);
        } catch (Exception ex){
            throw new ServiceException("---- findSchedule 语法错误");
        }
        if(selectList.size()>0){
            for(Object[] s : selectList){
                FindScheduleOutDto outDto = new FindScheduleOutDto();
                outDto.setScheduleId((Integer)s[0]);
                outDto.setScheduleName((String)s[1]);
                outDto.setScheduleStartTime(CommonMethods.stampToDate((Timestamp) s[2]));
                outDto.setScheduleDeadline(CommonMethods.stampToDate((Timestamp) s[3]));
                outDto.setScheduleStatus((Integer)s[4]);
                outDto.setScheduleFinishDate(CommonMethods.stampToDate((Timestamp) s[5]));

                Integer scheduleIdN = outDto.getScheduleId();
                // 获取标签名称
                List<String> labelList = new ArrayList<>();
                try{
                    labelList = labelRespository.findLabelNameByScheduleId(scheduleIdN);
                } catch (Exception ex){
                    throw new ServiceException("---- findLabelNameByScheduleId 语法错误");
                }
                outDto.setLabelName(labelList);

                // 获取参与群组信息
                List<Object[]> groupList = new ArrayList<>();
                List<GroupOutDto> gruopListO = new ArrayList<>();
                try{
//                    groupList = groupJpaRepository.findGroupByScheduleId(scheduleIdN);
                    groupList = groupRepository.findGroupByScheduleId(scheduleIdN);
                } catch (Exception ex){
                    throw new ServiceException("---- findGroupByScheduleId 语法错误");
                }
                if(groupList.size()>0){
                    for(Object[] gro : groupList){
                        GroupOutDto groOut = new GroupOutDto();
                        groOut.setGroupId((Integer)gro[0]);
                        groOut.setGroupName((String)gro[1]);

                        gruopListO.add(groOut);
                    }
                }
                outDto.setGroup(gruopListO);

                resultList.add(outDto);
            }
        }
        return resultList;
    }

    /**
     * 查询自己参与的日程
     *
     * @param inDto
     * @return
     */
    @Override
    public List<FindScheduleOutDto> findJoinSchedule(FindScheduleInDto inDto) {
        List<FindScheduleOutDto> resultList = new ArrayList<>();
        List<Object[]> selectList = new ArrayList<>();
        // 接受参数
        Integer userId = inDto.getUserId();
        Integer scheduleId = inDto.getScheduleId();
        String scheduleName = inDto.getScheduleName();
        String scheduleStarttime = inDto.getScheduleStartTime();
        String scheduleDeadline = inDto.getScheduleDeadline();
        Integer labelId = inDto.getLabelId();
        String groupName = inDto.getGroupName();
        Integer groupId = inDto.getGroupId();

        // 入参检查
        if(userId == null || userId ==0 || "".equals(userId)) throw new ServiceException("用户名ID不能为空");
        // 入参必须项检查

        // 入参类型检查
        if (scheduleStarttime != null && !"".equals(scheduleStarttime) && !CommonMethods.checkIsDate(scheduleStarttime)) throw new ServiceException("开始时间不是日期类型");
        if (scheduleDeadline != null && !"".equals(scheduleDeadline) && !CommonMethods.checkIsDate(scheduleDeadline)) throw new ServiceException("截止时间不是日期类型");
        // 入参长度检查
        // 入参关联检查
        if(scheduleStarttime != null && !"".equals(scheduleStarttime)
                && scheduleDeadline != null && !"".equals(scheduleDeadline)){
            if (!CommonMethods.compareDate(scheduleStarttime,scheduleDeadline)){
                throw new ServiceException("开始时间必须小于截止时间");
            }
        }
        if(scheduleName != null && !"".equals(scheduleName)){
            if (CommonMethods.checkMySqlReservedWords(scheduleName)){
                throw new ServiceException("日程主题包含关键字");
            }
        }
        // 业务处理
        try{
            selectList = scheduleRepository.findJoinSchedule(inDto);
        } catch (Exception ex){
            throw new ServiceException("---- findJoinSchedule 语法错误");
        }
        if(selectList.size()>0){
            for(Object[] s : selectList){
                FindScheduleOutDto outDto = new FindScheduleOutDto();
                outDto.setScheduleId(Integer.valueOf(s[0].toString()));
                outDto.setScheduleId((Integer)s[0]);
                outDto.setScheduleName((String)s[1]);
                outDto.setScheduleStartTime(CommonMethods.stampToDate((Timestamp) s[2]));
                outDto.setScheduleDeadline(CommonMethods.stampToDate((Timestamp) s[3]));
                outDto.setScheduleStatus((Integer)s[4]);
                outDto.setScheduleFinishDate(CommonMethods.stampToDate((Timestamp) s[5]));

                Integer scheduleIdN = outDto.getScheduleId();
                // 获取标签名称
                List<String> labelList = new ArrayList<>();
                try{
                    labelList = labelRespository.findLabelNameByScheduleId(scheduleIdN);
                } catch (Exception ex){
                    throw new ServiceException("---- findLabelNameByScheduleId 语法错误");
                }
                outDto.setLabelName(labelList);

                // 获取提醒时间列表
                List<RemindOutDto> remind = new ArrayList<>();
                List<Object[]> remindS = new ArrayList<>();
                try{
//                    remind = remindJpaRepository.findRemindByUserIDAndScheId(userId,scheduleIdN);
                    remindS = remindRepository.findRemindByUserIDAndScheId(userId,scheduleIdN);
                } catch (Exception ex){
                    throw new ServiceException("---- findRemindByUserIDAndScheId 语法错误");
                }
                if(remindS.size()>0){
                    for(Object[] re : remindS){
                        RemindOutDto out = new RemindOutDto();
                        out.setRemindId((Integer)re[0]);
                        out.setRemindDate(re[1].toString());

                        remind.add(out);
                    }
                }
                outDto.setRemind(remind);

                resultList.add(outDto);
            }
        }
        return resultList;
    }

    /**
     * 更新日程
     * @param inDto
     * @return
     */
    @Override
    public int updateSchedule(ScheduleInDto inDto) {
        // 接收参数
        int userId = inDto.getUserId();                           			// 用户ID
        int scheduleId = inDto.getScheduleId();                             // 日程事件ID
        String scheduleName = inDto.getScheduleName();                    	// 日程事件名称
        String scheduleStartTime = inDto.getScheduleStartTime();            // 开始时间
        String scheduleDeadline = inDto.getScheduleDeadline();              // 截止时间
        //int scheduleRepeatType = inDto.getScheduleRepeatType();             // 日程重复类型
        Integer scheduleStatus = inDto.getScheduleStatus();                  // 完成状态
        int updateId = inDto.getUpdateId();                          		// 更新人
        String updateDate = inDto.getUpdateDate();                     		// 更新时间

        List<Integer> groupIds = inDto.getGroupIds();                          		// 群组 List
        List<Integer> labelIds = inDto.getLabelIds();                          		// 标签 List
        String date = dateFormat();
        // 入参检查
        // 入参必须项检查
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户名ID不能为空");
        if (scheduleId == 0 || "".equals(scheduleId)) throw new ServiceException("日程事件ID不能为空");
        if (scheduleName == null || "".equals(scheduleName)) throw new ServiceException("日程事件名称不能为空");
        else scheduleName = scheduleName.replace(" ", "");
        if (scheduleStartTime == null || "".equals(scheduleStartTime)) throw new ServiceException("开始时间不能为空");
        if (scheduleDeadline == null || "".equals(scheduleDeadline)) throw new ServiceException("截止时间不能为空");
        if (updateId == 0 || "".equals(updateId)) updateId = userId;
        if (updateDate == null || "".equals(updateDate)) updateDate =date;
        if (groupIds.size() == 0) throw new ServiceException("群组不能为空");
        if (labelIds.size() == 0) throw new ServiceException("标签名称不能为空");
        if(scheduleStatus == null || "".equals(scheduleStatus)) scheduleStatus = 1;
        // 入参类型检查
       /* // 日程重复类型 判断
        int[] types = new int[] { 0, 1, 2, 3 };
        if (!CommonMethods.isInArray(types,scheduleRepeatType)){
            throw new ServiceException("日程重复类型不在‘0-3’范围内");
        }*/
        // 完成状态 判断
        int[] status = new int[] { 0,1,2 };
        if (!CommonMethods.isInArray(status,scheduleStatus)){
            throw new ServiceException("完成状态不在‘0-2’范围内");
        }
        // 判断是否为日期类型
        if (scheduleStartTime != null && !"".equals(scheduleStartTime) && !CommonMethods.checkIsDate(scheduleStartTime)) throw new ServiceException("开始时间不是日期类型");
        if (scheduleDeadline != null && !"".equals(scheduleDeadline) && !CommonMethods.checkIsDate(scheduleDeadline)) throw new ServiceException("截止时间不是日期类型");
        if (updateDate != null && !"".equals(updateDate) && !CommonMethods.checkIsDate(updateDate)) throw new ServiceException("更新时间不是日期类型");
        // 入参长度检查
        // 入参关联检查
        if(scheduleStartTime != null && !"".equals(scheduleStartTime)
                && scheduleDeadline != null && !"".equals(scheduleDeadline)){
            if (!CommonMethods.compareDate(scheduleStartTime,scheduleDeadline)){
                throw new ServiceException("开始时间必须小于截止时间");
            }
        }

        if(scheduleName != null && !"".equals(scheduleName)){
            if (CommonMethods.checkMySqlReservedWords(scheduleName)){
                throw new ServiceException("日程事件名称包含关键字");
            }
        }

        // 业务处理
        GtdScheduleEntity scheduleEntity = scheduleJpaRepository.getOne(scheduleId);

        if (scheduleEntity.getCreateId().equals(userId)) {     // 发布人 日程编辑
            // 查询开始时间
            String dbStartTime = null;
            boolean timeFlag = false;
            try{
                dbStartTime = scheduleRepository.findschedulStartT(scheduleId);
            } catch (Exception ex){
                throw new ServiceException("---- findschedulStartT 语法错误");
            }
            if(!scheduleStartTime.equals(dbStartTime)){ // 开始时间发生改变
                timeFlag = true;
            }
            // 开始前 10分钟
            String tenMinutes = CommonMethods.getBeforeTime(scheduleStartTime,10*60*1000L);
            // 开始前 半小时
            String halfHour = CommonMethods.getBeforeTime(scheduleStartTime,30*60*1000L);
            // 开始前 一小时
            String oneHour = CommonMethods.getBeforeTime(scheduleStartTime,60*60*1000L);
            // 开始前 两小时
            String twoHour = CommonMethods.getBeforeTime(scheduleStartTime,2*60*60*1000L);
            // 开始前 一天
            String oneDay =  CommonMethods.getBeforeTime(scheduleStartTime,24*60*60*1000L);

            //  更新日程事件表
            try {
                scheduleJpaRepository.updateScheduleByScheduleid(scheduleName,CommonMethods.dateToStamp(scheduleStartTime),CommonMethods.dateToStamp(scheduleDeadline),
                        CommonMethods.dateToStamp(updateDate),userId,scheduleId);
            } catch (Exception ex){
                throw new ServiceException("---- updateScheduleByScheduleid 语法错误");
            }

            // 新传入日程标签
            Integer scheduleLabel = CommonMethods.getscheduleLabel(labelIds);
            //  查询 日程标签中间表: 获取标签
            List<GtdScheduleLabelEntity> dbScheduleLabel= new ArrayList<GtdScheduleLabelEntity>();
            List<Object[]> dbScheduleLabelO = new ArrayList<>();
            try {
//                dbScheduleLabel = centerScheduleLabelRepository.findLabelIdByScheduleId(scheduleId);
                dbScheduleLabelO = labelRespository.findLabelIdByScheduleId(scheduleId);
            } catch (Exception ex){
                throw new ServiceException("---- findLabelIdByScheduleId 语法错误");
            }
            if(dbScheduleLabelO.size()>0){
                for(Object[] dbLabelO : dbScheduleLabelO){
                    GtdScheduleLabelEntity G = new GtdScheduleLabelEntity();
                    G.setScheduleLabelId((Integer) dbLabelO[0]);
                    G.setLabelId((Integer) dbLabelO[1]);
                    dbScheduleLabel.add(G);
                }
            }
            List<Timestamp> remindList = new ArrayList<>(); // 提醒时间列表
            Integer scheduleLabelId = 0;
            Integer dbscheduleLabel = 4;
            for(GtdScheduleLabelEntity gtdScheduleLabelEntity : dbScheduleLabel){
                Integer id = gtdScheduleLabelEntity.getScheduleLabelId();
                Integer label = gtdScheduleLabelEntity.getLabelId();
                if(label == 4){
                    dbscheduleLabel = 4;
                    scheduleLabelId = id;
                    remindList.add(CommonMethods.dateToStamp(oneHour));
                } else if(label == 5){
                    dbscheduleLabel = 5;
                    scheduleLabelId = id;
                    remindList.add(CommonMethods.dateToStamp(tenMinutes));
                    remindList.add(CommonMethods.dateToStamp(twoHour));
                    remindList.add(CommonMethods.dateToStamp(oneDay));
                } else if(label == 6){
                    dbscheduleLabel = 6;
                    scheduleLabelId = id;
                    remindList.add(CommonMethods.dateToStamp(tenMinutes));
                    remindList.add(CommonMethods.dateToStamp(halfHour));
                    remindList.add(CommonMethods.dateToStamp(oneHour));
                    remindList.add(CommonMethods.dateToStamp(twoHour));
                    remindList.add(CommonMethods.dateToStamp(oneDay));
                }
            }
            boolean labelFlag = false;  // 标签是否改变标志
            if(scheduleLabel != dbscheduleLabel){   // 标签发生改变
                labelFlag = true;
                //  更新 日程标签中间表
                try {
                    centerScheduleLabelRepository.updateScheduleLabelById(scheduleLabel,userId,CommonMethods.dateToStamp(updateDate),scheduleLabelId);
                }  catch (Exception ex){
                    throw new ServiceException("---- updateScheduleLabelById 语法错误");
                }
            }

            //  查询 日程群组中间表: 获取所有群组ID
            List<Integer> dbGroupIdList = new ArrayList<Integer>();
            // 原有群组集合
            List<Integer> updateGroupIdList = new ArrayList<Integer>();
            // 新增群组集合
            List<Integer> newGroupIdList = new ArrayList<Integer>();
            try{
                dbGroupIdList = groupRepository.findGroupIdByScheduleId(scheduleId);
            }  catch (Exception ex){
                throw new ServiceException("---- findGroupIdByScheduleId 语法错误");
            }
            for(int i = 0; i < groupIds.size(); i++){
                Integer groupId = groupIds.get(i);
                for(int j = 0; j < dbGroupIdList.size(); j++){
                    Integer dbGroupId = dbGroupIdList.get(j);
                    if(groupId == dbGroupId){
                        updateGroupIdList.add(groupId);
                        //  更新 日程群组中间表: 更新日期
                        try{
                            groupJpaRepository.updateUpDateByGroupId(userId,CommonMethods.dateToStamp(updateDate),dbGroupId,scheduleId);
                        }  catch (Exception ex){
                            throw new ServiceException("---- updateUpDateByGroupId 语法错误");
                        }
                    } else if(j == dbGroupIdList.size()-1){
                        newGroupIdList.add(groupId);
                        //  新增 日程群组中间表数据
                        try{
                            groupJpaRepository.insertIntoGroupSchedule(groupId,scheduleId,userId,CommonMethods.dateToStamp(updateDate),userId,CommonMethods.dateToStamp(updateDate));
                        }  catch (Exception ex){
                            throw new ServiceException("---- insertIntoGroupSchedule 语法错误");
                        }
                    }
                }
            }
            //  查询 原有群组 updateGroupId 对应 人员id
            List<Integer> oldUserIdList = new ArrayList<>();
            for(int i=0; i<updateGroupIdList.size(); i++){
                List<Integer> userIdList = new ArrayList<>();
                Integer oldGroupId = updateGroupIdList.get(i);
                try{
                    userIdList = groupMemberRepository.findAllUserIdByGroupId(oldGroupId);
                } catch (Exception ex){
                    throw new ServiceException("---- findAllUserIdByGroupId 语法错误");
                }
                oldUserIdList = CommonMethods.addNoRepetitionToList(oldUserIdList,userIdList);
            }

            //  查询原有数据 参与人表ID
            List<Integer> playerIdList = new ArrayList<>();
            for(Integer user : oldUserIdList){
                Integer playerId = 0;
                try{
//                    playerId = schedulePlayersRepository.findPlayersIdByUserIdAndScheduleId(scheduleId,user);
                    playerId = schedulePlayersNewRepository.findPlayersIdByUserIdAndScheduleId(scheduleId,user);
                } catch (Exception ex){
                    throw new ServiceException("---- findPlayersIdByUserIdAndScheduleId 语法错误");
                }
                if(playerId != 0) playerIdList.add(playerId);
            }
            // 查询 原有提醒时间表
            for(int i=0; i<playerIdList.size(); i++){
                List<Integer> remindIdList = new ArrayList<>();
                try{
                    remindIdList = remindJpaRepository.findAllRemindIdByPlayersId(playerIdList.get(i));
                } catch (Exception ex){
                    throw new ServiceException("---- findAllRemindIdByPlayersId 语法错误");
                }
                if(!labelFlag && timeFlag) { //  标签未变，时间改变 - 更新提醒时间
                    for(int j=0; j<remindList.size(); j++){
                        Timestamp remindDt = remindList.get(j);
                        Integer remindId = remindIdList.get(j);
                        try{
                            remindJpaRepository.updateRemindDate(remindDt,userId,CommonMethods.dateToStamp(updateDate),remindId);
                        } catch (Exception ex){
                            throw new ServiceException("---- updateRemindDate 语法错误");
                        }
                    }
                } else if(labelFlag) {   //  标签改变 - 清空提醒时间，重新添加
                    // 删除数据
                    try{
                        remindJpaRepository.deleteAllByPlayersId(playerIdList.get(i));
                    } catch (Exception ex){
                        throw new ServiceException("---- deleteAllByPlayersId 语法错误");
                    }
                    // 重新添加数据
                    for(int j=0; j<remindList.size(); j++){
                        Timestamp remindDt = remindList.get(j);
                        try{
                            remindJpaRepository.insertIntoRemind(playerIdList.get(i),remindDt,userId,CommonMethods.dateToStamp(updateDate),userId,CommonMethods.dateToStamp(updateDate));
                        } catch (Exception ex){
                            throw new ServiceException("---- insertIntoRemind 语法错误");
                        }
                    }
                }
            }

            //  查询 新增群组 newGroupIdList 对应 人员id（排除原有人员id）
            List<Integer> newUserIdList = new ArrayList<>();
            for(int i=0; i<newGroupIdList.size(); i++){
                List<Integer> userIdList = new ArrayList<>();
                Integer newGroupId = newGroupIdList.get(i);
                try{
                    userIdList = groupMemberRepository.findAllUserIdByGroupId(newGroupId);
                } catch (Exception ex){
                    throw new ServiceException("---- findAllUserIdByGroupId 语法错误");
                }
                newUserIdList = CommonMethods.addNoRepetitionToList(newUserIdList,userIdList);
            }
            for(int i=0; i<newUserIdList.size(); i++){
                if(oldUserIdList.contains(newUserIdList.get(i))){
                    newUserIdList.remove(i);
                    i--;
                }
            }
            //  插入 日程参与人表
            List<Integer> newPlayersIdList = new ArrayList<>();
            for(Integer userid : newUserIdList){
                try{
                    schedulePlayersRepository.insertSchedulePlayers(scheduleId,3,userid,userId,CommonMethods.dateToStamp(updateDate),userId,CommonMethods.dateToStamp(updateDate));
                } catch (Exception ex){
                    throw new ServiceException("---- insertSchedulePlayers 语法错误");
                }

                Integer newPlayersId = 0;
                try{
                    newPlayersId = schedulePlayersRepository.findPlayersIdByUserIdAndScheduleId(scheduleId,userid);
                } catch (Exception ex){
                    throw new ServiceException("---- findPlayersIdByUserIdAndScheduleId 语法错误");
                }
                if(newPlayersId != 0) newPlayersIdList.add(newPlayersId);
            }
            //  插入 提醒时间表
            for(Integer pId : newPlayersIdList){
                for(int i=0; i<remindList.size(); i++){
                    try{
                        remindJpaRepository.insertIntoRemind(pId,remindList.get(i),userId,CommonMethods.dateToStamp(updateDate),userId,CommonMethods.dateToStamp(updateDate));
                    } catch (Exception ex){
                        throw new ServiceException("---- insertIntoRemind 语法错误");
                    }
                }
            }
            //  查询发布人名称
            String createName = null;
            try {
                createName = userRepository.findUserNameByUserId(userId);
            } catch (Exception ex){
                throw new ServiceException("----  语法错误");
            }
            // 发送提醒 - 原有用户日程修改提醒
            PushOutDto pushOutDto = new PushOutDto();   // 推送消息
            PushInDto pushInDto = new PushInDto();      // 推送目标
            // 推送信息设置
            pushOutDto.setMessageId(scheduleId);
            pushOutDto.setMessageName(scheduleName);
            pushOutDto.setMessageContent(PUSH_MESSAGE_SCHEDULE_UPDATE);
            pushOutDto.setUserName(createName);
            pushOutDto.setType(1);
            // 推送目标设置
            pushInDto.setData(pushOutDto);
            pushInDto.setUserId(userId);
            pushInDto.setMemberUserId(oldUserIdList);
            // 发送日程修改信息
            int modifyMessage = webSocketService.pushToUser(pushInDto);
            if(modifyMessage != 0){
                logger.error("日程修改 --- 原有参与人 --- 推送失败！");
            } else {
                logger.info("日程修改 --- 原有参与人 --- 推送成功");
            }

            // 发送提醒 - 新增用户日程提醒
            PushOutDto pushOutDto1 = new PushOutDto();  // 推送消息
            PushInDto pushInDto1 = new PushInDto();     // 推送目标
            // 推送信息设置
            pushOutDto1.setMessageId(scheduleId);
            pushOutDto1.setMessageName(scheduleName);
            pushOutDto1.setMessageContent(PUSH_MESSAGE_SCHEDULE_CREATE);
            pushOutDto1.setUserName(createName);
            pushOutDto1.setType(1);
            // 推送目标设置
            pushInDto1.setData(pushOutDto1);
            pushInDto1.setUserId(userId);
            pushInDto1.setMemberUserId(newUserIdList);
            // 发送日程修改信息
            int createMessage = webSocketService.pushToUser(pushInDto1);
            if(createMessage != 0){
                logger.error("日程修改 --- 新增参与人 --- 推送失败！");
            } else {
                logger.info("日程修改 --- 新增参与人 --- 推送成功");
            }
        }

        return 0;
    }

    /**
     * 日程发布撤回参与人
     * @param inDto
     * @return
     */
    @Override
    public int releaseToWithdrawSchedule(ScheduleInDto inDto) {
        // 接收参数
        int userId = inDto.getUserId();                           			// 用户ID
        int scheduleId = inDto.getScheduleId();                             // 日程事件ID
        int createId = inDto.getCreateId();                      		    // 创建人
        String createDate = inDto.getCreateDate();                 		    // 创建日期
        List groupIds = inDto.getGroupIds();                          		// 群组 List
        String date = dateFormat();
        // 入参检查     // 入参必须项检查
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (scheduleId == 0 || "".equals(scheduleId)) throw new ServiceException("日程事件ID不能为空");
        if (createId == 0 || "".equals(createId)) createId = userId;
        if (createDate == null || "".equals(createDate)) createDate = date;
        if (groupIds == null || "".equals(groupIds)) throw new ServiceException("群组不能为空");
        // 入参类型检查
        // 入参长度检查
        // 入参关联检查

        // 业务处理
        GtdScheduleEntity scheduleEntity = scheduleJpaRepository.getOne(scheduleId);

        if (scheduleEntity == null){
            throw new ServiceException("请检查此日程事件");
        }
        String data = CommonMethods.stampToDate(scheduleEntity.getCreateDate());
        if (!CommonMethods.getPastTime(data,createDate)){
            throw new ServiceException("时间不在五分钟内");
        }

        List<GtdGroupMemberEntity> list = new ArrayList<>();
        if (groupIds != null) {
            for (Object id : groupIds) {
                // 根据groupId 查询群成员信息
                List<GtdGroupMemberEntity> groupMemberList = null;
                try {
                    groupMemberList = groupMemberRepository.findMemberByGroupId(Integer.parseInt(id.toString()));
                }catch (Exception ex){
                    throw new ServiceException("语法错误");
                }
                for (GtdGroupMemberEntity entity:groupMemberList){
                    list.add(entity);
                }
            }
        }else throw new ServiceException("groupIds参数不能为空");

        Set<Integer> setGroupUserId = list.stream().map(GtdGroupMemberEntity::getUserId).collect(Collectors.toSet());
        //setGroupUserId.forEach(e -> logger.info(e));   // 打印

        List<GtdSchedulePlayersEntity> listSp = null;
        try {
            listSp = schedulePlayersRepository.findAllByScheduleId(scheduleId);
        }catch (Exception ex){
            throw new ServiceException("语法错误");
        }
        for (Integer i : setGroupUserId) {
            GtdSchedulePlayersEntity players = null;
            try {
                players = schedulePlayersRepository.findByScheduleIdAndUserIdAndCreateId(scheduleId,i,createId);
            }catch (Exception ex){
                throw new ServiceException("语法错误");
            }
            if (players == null) {
                GtdSchedulePlayersEntity schedulePlayersEntity = new GtdSchedulePlayersEntity();
                // 日程参与人 绑定
                schedulePlayersEntity.setScheduleId(scheduleId);
                schedulePlayersEntity.setCreateId(createId);
                schedulePlayersEntity.setCreateDate(CommonMethods.dateToStamp(createDate));
                schedulePlayersEntity.setPlayersStatus(3);
                schedulePlayersEntity.setUserId(i);
                logger.info("添加 群组Id " + groupIds + "有此成员 userId " + i + "\t 日程事件"+ scheduleId + "参与人表添加 userId :" + i);
                try{
                    schedulePlayersRepository.save(schedulePlayersEntity);
                }catch (Exception e){
                    throw new ServiceException("语法错误");
                }
            }
        }
        for (GtdSchedulePlayersEntity i : listSp) {
            GtdGroupMemberEntity groupMember = null;
            for (Object id : groupIds) {
                // 根据groupId 查询群成员信息
                try {
                    groupMember = groupMemberRepository.findMemberByGroupIdAndUserId(Integer.parseInt(id.toString()),i.getUserId());
                }catch (Exception ex){
                    throw new ServiceException("语法错误");
                }
            }
            if (groupMember == null) {
                logger.info("群组Id " + groupIds + "没有此成员 userId" + i.getUserId() + "参与人表删除 userId :" + i.getUserId());
                try {
                    schedulePlayersRepository.deleteConnectionByScheduleIdAndUserId(scheduleId, i.getUserId());
                } catch (Exception e) {
                    throw new ServiceException("语法错误");
                }
            }
        }
        return 0;
    }

    /**
     * 新增日程
     * @param inDto
     * @return
     */
    @Override
    public int addSchedule(ScheduleInDto inDto){
        // 接收参数
        int userId = inDto.getUserId();                           			// 用户ID
        String scheduleName = inDto.getScheduleName();                    	// 日程事件名称
        String scheduleStartTime = inDto.getScheduleStartTime();            // 开始时间
        String scheduleDeadline = inDto.getScheduleDeadline();              // 截止时间
        //Integer scheduleRepeatType = inDto.getScheduleRepeatType();             // 日程重复类型
        Integer scheduleStatus = inDto.getScheduleStatus();                  // 完成状态
        int createId = inDto.getCreateId();                      		    // 更新人
        String createDate = inDto.getCreateDate();                 		    // 更新时间

        List groupIds = inDto.getGroupIds();                          		// 群组 List
        List labelIds = inDto.getLabelIds();                          		// 标签 List

        String date = dateFormat();
        // 入参检查     // 入参必须项检查
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (scheduleName == null || "".equals(scheduleName)) throw new ServiceException("日程事件名称不能为空");
        else scheduleName = CommonMethods.trimAllBlanks(scheduleName);
        if ((scheduleStartTime == null || "".equals(scheduleStartTime)) && (scheduleDeadline == null || "".equals(scheduleDeadline)))throw new ServiceException("开始和截止时间不能都为空");
        if (createId == 0 || "".equals(createId)) createId = userId;
        if (createDate == null || "".equals(createDate)) createDate = date;
        if (groupIds == null || "".equals(groupIds)) throw new ServiceException("群组不能为空");
        if (labelIds == null || "".equals(labelIds)) throw new ServiceException("标签名称不能为空");
        // 入参类型检查
        /*// 日程重复类型 判断
        int[] types = new int[] { 0, 1, 2, 3 };
        if (!CommonMethods.isInArray(types,scheduleRepeatType)){
            throw new ServiceException("日程重复类型不在‘0-3’范围内");
        }*/
        // 完成状态 判断
        int[] status = new int[] { 0, 1, 2 };
        if (!CommonMethods.isInArray(status,scheduleStatus)){
            throw new ServiceException("完成状态不在‘0-2’范围内");
        }
        // 判断是否为日期类型
//        if (!CommonMethods.checkIsDate(scheduleStartTime)) throw new ServiceException("开始时间不是日期类型");
//        if (!CommonMethods.checkIsDate(scheduleDeadline)) throw new ServiceException("截止时间不是日期类型");
//        if (!CommonMethods.checkIsDate(createDate)) throw new ServiceException("更新时间不是日期类型");
        // 入参长度检查
        // 入参关联检查
        if ((!"".equals(scheduleStartTime) && scheduleStartTime != null) && (!"".equals(scheduleDeadline) && scheduleDeadline != null)) {
            if (!CommonMethods.compareDate(scheduleStartTime,scheduleDeadline)){
                throw new ServiceException("开始时间必须小于截止时间");
            }
        }

        if (CommonMethods.checkMySqlReservedWords(scheduleName)){
            throw new ServiceException("用户名包含关键字");
        }

        // 业务处理
        GtdScheduleEntity scheduleEntity = new GtdScheduleEntity();                     // 日程表
        GtdUserScheduleEntity userScheduleEntity = new GtdUserScheduleEntity();         // 用户日程表

        // 日程信息 绑定
        scheduleEntity.setScheduleName(scheduleName);
        if (!"".equals(scheduleStartTime) && scheduleStartTime != null) {
            scheduleEntity.setScheduleStarttime(CommonMethods.dateToStamp(scheduleStartTime));
        }
        if (!"".equals(scheduleDeadline) && scheduleDeadline != null) {
            scheduleEntity.setScheduleDeadline(CommonMethods.dateToStamp(scheduleDeadline));
        }
        //scheduleEntity.setScheduleRepeatType(scheduleRepeatType);
        scheduleEntity.setScheduleStatus(scheduleStatus);
        scheduleEntity.setCreateId(createId);
        scheduleEntity.setCreateDate(CommonMethods.dateToStamp(createDate));

        try{
            // 获取自增主键
            // 日程事件表插入
            scheduleJpaRepository.save(scheduleEntity);
            logger.info("日程事件表 成功添加");
        }catch (Exception e){
            throw new ServiceException("语法错误");
        }

        // 用户日程表信息  绑定
        userScheduleEntity.setUserId(userId);
        userScheduleEntity.setScheduleId(scheduleEntity.getScheduleId());
        userScheduleEntity.setCreateId(userId);
        userScheduleEntity.setCreateDate(CommonMethods.dateToStamp(createDate));

        try{
            // 用户日程表插入
            userShceduleRepository.save(userScheduleEntity);
            logger.info("用户日程表 成功添加");
        }catch (Exception e){
            throw new ServiceException("语法错误");
        }

        if (labelIds != null) {
            for (Object id : labelIds) {
                GtdScheduleLabelEntity scheduleLabelEntity = new GtdScheduleLabelEntity();      // 日程标签中间表
                // 日程标签表  绑定
                scheduleLabelEntity.setLabelId(Integer.parseInt(id.toString()));
                scheduleLabelEntity.setCreateId(userId);
                scheduleLabelEntity.setCreateDate(CommonMethods.dateToStamp(createDate));
                scheduleLabelEntity.setScheduleId(scheduleEntity.getScheduleId());

                try{
                    // 日程标签表插入
                    scheduleLabelRepository.save(scheduleLabelEntity);
                    logger.info("日程标签中间表 成功添加" + "labelIds = "+Integer.parseInt(id.toString()));
                }catch (Exception e){
                    throw new ServiceException("语法错误");
                }
            }
        }else {
            throw new ServiceException("labelIds参数不能为空");
        }

        List<GtdGroupMemberEntity> list = new ArrayList<>();
        if (groupIds != null) {
            for (Object id : groupIds) {
                // 根据groupId 查询群成员信息
                List<GtdGroupMemberEntity> groupMemberList = groupMemberRepository.findMemberByGroupId(Integer.parseInt(id.toString()));
                for (GtdGroupMemberEntity entity:groupMemberList){
                    list.add(entity);
                }

                GtdGroupScheduleEntity groupScheduleEntity = new GtdGroupScheduleEntity();   // 群组日程中间表
                // 群组日程表  绑定
                groupScheduleEntity.setGroupId(Integer.parseInt(id.toString()));
                groupScheduleEntity.setCreateId(userId);
                groupScheduleEntity.setCreateDate(CommonMethods.dateToStamp(createDate));
                groupScheduleEntity.setScheduleId(scheduleEntity.getScheduleId());
                try{
                    // 群组日程表 插入
                    groupScheduleRepository.save(groupScheduleEntity);
                    logger.info("群组日程中间表 成功添加" + "groupIds = "+Integer.parseInt(id.toString()));
                }catch (Exception e){
                    throw new ServiceException("语法错误");
                }
            }
        }else throw new ServiceException("groupIds参数不能为空");

        Set<Integer> setGroupUserId = list.stream().map(GtdGroupMemberEntity::getUserId).collect(Collectors.toSet());
        //setGroupUserId.forEach(e -> logger.info(e));   // 打印

        for (Integer i:setGroupUserId){
            GtdSchedulePlayersEntity schedulePlayersEntity = new GtdSchedulePlayersEntity();// 日程参与人表
            // 日程参与人 绑定
            schedulePlayersEntity.setScheduleId(scheduleEntity.getScheduleId());
            schedulePlayersEntity.setCreateId(createId);
            schedulePlayersEntity.setPlayersStatus(3);
            schedulePlayersEntity.setUserId(i);
            schedulePlayersEntity.setCreateDate(CommonMethods.dateToStamp(createDate));
            try{
                // 日程参与人插入
                schedulePlayersRepository.save(schedulePlayersEntity);
                logger.info("日程参与人 成功添加"+ "群组成员userId = " + i);
            }catch (Exception e){
                throw new ServiceException("语法错误");
            }
        }
        return 0;
    }

    /**
     * 删除日程
     * @param inDto
     * @return
     */
    @Override
    public int deleteSchedule(ScheduleInDto inDto) {
        // 接收参数
        int userId = inDto.getUserId();                                     // 用户ID
        int scheduleId = inDto.getScheduleId();                             // 日程事件ID

        // 入参检查     // 入参必须项检查
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (scheduleId == 0 || "".equals(scheduleId)) throw new ServiceException("日程事件ID不能为空");
        // 入参类型检查
        // 入参长度检查
        // 入参关联检查

        // 业务处理
        GtdScheduleEntity data = scheduleJpaRepository.findByScheduleId(scheduleId);

        if (data == null) throw new ServiceException();

        if (data.getCreateId().equals(userId)){     // 发布人删除
            List<GtdSchedulePlayersEntity> playersEntities = schedulePlayersRepository.findAllByScheduleId(scheduleId);
            for (GtdSchedulePlayersEntity entity:playersEntities){
                // TODO 发送消息给 参与人 entity.getCreateId()
                logger.info("userId = "+ userId + "\t 发送消息给 参与人 " + entity.getCreateId());
            }
            try {
                userShceduleRepository.deleteConnectionByScheduleId(scheduleId);    // 用户日程表 删除
                scheduleLabelRepository.deleteConnectionByScheduleId(scheduleId);   // 日程标签表 删除
                groupScheduleRepository.deleteConnectionByScheduleId(scheduleId);   // 群组标签表 删除
                schedulePlayersRepository.deleteConnectionByScheduleId(scheduleId); // 日程参与人表 删除

                GtdScheduleEntity scheduleEntity = new GtdScheduleEntity();
                scheduleEntity.setScheduleId(scheduleId);
                scheduleJpaRepository.delete(scheduleEntity);                       // 日程表      删除
            }catch (Exception ex){
                throw new ServiceException("语法错误");
            }
        }else {     // 参与人删除
            // TODO 发送消息给发布人 data.getCreateId()
            logger.info("userId = "+ userId + "\t 发送消息给 发布人 " + data.getCreateId());
            try {
                schedulePlayersRepository.deleteConnectionByScheduleIdAndUserId(scheduleId,userId); // 日程参与人表 删除
            }catch (Exception ex){
                throw new ServiceException("语法错误");
            }
        }
        return 0;
    }

    /**
     * 日程参与人状态修改
     * @param inDto
     * @return
     */
    @Override
    public int statusSchedule(ScheduleInDto inDto) {
        // 接收参数
        int userId = inDto.getUserId();                           			// 用户ID
        int scheduleId = inDto.getScheduleId();                    	        // 日程事件ID
        Integer playersStatus = inDto.getPlayersStatus();                       // 参与人状态修改
        int updateId = inDto.getUpdateId();                          		// 更新人
        String updateDate = inDto.getUpdateDate();                     		// 更新时间

        String date = dateFormat();
        // 入参检查     // 入参必须项检查
        if ("".equals(userId)) throw new ServiceException("用户ID不能为空");
        if ("".equals(scheduleId)) throw new ServiceException("日程事件ID不能为空");
        if (updateId == 0 || "".equals(updateId)) updateId = userId;
        if (updateDate == null || "".equals(updateDate)) updateDate = date;
        // 入参类型检查
        // 入参长度检查
        // 入参关联检查

        try {
            schedulePlayersRepository.updateConnectionByScheduleIdAndUserId(0,userId,CommonMethods.dateToStamp(updateDate),scheduleId);
        }catch (Exception ex){
            throw new ServiceException("语法错误");
        }
        return 0;
    }

    private String dateFormat() {
        SimpleDateFormat sf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        String date = sf.format(new Date());
        return date;
    }
}

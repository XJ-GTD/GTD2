package com.manager.master.service.serviceImpl;

import com.manager.config.exception.ServiceException;
import com.manager.master.dto.ScheduleInDto;
import com.manager.master.entity.*;
import com.manager.master.repository.*;
import com.manager.master.service.IScheduleService;
import com.manager.util.CommonMethods;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * 日程Service实现类
 * @author cp
 * @since 2018/8/28
 */
@Service
@Transactional
public class ScheduleServiceImpl implements IScheduleService {

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

    @Override
    public List<GtdScheduleEntity> findAll(ScheduleInDto inDto) {
        return null;
    }

    @Override
    public GtdScheduleEntity findOne(ScheduleInDto inDto) {
        return scheduleJpaRepository.findByScheduleId(inDto.getScheduleId());
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
        int scheduleRepeatType = inDto.getScheduleRepeatType();             // 日程重复类型
        Integer scheduleStatus = inDto.getScheduleStatus();                  // 完成状态
        int updateId = inDto.getUpdateId();                          		// 更新人
        String updateDate = inDto.getUpdateDate();                     		// 更新时间

        List groupIds = inDto.getGroupIds();                          		// 群组 List
        List labelIds = inDto.getLabelIds();                          		// 标签 List
        Date date = new Date();
        // 入参检查     // 入参必须项检查
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户名ID不能为空");
        if (scheduleId == 0 || "".equals(scheduleId)) throw new ServiceException("日程事件ID不能为空");
        if (scheduleName == null || "".equals(scheduleName)) throw new ServiceException("日程事件名称不能为空");
        else scheduleName = scheduleName.replace(" ", "");
        if (scheduleStartTime == null || "".equals(scheduleStartTime)) throw new ServiceException("开始时间不能为空");
        if (scheduleDeadline == null || "".equals(scheduleDeadline)) throw new ServiceException("截止时间不能为空");
        if (updateId == 0 || "".equals(updateId)) updateId = userId;
        if (updateDate == null || "".equals(updateDate)) updateDate =date.toString();
        if (groupIds == null || "".equals(groupIds)) throw new ServiceException("群组不能为空");
        if (labelIds == null || "".equals(labelIds)) throw new ServiceException("标签名称不能为空");
        // 入参类型检查
        // 日程重复类型 判断
        int[] types = new int[] { 0, 1, 2, 3 };
        if (!CommonMethods.isInArray(types,scheduleRepeatType)){
            throw new ServiceException("日程重复类型不在‘0-3’范围内");
        }
        // 完成状态 判断
        int[] status = new int[] { 0,1, 2 };
        if (!CommonMethods.isInArray(status,scheduleStatus)){
            throw new ServiceException("完成状态不在‘0-2’范围内");
        }
        // 判断是否为日期类型
        if (!CommonMethods.checkIsDate(scheduleStartTime)) throw new ServiceException("开始时间不是日期类型");
        if (!CommonMethods.checkIsDate(scheduleDeadline)) throw new ServiceException("截止时间不是日期类型");
        if (!CommonMethods.checkIsDate(updateDate)) throw new ServiceException("更新时间不是日期类型");
        // 入参长度检查
        // 入参关联检查
        if (!CommonMethods.compareDate(scheduleStartTime,scheduleDeadline)){
            throw new ServiceException("开始时间必须小于截止时间");
        }
        if (CommonMethods.checkMySqlReservedWords(scheduleName)){
            throw new ServiceException("用户名包含关键字");
        }

        // 业务处理
        GtdScheduleEntity scheduleEntity = scheduleJpaRepository.getOne(scheduleId);

        if (scheduleEntity.getCreateId().equals(userId)) {     // 发布人 日程编辑

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
        Date date = new Date();
        // 入参检查     // 入参必须项检查
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (scheduleId == 0 || "".equals(scheduleId)) throw new ServiceException("日程事件ID不能为空");
        if (createId == 0 || "".equals(createId)) createId = userId;
        if (createDate == null || "".equals(createDate)) createDate = date.toString();
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
                    groupMemberList = groupMemberRepository.findAllByGroupId(Integer.parseInt(id.toString()));
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
                    groupMember = groupMemberRepository.findByGroupIdAndUserId(Integer.parseInt(id.toString()),i.getUserId());
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

        Date date = new Date();
        // 入参检查     // 入参必须项检查
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (scheduleName == null || "".equals(scheduleName)) throw new ServiceException("日程事件名称不能为空");
        else scheduleName = CommonMethods.trimAllBlanks(scheduleName);
        if (scheduleStartTime == null || "".equals(scheduleStartTime)) scheduleStartTime = date.toString();
        if (scheduleDeadline == null || "".equals(scheduleDeadline)) throw new ServiceException("截止时间不能为空");
        if (createId == 0 || "".equals(createId)) createId = userId;
        if (createDate == null || "".equals(createDate)) createDate = date.toString();
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
        if (!CommonMethods.checkIsDate(scheduleStartTime)) throw new ServiceException("开始时间不是日期类型");
        if (!CommonMethods.checkIsDate(scheduleDeadline)) throw new ServiceException("截止时间不是日期类型");
        if (!CommonMethods.checkIsDate(createDate)) throw new ServiceException("更新时间不是日期类型");
        // 入参长度检查
        // 入参关联检查
        if (!CommonMethods.compareDate(scheduleStartTime,scheduleDeadline)){
            throw new ServiceException("开始时间必须小于截止时间");
        }
        if (CommonMethods.checkMySqlReservedWords(scheduleName)){
            throw new ServiceException("用户名包含关键字");
        }

        // 业务处理
        GtdScheduleEntity scheduleEntity = new GtdScheduleEntity();                     // 日程表
        GtdUserScheduleEntity userScheduleEntity = new GtdUserScheduleEntity();         // 用户日程表

        // 日程信息 绑定
        scheduleEntity.setScheduleName(scheduleName);
        scheduleEntity.setScheduleStarttime(CommonMethods.dateToStamp(scheduleStartTime));
        scheduleEntity.setScheduleDeadline(CommonMethods.dateToStamp(scheduleDeadline));
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
                List<GtdGroupMemberEntity> groupMemberList = groupMemberRepository.findAllByGroupId(Integer.parseInt(id.toString()));
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

        Date date = new Date();
        // 入参检查     // 入参必须项检查
        if ("".equals(userId)) throw new ServiceException("用户ID不能为空");
        if ("".equals(scheduleId)) throw new ServiceException("日程事件ID不能为空");
        if (updateId == 0 || "".equals(updateId)) updateId = userId;
        if (updateDate == null || "".equals(updateDate)) updateDate = date.toString();
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
}

package com.manager.master.service.serviceImpl;

import com.manager.util.CommonMethods;
import com.manager.config.exception.ServiceException;
import com.manager.master.dto.ScheduleInDto;
import com.manager.master.entity.*;
import com.manager.master.repository.*;
import com.manager.master.service.IScheduleService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
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

    private Logger logger = LogManager.getLogger(this.getClass());

    @Resource
    ScheduleJpaRepository scheduleJpaRepository;

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

    /**
     * 更新日程
     * @param inDto
     * @return
     */
    @Override
    public int updateSchedule(ScheduleInDto inDto) {
        // 接收参数
        int userId = inDto.getUserId();                           			// 用户ID
        String scheduleName = inDto.getScheduleName();                    	// 日程事件名称
        String scheduleStartTime = inDto.getScheduleStartTime();            // 开始时间
        String scheduleDeadline = inDto.getScheduleDeadline();              // 截止时间
        int scheduleRepeatType = inDto.getScheduleRepeatType();             // 日程重复类型
        String scheduleStatus = inDto.getScheduleStatus();                  // 完成状态
        int updateId = inDto.getUpdateId();                          		// 更新人
        String updateDate = inDto.getUpdateDate();                     		// 更新时间

        List groupIds = inDto.getGroupIds();                          		// 群组 List
        List labelIds = inDto.getLabelIds();                          		// 标签 List
        List groupScheduleIds = inDto.getGroupScheduleIds();                // 群组日程 List
        List scheduleLabelIds = inDto.getScheduleLabelIds();                // 日程标签 List
        // 入参检查     // 入参必须项检查
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户名不能为空");
        if (scheduleName == null || "".equals(scheduleName)) throw new ServiceException("日程事件名称不能为空");
        else scheduleName = scheduleName.replace(" ", "");
        if (scheduleStartTime == null || "".equals(scheduleStartTime)) throw new ServiceException("开始时间不能为空");
        if (scheduleDeadline == null || "".equals(scheduleDeadline)) throw new ServiceException("截止时间不能为空");
        if ("".equals(scheduleRepeatType)) throw new ServiceException("日程重复类型不能为空");
        if (scheduleStatus == null || "".equals(scheduleStatus)) throw new ServiceException("完成状态不能为空");
        else scheduleStatus = "1";
        if (updateId == 0 || "".equals(updateId)) updateId = userId;
        if (updateDate == null || "".equals(updateDate)) throw new ServiceException("更新时间不能为空");
        if (groupIds == null || "".equals(groupIds)) throw new ServiceException("群组不能为空");
        if (labelIds == null || "".equals(labelIds)) throw new ServiceException("标签名称不能为空");
        // 入参类型检查
        // 日程重复类型 判断
        int[] types = new int[] { 0, 1, 2, 3 };
        if (!CommonMethods.isInArray(types,scheduleRepeatType)){
            throw new ServiceException("日程重复类型不在‘0-3’范围内");
        }
        // 完成状态 判断
        int[] status = new int[] { '0', '1', '2' };
        int st;
        try{
            st = Integer.parseInt(scheduleStatus);
        }catch (Exception e){
            throw new ServiceException("完成状态不在‘0-2’范围内");
        }
        if (!CommonMethods.isInArray(types,st)){
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
        GtdScheduleEntity scheduleEntity = new GtdScheduleEntity();       // 日程表



        /*List scheduleLabelIds = inDto.getScheduleLabelIds();  // 标签 SCHEDULE_LABEL_ID List
        if (scheduleLabelIds != null) {
            for (Object id : scheduleLabelIds) {
                logger.info("scheduleLabelIds = "+Integer.parseInt(id.toString()));
                GtdScheduleLabelEntity scheduleLabelEntity = new GtdScheduleLabelEntity();      // 日程标签中间表
                // 日程标签表  绑定
                scheduleLabelEntity.setScheduleLabelId(Integer.parseInt(id.toString()));
                scheduleLabelEntity.setUpdateId(inDto.getUpdateId());
                scheduleLabelEntity.setUpdateDate(CommonMethods.dateToStamp(inDto.getCreateDate()));

                // 日程标签表插入
                GtdScheduleLabelEntity slid = scheduleLabelRepository.saveAndFlush(scheduleLabelEntity);     // 获取自增主键
                scheduleLabelRepository.save(scheduleLabelEntity);
            }
        }else {
            throw new ServiceException("labelIds参数不能为空");
        }*/

        /*List groupScheduleIds = inDto.getGroupScheduleIds();    // 群组
        if (groupScheduleIds != null) {
            for (Object id : groupScheduleIds) {
                logger.info("groupScheduleIds = "+Integer.parseInt(id.toString()));
                GtdGroupScheduleEntity groupScheduleEntity = new GtdGroupScheduleEntity();   // 群组日程中间表
                // 群组日程表  绑定
                groupScheduleEntity.setGroupScheduleId(Integer.parseInt(id.toString()));
                groupScheduleEntity.setUpdateId(inDto.getUpdateId());
                groupScheduleEntity.setUpdateDate(CommonMethods.dateToStamp(inDto.getCreateDate()));
                groupScheduleEntity.setScheduleId(scheduleEntity.getScheduleId());
                // 群组日程表 插入
                GtdGroupScheduleEntity gsid = groupScheduleRepository.saveAndFlush(groupScheduleEntity);     // 获取自增主键
                groupScheduleRepository.save(groupScheduleEntity);
            }
        }else throw new ServiceException("groupIds参数不能为空");*/
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
        int scheduleRepeatType = inDto.getScheduleRepeatType();             // 日程重复类型
        String scheduleStatus = inDto.getScheduleStatus();                  // 完成状态
        int createId = inDto.getCreateId();                      		    // 更新人
        String createDate = inDto.getCreateDate();                 		    // 更新时间

        List groupIds = inDto.getGroupIds();                          		// 群组 List
        List labelIds = inDto.getLabelIds();                          		// 标签 List
        // 入参检查     // 入参必须项检查
        if (userId == 0 || "".equals(userId)) throw new ServiceException("用户ID不能为空");
        if (scheduleName == null || "".equals(scheduleName)) throw new ServiceException("日程事件名称不能为空");
        else scheduleName = scheduleName.replace(" ", "");
        if (scheduleStartTime == null || "".equals(scheduleStartTime)) throw new ServiceException("开始时间不能为空");
        if (scheduleDeadline == null || "".equals(scheduleDeadline)) throw new ServiceException("截止时间不能为空");
        if ("".equals(scheduleRepeatType)) throw new ServiceException("日程重复类型不能为空");
        if (scheduleStatus == null || "".equals(scheduleStatus)) throw new ServiceException("完成状态不能为空");
        else scheduleStatus = "1";
        if (createId == 0 || "".equals(createId)) createId = userId;
        if (createDate == null || "".equals(createDate)) throw new ServiceException("更新时间不能为空");
        if (groupIds == null || "".equals(groupIds)) throw new ServiceException("群组不能为空");
        if (labelIds == null || "".equals(labelIds)) throw new ServiceException("标签名称不能为空");
        // 入参类型检查
        // 日程重复类型 判断
        int[] types = new int[] { 0, 1, 2, 3 };
        if (!CommonMethods.isInArray(types,scheduleRepeatType)){
            throw new ServiceException("日程重复类型不在‘0-3’范围内");
        }
        // 完成状态 判断
        int st;
        try{
            st = Integer.parseInt(scheduleStatus);
        }catch (Exception e){
            throw new ServiceException("完成状态不在‘0-2’范围内");
        }
        int[] status = new int[] { '0', '1', '2' };
        if (!CommonMethods.isInArray(types,st)){
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
        GtdSchedulePlayersEntity schedulePlayersEntity = new GtdSchedulePlayersEntity();// 日程参与人表
        GtdUserShceduleEntity userShceduleEntity = new GtdUserShceduleEntity();         // 用户日程表

        // 日程信息 绑定
        scheduleEntity.setScheduleName(scheduleName);
        scheduleEntity.setScheduleStarttime(CommonMethods.dateToStamp(scheduleStartTime));
        scheduleEntity.setScheduleDeadline(CommonMethods.dateToStamp(scheduleDeadline));
        scheduleEntity.setScheduleRepeatType(scheduleRepeatType);
        scheduleEntity.setScheduleStatus(scheduleStatus);
        scheduleEntity.setCreateId(createId);
        scheduleEntity.setCreateDate(CommonMethods.dateToStamp(createDate));

        // 获取自增主键
        scheduleEntity = scheduleJpaRepository.saveAndFlush(scheduleEntity);
        // 日程事件表插入
        scheduleJpaRepository.save(scheduleEntity);
        logger.info("日程事件表插入");

        // 用户日程表信息  绑定
        userShceduleEntity.setUserId(userId);
        userShceduleEntity.setScheduleId(scheduleEntity.getScheduleId());
        userShceduleEntity.setCreateId(userId);
        userShceduleEntity.setCreateDate(CommonMethods.dateToStamp(createDate));
        // 用户日程表插入
        GtdUserShceduleEntity uid = userShceduleRepository.saveAndFlush(userShceduleEntity);     // 获取自增主键
        userShceduleRepository.save(userShceduleEntity);
        logger.info("用户日程表插入");

        if (labelIds != null) {
            for (Object id : labelIds) {
                logger.info("labelIds = "+Integer.parseInt(id.toString()));
                GtdScheduleLabelEntity scheduleLabelEntity = new GtdScheduleLabelEntity();      // 日程标签中间表
                // 日程标签表  绑定
                scheduleLabelEntity.setLabelId(Integer.parseInt(id.toString()));
                scheduleLabelEntity.setCreateId(userId);
                scheduleLabelEntity.setCreateDate(CommonMethods.dateToStamp(createDate));
                scheduleLabelEntity.setScheduleId(scheduleEntity.getScheduleId());
                // 日程标签表插入
                GtdScheduleLabelEntity slid = scheduleLabelRepository.saveAndFlush(scheduleLabelEntity);     // 获取自增主键
                scheduleLabelRepository.save(scheduleLabelEntity);
                logger.info("日程标签表插入");
            }
        }else {
            throw new ServiceException("labelIds参数不能为空");
        }

        List<GtdGroupMemberEntity> list = new ArrayList<>();
        if (groupIds != null) {
            for (Object id : groupIds) {
                logger.info("groupIds = "+Integer.parseInt(id.toString()));
                // 根据groupId 查询群成员信息
                List<GtdGroupMemberEntity> groupmemberlist = groupMemberRepository.findAllByGroupId(Integer.parseInt(id.toString()));
                for (GtdGroupMemberEntity entity:groupmemberlist){
                    list.add(entity);
                }

                GtdGroupScheduleEntity groupScheduleEntity = new GtdGroupScheduleEntity();   // 群组日程中间表
                // 群组日程表  绑定
                groupScheduleEntity.setGroupId(Integer.parseInt(id.toString()));
                groupScheduleEntity.setCreateId(userId);
                groupScheduleEntity.setCreateDate(CommonMethods.dateToStamp(createDate));
                groupScheduleEntity.setScheduleId(scheduleEntity.getScheduleId());
                // 群组日程表 插入
                GtdGroupScheduleEntity gsid = groupScheduleRepository.saveAndFlush(groupScheduleEntity);     // 获取自增主键
                groupScheduleRepository.save(groupScheduleEntity);
                logger.info("群组日程表插入");
            }
        }else throw new ServiceException("groupIds参数不能为空");

        Set<Integer> setGroupUserId = list.stream().map(GtdGroupMemberEntity::getUserId).collect(Collectors.toSet());
        //setGroupUserId.forEach(e -> logger.info(e));   // 打印

        for (Integer i:setGroupUserId){
            // 日程参与人 绑定
            schedulePlayersEntity.setScheduleId(scheduleEntity.getScheduleId());
            schedulePlayersEntity.setCreateId(createId);
            schedulePlayersEntity.setPlayersStatus(3);
            schedulePlayersEntity.setUserId(i);
            // 日程参与人插入
            GtdSchedulePlayersEntity spid = schedulePlayersRepository.saveAndFlush(schedulePlayersEntity);
            schedulePlayersRepository.save(schedulePlayersEntity);
            logger.info("日程参与人插入");
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
        int scheduleId = inDto.getScheduleId();     // 日程事件ID
        GtdScheduleEntity scheduleEntity = new GtdScheduleEntity();
        scheduleEntity.setScheduleId(scheduleId);

        // 入参检查     // 入参必须项检查
        if (scheduleId == 0 || "".equals(scheduleId)) throw new ServiceException("日程事件ID不能为空");

        // 入参类型检查
        // 入参长度检查
        // 入参关联检查

        // 业务处理
        userShceduleRepository.deleteConnectionByScheduleId(scheduleId);    // 用户日程表 删除
        scheduleLabelRepository.deleteConnectionByScheduleId(scheduleId);   // 日程标签表 删除
        groupScheduleRepository.deleteConnectionByScheduleId(scheduleId);   // 群组标签表 删除
        schedulePlayersRepository.deleteConnectionByScheduleId(scheduleId); // 日程参与人表 删除
        scheduleJpaRepository.delete(scheduleEntity);

        return 0;
    }
}

package com.xiaoji.master.service.serviceImpl;

import com.xiaoji.master.dto.RemindInsertInDto;
import com.xiaoji.master.repository.RemindJpaRepository;
import com.xiaoji.master.repository.SchedulePlayersNewRepository;
import com.xiaoji.master.service.IRemindService;
import com.xiaoji.util.CommonMethods;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.annotation.Resource;
import java.text.SimpleDateFormat;
import java.util.Date;

@Service
@Transactional
public class RemindServiceImpl implements IRemindService {

    @Resource
    SchedulePlayersNewRepository schedulePlayersNewRepository;

    @Resource
    RemindJpaRepository remindJpaRepository;

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 插入提醒时间
     *
     * @param inDto
     * @return
     */
    @Override
    public int insertRemind(RemindInsertInDto inDto) {
        logger.info(" ------- 开始 RemindServiceImpl - insertRemind --------");
        // 接收参数
        Integer userId = inDto.getUserId();
        String remindDate = inDto.getRemindDate();
        Integer scheduleId = inDto.getScheduleId();
        Integer remindType = inDto.getRemindType();

        // 入参必输项检查
        logger.info("----- 入参检查 -----");
        if(userId == null || "".equals(userId)){
            logger.error("----- 用户id 不能为空 -----");
            return 1;
        }
        if(remindDate == null || "".equals(remindDate)){
            logger.error("----- 提醒时间 不能为空 -----");
            return 1;
        }
        if(scheduleId == null || "".equals(scheduleId)){
            logger.error("----- 日程ID 不能为空 -----");
            return 1;
        }
        if(remindType == null || "".equals(remindType)){
            logger.error("----- 提醒类型 不能为空 -----");
            return 1;
        }
        // 入参类型检查
        if(!CommonMethods.checkIsDate(remindDate)){
            logger.error(" ----- 提醒时间 格式不正确 -----");
            return 1;
        }

        // 业务处理
        // 查找 参与人 表Id
        Integer playersId = null;
        try {
            logger.info("----- 查找参与人表ID -----");
            playersId = schedulePlayersNewRepository.findPlayersIdByUserIdAndScheduleId(scheduleId,userId);
        } catch (Exception ex){
            logger.error("-----  findPlayersIdByUserIdAndScheduleId 语法错误 ------");
            ex.printStackTrace();
        }
        // 插入提醒时间
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        Date date = new Date();
        String time = sdf.format(date);
        try {
            logger.info("---- 插入提醒时间 -----");
            remindJpaRepository.insertIntoRemind(playersId,CommonMethods.dateToStamp(remindDate),remindType,userId,CommonMethods.dateToStamp(time),userId,CommonMethods.dateToStamp(time));
        } catch (Exception ex){
            logger.error("-----  insertIntoRemind 语法错误 ------");
            ex.printStackTrace();
        }
        return 0;
    }

    /**
     * 提醒时间更新
     *
     * @param userId     用户id
     * @param remindDate 提醒时间：yyyy-MM-dd HH:mm
     * @param remindType 提醒类型
     * @param remindId   提醒时间id
     * @return
     */
    @Override
    public int updateRemindDate(Integer userId, String remindDate, Integer remindType, Integer remindId) {
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd HH:mm");
        Date date = new Date();
        String time = sdf.format(date);
        try{
            remindJpaRepository.updateRemindDateByUser(CommonMethods.dateToStamp(remindDate),remindType,userId,CommonMethods.dateToStamp(time),remindId);
        } catch (Exception ex){
            logger.error("----- updateRemindDateByUser 语法错误 -----");
            ex.printStackTrace();
        }
        return 0;
    }

    /**
     * 提醒时间删除
     *
     * @param remindId
     * @return
     */
    @Override
    public int deleteRemind(Integer remindId) {
        try{
            remindJpaRepository.deleteByRemindId(remindId);
        } catch (Exception ex){
            logger.error("----- deleteByRemindId 语法错误 -----");
            ex.printStackTrace();
        }
        return 0;
    }
}

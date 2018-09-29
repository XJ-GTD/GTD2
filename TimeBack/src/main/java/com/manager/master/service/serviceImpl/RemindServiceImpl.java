package com.manager.master.service.serviceImpl;

import com.manager.master.dto.RemindInsertInDto;
import com.manager.master.repository.RemindJpaRepository;
import com.manager.master.repository.SchedulePlayersNewRepository;
import com.manager.master.service.IRemindService;
import com.manager.util.CommonMethods;
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
}

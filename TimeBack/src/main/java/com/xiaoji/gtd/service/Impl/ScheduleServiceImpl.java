package com.xiaoji.gtd.service.Impl;

import com.xiaoji.gtd.dto.ScheduleInDto;
import com.xiaoji.gtd.dto.mq.WebSocketDataDto;
import com.xiaoji.gtd.dto.mq.WebSocketOutDto;
import com.xiaoji.gtd.service.IScheduleService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

/**
 * 日程接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
@Transactional
public class ScheduleServiceImpl implements IScheduleService {

    private Logger logger = LogManager.getLogger(this.getClass());

    /**
     * 日程推送处理
     * @return
     */
    @Override
    public int dealWithSchedule(ScheduleInDto inDto) {

        WebSocketOutDto outDto = new WebSocketOutDto();
        WebSocketDataDto data = new WebSocketDataDto();

        String userId = inDto.getUserId();
        String skillType = inDto.getSkillType();
        String scheduleName = inDto.getScheduleName();
        String startTime = inDto.getStartTime();
        String endTime = inDto.getEndTime();
        String label = inDto.getLabel();
        String planName = inDto.getPlanName();
        String status = inDto.getStatus();
        List<Map<String, String>> playerName = inDto.getPlayerName();
        String targetUserId = "";
        String targetMobile = "";

        try {


        } catch (Exception e) {
            e.printStackTrace();
            logger.error("");
        }

        return 0;
    }


}

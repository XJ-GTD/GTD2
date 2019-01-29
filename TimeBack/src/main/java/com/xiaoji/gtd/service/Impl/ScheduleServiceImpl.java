package com.xiaoji.gtd.service.Impl;

import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.dto.mq.WebSocketDataDto;
import com.xiaoji.gtd.dto.mq.WebSocketOutDto;
import com.xiaoji.gtd.dto.mq.WebSocketResultDto;
import com.xiaoji.gtd.dto.player.PlayerDataDto;
import com.xiaoji.gtd.dto.schedule.ScheduleDataDto;
import com.xiaoji.gtd.dto.schedule.ScheduleInDto;
import com.xiaoji.gtd.dto.schedule.ScheduleOutData;
import com.xiaoji.gtd.dto.schedule.ScheduleOutDto;
import com.xiaoji.gtd.service.IPersonService;
import com.xiaoji.gtd.service.IScheduleService;
import com.xiaoji.gtd.service.ISmsService;
import com.xiaoji.gtd.service.IWebSocketService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * 日程接口实现类
 *
 * create by wzy on 2018/11/16.
 */
@Service
@Transactional
public class ScheduleServiceImpl implements IScheduleService {

    private Logger logger = LogManager.getLogger(this.getClass());

    @Value("${mq.agreement.version}")
    private String VERSION;

    private final IWebSocketService webSocketService;
    private final ISmsService smsService;
    private final IPersonService personService;

    @Autowired
    public ScheduleServiceImpl(IWebSocketService webSocketService, ISmsService smsService, IPersonService personService) {
        this.webSocketService = webSocketService;
        this.smsService = smsService;
        this.personService = personService;
    }

    /**
     * 日程推送处理
     * @return
     */
    @Override
    public ScheduleOutDto dealWithSchedule(ScheduleInDto inDto) {

        ScheduleOutDto outDto = new ScheduleOutDto();
        List<ScheduleOutData> scheduleOutList = new ArrayList<>();
        ScheduleOutData scheduleData = new ScheduleOutData();
        WebSocketOutDto pushDto = new WebSocketOutDto();
        WebSocketDataDto data = new WebSocketDataDto();

        String userId = inDto.getUserId();
        String skillType = inDto.getSkillType();
        List<ScheduleDataDto> scheduleList = inDto.getScheduleList();

        String scheduleId = "";
        String scheduleName = "";
        String startTime = "";
        String endTime = "";
        String label = "";
        String status = "";
        String id = "";      //子表ID
        String comment = "";     //备注
        String repeatType = "";      //重复类型
        String remindType = "";      //提醒类型
        String remindTime = "";      //提醒时间
        String finishStatus = "";    //完成状态
        String finishTime = "";      //  完成时间
        List<PlayerDataDto> players;
        String targetUserId = "";
        String targetMobile = "";

        try {

            for (ScheduleDataDto sdd : scheduleList) {
                scheduleId = sdd.getScheduleId();

                data.setSi(scheduleId);
                data.setSn(sdd.getScheduleName());
                data.setSt(sdd.getStartTime());
                data.setEt(sdd.getEndTime());
                data.setLb(sdd.getLabel());
                data.setSs(sdd.getStatus());
                data.setUs(userId);
                data.setId(sdd.getId());
                data.setRm(sdd.getComment());
                data.setCft(sdd.getRepeatType());
                data.setAc(sdd.getRemindType());
                data.setDt(sdd.getRemindTime());
                data.setFh(sdd.getFinishStatus());
                data.setWd(sdd.getFinishTime());
                data.setEi(sdd.getExecuteId());
                data.setSa(sdd.getScheduleAuth());

                pushDto.setRes(new WebSocketResultDto(data));
                pushDto.setSk(skillType);
                pushDto.setVs(VERSION);

                players = personService.isAgree(userId, sdd.getPlayers());
                for (PlayerDataDto player: players) {
                    targetMobile = player.getAccountMobile();
                    targetUserId = player.getUserId();

                    if (player.isAgree()) {
                        pushDto.setSs(ResultCode.SUCCESS);
                        webSocketService.pushTopicMessage(targetUserId, pushDto);
                        logger.debug("[成功推送日程]:方式 === RABBIT MQ");
                    } else if (!player.isUser()){
//                        smsService.pushSchedule(targetMobile);
                        logger.debug("[成功推送日程]:方式 === SMS");
                    } else {
                        logger.debug("[不可推送日程]:原因 === 非对方好友或没有权限");
                    }
                }
                scheduleData.setPlayers(players);
                scheduleData.setScheduleId(scheduleId);
                scheduleOutList.add(scheduleData);

            }
            outDto.setScheduleList(scheduleOutList);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("dealWithSchedule日程推送出错");
            outDto = null;
        }

        return outDto;
    }


}

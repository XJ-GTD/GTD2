package com.xiaoji.gtd.service.Impl;

import com.xiaoji.gtd.dto.PlayerDataDto;
import com.xiaoji.gtd.dto.ScheduleInDto;
import com.xiaoji.gtd.dto.SearchOutDto;
import com.xiaoji.gtd.dto.code.ResultCode;
import com.xiaoji.gtd.dto.mq.WebSocketDataDto;
import com.xiaoji.gtd.dto.mq.WebSocketOutDto;
import com.xiaoji.gtd.dto.mq.WebSocketResultDto;
import com.xiaoji.gtd.service.IPersonService;
import com.xiaoji.gtd.service.IScheduleService;
import com.xiaoji.gtd.service.ISmsService;
import com.xiaoji.gtd.service.IWebSocketService;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
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
    public SearchOutDto dealWithSchedule(ScheduleInDto inDto) {

        SearchOutDto outDto = new SearchOutDto();
        WebSocketOutDto pushDto = new WebSocketOutDto();
        WebSocketDataDto data = new WebSocketDataDto();

        String userId = inDto.getUserId();
        String skillType = inDto.getSkillType();
        String scheduleId = inDto.getScheduleId();
        String scheduleName = inDto.getScheduleName();
        String startTime = inDto.getStartTime();
        String endTime = inDto.getEndTime();
        String label = inDto.getLabel();
        String status = inDto.getStatus();
        List<PlayerDataDto> players;
        String targetUserId = "";
        String targetMobile = "";

        try {

            data.setSi(scheduleId);
            data.setSn(scheduleName);
            data.setSt(startTime);
            data.setEt(endTime);
            data.setLb(label);
            data.setSt(status);
            data.setUs(userId);

            pushDto.setRes(new WebSocketResultDto(data));
            pushDto.setSk(skillType);
            pushDto.setVs(VERSION);

            players = personService.isAgree(userId, inDto.getPlayers());
            for (PlayerDataDto player: players) {
                targetMobile = player.getAccountMobile();
                targetUserId = player.getUserId();

                if (player.isAgree()) {
                    pushDto.setSs(ResultCode.SUCCESS);
                    webSocketService.pushTopicMessage(targetUserId, pushDto);
                    logger.debug("[成功推送日程]:方式 === RABBIT MQ");
                } else if (!player.isUser()){
//                    smsService.pushSchedule(targetMobile);
                    logger.debug("[成功推送日程]:方式 === SMS");
                } else {
                    logger.debug("[不可推送日程]:原因 === 非对方好友或没有权限");
                }
            }
            outDto.setPlayers(players);
        } catch (Exception e) {
            e.printStackTrace();
            logger.error("dealWithSchedule日程推送出错");
            outDto = null;
        }

        return outDto;
    }


}

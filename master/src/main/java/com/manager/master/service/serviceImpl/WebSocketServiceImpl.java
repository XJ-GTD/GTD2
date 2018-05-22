package com.manager.master.service.serviceImpl;

import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ServerMessageDto;
import com.manager.master.dto.ToUserMessageDto;
import com.manager.master.service.IWebSocketService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

/**
 * @Author: tzx ;
 * @Date: Created in 14:25 2018/5/8
 */
@Service
@Transactional
public class WebSocketServiceImpl implements IWebSocketService {

    //注入SimpMessagingTemplate 用于点对点消息发送
    @Autowired
    private SimpMessagingTemplate template;


    /**
     * 广播
     * 发送给所有在线用户
     *
     * @param msg
     */
    @Override
    public void sendMsg(ServerMessageDto msg) {
        template.convertAndSend("/topic/getResponse", msg);
    }

    /**
     * 发送给指定用户
     *
     * @param toUserMsg
     * @param schedule
     */
    @Override
    public void send2Users(ToUserMessageDto toUserMsg, ScheduleInDto schedule) {
        if (schedule.getUserId() != null && !"".equals(schedule.getUserId())) {
            //指定用户发送(执行人非空)
            List<String> userName = new ArrayList<>();
            String[] users = schedule.getUserId().split(",");
            for (String mobile : users) {
                userName.add(mobile);
            }
            toUserMsg.setUsers(userName);//执行人(手机号)
//            String userMobile = userDao.findMobileById(schedule.getScheduleIssuer());//发布人手机号
            String userMobile = schedule.getSchedulePhoneNum();//发布人手机号
            String title = schedule.getScheduleName();//事件名
            String finishDateString = schedule.getScheduleFinishDateString();//完成时间
            toUserMsg.setMessage("用户 " + userMobile + " 给您安排了" + title + "，希望您在" + finishDateString + "之前能完成！");
            toUserMsg.getUsers().forEach(name -> {
                template.convertAndSendToUser(name, "/message", toUserMsg.getMessage());
            });
        }
    }
}

package com.manager.master.service;

import com.manager.master.dto.ScheduleInDto;
import com.manager.master.dto.ServerMessageDto;
import com.manager.master.dto.ToUserMessageDto;


/**websocket推送
 * @Author: tzx ;
 * @Date: Created in 14:12 2018/5/8
 */
public interface IWebSocketService {

    /**
     * 广播
     * 发送给所有在线用户
     * @param msg
     */
    void sendMsg(ServerMessageDto msg);

    /**
     * 发送给指定用户
     * @param toUserMsg
     */
    void send2Users(ToUserMessageDto toUserMsg, ScheduleInDto schedule);

}

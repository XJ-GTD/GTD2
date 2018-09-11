package com.manager.master.service;

import com.manager.master.dto.PushInDto;

/**websocket推送
 * @Author: tzx ;
 * @Date: Created in 14:12 2018/5/8
 */
public interface IWebSocketService {

    int pushToUser(PushInDto inDto);

}

package com.manager.master.dto;

/**服务器端消息
 * @Author: tzx ;
 * @Date: Created in 17:52 2018/5/3
 */
public class ServerMessageDto {
    private String responseMessage;

    public String getResponseMessage() {
        return responseMessage;
    }

    public void setResponseMessage(String responseMessage) {
        this.responseMessage = responseMessage;
    }

    public ServerMessageDto(String responseMessage) {
        this.responseMessage = responseMessage;
    }
}

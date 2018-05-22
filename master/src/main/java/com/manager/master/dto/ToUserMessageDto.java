package com.manager.master.dto;

import java.util.List;

/**发送给用户的消息
 * @Author: tzx ;
 * @Date: Created in 17:54 2018/5/3
 */
public class ToUserMessageDto {
    private List<String> users;
    private String message;


    public List<String> getUsers() {
        return users;
    }

    public void setUsers(List<String> users) {
        this.users = users;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

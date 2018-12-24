package com.xiaoji.gtd.dto;

import java.util.List;
import java.util.Map;

/**
 * 参与人查询入参
 */
public class SearchInDto {

    private String userName;
    private String otherName;

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getOtherName() {
        return otherName;
    }

    public void setOtherName(String otherName) {
        this.otherName = otherName;
    }
}

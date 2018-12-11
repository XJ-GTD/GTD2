package com.xiaoji.gtd.dto;

/**
 * 添加联系人
 *
 * create by wzy on 2018/12/05
 */
public class PlayerInDto {

    private String userId;
    private String accountMobile;

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getAccountMobile() {
        return accountMobile;
    }

    public void setAccountMobile(String accountMobile) {
        this.accountMobile = accountMobile;
    }
}

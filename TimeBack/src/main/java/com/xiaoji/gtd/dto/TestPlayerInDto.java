package com.xiaoji.gtd.dto;

/**
 *  ！！ 同步方法完成后删除！！！
 */
public class TestPlayerInDto {

    private String id;              //参与人表主键
    private String userId;          //用户id
    private String otherName;       //备注

    private String accountMobile;   //参与人手机号
    private String playerId;        //参与人id
    private String playerName;      //参与人昵称
    private String headImg;         //参与人头像

    private int playerFlag;         //参与人权限 0不接收 1接收
    private int playerType;         //参与人类型 0未注册用户 1注册用户

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getOtherName() {
        return otherName;
    }

    public void setOtherName(String otherName) {
        this.otherName = otherName;
    }

    public String getPlayerId() {
        return playerId;
    }

    public void setPlayerId(String playerId) {
        this.playerId = playerId;
    }

    public String getPlayerName() {
        return playerName;
    }

    public void setPlayerName(String playerName) {
        this.playerName = playerName;
    }

    public String getHeadImg() {
        return headImg;
    }

    public void setHeadImg(String headImg) {
        this.headImg = headImg;
    }

    public int getPlayerFlag() {
        return playerFlag;
    }

    public void setPlayerFlag(int playerFlag) {
        this.playerFlag = playerFlag;
    }

    public int getPlayerType() {
        return playerType;
    }

    public void setPlayerType(int playerType) {
        this.playerType = playerType;
    }

    public String getAccountMobile() {
        return accountMobile;
    }

    public void setAccountMobile(String accountMobile) {
        this.accountMobile = accountMobile;
    }
}

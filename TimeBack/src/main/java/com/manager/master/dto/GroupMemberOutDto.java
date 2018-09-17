package com.manager.master.dto;

public class GroupMemberOutDto {
    private int memberId;            //群成员ID
    private String memeberName;      //群成员姓名
    private String memeberContact;   //群成员联系方式
    private int memberStatus;       //群成员状态

    public int getMemberId() {
        return memberId;
    }

    public void setMemberId(int memberId) {
        this.memberId = memberId;
    }

    public String getMemeberName() {
        return memeberName;
    }

    public void setMemeberName(String memeberName) {
        this.memeberName = memeberName;
    }

    public String getMemeberContact() {
        return memeberContact;
    }

    public void setMemeberContact(String memeberContact) {
        this.memeberContact = memeberContact;
    }

    public int getMemberStatus() {
        return memberStatus;
    }

    public void setMemberStatus(int memberStatus) {
        this.memberStatus = memberStatus;
    }
}

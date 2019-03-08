package com.xiaoji.sms.dto;

public class SmsDto {
	private String platformType; //平台 
	private String mobile; //手机号 
	private String sendType; //模板ID  0:验证码   1:日程共享发送未注册用户下载App邀请
	private String sendContent; //发送内容   sendType=0发送内容为验证码
	public String getPlatformType() {
		return platformType;
	}
	public void setPlatformType(String platformType) {
		this.platformType = platformType;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getSendType() {
		return sendType;
	}
	public void setSendType(String sendType) {
		this.sendType = sendType;
	}
	public String getSendContent() {
		return sendContent;
	}
	public void setSendContent(String sendContent) {
		this.sendContent = sendContent;
	}
	
}

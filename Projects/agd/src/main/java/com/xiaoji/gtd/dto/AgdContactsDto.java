package com.xiaoji.gtd.dto;

import java.io.Serializable;

/**
 * AgdAgendaInDto 入参类
 *
 */
public class AgdContactsDto implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String ai;	//	帐户ID
	private String n;	//	姓名
	private String a;	//	头像
	private String s;	//	性别
	private String bd;	//	生日
	private String mpn;	//	手机号码
	private String ci;	//	联系人ID
	private String ri;	//	关联日程ID
	public String getAi() {
		return ai;
	}
	public void setAi(String ai) {
		this.ai = ai;
	}
	public String getN() {
		return n;
	}
	public void setN(String n) {
		this.n = n;
	}
	public String getA() {
		return a;
	}
	public void setA(String a) {
		this.a = a;
	}
	public String getS() {
		return s;
	}
	public void setS(String s) {
		this.s = s;
	}
	public String getBd() {
		return bd;
	}
	public void setBd(String bd) {
		this.bd = bd;
	}
	public String getMpn() {
		return mpn;
	}
	public void setMpn(String mpn) {
		this.mpn = mpn;
	}
	public String getCi() {
		return ci;
	}
	public void setCi(String ci) {
		this.ci = ci;
	}
	public String getRi() {
		return ri;
	}
	public void setRi(String ri) {
		this.ri = ri;
	}
	
}

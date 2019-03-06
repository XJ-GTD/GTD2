package com.xiaoji.gtd.dto;

import java.io.Serializable;

/**
 * XjBlacklistDto
 *
 */
public class BlaBlacklistDto implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private Long Id; //主键	
	private String mpn; //电话
	private String ai; //账号
	private String a;//头像
	private String n; // 名称
	private String relId; //关联ID
	public Long getId() {
		return Id;
	}
	public void setId(Long id) {
		Id = id;
	}
	public String getMpn() {
		return mpn;
	}
	public void setMpn(String mpn) {
		this.mpn = mpn;
	}
	public String getAi() {
		return ai;
	}
	public void setAi(String ai) {
		this.ai = ai;
	}
	public String getA() {
		return a;
	}
	public void setA(String a) {
		this.a = a;
	}
	public String getN() {
		return n;
	}
	public void setN(String n) {
		this.n = n;
	}
	public String getRelId() {
		return relId;
	}
	public void setRelId(String relId) {
		this.relId = relId;
	}
	
}

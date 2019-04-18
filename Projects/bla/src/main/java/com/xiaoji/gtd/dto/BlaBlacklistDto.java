package com.xiaoji.gtd.dto;

import java.io.Serializable;
import java.util.List;

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
	private List<BlaBlacklistDto> bls;
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
	public List<BlaBlacklistDto> getBls() {
		return bls;
	}
	public void setBls(List<BlaBlacklistDto> bls) {
		this.bls = bls;
	}
	@Override
	public String toString() {
		StringBuilder builder = new StringBuilder();
		builder.append("BlaBlacklistDto [Id=").append(Id).append(", mpn=").append(mpn).append(", ai=").append(ai)
				.append(", a=").append(a).append(", n=").append(n).append(", relId=").append(relId).append(", bls=")
				.append(bls).append("]");
		return builder.toString();
	}
	
}

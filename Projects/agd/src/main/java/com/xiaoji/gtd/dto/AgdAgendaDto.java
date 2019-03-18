package com.xiaoji.gtd.dto;

import java.io.Serializable;
import java.util.List;

/**
 * AgdAgendaInDto 入参类
 *
 */
public class AgdAgendaDto implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private String rai;	//关联日程ID
	private String fc;	//	来自于
	private String ai;	//	日程ID
	private String at;	//	主题
	private String adt;	//	开始日期
	private String st;	//	开始时间
	private String ed;	//	结束日期
	private String et;	//	结束时间
	private String ap;	//	计划
	private String ar;	//	重复
	private String aa;	//	提醒
	private String am;	//	备注
	private String wtt; // 创建时间戳
	private List<AgdContactsDto> ac;	//	参与人
	public String getRai() {
		return rai;
	}
	public void setRai(String rai) {
		this.rai = rai;
	}
	public String getFc() {
		return fc;
	}
	public void setFc(String fc) {
		this.fc = fc;
	}
	public String getAi() {
		return ai;
	}
	public void setAi(String ai) {
		this.ai = ai;
	}
	public String getAt() {
		return at;
	}
	public void setAt(String at) {
		this.at = at;
	}
	public String getAdt() {
		return adt;
	}
	public void setAdt(String adt) {
		this.adt = adt;
	}
	public String getAp() {
		return ap;
	}
	public void setAp(String ap) {
		this.ap = ap;
	}
	public String getAr() {
		return ar;
	}
	public void setAr(String ar) {
		this.ar = ar;
	}
	public String getAa() {
		return aa;
	}
	public void setAa(String aa) {
		this.aa = aa;
	}
	public String getAm() {
		return am;
	}
	public void setAm(String am) {
		this.am = am;
	}
	public List<AgdContactsDto> getAc() {
		return ac;
	}
	public void setAc(List<AgdContactsDto> ac) {
		this.ac = ac;
	}
	public String getSt() {
		return st;
	}
	public void setSt(String st) {
		this.st = st;
	}
	public String getEd() {
		return ed;
	}
	public void setEd(String ed) {
		this.ed = ed;
	}
	public String getEt() {
		return et;
	}
	public void setEt(String et) {
		this.et = et;
	}
	public String getWtt() {
		return wtt;
	}
	public void setWtt(String wtt) {
		this.wtt = wtt;
	}
	
}

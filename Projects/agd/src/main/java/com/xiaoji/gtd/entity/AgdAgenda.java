package com.xiaoji.gtd.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * agdAgenda 实体类
 *
 */
@Entity
@Table(name = "agd_agenda")
public class AgdAgenda implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	private String agendaId;	//	日程ID
	private String relAgendaId;	//关联日程ID
	private String createrId;	//	来自于
	private String title;	//	主题
	private String agendaDate;	//	时间
	private String planFlag;	//	计划
	private String repeatType;	//	重复
	private String remindFlag;	//	提醒
	private String remarks;	//	备注
	public String getAgendaId() {
		return agendaId;
	}
	public void setAgendaId(String agendaId) {
		this.agendaId = agendaId;
	}
	public String getRelAgendaId() {
		return relAgendaId;
	}
	public void setRelAgendaId(String relAgendaId) {
		this.relAgendaId = relAgendaId;
	}
	public String getCreaterId() {
		return createrId;
	}
	public void setCreaterId(String createrId) {
		this.createrId = createrId;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getAgendaDate() {
		return agendaDate;
	}
	public void setAgendaDate(String agendaDate) {
		this.agendaDate = agendaDate;
	}
	public String getPlanFlag() {
		return planFlag;
	}
	public void setPlanFlag(String planFlag) {
		this.planFlag = planFlag;
	}
	public String getRepeatType() {
		return repeatType;
	}
	public void setRepeatType(String repeatType) {
		this.repeatType = repeatType;
	}
	public String getRemindFlag() {
		return remindFlag;
	}
	public void setRemindFlag(String remindFlag) {
		this.remindFlag = remindFlag;
	}
	public String getRemarks() {
		return remarks;
	}
	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

}

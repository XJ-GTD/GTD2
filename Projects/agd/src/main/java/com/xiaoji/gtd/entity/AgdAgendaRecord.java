package com.xiaoji.gtd.entity;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * AgdAgendaRecord 实体类
 *
 */
@Entity
@Table(name = "agd_agenda_record")
public class AgdAgendaRecord implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;
	public AgdAgendaRecord(){
		
	}
	public AgdAgendaRecord(Long recId,String agendaId,String accountId,
			Long timeStamp,String phone,int requestState){
		setRecId(recId);
		setAgendaId(agendaId);
		setAccountId(accountId);
		setTimeStamp(timeStamp);
		setPhone(phone);
		setRequestState(requestState);
	}

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long recId;	//	主键
	@Column(name="agenda_Id")
	private String agendaId;	//	日程ID
	@Column(name="time_stamp")
	private Long timeStamp;	 //	日程时间戳
	@Column(name="account_id")
	private String accountId;	//	参与人ID
	@Column(name="phone")
	private String phone;	//参与人手机号
	@Column(name="request_state")
	private int requestState; //请求状态 0:未请求;1已请求
	
	public Long getRecId() {
		return recId;
	}
	public void setRecId(Long recId) {
		this.recId = recId;
	}
	public String getAgendaId() {
		return agendaId;
	}
	public void setAgendaId(String agendaId) {
		this.agendaId = agendaId;
	}
	public Long getTimeStamp() {
		return timeStamp;
	}
	public void setTimeStamp(Long timeStamp) {
		this.timeStamp = timeStamp;
	}
	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public int getRequestState() {
		return requestState;
	}
	public void setRequestState(int requestState) {
		this.requestState = requestState;
	}

	
}

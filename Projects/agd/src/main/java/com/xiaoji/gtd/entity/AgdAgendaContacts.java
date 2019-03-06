package com.xiaoji.gtd.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * agdAgenda 实体类
 *
 */
@Entity
@Table(name = "agd_agenda_contacts")
public class AgdAgendaContacts implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long recId;	//	主键
	private String contactsId;	//联系人ID
	private String relAgendaId;	//关联日程ID
	private String accountId;	//	参与人用户ID
	private String contactsName;	//	参与人名称
	private String phone;	//参与人手机号
	
	public Long getRecId() {
		return recId;
	}
	public void setRecId(Long recId) {
		this.recId = recId;
	}
	public String getContactsId() {
		return contactsId;
	}
	public void setContactsId(String contactsId) {
		this.contactsId = contactsId;
	}
	public String getRelAgendaId() {
		return relAgendaId;
	}
	public void setRelAgendaId(String relAgendaId) {
		this.relAgendaId = relAgendaId;
	}
	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}
	public String getContactsName() {
		return contactsName;
	}
	public void setContactsName(String contactsName) {
		this.contactsName = contactsName;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	
}

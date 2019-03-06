package com.xiaoji.gtd.entity;

import java.io.Serializable;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * BlaBlacklist 实体�?
 *
 */
@Entity
@Table(name = "bla_blacklist")
public class BlaBlacklist implements Serializable {
	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long Id;
	
	private String phone;
	
	private String accountId; 
	private String headImg;
	private String contactsName;
	private String relAccountId;
	public Long getId() {
		return Id;
	}
	public void setId(Long id) {
		Id = id;
	}
	public String getPhone() {
		return phone;
	}
	public void setPhone(String phone) {
		this.phone = phone;
	}
	public String getAccountId() {
		return accountId;
	}
	public void setAccountId(String accountId) {
		this.accountId = accountId;
	}
	public String getHeadImg() {
		return headImg;
	}
	public void setHeadImg(String headImg) {
		this.headImg = headImg;
	}
	public String getContactsName() {
		return contactsName;
	}
	public void setContactsName(String contactsName) {
		this.contactsName = contactsName;
	}
	public String getRelAccountId() {
		return relAccountId;
	}
	public void setRelAccountId(String relAccountId) {
		this.relAccountId = relAccountId;
	}

    
}

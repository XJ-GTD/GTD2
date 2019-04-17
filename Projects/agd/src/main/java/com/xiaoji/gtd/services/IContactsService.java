package com.xiaoji.gtd.services;

import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.xiaoji.gtd.dto.AgdAgendaDto;
import com.xiaoji.gtd.entity.AgdAgendaContacts;

/**
 * IContactsService 参与人接口
 *
 */
public interface IContactsService {
	
	/**
	 * 保存参与人
	 * @param blacklist
	 */
	AgdAgendaContacts save(AgdAgendaDto inDto,HttpServletRequest request);
	
	/**
	 * 删除参与人
	 * @param blacklist
	 */
	int deleteById(Long recId);

	/**
	 * 根据参与人ID查询参与人
	 * @param agendaId
	 * @return
	 */
	AgdAgendaContacts findById(Long recId);
	
	/**
	 * 根据日程ID查询参与人
	 * @param relAgendaId
	 * @return
	 */
	List<AgdAgendaContacts> findContactsByRelId(String relAgendaId);
}
